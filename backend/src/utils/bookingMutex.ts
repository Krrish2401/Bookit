import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

export class BookingMutex {
    private lockTimeout = 30000;

    async acquireLock(
        experienceId: string,
        bookingDate: string,
        bookingTime: string
    ): Promise<string | null> {
        const lockId = randomUUID();
        const expiresAt = new Date(Date.now() + this.lockTimeout);

        try {
            await this.cleanupExpiredLocks();
            await prisma.$transaction(async (tx) => {
                const existingLock = await tx.bookingLock.findUnique({
                    where: {
                        experienceId_bookingDate_bookingTime: {
                            experienceId,
                            bookingDate,
                            bookingTime,
                        },
                    },
                });
                if (existingLock && existingLock.expiresAt > new Date()) {
                    throw new Error('LOCK_ALREADY_HELD');
                }

                if (existingLock) {
                    await tx.bookingLock.delete({
                        where: {
                            id: existingLock.id,
                        },
                    });
                }

                await tx.bookingLock.create({
                    data: {
                        experienceId,
                        bookingDate,
                        bookingTime,
                        lockedBy: lockId,
                        expiresAt,
                    },
                });
            });

            return lockId;
        } catch (error: any) {
            if (error.message === 'LOCK_ALREADY_HELD') {
                return null;
            }
            if (error.code === 'P2002') {
                return null;
            }
            throw error;
        }
    }

    async releaseLock(lockId: string): Promise<void> {
        try {
            await prisma.bookingLock.deleteMany({
                where: {
                    lockedBy: lockId,
                },
            });
        } catch (error) {
            console.error('Error releasing lock:', error);
        }
    }

    async cleanupExpiredLocks(): Promise<void> {
        try {
            await prisma.bookingLock.deleteMany({
                where: {
                    expiresAt: {
                        lt: new Date(),
                    },
                },
            });
        } catch (error) {
            console.error('Error cleaning up expired locks:', error);
        }
    }

    async withLock<T>(
        experienceId: string,
        bookingDate: string,
        bookingTime: string,
        callback: () => Promise<T>,
        maxRetries: number = 3,
        retryDelay: number = 1000
    ): Promise<T> {
        let lockId: string | null = null;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            lockId = await this.acquireLock(experienceId, bookingDate, bookingTime);

            if (lockId) {
                try {
                    const result = await callback();
                    return result;
                } finally {
                    await this.releaseLock(lockId);
                }
            }
            if (attempt < maxRetries - 1) {
                await this.sleep(retryDelay);
            }
        }

        throw new Error('Unable to acquire booking lock. Please try again.');
    }

    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

export const bookingMutex = new BookingMutex();
