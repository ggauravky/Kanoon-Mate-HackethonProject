import User from '../models/user.model.js'

/**
 * Service: Register a new user directly in MongoDB
 */
export const registerUserService = async ({ fullName, email, password, role, profilePicture }) => {
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

  // 2. Create and save user in MongoDB
  const user = await User.create({
    fullName: fullName.trim(),
    email: email.toLowerCase().trim(),
    password,
    role: role || 'citizen',
    profilePicture: profilePicture || '',
    isVerified: true,
  })

  // 3. Generate Auth JWT Token
  const token = user.generateAuthToken()

  // 4. Exclude password from returned user object
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
