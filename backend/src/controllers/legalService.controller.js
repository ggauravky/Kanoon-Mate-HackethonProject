import LegalService from '../models/legalService.model.js';

/**
 * @desc    Get all legal services & helplines with optional filters
 * @route   GET /api/v1/legal-services
 * @access  Public / Private
 */
export const getLegalServices = async (req, res, next) => {
  try {
    const { city, state, category, type, search } = req.query;

    let filter = {};

    if (city && city.trim()) {
      filter.city = { $regex: city.trim(), $options: 'i' };
    }

    if (state && state.trim()) {
      filter.state = { $regex: state.trim(), $options: 'i' };
    }

    if (category && category.trim()) {
      filter.category = category.trim();
    }

    if (type && type.trim()) {
      filter.type = type.trim();
    }

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      filter.$or = [
        { name: searchRegex },
        { city: searchRegex },
        { state: searchRegex },
        { category: searchRegex },
        { description: searchRegex },
      ];
    }

    const services = await LegalService.find(filter).sort({ type: 1, name: 1 });

    return res.status(200).json({
      success: true,
      count: services.length,
      data: {
        services,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search legal services by query text, city, or category
 * @route   GET /api/v1/legal-services/search
 * @access  Public / Private
 */
export const searchLegalServices = async (req, res, next) => {
  try {
    const { q, city, category } = req.query;

    let filter = {};

    if (city && city.trim()) {
      filter.city = { $regex: city.trim(), $options: 'i' };
    }

    if (category && category.trim()) {
      filter.category = category.trim();
    }

    if (q && q.trim()) {
      const qRegex = { $regex: q.trim(), $options: 'i' };
      filter.$or = [
        { name: qRegex },
        { description: qRegex },
        { address: qRegex },
        { city: qRegex },
      ];
    }

    const services = await LegalService.find(filter).limit(30);

    return res.status(200).json({
      success: true,
      count: services.length,
      data: {
        services,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single legal service details by ID
 * @route   GET /api/v1/legal-services/:id
 * @access  Public / Private
 */
export const getLegalServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const service = await LegalService.findById(id);

    if (!service) {
      const error = new Error('Legal service resource not found');
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({
      success: true,
      data: {
        service,
      },
    });
  } catch (error) {
    next(error);
  }
};
