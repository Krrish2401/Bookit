import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

export class BookingMutex {
    private lockTimeout = 30000; // 30 seconds lock timeout

    /**
     * Acquire a lock for a specific booking slot
     * Returns a lock ID if successful, null if lock cannot be acquired
     */
    async acquireLock(
        experienceId: string,
        bookingDate: string,
        bookingTime: string
    ): Promise<string | null> {
        const lockId = randomUUID();
        const expiresAt = new Date(Date.now() + this.lockTimeout);

        try {
            // Clean up expired locks first
            await this.cleanupExpiredLocks();

            // Try to create a lock using upsert with a transaction
            await prisma.$transaction(async (tx) => {
                // Check if a valid lock already exists
                const existingLock = await tx.bookingLock.findUnique({
                    where: {
                        experienceId_bookingDate_bookingTime: {
                            experienceId,
                            bookingDate,
                            bookingTime,
                        },
                    },
                });

                // If lock exists and hasn't expired, throw error
                if (existingLock && existingLock.expiresAt > new Date()) {
                    throw new Error('LOCK_ALREADY_HELD');
                }

                // Delete expired lock or create new one
                if (existingLock) {
                    await tx.bookingLock.delete({
                        where: {
                            id: existingLock.id,
                        },
                    });
                }

                // Create new lock
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
            // Handle unique constraint violation (race condition)
            if (error.code === 'P2002') {
                return null;
            }
            throw error;
        }
    }

    /**
     * Release a lock after booking is complete
     */
    async releaseLock(lockId: string): Promise<void> {
        try {
            await prisma.bookingLock.deleteMany({
                where: {
                    lockedBy: lockId,
                },
            });
        } catch (error) {
            console.error('Error releasing lock:', error);
            // Don't throw - locks will expire anyway
        }
    }

    /**
     * Clean up expired locks
     */
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

    /**
     * Execute a function with a lock (mutex pattern)
     */
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
                    // Execute the callback with the lock held
                    const result = await callback();
                    return result;
                } finally {
                    // Always release the lock
                    await this.releaseLock(lockId);
                }
            }

            // If lock couldn't be acquired and we have retries left, wait and try again
            if (attempt < maxRetries - 1) {
                await this.sleep(retryDelay);
            }
        }

        // If we couldn't acquire lock after all retries
        throw new Error('Unable to acquire booking lock. Please try again.');
    }

    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

export const bookingMutex = new BookingMutex();
