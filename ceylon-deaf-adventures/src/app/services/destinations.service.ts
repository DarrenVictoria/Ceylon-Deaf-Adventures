import { Injectable } from '@angular/core';

export interface Destination {
    title: string;
    slug: string; // Add slug for routing
    image: string;
    icon: string;
    description: string;
    alt: string;
    credit: string;
    fullDescription?: string; // Add detailed description
    highlights?: string[];   // Add highlights
}

@Injectable({
    providedIn: 'root'
})
export class DestinationsService {
    private destinations: Destination[] = [
        {
            title: 'Kandy Esala Perahera',
            slug: 'kandy',
            image: '/Esala_Perahara.jpg',
            icon: 'temple_buddhist',
            description: 'Sri Lanka\'s grandest festival with glowing elephants.',
            alt: 'Kandy Esala Perahera',
            credit: 'Photo: Sovindu Rashmilka',
            fullDescription: 'Sri Lanka\'s grandest festival with glowing elephants, dancers, drummers and sacred traditions—an unforgettable cultural spectacle in Kandy.',
            highlights: ['Temple of the Tooth', 'Kandy Lake', 'Royal Botanical Gardens', 'Esala Perahera']
        },
        {
            title: 'Ella',
            slug: 'ella',
            image: '/Ella.jpg',
            icon: 'hiking',
            description: 'Misty mountain village with scenic train rides.',
            alt: 'Nine Arch Bridge in Ella',
            credit: 'Photo: Lisa',
            fullDescription: 'A misty mountain village with tea fields, waterfalls and the iconic Nine Arch Bridge—perfect for hikes and scenic train rides.',
            highlights: ['Nine Arch Bridge', 'Little Adam\'s Peak', 'Ella Rock', 'Ravana Falls']
        },
        {
            title: 'Nuwara Eliya (Little England)',
            slug: 'nuwara-eliya',
            image: '/Nuwara_Eliya.jpg',
            icon: 'emoji_food_beverage',
            description: 'Tea country charm with cool climates.',
            alt: 'Tea plantations in Nuwara Eliya',
            credit: 'Photo: Darren Victoria',
            fullDescription: 'Tea country charm with cool climates, colonial vibes and the world\'s finest high-grown Ceylon tea.',
            highlights: ['Gregory Lake', 'Tea Factories', 'Horton Plains', 'Victoria Park']
        },
        {
            title: 'Negombo',
            slug: 'negombo',
            image: '/negombo.jpeg',
            icon: 'directions_boat',
            description: 'Golden beaches & bustling fish market.',
            alt: 'Negombo Beach',
            credit: 'Photo: Tristan',
            fullDescription: 'Golden beaches, a bustling fish market and rich colonial heritage—your coastal gateway near Colombo.',
            highlights: ['Negombo Beach', 'Fish Market', 'Dutch Canals', 'St. Mary\'s Church']
        },
        {
            title: 'Colombo',
            slug: 'colombo',
            image: '/Colombo.jpg',
            icon: 'location_city',
            description: 'Lively capital with temples, markets & parks.',
            alt: 'Colombo City',
            credit: 'Photo: Isuru Dev Thilina',
            fullDescription: 'Sri Lanka\'s lively capital with temples, markets, parks, museums and modern city vibes all in one.',
            highlights: ['Lotus Tower', 'Galle Face Green', 'Gangaramaya Temple', 'Pettah Market']
        },
        {
            title: 'Sigiriya (Lion Rock)',
            slug: 'sigiriya',
            image: '/Sigiriya.jpg',
            icon: 'landscape',
            description: 'Ancient rock fortress & history.',
            alt: 'Sigiriya Rock Fortress',
            credit: 'Photo: Lisa',
            fullDescription: 'Sigiriya, also known as Lion Rock, is an ancient rock fortress located in the northern Matale District. It is a site of historical and archaeological significance dominated by a massive column of rock.',
            highlights: ['Lion Rock Fortress', 'Mirror Wall', 'Water Gardens', 'Ancient Frescoes']
        },
        {
            title: 'Down South',
            slug: 'down-south',
            image: '/Down_South.jpg',
            icon: 'beach_access',
            description: 'Golden beaches & coastal vibes.',
            alt: 'Southern Coast Beach',
            credit: 'Photo: Lisa',
            fullDescription: 'The southern coast of Sri Lanka is famous for its beautiful sandy beaches, coral reefs, and laid-back atmosphere.',
            highlights: ['Mirissa Whale Watching', 'Unawatuna Beach', 'Galle Fort', 'Hikkaduwa Coral Reef']
        },
        {
            title: 'Anuradhapura',
            slug: 'anuradhapura',
            image: '/Anuradhapura.jpg',
            icon: 'temple_buddhist',
            description: 'Ancient capital & sacred temples.',
            alt: 'Anuradhapura Ancient City',
            credit: 'Photo: Isuru Dev Thilina',
            fullDescription: 'Anuradhapura is one of the ancient capitals of Sri Lanka, famous for its well-preserved ruins of an ancient Sri Lankan civilization.',
            highlights: ['Sri Maha Bodhi', 'Ruwanwelisaya', 'Jetavanaramaya', 'Thuparamaya']
        },
        {
            title: 'Adams Peak (Sri Pada)',
            slug: 'sri-pada',
            image: '/Sri_Pada.jpg',
            icon: 'vertical_align_top',
            description: 'Sacred mountain pilgrimage.',
            alt: 'Adam\'s Peak',
            credit: 'Photo: Nadeesha Fernando',
            fullDescription: 'Adam\'s Peak is a 2,243 m tall conical mountain located in central Sri Lanka. It is well known for the Sri Pada, i.e., "sacred footprint".',
            highlights: ['Sunrise View', 'Pilgrimage Trek', 'Peak Wilderness Sanctuary', 'Seethagangula']
        },
        {
            title: 'Pollonaruwa',
            slug: 'polonnaruwa',
            image: '/Pollonaruwa.jpg',
            icon: 'history_edu',
            description: 'Ancient ruins & archaeological sites.',
            alt: 'Polonnaruwa Ruins',
            credit: 'Photo: Isuru Dev Thilina',
            fullDescription: 'Polonnaruwa remains as the royal ancient city of the Kingdom of Polonnaruwa.',
            highlights: ['Gal Vihara', 'Royal Palace', 'Parakrama Samudra', 'Vatadage']
        }
    ];

    getDestinations(): Destination[] {
        return this.destinations;
    }

    getDestinationBySlug(slug: string): Destination | undefined {
        return this.destinations.find(d => d.slug === slug);
    }
}
