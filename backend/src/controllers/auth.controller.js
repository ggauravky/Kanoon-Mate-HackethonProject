import {
  registerUserService,
  loginUserService,
  getMeService,
  updateProfilePictureService,
} from '../services/auth.service.js'

// Helper: Set HTTP-Only Cookie and return standardized JSON response
const sendTokenResponse = (user, token, statusCode, res, message) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  }

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      message,
      data: {
        user,
        token,
      },
    })
}

/**
 * @desc    Register new user in MongoDB
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { user, token } = await registerUserService(req.body)
    sendTokenResponse(user, token, 201, res, 'User account registered successfully')
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Authenticate user login & return JWT
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { user, token } = await loginUserService(req.body)
    sendTokenResponse(user, token, 200, res, 'User logged in successfully')
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Log out user & clear authentication cookie
 * @route   POST /api/v1/auth/logout
 * @access  Public / Private
 */
export const logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000), // expire in 10 seconds
      httpOnly: true,
    })

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
      data: {},
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get currently logged-in user profile from MongoDB
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const user = await getMeService(userId)

    res.status(200).json({
      success: true,
      data: { user },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Upload or update profile picture via Cloudinary
 * @route   PUT /api/v1/auth/profile-picture
 * @access  Private
 */
export const updateProfilePicture = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const user = await updateProfilePictureService(userId, req.file)

    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully',
      data: { user },
    })
  } catch (error) {
    next(error)
  }
}
