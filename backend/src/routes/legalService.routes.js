import { Router } from 'express';
import {
  getLegalServices,
  searchLegalServices,
  getLegalServiceById,
} from '../controllers/legalService.controller.js';

const router = Router();

// GET /api/v1/legal-services/search - Search legal services
router.get('/search', searchLegalServices);

// GET /api/v1/legal-services - List all legal services with filters
router.get('/', getLegalServices);

// GET /api/v1/legal-services/:id - Get single legal service by ID
router.get('/:id', getLegalServiceById);

export default router;
