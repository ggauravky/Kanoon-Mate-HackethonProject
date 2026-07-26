import User from '../models/user.model.js'
import AdvocateProfile from '../models/advocateProfile.model.js'
import { uploadToCloudinary, deleteFromCloudinary } from './upload.service.js'

/**
 * Service: Register a new user directly in MongoDB (Citizen or Advocate)
 */
export const registerUserService = async (userData) => {
  const {
    fullName,
    email,
    password,
    role = 'citizen',
    phone,
    state,
    city,
    pincode,
    preferredLanguage,
    gender,
    profilePicture,
    // Advocate specific fields
    barCouncilNumber,
    experience,
    practiceAreas,
    officeAddress,
    languages,
    consultationFee,
    bio,
    onlineAvailable,
    offlineAvailable,
  } = userData

  if (!fullName || !email || !password) {
    const error = new Error('Full name, email, and password are required')
    error.statusCode = 400
    throw error
  }

  // 1. Check duplicate email in MongoDB
  const existingUser = await User.findOne({ email: email.toLowerCase() })
  if (existingUser) {
    const error = new Error('An account with this email address already exists.')
    error.statusCode = 400
    throw error
  }

  // 2. Create user in MongoDB
  const user = await User.create({
    fullName: fullName.trim(),
    email: email.toLowerCase().trim(),
    password,
    phone: phone || '',
    state: state || 'Delhi',
    city: city || 'Delhi',
    pincode: pincode || '',
    preferredLanguage: preferredLanguage || 'English',
    gender: gender || '',
    role: role || 'citizen',
    profilePicture: profilePicture || '',
    isVerified: true,
  })

  // 3. If registering as Advocate, create linked AdvocateProfile
  if (role === 'advocate') {
    const parsedAreas = Array.isArray(practiceAreas)
      ? practiceAreas
      : typeof practiceAreas === 'string'
      ? practiceAreas.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Civil Lawyer', 'Property Lawyer']

    const parsedLangs = Array.isArray(languages)
      ? languages
      : typeof languages === 'string'
      ? languages.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Hindi', 'English']

    await AdvocateProfile.create({
      user: user._id,
      barCouncilNumber: barCouncilNumber || `BCI/${Date.now().toString().slice(-5)}`,
      experience: Number(experience) || 5,
      practiceAreas: parsedAreas.length > 0 ? parsedAreas : ['Civil Lawyer'],
      officeAddress: officeAddress || `${city || 'Delhi'}, India`,
      city: city || 'Delhi',
      state: state || 'Delhi',
      pincode: pincode || '',
      languages: parsedLangs,
      consultationFee: Number(consultationFee) || 1000,
      bio: bio || `Verified advocate specializing in ${parsedAreas.join(', ')}.`,
      verified: true,
      onlineAvailable: onlineAvailable !== false,
      offlineAvailable: offlineAvailable !== false,
    })
  }

  // 4. Generate Auth JWT Token
  const token = user.generateAuthToken()

  // 5. Exclude password from returned user object
  const userObj = user.toObject()
  delete userObj.password

  return { user: userObj, token }
}

/**
 * Service: Authenticate user login against MongoDB credentials
 */
export const loginUserService = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error('Please provide both email and password.')
    error.statusCode = 400
    throw error
  }

  // 1. Find user in MongoDB and explicitly select password field
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')

  if (!user) {
    const error = new Error('Invalid email or password credentials.')
    error.statusCode = 401
    throw error
  }

  // 2. Compare bcrypt password hash
  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    const error = new Error('Invalid email or password credentials.')
    error.statusCode = 401
    throw error
  }

  // 3. Generate Auth JWT Token
  const token = user.generateAuthToken()

  // 4. Exclude password from response
  const userObj = user.toObject()
  delete userObj.password

  return { user: userObj, token }
}

/**
 * Service: Fetch current logged-in user profile from MongoDB
 */
export const getMeService = async (userId) => {
  const user = await User.findById(userId)

  if (!user) {
    const error = new Error('User account not found.')
    error.statusCode = 404
    throw error
  }

  return user
}

/**
 * Service: Upload or update user profile picture via Cloudinary
 */
export const updateProfilePictureService = async (userId, file) => {
  if (!file) {
    const error = new Error('No profile picture file provided')
    error.statusCode = 400
    throw error
  }

  const user = await User.findById(userId)
  if (!user) {
    const error = new Error('User account not found')
    error.statusCode = 404
    throw error
  }

  // If previous picture exists in Cloudinary, delete it
  if (user.profilePicturePublicId) {
    await deleteFromCloudinary(user.profilePicturePublicId, 'image')
  }

  // Upload new image buffer to Cloudinary
  const uploadResult = await uploadToCloudinary(file.buffer, {
    folder: 'kanoon_mate/profiles',
    fileName: `user-${userId}-${Date.now()}`,
    resource_type: 'image',
  })

  user.profilePicture = uploadResult.url
  user.profilePicturePublicId = uploadResult.publicId
  await user.save()

  // If user is advocate, also update profileImage on AdvocateProfile
  if (user.role === 'advocate') {
    await AdvocateProfile.findOneAndUpdate(
      { user: user._id },
      { profileImage: uploadResult.url }
    )
  }

  return user
}
