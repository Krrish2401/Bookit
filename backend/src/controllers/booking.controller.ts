import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

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

        // Validate required fields
        if (!experienceId || !fullName || !email || !bookingDate || !bookingTime || !quantity) {
            res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
            return;
        }

        // Check if experience exists
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

        // Check availability for this date and time
        const existingBookings = await prisma.booking.findMany({
            where: {
                experienceId,
                bookingDate,
                bookingTime
            }
        });

        const totalBooked = existingBookings.reduce((sum, booking) => sum + booking.quantity, 0);
        const maxCapacity = 10; // Max capacity per slot
        const availableSlots = maxCapacity - totalBooked;

        if (availableSlots < quantity) {
            res.status(400).json({
                success: false,
                message: `Not enough slots available. Only ${availableSlots} slot(s) remaining for this time.`
            });
            return;
        }

        // Generate unique reference ID
        let referenceId = generateReferenceId();
        let existingBooking = await prisma.booking.findUnique({
            where: { referenceId }
        });

        // Ensure uniqueness
        while (existingBooking) {
            referenceId = generateReferenceId();
            existingBooking = await prisma.booking.findUnique({
                where: { referenceId }
            });
        }

        // Create booking
        const booking = await prisma.booking.create({
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

        res.status(201).json({
            success: true,
            data: booking
        });
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
