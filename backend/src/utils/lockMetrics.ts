import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface LockMetrics {
    totalActiveLocks: number;
    oldestLockAge: number | null;
    locksBySlot: Array<{
        experienceId: string;
        bookingDate: string;
        bookingTime: string;
        lockedAt: Date;
        ageInSeconds: number;
    }>;
}

export async function getLockMetrics(): Promise<LockMetrics> {
    const now = new Date();
    
    const activeLocks = await prisma.bookingLock.findMany({
        where: {
            expiresAt: {
                gte: now,
            },
        },
        orderBy: {
            lockedAt: 'asc',
        },
    });

    const locksBySlot = activeLocks.map(lock => {
        const ageInSeconds = Math.floor((now.getTime() - lock.lockedAt.getTime()) / 1000);
        return {
            experienceId: lock.experienceId,
            bookingDate: lock.bookingDate,
            bookingTime: lock.bookingTime,
            lockedAt: lock.lockedAt,
            ageInSeconds,
        };
    });

    const oldestLockAge = locksBySlot.length > 0 
        ? locksBySlot[0].ageInSeconds 
        : null;

    return {
        totalActiveLocks: activeLocks.length,
        oldestLockAge,
        locksBySlot,
    };
}

export async function isHighContention(threshold: number = 5): Promise<boolean> {
    const metrics = await getLockMetrics();
    return metrics.totalActiveLocks >= threshold;
}

export async function logLockMetrics(): Promise<void> {
    try {
        const metrics = await getLockMetrics();
        
        console.log('\n Lock Metrics Report');
        console.log('═'.repeat(50));
        console.log(`Active Locks: ${metrics.totalActiveLocks}`);
        
        if (metrics.oldestLockAge !== null) {
            console.log(`Oldest Lock Age: ${metrics.oldestLockAge}s`);
        }

        if (metrics.locksBySlot.length > 0) {
            console.log('\nActive Lock Details:');
            metrics.locksBySlot.forEach((lock, index) => {
                console.log(`  ${index + 1}. Experience: ${lock.experienceId}`);
                console.log(`     Date: ${lock.bookingDate}, Time: ${lock.bookingTime}`);
                console.log(`     Age: ${lock.ageInSeconds}s`);
            });
        } else {
            console.log('\n✓ No active locks');
        }
        
        console.log('═'.repeat(50) + '\n');
    } catch (error) {
        console.error('Error fetching lock metrics:', error);
    }
}

export function createLockMonitoringMiddleware(intervalSeconds: number = 60) {
    let lastLog = Date.now();
    
    return async (_req: any, _res: any, next: any) => {
        const now = Date.now();
        const elapsed = (now - lastLog) / 1000;
        
        if (elapsed >= intervalSeconds) {
            await logLockMetrics();
            lastLog = now;
        }
        
        next();
    };
}
