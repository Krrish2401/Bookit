import { Router } from 'express';
import { createBooking, getBookingByReferenceId, checkAvailability } from '../controllers/booking.controller';

const router = Router();

router.post('/', createBooking);
router.get('/check-availability', checkAvailability);
router.get('/:referenceId', getBookingByReferenceId);

export default router;
