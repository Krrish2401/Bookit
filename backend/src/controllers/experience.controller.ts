import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllExperiences = async (req: Request, res: Response): Promise<void> => {
    try {
        const experiences = await prisma.experience.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({
            success: true,
            data: experiences
        });
    } catch (error) {
        console.error('Error fetching experiences:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch experiences'
        });
    }
};

export const getExperienceById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const experience = await prisma.experience.findUnique({
            where: { id }
        });

        if (!experience) {
            res.status(404).json({
                success: false,
                message: 'Experience not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: experience
        });
    } catch (error) {
        console.error('Error fetching experience:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch experience'
        });
    }
};

export const checkAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { date, time } = req.query;

        if (!date || !time) {
            res.status(400).json({
                success: false,
                message: 'Date and time are required'
            });
            return;
        }

        // Get total bookings for this specific date and time
        const bookings = await prisma.booking.findMany({
            where: {
                experienceId: id,
                bookingDate: date as string,
                bookingTime: time as string
            }
        });

        // Calculate total booked quantity
        const totalBooked = bookings.reduce((sum, booking) => sum + booking.quantity, 0);

        // Assuming max capacity of 10 per slot (you can make this configurable per experience)
        const maxCapacity = 10;
        const availableSlots = Math.max(0, maxCapacity - totalBooked);

        res.status(200).json({
            success: true,
            data: {
                date,
                time,
                availableSlots,
                totalBooked,
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
