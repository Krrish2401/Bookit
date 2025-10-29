import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    await prisma.booking.deleteMany();
    await prisma.promoCode.deleteMany();
    await prisma.experience.deleteMany();

    const experiences = await Promise.all([
        prisma.experience.create({
            data: {
                title: 'Kayaking Adventure',
                location: 'Udupi',
                description: 'Explore the serene backwaters of Udupi on a guided kayaking tour. Perfect for beginners and experienced paddlers. All safety equipment provided including helmets, life jackets, and waterproof bags. Expert instructors ensure a safe and memorable experience.',
                price: 999,
                image: 'https://images.unsplash.com/photo-1480480565647-1c4385c7c0bf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1931',
                availableDates: ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
                availableTimes: ['07:00 am', '9:00 am', '11:00 am', '1:00 pm'],
            },
        }),
        prisma.experience.create({
            data: {
                title: 'Nandi Hills Sunrise Trek',
                location: 'Bangalore',
                description: 'Wake up early and witness the breathtaking sunrise from Nandi Hills. This guided trek includes transport, breakfast, and professional photography. Experience the cool morning breeze and panoramic views that stretch for miles.',
                price: 899,
                image: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=800',
                availableDates: ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
                availableTimes: ['05:00 am', '05:30 am'],
            },
        }),
        prisma.experience.create({
            data: {
                title: 'Coffee Plantation Tour',
                location: 'Coorg',
                description: 'Immerse yourself in the aromatic world of coffee plantations. Learn about coffee cultivation from bean to cup, taste fresh brews, and explore the lush green estates. Includes traditional Coorgi lunch and souvenir coffee pack.',
                price: 1299,
                image: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=800',
                availableDates: ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
                availableTimes: ['08:00 am', '10:00 am', '2:00 pm'],
            },
        }),
        prisma.experience.create({
            data: {
                title: 'Sunderbans Mangrove Safari',
                location: 'Sunderbans',
                description: 'Navigate through the worlds largest mangrove forest on a thrilling boat safari. Spot Royal Bengal Tigers, crocodiles, and exotic birds. Experienced naturalist guides provide fascinating insights into this unique ecosystem.',
                price: 999,
                image: 'https://images.unsplash.com/photo-1669021820355-7186908380d9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
                availableDates: ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
                availableTimes: ['07:00 am', '9:00 am', '11:00 am'],
            },
        }),
        prisma.experience.create({
            data: {
                title: 'Bungee Jumping',
                location: 'Rishikesh',
                description: 'Take the leap of faith with Indias highest bungee jump! Plunge from 83 meters above the ground with stunning valley views. Professional equipment, trained staff, and comprehensive safety briefing included. Jump video and certificate provided.',
                price: 999,
                image: 'https://plus.unsplash.com/premium_photo-1664301262307-6c034eaec5db?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
                availableDates: ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
                availableTimes: ['10:00 am', '12:00 pm', '2:00 pm'],
            },
        }),
        prisma.experience.create({
            data: {
                title: 'Scuba Diving Experience',
                location: 'Andaman Islands',
                description: 'Discover the underwater paradise of Andaman with crystal-clear waters and vibrant coral reefs. PADI certified instructors, all equipment included. Perfect for first-time divers. Underwater photography package available.',
                price: 1299,
                image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
                availableDates: ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
                availableTimes: ['08:00 am', '10:00 am', '2:00 pm'],
            },
        }),
        prisma.experience.create({
            data: {
                title: 'Paragliding Adventure',
                location: 'Bir Billing',
                description: 'Soar like a bird over the Himalayas at the paragliding capital of India. Tandem flights with experienced pilots, stunning mountain views, and thrilling aerial maneuvers. GoPro video of your flight included.',
                price: 999,
                image: 'https://images.unsplash.com/photo-1471247511763-88a722fc9919?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1632',
                availableDates: ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
                availableTimes: ['10:00 am', '12:00 pm', '2:00 pm'],
            },
        }),
        prisma.experience.create({
            data: {
                title: 'Desert Safari & Camping',
                location: 'Jaisalmer',
                description: 'Experience the magic of the Thar Desert with camel rides, cultural performances, and overnight camping under the stars. Includes traditional Rajasthani dinner, bonfire, folk music, and sunrise views over the golden dunes.',
                price: 1299,
                image: 'https://d26dp53kz39178.cloudfront.net/media/uploads/products/Sam_Sand_Dunes_Desert_Safari_Camp_1-1693745394570.webp',
                availableDates: ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
                availableTimes: ['08:00 am', '10:00 am', '2:00 pm'],
            },
        }),
    ]);

    console.log(`Created ${experiences.length} experiences`);

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

    console.log(`Created ${promoCodes.length} promo codes`);
    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
