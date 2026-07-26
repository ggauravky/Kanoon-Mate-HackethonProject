import User from '../../models/user.model.js'
import AdvocateProfile from '../../models/advocateProfile.model.js'
import { generateAdvocates } from './generateAdvocates.js'

/**
 * Idempotent Advocate Seed Runner
 * Generates 120 realistic advocates across 50 Indian cities and saves them to MongoDB.
 * Checks for duplicates by email & bar council number before inserting.
 */
export const seedAdvocates = async (count = 120) => {
  try {
    const existingProfilesCount = await AdvocateProfile.countDocuments()

    if (existingProfilesCount >= count) {
      console.log(`ℹ️ MongoDB already contains ${existingProfilesCount} advocate profiles. Seed target (${count}) satisfied.`)
      return
    }

    console.log(`🌱 Generating ${count} realistic Indian Advocates across 50 cities...`)
    const sampleAdvocates = generateAdvocates(count)

    let createdUsersCount = 0
    let createdProfilesCount = 0
    let skippedCount = 0

    for (const adv of sampleAdvocates) {
      try {
        // 1. Check duplicate user by email
        let user = await User.findOne({ email: adv.email.toLowerCase() })

        if (!user) {
          user = await User.create({
            fullName: adv.fullName,
            email: adv.email.toLowerCase(),
            password: 'AdvocatePass@123',
            phone: adv.phone,
            city: adv.city,
            state: adv.state,
            pincode: adv.pincode,
            role: 'advocate',
            isVerified: true,
          })
          createdUsersCount++
        }

        // 2. Check duplicate advocate profile
        const existingProfile = await AdvocateProfile.findOne({
          $or: [{ user: user._id }, { barCouncilNumber: adv.barCouncilNumber }],
        })

        if (!existingProfile) {
          await AdvocateProfile.create({
            user: user._id,
            barCouncilNumber: adv.barCouncilNumber,
            practiceAreas: adv.practiceAreas,
            experience: adv.experience,
            officeAddress: adv.officeAddress,
            city: adv.city,
            state: adv.state,
            pincode: adv.pincode,
            languages: adv.languages,
            consultationFee: adv.consultationFee,
            bio: adv.bio,
            verified: adv.verified !== false,
            rating: adv.rating,
            totalReviews: adv.totalReviews,
            totalCasesHandled: adv.totalCasesHandled,
            onlineAvailable: adv.onlineAvailable,
            offlineAvailable: adv.offlineAvailable,
          })
          createdProfilesCount++
        } else {
          skippedCount++
        }
      } catch (itemErr) {
        skippedCount++
      }
    }

    const totalProfilesInDB = await AdvocateProfile.countDocuments()
    console.log('====================================================')
    console.log('✅ ADVOCATE SEED COMPLETE!')
    console.log(`• Users Created: ${createdUsersCount}`)
    console.log(`• Advocate Profiles Created: ${createdProfilesCount}`)
    console.log(`• Duplicate Records Skipped: ${skippedCount}`)
    console.log(`• Total Advocates in Database: ${totalProfilesInDB}`)
    console.log('====================================================')
  } catch (error) {
    console.error('❌ Error running advocate seed:', error.message)
  }
}

export default seedAdvocates
