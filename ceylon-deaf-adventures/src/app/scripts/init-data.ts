import { Tour } from '../models/tour';
import { getFirestore, collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';

// Initialize Firebase for direct access
const app = initializeApp(environment.firebase);
const db = getFirestore(app);

export async function initDummyData(): Promise<void> {
    const toursCol = collection(db, 'tours');
    const snapshot = await getDocs(toursCol);

    if (snapshot.size > 0) {
        console.log('Tours already exist, skipping initialization.');
        return;
    }

    const dummyTours: Partial<Tour>[] = [
        {
            title: 'Sigiriya Rock Fortress',
            slug: 'sigiriya-rock-fortress',
            type: 'adventure',
            location: ['Sigiriya'],
            shortDescription: 'Climb the ancient palace with visual storytelling guides who bring 1,500 years of history to life through detailed visual narratives.',
            fullDescription: 'Experience the UNESCO World Heritage Site with accessible paths and sign language guides.',
            durationDays: 1,
            priceDisplay: 50,
            currency: 'USD',
            capacity: 10,
            images: ['/assets/sigiriya.jpg'],
            features: ['UNESCO', 'Hiking'],
            accessibility: { visualAlarms: true, staffTrained: true, ramps: false, captionsProvided: true },
            nextAvailableDates: [Timestamp.fromDate(new Date('2025-10-01')), Timestamp.fromDate(new Date('2025-10-15'))],
            published: true,
            createdAt: Timestamp.now()
        },
        {
            title: 'Temple of the Sacred Tooth Relic',
            slug: 'temple-sacred-tooth-relic',
            type: 'group',
            location: ['Kandy'],
            shortDescription: 'Experience Kandy\'s most sacred Buddhist temple with cultural interpreters.',
            fullDescription: 'Full cultural immersion with visual communication.',
            durationDays: 1,
            priceDisplay: 40,
            currency: 'USD',
            capacity: 15,
            images: ['/assets/kandy-temple.jpg'],
            features: ['Cultural', 'Buddhist'],
            accessibility: { visualAlarms: true, staffTrained: true, ramps: true, captionsProvided: true },
            nextAvailableDates: [Timestamp.fromDate(new Date('2025-10-05')), Timestamp.fromDate(new Date('2025-10-20'))],
            published: true,
            createdAt: Timestamp.now()
        },
        {
            title: 'Ella Hiking Trails',
            slug: 'ella-hiking-trails',
            type: 'adventure',
            location: ['Ella'],
            shortDescription: 'Scenic hiking through tea plantations to Little Adam\'s Peak.',
            fullDescription: 'With visual trail guides and vibration alerts for safety.',
            durationDays: 2,
            priceDisplay: 60,
            currency: 'USD',
            capacity: 8,
            images: ['/assets/ella-hiking.jpg'],
            features: ['Hiking', 'Nature'],
            accessibility: { visualAlarms: false, staffTrained: true, ramps: false, captionsProvided: true },
            nextAvailableDates: [Timestamp.fromDate(new Date('2025-10-10')), Timestamp.fromDate(new Date('2025-10-25'))],
            published: true,
            createdAt: Timestamp.now()
        },
        {
            title: 'Yala National Park Safari',
            slug: 'yala-national-park-safari',
            type: 'deaf_guide',
            location: ['Yala'],
            shortDescription: 'Wildlife photography adventure with vibration alerts.',
            fullDescription: 'Spot leopards and elephants with visual identification guides.',
            durationDays: 3,
            priceDisplay: 100,
            currency: 'USD',
            capacity: 12,
            images: ['/assets/yala-safari.jpg'],
            features: ['Safari', 'Wildlife'],
            accessibility: { visualAlarms: true, staffTrained: true, ramps: true, captionsProvided: true },
            nextAvailableDates: [Timestamp.fromDate(new Date('2025-11-01')), Timestamp.fromDate(new Date('2025-11-15'))],
            published: true,
            createdAt: Timestamp.now()
        },
        {
            title: 'Whale Watching in Mirissa',
            slug: 'whale-watching-mirissa',
            type: 'private',
            location: ['Mirissa'],
            shortDescription: 'Experience majestic blue whales and dolphins.',
            fullDescription: 'With sign language marine guides and visual charts.',
            durationDays: 1,
            priceDisplay: 80,
            currency: 'USD',
            capacity: 6,
            images: ['/assets/mirissa-whales.jpg'],
            features: ['Marine', 'Adventure'],
            accessibility: { visualAlarms: true, staffTrained: true, ramps: false, captionsProvided: true },
            nextAvailableDates: [Timestamp.fromDate(new Date('2025-12-01')), Timestamp.fromDate(new Date('2025-12-15'))],
            published: true,
            createdAt: Timestamp.now()
        },
        {
            title: 'Galle Fort',
            slug: 'galle-fort',
            type: 'group',
            location: ['Galle'],
            shortDescription: 'Explore 400-year-old colonial architecture.',
            fullDescription: 'With historical visual guides and accessible cafes.',
            durationDays: 1,
            priceDisplay: 45,
            currency: 'USD',
            capacity: 20,
            images: ['/assets/galle-fort.jpg'],
            features: ['Colonial', 'Heritage'],
            accessibility: { visualAlarms: true, staffTrained: true, ramps: true, captionsProvided: true },
            nextAvailableDates: [Timestamp.fromDate(new Date('2025-10-03')), Timestamp.fromDate(new Date('2025-10-18'))],
            published: true,
            createdAt: Timestamp.now()
        },
        {
            title: 'Dambulla Cave Temple',
            slug: 'dambulla-cave-temple',
            type: 'adventure',
            location: ['Dambulla'],
            shortDescription: 'Marvel at 2,000-year-old Buddhist murals.',
            fullDescription: 'With art historians providing detailed visual descriptions.',
            durationDays: 1,
            priceDisplay: 55,
            currency: 'USD',
            capacity: 10,
            images: ['/assets/dambulla-cave.jpg'],
            features: ['Ancient', 'Art'],
            accessibility: { visualAlarms: false, staffTrained: true, ramps: false, captionsProvided: true },
            nextAvailableDates: [Timestamp.fromDate(new Date('2025-11-05')), Timestamp.fromDate(new Date('2025-11-20'))],
            published: true,
            createdAt: Timestamp.now()
        },
        {
            title: 'Bentota/Mirissa Beaches',
            slug: 'bentota-mirissa-beaches',
            type: 'private',
            location: ['Bentota', 'Mirissa'],
            shortDescription: 'Relax on pristine tropical beaches.',
            fullDescription: 'With accessible facilities and sign language water sports instruction.',
            durationDays: 4,
            priceDisplay: 120,
            currency: 'USD',
            capacity: 5,
            images: ['/assets/bentota-beach.jpg'],
            features: ['Beach', 'Relaxation'],
            accessibility: { visualAlarms: true, staffTrained: true, ramps: true, captionsProvided: true },
            nextAvailableDates: [Timestamp.fromDate(new Date('2025-12-10')), Timestamp.fromDate(new Date('2025-12-25'))],
            published: true,
            createdAt: Timestamp.now()
        }
    ];

    for (const tour of dummyTours) {
        await addDoc(toursCol, tour);
        console.log(`Added tour: ${tour.title}`);
    }
}