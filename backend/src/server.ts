import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import experienceRoutes from './routes/experience.routes';
import bookingRoutes from './routes/booking.routes';
import promoCodeRoutes from './routes/promoCode.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/experiences', experienceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/promo-codes', promoCodeRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'BookIt API is running' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

export default app;
