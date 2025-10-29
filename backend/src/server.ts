import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import experienceRoutes from './routes/experience.routes';
import bookingRoutes from './routes/booking.routes';
import promoCodeRoutes from './routes/promoCode.routes';
import { apiLimiter } from './middleware/rateLimiter';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// important for rate limiting behind proxies
app.set('trust proxy', 1);

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(apiLimiter);

app.use('/experiences', experienceRoutes);
app.use('/bookings', bookingRoutes);
app.use('/promo-codes', promoCodeRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'BookIt API is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
