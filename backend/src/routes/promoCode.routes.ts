import { Router } from 'express';
import { validatePromoCode } from '../controllers/promoCode.controller';
import { promoCodeLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/validate/:code', promoCodeLimiter, validatePromoCode);

export default router;
