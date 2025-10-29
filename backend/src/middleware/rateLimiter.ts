import rateLimit from 'express-rate-limit';

// General API rate limiter - 100 requests per 15 minutes per IP
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes.',
    },
    standardHeaders: true, 
    legacyHeaders: false,
});

// Stricter limiter for booking creation - 10 bookings per 15 minutes per IP
export const bookingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: 'Too many booking attempts. Please try again after 15 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});

// Promo code validation limiter - 15 attempts per 15 minutes per IP
export const promoCodeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: {
        success: false,
        message: 'Too many promo code validation attempts. Please try again after 15 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Availability check limiter - 50 checks per minute per IP (for real-time checking)
export const availabilityLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 50,
    message: {
        success: false,
        message: 'Too many availability checks. Please slow down.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
