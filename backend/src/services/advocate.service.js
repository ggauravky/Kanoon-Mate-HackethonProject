import AdvocateProfile from '../models/advocateProfile.model.js'
import User from '../models/user.model.js'

/**
 * Service: Search, filter, sort, and paginate Advocate Directory
 */
export const getAllAdvocatesService = async (query = {}) => {
  const filter = { verified: true }

  // Practice Area Filter
  if (query.practiceArea && query.practiceArea.trim()) {
    filter.practiceAreas = query.practiceArea.trim()
  }

  // City & State Filter
  if (query.city && query.city.trim()) {
    filter.city = { $regex: query.city.trim(), $options: 'i' }
  }
  if (query.state && query.state.trim()) {
    filter.state = { $regex: query.state.trim(), $options: 'i' }
  }

  // Minimum Experience Filter
  if (query.minExperience) {
    filter.experience = { $gte: Number(query.minExperience) }
  }

  // Minimum Rating Filter
  if (query.minRating) {
    filter.rating = { $gte: Number(query.minRating) }
  }

  // Availability Filters
  if (query.onlineAvailable === 'true') {
    filter.onlineAvailable = true
  }
  if (query.offlineAvailable === 'true') {
    filter.offlineAvailable = true
  }

  // Language Filter
  if (query.language && query.language.trim()) {
    filter.languages = query.language.trim()
  }

  // Search Filter across Name, City, Practice Areas, Bio
  if (query.search && query.search.trim()) {
    const searchRegex = { $regex: query.search.trim(), $options: 'i' }
    filter.$or = [
      { city: searchRegex },
      { state: searchRegex },
      { practiceAreas: searchRegex },
      { bio: searchRegex },
      { officeAddress: searchRegex },
    ]
  }

  // Sorting Logic
  let sortOption = { rating: -1, experience: -1 }
  if (query.sortBy === 'experience') {
    sortOption = { experience: -1, rating: -1 }
  } else if (query.sortBy === 'fee_low') {
    sortOption = { consultationFee: 1, rating: -1 }
  } else if (query.sortBy === 'newest') {
    sortOption = { createdAt: -1 }
  }

  // Count Total Records matching filter
  const total = await AdvocateProfile.countDocuments(filter)

  // Pagination parameters
  const page = Math.max(1, parseInt(query.page) || 1)
  const limit = Math.max(1, parseInt(query.limit) || 100) // Default 100 per page to show full directory
  const skip = (page - 1) * limit
  const totalPages = Math.ceil(total / limit) || 1

  let advocates = await AdvocateProfile.find(filter)
    .populate('user', 'fullName email phone profilePicture')
    .sort(sortOption)
    .skip(skip)
    .limit(limit)

  // Filter by user name if search specified
  if (query.search && query.search.trim()) {
    const term = query.search.trim().toLowerCase()
    advocates = advocates.filter(
      (adv) =>
        adv.user?.fullName?.toLowerCase().includes(term) ||
        adv.practiceAreas.some((p) => p.toLowerCase().includes(term)) ||
        adv.city.toLowerCase().includes(term)
    )
  }

  return {
    advocates,
    total,
    page,
    limit,
    totalPages,
  }
}

/**
 * Service: Get single Advocate Details by ID
 */
export const getAdvocateByIdService = async (id) => {
  const advocate = await AdvocateProfile.findById(id).populate(
    'user',
    'fullName email phone profilePicture state city pincode'
  )

  if (!advocate) {
    const error = new Error('Advocate profile not found')
    error.statusCode = 404
    throw error
  }

  return advocate
}

/**
 * Service: Toggle Favorite Advocate for logged-in Citizen
 */
export const toggleFavoriteAdvocateService = async (userId, advocateProfileId) => {
  const user = await User.findById(userId)
  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  }

  const advocateExists = await AdvocateProfile.findById(advocateProfileId)
  if (!advocateExists) {
    const error = new Error('Advocate profile not found')
    error.statusCode = 404
    throw error
  }

  const existsIndex = user.favoriteAdvocates.indexOf(advocateProfileId)
  let isFavorite = false

  if (existsIndex > -1) {
    user.favoriteAdvocates.splice(existsIndex, 1)
    isFavorite = false
  } else {
    user.favoriteAdvocates.push(advocateProfileId)
    isFavorite = true
  }

  await user.save()
  return { isFavorite, favoriteAdvocates: user.favoriteAdvocates }
}

/**
 * Service: Get Citizen's Saved Favorite Advocates
 */
export const getFavoriteAdvocatesService = async (userId) => {
  const user = await User.findById(userId).populate({
    path: 'favoriteAdvocates',
    populate: { path: 'user', select: 'fullName email phone profilePicture' },
  })

  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  }

  return user.favoriteAdvocates || []
}
