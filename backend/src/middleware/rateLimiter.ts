import rateLimit from 'express-rate-limit';

// General API rate limiter - 100 requests per 15 minutes per IP
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes.',
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter limiter for booking creation - 10 bookings per 15 minutes per IP
export const bookingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 booking requests per windowMs
    message: {
        success: false,
        message: 'Too many booking attempts. Please try again after 15 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false, // Count all requests, even successful ones
});

// Promo code validation limiter - 15 attempts per 15 minutes per IP
export const promoCodeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15, // Limit each IP to 15 promo code validation attempts per windowMs
    message: {
        success: false,
        message: 'Too many promo code validation attempts. Please try again after 15 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Availability check limiter - 50 checks per minute per IP (for real-time checking)
export const availabilityLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 50, // Limit each IP to 50 availability checks per minute
    message: {
        success: false,
        message: 'Too many availability checks. Please slow down.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
