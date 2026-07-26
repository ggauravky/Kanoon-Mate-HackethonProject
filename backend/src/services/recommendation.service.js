import Document from '../models/document.model.js'
import User from '../models/user.model.js'
import AdvocateProfile from '../models/advocateProfile.model.js'
import { getRecommendedPracticeAreas } from '../config/advocateMapping.js'

/**
 * AI Recommendation Engine Service
 * Analyzes document AI classification + user location to recommend top matching lawyers.
 * 
 * @param {string} documentId - ID of analyzed document
 * @param {string} userId - Currently authenticated user ID
 * @returns {Promise<Object>} Recommendation payload with reason metrics and top matches
 */
export const getRecommendedAdvocatesService = async (documentId, userId) => {
  // 1. Fetch document and verify ownership
  const document = await Document.findById(documentId)

  if (!document) {
    const error = new Error('Document not found')
    error.statusCode = 404
    throw error
  }

  if (document.uploadedBy.toString() !== userId.toString()) {
    const error = new Error('Access denied. You do not own this document.')
    error.statusCode = 403
    throw error
  }

  // 2. Fetch user location & language preferences
  const user = await User.findById(userId)
  const userCity = user?.city || 'Delhi'
  const userState = user?.state || 'Delhi'

  // 3. Extract legal category from AI analysis
  const detectedCategory =
    document.analysis?.documentType ||
    document.title ||
    'General Legal Document'

  // 4. Get mapped advocate practice areas
  const recommendedPracticeAreas = getRecommendedPracticeAreas(detectedCategory)

  // 5. Query MongoDB for matching advocates (Hierarchy: Same City -> Same State -> Nearby)
  let advocates = await AdvocateProfile.find({
    practiceAreas: { $in: recommendedPracticeAreas },
    city: { $regex: userCity, $options: 'i' },
    verified: true,
  })
    .populate('user', 'fullName email phone profilePicture')
    .sort({ rating: -1, experience: -1 })
    .limit(5)

  let locationMatchLevel = 'city'

  // If no advocate in same city, fallback to same state
  if (advocates.length === 0) {
    locationMatchLevel = 'state'
    advocates = await AdvocateProfile.find({
      practiceAreas: { $in: recommendedPracticeAreas },
      state: { $regex: userState, $options: 'i' },
      verified: true,
    })
      .populate('user', 'fullName email phone profilePicture')
      .sort({ rating: -1, experience: -1 })
      .limit(5)
  }

  // If still empty, fallback to top rated in category nationwide
  if (advocates.length === 0) {
    locationMatchLevel = 'nationwide'
    advocates = await AdvocateProfile.find({
      practiceAreas: { $in: recommendedPracticeAreas },
      verified: true,
    })
      .populate('user', 'fullName email phone profilePicture')
      .sort({ rating: -1, experience: -1 })
      .limit(5)
  }

  // 6. Enrich each match with % Score & AI Reason Badges
  const matches = advocates.map((advocate) => {
    const isSameCity = advocate.city.toLowerCase() === userCity.toLowerCase()
    const isSameState = advocate.state.toLowerCase() === userState.toLowerCase()

    // Score calculation
    let matchScore = 80 // Base for category match
    if (isSameCity) matchScore += 18
    else if (isSameState) matchScore += 10
    if (advocate.rating >= 4.8) matchScore += 2

    matchScore = Math.min(matchScore, 99)

    // Build human-readable AI rationale bullets
    const primaryPractice = advocate.practiceAreas[0] || 'Legal Specialist'
    const reasons = [
      `✔ Your document is a ${detectedCategory}`,
      `✔ ${advocate.experience} Years Experience`,
      `✔ Handles ${primaryPractice} Disputes`,
      `✔ Speaks ${advocate.languages.join(' & ')}`,
      isSameCity ? `✔ Located in Your City (${advocate.city})` : `✔ Available in Your State (${advocate.state})`,
    ]

    return {
      id: advocate._id,
      advocate,
      matchScore: `${matchScore}%`,
      locationMatchLevel,
      reasons,
    }
  })

  return {
    documentId: document._id,
    documentTitle: document.title,
    detectedCategory,
    recommendedPracticeAreas,
    userLocation: { city: userCity, state: userState },
    locationMatchLevel,
    totalMatches: matches.length,
    matches,
  }
}
