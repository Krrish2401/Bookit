import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await prisma.booking.deleteMany();
    await prisma.promoCode.deleteMany();
    await prisma.experience.deleteMany();

    // Create experiences
    const experiences = await Promise.all([
        prisma.experience.create({
            data: {
                title: 'Kayaking',
                location: 'Udupi',
                description: 'Curated small-group experience. Certified guide. Safety first with gear included. Helmet and Life jackets along with an expert will accompany in kayaking.',
                price: 999,
                image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
                availableDates: ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
                availableTimes: ['07:00 am', '9:00 am', '11:00 am', '1:00 pm'],
            },
        }),
        prisma.experience.create({
            data: {
                title: 'Kayaking',
                location: 'Udupi, Karnataka',
                description: 'Curated small-group experience. Certified guide. Safety first with gear included. Helmet and Life jackets along with an expert will accompany in kayaking.',
                price: 999,
                image: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800&q=80',
                availableDates: ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
                availableTimes: ['07:00 am', '9:00 am', '11:00 am', '1:00 pm'],
            },
        }),
        prisma.experience.create({
            data: {
                title: 'Kayaking',
                location: 'Udupi, Karnataka',
                description: 'Curated small-group experience. Certified guide. Safety first with gear included. Helmet and Life jackets along with an expert will accompany in kayaking.',
                price: 999,
                image: 'https://images.unsplash.com/photo-1503803548695-c2a7b4a5b875?w=800&q=80',
                availableDates: ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
                availableTimes: ['07:00 am', '9:00 am', '11:00 am', '1:00 pm'],
            },
        }),
        prisma.experience.create({
            data: {
                title: 'Nandi Hills Sunrise',
                location: 'Bangalore',
                description: 'Curated small-group experience. Certified guide. Safety first with gear included. Watch the beautiful sunrise from Nandi Hills.',
                price: 899,
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
                availableDates: ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
                availableTimes: ['05:00 am', '05:30 am'],
            },
        }),
        prisma.experience.create({
            data: {
                title: 'Coffee Trail',
                location: 'Coorg',
                description: 'Curated small-group experience. Certified guide. Safety first with gear included. Explore coffee plantations and learn about coffee making.',
                price: 1299,
                image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80',
                availableDates: ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
                availableTimes: ['08:00 am', '10:00 am', '2:00 pm'],
            },
        }),
        prisma.experience.create({
            data: {
                title: 'Boat Cruise',
                location: 'Sunderbans',
                description: 'Curated small-group experience. Certified guide. Safety first with gear included. Experience the mangrove forests and wildlife.',
                price: 999,
                image: 'https://images.unsplash.com/photo-1569243824812-e7154e8b0eec?w=800&q=80',
                availableDates: ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
                availableTimes: ['07:00 am', '9:00 am', '11:00 am'],
            },
        }),
        prisma.experience.create({
            data: {
                title: 'Bungee Jumping',
                location: 'Manali',
                description: 'Curated small-group experience. Certified guide. Safety first with gear included. Experience the ultimate adrenaline rush.',
                price: 999,
                image: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=800&q=80',
                availableDates: ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
                availableTimes: ['10:00 am', '12:00 pm', '2:00 pm'],
            },
        }),
        prisma.experience.create({
            data: {
                title: 'Coffee Trail',
                location: 'Coorg',
                description: 'Curated small-group experience. Certified guide. Safety first with gear included. Discover the secrets of coffee cultivation.',
                price: 1299,
                image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
                availableDates: ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
                availableTimes: ['08:00 am', '10:00 am', '2:00 pm'],
            },
        }),
    ]);

    console.log(`✅ Created ${experiences.length} experiences`);

    // Create promo codes
    const promoCodes = await Promise.all([
        prisma.promoCode.create({
            data: {
                code: 'SAVE10',
                discount: 10,
                isActive: true,
                expiresAt: new Date('2026-12-31')
            }
        }),
        prisma.promoCode.create({
            data: {
                code: 'WELCOME20',
                discount: 20,
                isActive: true,
                expiresAt: new Date('2026-12-31')
            }
        }),
        prisma.promoCode.create({
            data: {
                code: 'SUMMER15',
                discount: 15,
                isActive: true,
                expiresAt: new Date('2026-06-30')
            }
        })
    ]);

    console.log(`✅ Created ${promoCodes.length} promo codes`);
    console.log('🎉 Seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
