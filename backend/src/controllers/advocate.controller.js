import {
  getAllAdvocatesService,
  getAdvocateByIdService,
  toggleFavoriteAdvocateService,
  getFavoriteAdvocatesService,
} from '../services/advocate.service.js'
import { getRecommendedAdvocatesService } from '../services/recommendation.service.js'

/**
 * @desc    Get all advocates with search, filter, and sort options
 * @route   GET /api/v1/advocates
 * @access  Public / Private
 */
export const getAdvocates = async (req, res, next) => {
  try {
    const { advocates, total, page, limit, totalPages } = await getAllAdvocatesService(req.query)

    return res.status(200).json({
      success: true,
      total,
      page,
      limit,
      totalPages,
      count: advocates.length,
      data: {
        advocates,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get AI recommended advocates based on document analysis & user location
 * @route   GET /api/v1/advocates/recommended/:documentId
 * @access  Private
 */
export const getRecommendedAdvocates = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const { documentId } = req.params

    const recommendationData = await getRecommendedAdvocatesService(
      documentId,
      userId
    )

    return res.status(200).json({
      success: true,
      message: 'AI advocate recommendations generated successfully',
      data: recommendationData,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get user's saved favorite advocates
 * @route   GET /api/v1/advocates/favorites
 * @access  Private
 */
export const getFavoriteAdvocates = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const favorites = await getFavoriteAdvocatesService(userId)

    return res.status(200).json({
      success: true,
      count: favorites.length,
      data: {
        favorites,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get single advocate details by ID
 * @route   GET /api/v1/advocates/:id
 * @access  Public / Private
 */
export const getAdvocateById = async (req, res, next) => {
  try {
    const { id } = req.params
    const advocate = await getAdvocateByIdService(id)

    return res.status(200).json({
      success: true,
      data: {
        advocate,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Toggle favorite advocate for current user
 * @route   POST /api/v1/advocates/:id/favorite
 * @access  Private
 */
export const toggleFavoriteAdvocate = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const advocateProfileId = req.params.id

    const result = await toggleFavoriteAdvocateService(
      userId,
      advocateProfileId
    )

    return res.status(200).json({
      success: true,
      message: result.isFavorite
        ? 'Advocate saved to favorites'
        : 'Advocate removed from favorites',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
