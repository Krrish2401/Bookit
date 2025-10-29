import { Router } from 'express';
import { createBooking, getBookingByReferenceId } from '../controllers/booking.controller';

const router = Router();

router.post('/', createBooking);
router.get('/:referenceId', getBookingByReferenceId);

export default router;
