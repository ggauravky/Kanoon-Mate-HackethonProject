import { INDIAN_CITIES } from './cities.js'
import { STATE_CONFIG } from './states.js'
import { getRandomAdvocateName } from './names.js'
import { ALL_PRACTICE_AREAS, getPracticeAreaCombination } from './practiceAreas.js'
import { getLanguagesForState } from './languages.js'
import { generateBio } from './bios.js'
import { getRandomFee } from './fees.js'
import { getRandomRatingAndReviews } from './ratings.js'
import { getRandomExperience } from './experience.js'

/**
 * Reusable Data Generator Engine
 * Generates a realistic dataset of 80 to 150 advocates distributed across India
 * 
 * @param {number} totalCount - Number of advocates to generate (default 120)
 * @returns {Array<Object>} Array of advocate records
 */
export const generateAdvocates = (totalCount = 120) => {
  const advocates = []

  for (let i = 0; i < totalCount; i++) {
    // 1. Pick City (ensures all 50 Indian cities get multiple advocates)
    const cityObj = INDIAN_CITIES[i % INDIAN_CITIES.length]
    const stateObj = STATE_CONFIG[cityObj.state] || { barPrefix: 'BCI', languages: ['Hindi', 'English'] }

    // 2. Generate Advocate Name
    const fullName = getRandomAdvocateName(i)
    const cleanName = fullName.replace('Adv. ', '').toLowerCase().replace(/\s+/g, '.')
    const cityClean = cityObj.name.toLowerCase().replace(/[^a-z0-9]/g, '')
    const email = `${cleanName}.${cityClean}${i}@advocate.in`

    // 3. Practice Areas & Experience
    const practiceAreas = getPracticeAreaCombination(i)
    const { experience, totalCasesHandled } = getRandomExperience()

    // 4. Rating & Reviews
    const { rating, totalReviews } = getRandomRatingAndReviews()

    // 5. Consultation Fee
    const consultationFee = getRandomFee(experience)

    // 6. Languages & Bio
    const languages = getLanguagesForState(cityObj.state)
    const bio = generateBio(practiceAreas[0], experience, cityObj.name)

    // 7. Bar Council Number
    const startYear = 2024 - experience
    const barCouncilNumber = `${stateObj.barPrefix}/${1000 + i}/${startYear}`

    // 8. Office Address
    const officeAddress = `Chamber ${101 + (i % 80)}, District & Sessions Court Complex, ${cityObj.name}`

    // 9. Availability (Online / Offline / Both)
    const onlineAvailable = i % 4 !== 0
    const offlineAvailable = i % 5 !== 0

    advocates.push({
      fullName,
      email,
      phone: `+91 9${String(810000000 + i * 3791).slice(0, 9)}`,
      city: cityObj.name,
      state: cityObj.state,
      pincode: cityObj.pincode,
      barCouncilNumber,
      practiceAreas,
      experience,
      officeAddress,
      languages,
      consultationFee,
      rating,
      totalReviews,
      totalCasesHandled,
      bio,
      onlineAvailable,
      offlineAvailable,
      verified: true,
    })
  }

  return advocates
}
