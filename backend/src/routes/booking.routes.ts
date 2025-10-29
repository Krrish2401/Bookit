import { Router } from 'express';
import { createBooking, getBookingByReferenceId, checkAvailability } from '../controllers/booking.controller';
import { bookingLimiter, availabilityLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/', bookingLimiter, createBooking);
router.get('/check-availability', availabilityLimiter, checkAvailability);
router.get('/:referenceId', getBookingByReferenceId);

export default router;
