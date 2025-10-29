import { Router } from 'express';
import { getAllExperiences, getExperienceById, checkAvailability } from '../controllers/experience.controller';

const router = Router();

router.get('/', getAllExperiences);
router.get('/:id', getExperienceById);
router.get('/:id/availability', checkAvailability);

export default router;
