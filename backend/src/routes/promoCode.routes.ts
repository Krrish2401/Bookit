import { Router } from 'express';
import { validatePromoCode } from '../controllers/promoCode.controller';

const router = Router();

router.get('/validate/:code', validatePromoCode);

export default router;
