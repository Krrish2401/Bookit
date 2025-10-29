import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { bookingMutex } from '../utils/bookingMutex';

const prisma = new PrismaClient();

// Generate a unique reference ID
const generateReferenceId = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

export const createBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            experienceId,
            fullName,
            email,
            bookingDate,
            bookingTime,
            quantity,
            subtotal,
            taxes,
            total,
            discount,
            promoCode
        } = req.body;

        if (!experienceId || !fullName || !email || !bookingDate || !bookingTime || !quantity) {
            res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
            return;
        }

        const experience = await prisma.experience.findUnique({
            where: { id: experienceId }
        });

        if (!experience) {
            res.status(404).json({
                success: false,
                message: 'Experience not found'
            });
            return;
        }

        try {
            const booking = await bookingMutex.withLock(
                experienceId,
                bookingDate,
                bookingTime,
                async () => {
                    const existingBookings = await prisma.booking.findMany({
                        where: {
                            experienceId,
                            bookingDate,
                            bookingTime
                        }
                    });

                    const totalBooked = existingBookings.reduce((sum, booking) => sum + booking.quantity, 0);
                    const maxCapacity = 10;
                    const availableSlots = maxCapacity - totalBooked;

                    if (availableSlots < quantity) {
                        throw new Error(`NOT_ENOUGH_SLOTS:${availableSlots}`);
                    }

                    let referenceId = generateReferenceId();
                    let existingBooking = await prisma.booking.findUnique({
                        where: { referenceId }
                    });

                    while (existingBooking) {
                        referenceId = generateReferenceId();
                        existingBooking = await prisma.booking.findUnique({
                            where: { referenceId }
                        });
                    }

                    const newBooking = await prisma.$transaction(async (tx) => {
                        return tx.booking.create({
                            data: {
                                referenceId,
                                experienceId,
                                fullName,
                                email,
                                bookingDate,
                                bookingTime,
                                quantity,
                                subtotal,
                                taxes,
                                total,
                                discount: discount || 0,
                                promoCode
                            },
                            include: {
                                experience: true
                            }
                        });
                    });

                    return newBooking;
                },
                5,
                500 
            );

            res.status(201).json({
                success: true,
                data: booking
            });
        } catch (lockError: any) {
            if (lockError.message?.startsWith('NOT_ENOUGH_SLOTS:')) {
                const availableSlots = lockError.message.split(':')[1];
                res.status(400).json({
                    success: false,
                    message: `Not enough slots available. Only ${availableSlots} slot(s) remaining for this time.`
                });
                return;
            }

            if (lockError.message === 'Unable to acquire booking lock. Please try again.') {
                res.status(409).json({
                    success: false,
                    message: 'This slot is being booked by another user. Please try again in a moment.'
                });
                return;
            }

            throw lockError;
        }
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create booking'
        });
    }
};

export const getBookingByReferenceId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { referenceId } = req.params;

        const booking = await prisma.booking.findUnique({
            where: { referenceId },
            include: {
                experience: true
            }
        });

        if (!booking) {
            res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch booking'
        });
    }
};

export const checkAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
        const { experienceId, bookingDate, bookingTime } = req.query;

        if (!experienceId || !bookingDate || !bookingTime) {
            res.status(400).json({
                success: false,
                message: 'Missing required parameters'
            });
            return;
        }

        const existingBookings = await prisma.booking.findMany({
            where: {
                experienceId: experienceId as string,
                bookingDate: bookingDate as string,
                bookingTime: bookingTime as string
            }
        });

        const totalBooked = existingBookings.reduce((sum, booking) => sum + booking.quantity, 0);
        const maxCapacity = 10;
        const availableSlots = maxCapacity - totalBooked;

        res.status(200).json({
            success: true,
            data: {
                availableSlots,
                maxCapacity,
                isAvailable: availableSlots > 0
            }
        });
    } catch (error) {
        console.error('Error checking availability:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check availability'
        });
    }
};
