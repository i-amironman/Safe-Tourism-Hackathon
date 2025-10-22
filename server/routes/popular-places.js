const express = require('express');
const router = express.Router();

// Comprehensive popular places data from around the world
const popularPlaces = [
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    region: 'Île-de-France',
    description: 'The City of Light, renowned for iconic landmarks, world-class art, romantic atmosphere, and exquisite cuisine.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
    category: 'Romantic & Cultural Destination',
    rating: 4.8,
    bestTimeToVisit: 'April to June, September to October',
    details: {
      overview: 'Paris, the capital of France, is a global center for art, fashion, gastronomy, and culture. Known for iconic landmarks like the Eiffel Tower, world-class museums, and charming cafés.',
      geography: 'Located in north-central France on the Seine River, the city features elegant boulevards, historic architecture, and beautiful parks.',
      climate: 'Temperate oceanic climate with mild winters, warm summers, and moderate rainfall year-round.',
      accessibility: 'Major international hub with two airports (Charles de Gaulle, Orly), extensive metro system, and high-speed rail connections.'
    },
    attractions: [
      {
        name: 'Eiffel Tower',
        description: 'Iconic iron lattice tower and symbol of Paris, offering spectacular city views',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop',
        activities: ['Sightseeing', 'Photography', 'Dining', 'Light show viewing'],
        entryFee: '€26.80 adults, €13.40 children',
        timing: '9:30 AM - 11:45 PM'
      },
      {
        name: 'Louvre Museum',
        description: 'World\'s largest art museum housing the Mona Lisa and countless masterpieces',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop',
        activities: ['Art viewing', 'Guided tours', 'Photography', 'Educational programs'],
        entryFee: '€17 adults, free under 18',
        timing: '9:00 AM - 6:00 PM (closed Tuesdays)'
      },
      {
        name: 'Notre-Dame Cathedral',
        description: 'Gothic architectural masterpiece currently under restoration',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop',
        activities: ['Architecture viewing', 'Historical tours', 'Photography'],
        entryFee: 'Free (exterior), interior access varies',
        timing: 'Varies due to restoration'
      },
      {
        name: 'Champs-Élysées',
        description: 'Famous avenue lined with shops, theaters, and cafés leading to Arc de Triomphe',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop',
        activities: ['Shopping', 'Dining', 'People watching', 'Walking tours'],
        entryFee: 'Free',
        timing: 'Open 24/7'
      }
    ],
    activities: [
      {
        name: 'Seine River Cruise',
        description: 'Romantic boat tour passing major landmarks and bridges',
        duration: '1-3 hours',
        cost: '€15-30',
        bestSeason: 'April to October'
      },
      {
        name: 'Montmartre Walking Tour',
        description: 'Explore artistic neighborhood with Sacré-Cœur and street artists',
        duration: '2-3 hours',
        cost: 'Free to €25 for guided tours',
        bestSeason: 'Year round'
      },
      {
        name: 'Palace of Versailles Day Trip',
        description: 'Visit opulent royal palace and magnificent gardens',
        duration: 'Full day',
        cost: '€20-27 palace entry, €7 train fare',
        bestSeason: 'April to October'
      }
    ],
    accommodation: {
      budget: [
        { name: 'Hostels in Marais', price: '€30-60 per night', amenities: ['Dorm beds', 'Kitchen access', 'Central location'] },
        { name: 'Budget hotels in outer arrondissements', price: '€60-100 per night', amenities: ['Private rooms', 'Breakfast', 'Metro access'] }
      ],
      midRange: [
        { name: 'Boutique hotels in Le Marais', price: '€150-250 per night', amenities: ['Stylish rooms', 'Local charm', 'Breakfast'] },
        { name: 'Business hotels near Opéra', price: '€180-300 per night', amenities: ['Modern amenities', 'Central location', 'Business services'] }
      ],
      luxury: [
        { name: 'The Ritz Paris', price: '€800-2000+ per night', amenities: ['Palace luxury', 'Fine dining', 'Spa', 'Central location'] },
        { name: 'Four Seasons George V', price: '€700-1500+ per night', amenities: ['5-star luxury', 'Michelin dining', 'Spa', 'Eiffel views'] }
      ]
    },
    cuisine: {
      localSpecialties: [
        { name: 'Croissant and café', description: 'Classic French breakfast with buttery pastry and coffee', price: '€5-10' },
        { name: 'Steak frites', description: 'Grilled steak with French fries, a bistro classic', price: '€15-30' },
        { name: 'Crêpes', description: 'Thin pancakes with sweet or savory fillings', price: '€5-15' }
      ],
      popularRestaurants: [
        { name: 'Le Comptoir du Relais', cuisine: 'Traditional French', priceRange: '€30-50 per person', specialty: 'Classic bistro dishes' },
        { name: 'L\'As du Fallafel', cuisine: 'Middle Eastern', priceRange: '€10-15 per person', specialty: 'Authentic falafel in Marais' },
        { name: 'Breizh Café', cuisine: 'Crêperie', priceRange: '€15-25 per person', specialty: 'Gourmet crêpes' }
      ]
    },
    transportation: {
      gettingAround: ['Metro', 'Bus', 'Walking', 'Velib\' bikes', 'Taxis/Uber'],
      nearestAirport: 'Charles de Gaulle Airport (CDG)',
      railwayConnectivity: 'Major stations: Gare du Nord, Gare de Lyon, Gare Montparnasse',
      roadConnectivity: 'Well connected by French autoroutes and Eurotunnel'
    },
    travelTips: [
      'Book museum tickets online to skip long lines',
      'Learn basic French phrases - locals appreciate the effort',
      'Wear comfortable shoes for walking on cobblestones',
      'Dinner is typically served after 7:30 PM',
      'Many shops close on Sundays, especially outside tourist areas'
    ]
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Kanto',
    description: 'A mesmerizing metropolis where ancient traditions seamlessly blend with cutting-edge technology and pop culture.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
    category: 'Modern & Cultural Destination',
    rating: 4.7,
    bestTimeToVisit: 'March to May, October to November',
    details: {
      overview: 'Tokyo, Japan\'s bustling capital, combines ultra-modern skyscrapers with traditional temples. From serene gardens to neon-lit streets, it offers endless discoveries.',
      geography: 'Located on the main island of Honshu, Tokyo Bay provides a natural harbor. The city spans across multiple special wards.',
      climate: 'Humid subtropical climate with hot, humid summers and mild winters. Spring and autumn offer pleasant weather.',
      accessibility: 'Major international gateway with Narita and Haneda airports, extensive train network, and efficient public transportation.'
    },
    attractions: [
      {
        name: 'Senso-ji Temple',
        description: 'Tokyo\'s oldest temple with traditional architecture and bustling shopping street',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop',
        activities: ['Temple worship', 'Shopping', 'Traditional snacks', 'Cultural experiences'],
        entryFee: 'Free',
        timing: '6:00 AM - 5:00 PM'
      },
      {
        name: 'Tokyo Skytree',
        description: 'World\'s second tallest tower offering panoramic city views',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop',
        activities: ['Observation decks', 'Shopping', 'Dining', 'Photography'],
        entryFee: '¥2,100-3,100 depending on deck',
        timing: '8:00 AM - 10:00 PM'
      },
      {
        name: 'Shibuya Crossing',
        description: 'World\'s busiest pedestrian crossing and symbol of Tokyo\'s energy',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop',
        activities: ['People watching', 'Photography', 'Shopping', 'Nightlife'],
        entryFee: 'Free',
        timing: 'Open 24/7'
      },
      {
        name: 'Meiji Shrine',
        description: 'Peaceful Shinto shrine dedicated to Emperor Meiji and Empress Shoken',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop',
        activities: ['Prayer', 'Forest walks', 'Cultural ceremonies', 'Photography'],
        entryFee: 'Free',
        timing: '5:00 AM - 6:00 PM'
      }
    ],
    activities: [
      {
        name: 'Tsukiji Outer Market Food Tour',
        description: 'Sample fresh sushi, street food, and traditional Japanese delicacies',
        duration: '3-4 hours',
        cost: '¥2,000-5,000',
        bestSeason: 'Year round (early morning best)'
      },
      {
        name: 'Traditional Tea Ceremony',
        description: 'Experience authentic Japanese tea ceremony in traditional setting',
        duration: '1-2 hours',
        cost: '¥2,000-4,000',
        bestSeason: 'Year round'
      },
      {
        name: 'Mount Fuji Day Trip',
        description: 'Visit Japan\'s sacred mountain and surrounding lakes',
        duration: 'Full day',
        cost: '¥10,000-15,000 including transport',
        bestSeason: 'July to September for climbing'
      }
    ],
    accommodation: {
      budget: [
        { name: 'Capsule hotels', price: '¥3,000-5,000 per night', amenities: ['Compact pods', 'Shared facilities', 'Central locations'] },
        { name: 'Business hotels', price: '¥8,000-12,000 per night', amenities: ['Small rooms', 'Breakfast', 'Convenient locations'] }
      ],
      midRange: [
        { name: 'Boutique hotels in Shibuya', price: '¥15,000-25,000 per night', amenities: ['Stylish rooms', 'Local character', 'Modern amenities'] },
        { name: 'Ryokans (traditional inns)', price: '¥20,000-30,000 per night', amenities: ['Traditional experience', 'Kaiseki meals', 'Onsen baths'] }
      ],
      luxury: [
        { name: 'Aman Tokyo', price: '¥80,000-150,000+ per night', amenities: ['Ultra-luxury', 'City views', 'Spa', 'Fine dining'] },
        { name: 'Mandarin Oriental', price: '¥70,000-120,000+ per night', amenities: ['5-star service', 'Sky-high views', 'Michelin dining'] }
      ]
    },
    cuisine: {
      localSpecialties: [
        { name: 'Sushi', description: 'Fresh raw fish over seasoned rice, Tokyo\'s most famous dish', price: '¥1,000-3,000 per set' },
        { name: 'Ramen', description: 'Noodle soup with various broths and toppings', price: '¥800-1,500' },
        { name: 'Tempura', description: 'Lightly battered and fried seafood and vegetables', price: '¥1,200-2,500' }
      ],
      popularRestaurants: [
        { name: 'Sukiyabashi Jiro', cuisine: 'Sushi', priceRange: '¥30,000-40,000 per person', specialty: 'World-renowned sushi' },
        { name: 'Ichiran Ramen', cuisine: 'Ramen', priceRange: '¥1,000-1,500 per person', specialty: 'Solo dining ramen' },
        { name: 'Narisawa', cuisine: 'Innovative Japanese', priceRange: '¥25,000-35,000 per person', specialty: 'Satoyama cuisine' }
      ]
    },
    transportation: {
      gettingAround: ['JR Yamanote Line', 'Metro', 'Walking', 'Bicycles', 'Taxis'],
      nearestAirport: 'Narita International Airport (NRT) and Haneda Airport (HND)',
      railwayConnectivity: 'Shinkansen (bullet train) hub, extensive local rail network',
      roadConnectivity: 'Expressways connect to other major cities, but traffic can be heavy'
    },
    travelTips: [
      'Get a JR Pass for unlimited train travel if visiting multiple cities',
      'Carry cash as many places don\'t accept credit cards',
      'Remove shoes when entering homes and some restaurants',
      'Bow as a sign of respect when greeting people',
      'Download translation apps - English is not widely spoken'
    ]
  },
  {
    id: 'new-york',
    name: 'New York City',
    country: 'United States',
    region: 'New York State',
    description: 'The city that never sleeps - a vibrant melting pot of cultures, iconic skyscrapers, world-class entertainment, and endless energy.',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
    category: 'Urban & Entertainment Destination',
    rating: 4.6,
    bestTimeToVisit: 'April to June, September to November',
    details: {
      overview: 'New York City, composed of five boroughs, is a global hub of commerce, finance, arts, fashion, and entertainment. From Broadway to Central Park, it offers something for everyone.',
      geography: 'Located at the mouth of the Hudson River on the Atlantic coast. Manhattan island forms the heart of the city.',
      climate: 'Humid subtropical climate with hot summers, cold winters, and beautiful spring and autumn seasons.',
      accessibility: 'Major international gateway with JFK, Newark, and LaGuardia airports, extensive subway system, and comprehensive public transport.'
    },
    attractions: [
      {
        name: 'Statue of Liberty & Ellis Island',
        description: 'Iconic symbol of freedom and immigration with museum and city views',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
        activities: ['Island tours', 'Museum visits', 'Photography', 'Historical learning'],
        entryFee: 'Ferry $24.30 adults, includes pedestal access',
        timing: '8:30 AM - 5:00 PM'
      },
      {
        name: 'Central Park',
        description: 'Massive urban oasis offering lakes, meadows, and recreational activities',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
        activities: ['Walking', 'Biking', 'Boating', 'Picnicking', 'Zoo visit'],
        entryFee: 'Free',
        timing: '6:00 AM - 1:00 AM'
      },
      {
        name: 'Empire State Building',
        description: 'Art Deco skyscraper with observation decks offering panoramic city views',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
        activities: ['Observation decks', 'Photography', 'Historical exhibits'],
        entryFee: '$44-86 depending on experience',
        timing: '10:00 AM - 12:00 AM'
      },
      {
        name: 'Times Square',
        description: 'Brilliantly lit commercial crossroads and entertainment district',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
        activities: ['Shopping', 'Broadway shows', 'Dining', 'People watching'],
        entryFee: 'Free',
        timing: 'Open 24/7'
      }
    ],
    activities: [
      {
        name: 'Broadway Show',
        description: 'Watch world-class theater performance in Theater District',
        duration: '2-3 hours',
        cost: '$50-200+ per ticket',
        bestSeason: 'Year round (holiday season special)'
      },
      {
        name: 'Brooklyn Bridge Walk',
        description: 'Walk across iconic bridge with Manhattan skyline views',
        duration: '1-2 hours',
        cost: 'Free',
        bestSeason: 'Sunset hours year round'
      },
      {
        name: 'Museum Mile Tour',
        description: 'Visit world-class museums along Fifth Avenue',
        duration: 'Full day',
        cost: '$15-25 per museum',
        bestSeason: 'Year round'
      }
    ],
    accommodation: {
      budget: [
        { name: 'Hostels in Manhattan', price: '$50-100 per night', amenities: ['Dorm beds', 'Shared facilities', 'Prime locations'] },
        { name: 'Budget hotels in outer boroughs', price: '$100-150 per night', amenities: ['Private rooms', 'Subway access', 'Basic amenities'] }
      ],
      midRange: [
        { name: 'Midtown Manhattan hotels', price: '$200-350 per night', amenities: ['Central location', 'Modern rooms', 'Hotel facilities'] },
        { name: 'Boutique hotels in Brooklyn', price: '$180-300 per night', amenities: ['Local character', 'Trendy neighborhoods', 'Unique experiences'] }
      ],
      luxury: [
        { name: 'The Plaza Hotel', price: '$600-1500+ per night', amenities: ['Historic luxury', 'Central Park views', 'Fine dining', 'Spa'] },
        { name: 'St. Regis', price: '$800-2000+ per night', amenities: ['5-star service', 'Butler service', 'Luxury amenities', 'Prime location'] }
      ]
    },
    cuisine: {
      localSpecialties: [
        { name: 'New York Pizza', description: 'Large, foldable slices with various toppings', price: '$3-5 per slice' },
        { name: 'Bagels with lox', description: 'Fresh bagels topped with salmon and cream cheese', price: '$8-15' },
        { name: 'Street hot dogs', description: 'Classic NYC street food with various toppings', price: '$2-5' }
      ],
      popularRestaurants: [
        { name: 'Katz\'s Delicatessen', cuisine: 'Jewish Deli', priceRange: '$20-40 per person', specialty: 'Pastrami sandwiches' },
        { name: 'Le Bernardin', cuisine: 'Seafood', priceRange: '$150-200 per person', specialty: 'Michelin-starred seafood' },
        { name: 'Joe\'s Pizza', cuisine: 'Pizza', priceRange: '$5-10 per person', specialty: 'Classic NYC slice' }
      ]
    },
    transportation: {
      gettingAround: ['Subway', 'Walking', 'Taxis/Uber', 'Buses', 'Citi Bike'],
      nearestAirport: 'JFK, Newark Liberty (EWR), LaGuardia (LGA)',
      railwayConnectivity: 'Penn Station, Grand Central Terminal - Amtrak and regional rail',
      roadConnectivity: 'Connected by interstate highways, bridges, and tunnels'
    },
    travelTips: [
      'Get a MetroCard for easy subway access',
      'Wear comfortable walking shoes - distances are deceiving',
      'Book Broadway shows in advance for better seats and prices',
      'Tipping 15-20% is customary at restaurants',
      'Avoid driving in Manhattan - parking is expensive and traffic is heavy'
    ]
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    region: 'Middle East',
    description: 'A futuristic oasis where luxury shopping, ultramodern architecture, and traditional Arabian culture create an unforgettable experience.',
    image: 'https://images.unsplash.com/photo-1548919873-d49801cb957e?w=800&h=600&fit=crop',
    category: 'Luxury & Modern Destination',
    rating: 4.5,
    bestTimeToVisit: 'November to March',
    details: {
      overview: 'Dubai transforms desert into a dazzling metropolis of record-breaking skyscrapers, luxury shopping, and innovative attractions while preserving Arabian heritage.',
      geography: 'Located on the southeast coast of the Persian Gulf, built on desert sands with man-made islands and waterfront developments.',
      climate: 'Desert climate with extremely hot summers and pleasantly warm winters. Very low rainfall year-round.',
      accessibility: 'Major international hub with Dubai International Airport (DXB), modern metro system, and extensive taxi services.'
    },
    attractions: [
      {
        name: 'Burj Khalifa',
        description: 'World\'s tallest building with observation decks offering breathtaking views',
        image: 'https://images.unsplash.com/photo-1548919873-d49801cb957e?w=400&h=300&fit=crop',
        activities: ['Observation decks', 'Photography', 'Dining', 'Light shows'],
        entryFee: 'AED 149-500 depending on deck and time',
        timing: '8:30 AM - 11:00 PM'
      },
      {
        name: 'Dubai Mall',
        description: 'Massive shopping and entertainment complex with aquarium and ice rink',
        image: 'https://images.unsplash.com/photo-1548919873-d49801cb957e?w=400&h=300&fit=crop',
        activities: ['Shopping', 'Aquarium visits', 'Ice skating', 'Entertainment'],
        entryFee: 'Free entry, attractions priced separately',
        timing: '10:00 AM - 12:00 AM'
      },
      {
        name: 'Palm Jumeirah',
        description: 'Artificial palm-shaped island with luxury resorts and beaches',
        image: 'https://images.unsplash.com/photo-1548919873-d49801cb957e?w=400&h=300&fit=crop',
        activities: ['Beach relaxation', 'Water sports', 'Dining', 'Hotel tours'],
        entryFee: 'Free to access, hotels have private beaches',
        timing: 'Open 24/7'
      },
      {
        name: 'Dubai Gold Souk',
        description: 'Traditional gold market with hundreds of shops selling precious metals',
        image: 'https://images.unsplash.com/photo-1548919873-d49801cb957e?w=400&h=300&fit=crop',
        activities: ['Gold shopping', 'Bargaining', 'Cultural experience', 'Photography'],
        entryFee: 'Free',
        timing: '10:00 AM - 10:00 PM (closed Fridays morning)'
      }
    ],
    activities: [
      {
        name: 'Desert Safari',
        description: 'Adventure in desert dunes with dune bashing, camel rides, and BBQ dinner',
        duration: '6-7 hours',
        cost: 'AED 150-300',
        bestSeason: 'November to March'
      },
      {
        name: 'Dubai Marina Dhow Cruise',
        description: 'Traditional boat dinner cruise with skyline views and entertainment',
        duration: '2-3 hours',
        cost: 'AED 100-200',
        bestSeason: 'Year round'
      },
      {
        name: 'Burj Al Arab Tour',
        description: 'Visit world\'s most luxurious hotel with guided tour and high tea',
        duration: '2 hours',
        cost: 'AED 400-600 for high tea experience',
        bestSeason: 'Year round'
      }
    ],
    accommodation: {
      budget: [
        { name: 'Deira budget hotels', price: 'AED 150-300 per night', amenities: ['Basic rooms', 'Central location', 'Breakfast'] },
        { name: 'Hostels in Bur Dubai', price: 'AED 80-150 per night', amenities: ['Dorm beds', 'Shared facilities', 'Metro access'] }
      ],
      midRange: [
        { name: 'Marina hotels', price: 'AED 400-800 per night', amenities: ['Marina views', 'Pool', 'Gym', 'Restaurants'] },
        { name: 'Downtown hotels', price: 'AED 500-900 per night', amenities: ['Burj views', 'Luxury amenities', 'Shopping access'] }
      ],
      luxury: [
        { name: 'Burj Al Arab', price: 'AED 3,000-8,000+ per night', amenities: ['7-star luxury', 'Private butler', 'Helicopter pad', 'Spa'] },
        { name: 'Atlantis The Palm', price: 'AED 1,500-3,000+ per night', amenities: ['Water park', 'Aquarium', 'Beach access', 'Multiple restaurants'] }
      ]
    },
    cuisine: {
      localSpecialties: [
        { name: 'Shawarma', description: 'Marinated meat wrapped in flatbread with garlic sauce', price: 'AED 8-15' },
        { name: 'Al Harees', description: 'Traditional wheat and meat slow-cooked dish', price: 'AED 25-40' },
        { name: 'Camel meat dishes', description: 'Local delicacy prepared in various styles', price: 'AED 40-80' }
      ],
      popularRestaurants: [
        { name: 'Al Mallah', cuisine: 'Lebanese', priceRange: 'AED 30-60 per person', specialty: 'Shawarma and manakeesh' },
        { name: 'Zuma', cuisine: 'Japanese', priceRange: 'AED 300-500 per person', specialty: 'Contemporary Japanese cuisine' },
        { name: 'Pierchic', cuisine: 'Seafood', priceRange: 'AED 400-600 per person', specialty: 'Overwater seafood dining' }
      ]
    },
    transportation: {
      gettingAround: ['Dubai Metro', 'Taxis', 'Uber/Careem', 'RTA buses', 'Abra boats'],
      nearestAirport: 'Dubai International Airport (DXB)',
      railwayConnectivity: 'Metro connects major areas, no inter-city rail',
      roadConnectivity: 'Modern highway system, well-maintained roads'
    },
    travelTips: [
      'Dress modestly in public areas, especially during Ramadan',
      'Alcohol is only served in licensed venues (hotels, clubs)',
      'Friday is the holy day, many businesses open in afternoon',
      'Bargaining is expected in souks and markets',
      'Avoid public displays of affection - it\'s culturally inappropriate'
    ]
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    region: 'Lazio',
    description: 'The Eternal City where ancient ruins, Renaissance art, and vibrant Italian culture create an unforgettable journey through time.',
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=600&fit=crop',
    category: 'Historical & Cultural Destination',
    rating: 4.7,
    bestTimeToVisit: 'April to June, September to October',
    details: {
      overview: 'Rome, Italy\'s capital, is a living museum where nearly 3,000 years of history are visible in every corner. From the Colosseum to Vatican City, it\'s unparalleled historical treasure.',
      geography: 'Located along the Tiber River in central Italy, built on seven hills with ancient ruins scattered throughout the modern city.',
      climate: 'Mediterranean climate with hot summers, mild winters, and pleasant spring and autumn seasons.',
      accessibility: 'Major international hub with Fiumicino and Ciampino airports, extensive public transport, and walkable historic center.'
    },
    attractions: [
      {
        name: 'Colosseum',
        description: 'Ancient amphitheater where gladiators fought, symbol of Imperial Rome',
        image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop',
        activities: ['Historical tours', 'Photography', 'Underground tours', 'Night visits'],
        entryFee: '€16 adults, €2 EU citizens 18-25',
        timing: '8:30 AM - 7:00 PM (varies by season)'
      },
      {
        name: 'Vatican City',
        description: 'Independent city-state and heart of Catholic Church with St. Peter\'s Basilica',
        image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop',
        activities: ['Church visits', 'Museum tours', 'Sistine Chapel', 'St. Peter\'s Dome'],
        entryFee: 'Museums €17 adults, Basilica free',
        timing: '8:00 AM - 6:00 PM (varies)'
      },
      {
        name: 'Trevi Fountain',
        description: 'Baroque masterpiece and Rome\'s most famous fountain',
        image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop',
        activities: ['Coin tossing', 'Photography', 'People watching', 'Wish making'],
        entryFee: 'Free',
        timing: 'Open 24/7'
      },
      {
        name: 'Roman Forum',
        description: 'Ancient Roman political and commercial center with impressive ruins',
        image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop',
        activities: ['Archaeological exploration', 'Photography', 'Historical learning'],
        entryFee: '€16 adults (combo with Colosseum)',
        timing: '8:30 AM - 7:00 PM'
      }
    ],
    activities: [
      {
        name: 'Food Tour in Trastevere',
        description: 'Sample authentic Roman cuisine in charming neighborhood',
        duration: '3-4 hours',
        cost: '€70-100',
        bestSeason: 'Year round'
      },
      {
        name: 'Borghese Gallery and Gardens',
        description: 'Visit world-class art collection and beautiful gardens',
        duration: '3-4 hours',
        cost: '€13 gallery entry, gardens free',
        bestSeason: 'April to October'
      },
      {
        name: 'Appian Way Bike Tour',
        description: 'Cycle ancient Roman road with catacombs and ruins',
        duration: '4-5 hours',
        cost: '€50-80 including bike rental',
        bestSeason: 'Spring and autumn'
      }
    ],
    accommodation: {
      budget: [
        { name: 'Hostels near Termini Station', price: '€25-50 per night', amenities: ['Dorm beds', 'Central location', 'Breakfast'] },
        { name: 'B&B in outer districts', price: '€60-90 per night', amenities: ['Private rooms', 'Italian breakfast', 'Local experience'] }
      ],
      midRange: [
        { name: 'Hotels in Monti district', price: '€120-200 per night', amenities: ['Central location', 'Rooftop terraces', 'Modern amenities'] },
        { name: 'Boutique hotels in Trastevere', price: '€150-250 per night', amenities: ['Charming area', 'Local character', 'Walking distance to sights'] }
      ],
      luxury: [
        { name: 'Hotel de Russie', price: '€500-1000+ per night', amenities: ['Luxury rooms', 'Secret garden', 'Fine dining', 'Spa'] },
        { name: 'The First Roma Dolce', price: '€600-1200+ per night', amenities: ['5-star luxury', 'Rooftop restaurant', 'Spa', 'Central location'] }
      ]
    },
    cuisine: {
      localSpecialties: [
        { name: 'Cacio e Pepe', description: 'Simple pasta with pecorino cheese and black pepper', price: '€12-18' },
        { name: 'Supplì', description: 'Fried rice balls with mozzarella center', price: '€3-5' },
        { name: 'Gelato', description: 'Italian ice cream with various flavors', price: '€3-6 per scoop' }
      ],
      popularRestaurants: [
        { name: 'Da Enzo al 29', cuisine: 'Traditional Roman', priceRange: '€25-40 per person', specialty: 'Authentic Roman dishes' },
        { name: 'Pizzeria Monteforte', cuisine: 'Pizza', priceRange: '€15-25 per person', specialty: 'Roman-style pizza' },
        { name: 'Il Sorpasso', cuisine: 'Modern Italian', priceRange: '€40-60 per person', specialty: 'Contemporary Italian cuisine' }
      ]
    },
    transportation: {
      gettingAround: ['Metro', 'Buses', 'Walking', 'Electric scooters', 'Taxis'],
      nearestAirport: 'Fiumicino Airport (FCO) and Ciampino Airport (CIA)',
      railwayConnectivity: 'Termini Station - main rail hub with high-speed trains',
      roadConnectivity: 'Connected by Italian autostrade, but driving in center is restricted'
    },
    travelTips: [
      'Book Colosseum and Vatican tickets online weeks in advance',
      'Wear comfortable shoes - cobblestones are tough on feet',
      'Carry cash for small purchases and tips',
      'Many restaurants charge coperto (cover charge)',
      'Dress modestly when visiting churches - cover shoulders and knees'
    ]
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Lesser Sunda Islands',
    description: 'A tropical paradise known for pristine beaches, ancient temples, terraced rice paddies, and spiritual Hindu culture.',
    image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&h=600&fit=crop',
    category: 'Tropical & Spiritual Destination',
    rating: 4.6,
    bestTimeToVisit: 'April to October',
    details: {
      overview: 'Bali, the Island of the Gods, offers a perfect blend of natural beauty, spiritual traditions, and modern tourism. From surfing beaches to spiritual retreats, it caters to all travelers.',
      geography: 'Indonesian island with volcanic mountains, rice terraces, beautiful beaches, and coral reefs. Varied landscapes from coast to highlands.',
      climate: 'Tropical climate with two seasons: dry season (April-October) and rainy season (November-March). Warm temperatures year-round.',
      accessibility: 'Ngurah Rai International Airport (DPS) is the main gateway. Local transport includes taxis, ride-hailing apps, and scooter rentals.'
    },
    attractions: [
      {
        name: 'Tanah Lot Temple',
        description: 'Ancient sea temple perched on rock formation with stunning sunset views',
        image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400&h=300&fit=crop',
        activities: ['Temple visits', 'Sunset viewing', 'Photography', 'Cultural ceremonies'],
        entryFee: '60,000 IDR adults, 30,000 IDR children',
        timing: '7:00 AM - 7:00 PM'
      },
      {
        name: 'Tegallalang Rice Terraces',
        description: 'Spectacular ancient rice terraces with traditional irrigation system',
        image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400&h=300&fit=crop',
        activities: ['Walking tours', 'Photography', 'Swing rides', 'Local crafts'],
        entryFee: '15,000-25,000 IDR donation',
        timing: '8:00 AM - 6:00 PM'
      },
      {
        name: 'Uluwatu Temple',
        description: 'Cliff-top temple with Kecak fire dance performances at sunset',
        image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400&h=300&fit=crop',
        activities: ['Temple visits', 'Kecak dance', 'Sunset viewing', 'Monkey watching'],
        entryFee: '50,000 IDR, dance performance 150,000 IDR',
        timing: '9:00 AM - 6:00 PM'
      },
      {
        name: 'Sacred Monkey Forest',
        description: 'Nature reserve and temple complex with hundreds of long-tailed macaques',
        image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400&h=300&fit=crop',
        activities: ['Monkey watching', 'Temple visits', 'Nature walks', 'Photography'],
        entryFee: '100,000 IDR adults, 75,000 IDR children',
        timing: '9:00 AM - 6:00 PM'
      }
    ],
    activities: [
      {
        name: 'Surfing Lessons',
        description: 'Learn to surf at beginner-friendly beaches like Kuta or Canggu',
        duration: '2-3 hours',
        cost: '300,000-500,000 IDR',
        bestSeason: 'April to October'
      },
      {
        name: 'Traditional Cooking Class',
        description: 'Learn to prepare authentic Balinese dishes with local ingredients',
        duration: '4-5 hours',
        cost: '350,000-600,000 IDR',
        bestSeason: 'Year round'
      },
      {
        name: 'Mount Batur Sunrise Trek',
        description: 'Early morning hike to see spectacular sunrise from volcanic crater',
        duration: '4-5 hours',
        cost: '400,000-700,000 IDR including guide',
        bestSeason: 'April to October'
      }
    ],
    accommodation: {
      budget: [
        { name: 'Guesthouses in Ubud', price: '200,000-400,000 IDR per night', amenities: ['Basic rooms', 'Breakfast', 'Local experience'] },
        { name: 'Hostels in Canggu', price: '150,000-300,000 IDR per night', amenities: ['Dorm beds', 'Social atmosphere', 'Pool'] }
      ],
      midRange: [
        { name: 'Boutique hotels in Seminyak', price: '800,000-1,500,000 IDR per night', amenities: ['Pool', 'Spa', 'Beach access', 'Restaurant'] },
        { name: 'Villas in Ubud', price: '1,000,000-2,000,000 IDR per night', amenities: ['Private pool', 'Kitchen', 'Garden', 'Staff'] }
      ],
      luxury: [
        { name: 'Mandapa Ritz-Carlton', price: '3,000,000-6,000,000+ IDR per night', amenities: ['Luxury villas', 'Spa', 'Fine dining', 'Ayung River views'] },
        { name: 'Four Seasons Jimbaran', price: '2,500,000-5,000,000+ IDR per night', amenities: ['Private villas', 'Beach access', 'Multiple pools', 'Spa'] }
      ]
    },
    cuisine: {
      localSpecialties: [
        { name: 'Nasi Goreng', description: 'Indonesian fried rice with vegetables and meat', price: '30,000-60,000 IDR' },
        { name: 'Babi Guling', description: 'Suckling pig with spices, Balinese specialty', price: '80,000-150,000 IDR' },
        { name: 'Satay', description: 'Grilled meat skewers with peanut sauce', price: '20,000-40,000 IDR' }
      ],
      popularRestaurants: [
        { name: 'Warung Babi Guling Ibu Oka', cuisine: 'Balinese', priceRange: '50,000-100,000 IDR per person', specialty: 'Famous roast pig' },
        { name: 'La Lucciola', cuisine: 'Italian-Indonesian fusion', priceRange: '200,000-400,000 IDR per person', specialty: 'Beachfront dining' },
        { name: 'Bebek Bengil', cuisine: 'Balinese', priceRange: '100,000-200,000 IDR per person', specialty: 'Crispy duck' }
      ]
    },
    transportation: {
      gettingAround: ['Scooter rental', 'Go-Jek/Grab', 'Private driver', 'Taxis', 'Bemos (local vans)'],
      nearestAirport: 'Ngurah Rai International Airport (DPS)',
      railwayConnectivity: 'No rail network on Bali',
      roadConnectivity: 'Well-developed road network, but traffic can be heavy'
    },
    travelTips: [
      'Respect temple dress codes - cover shoulders and knees, bring sash',
      'Negotiate prices at markets and with taxi drivers',
      'Be careful with monkeys - don\'t wear glasses or jewelry',
      'Drink only bottled water and be careful with street food',
      'Learn basic Indonesian phrases - locals appreciate the effort'
    ]
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    region: 'England',
    description: 'A historic capital where royal tradition meets modern creativity, offering world-class museums, iconic landmarks, and diverse neighborhoods.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
    category: 'Historical & Cultural Destination',
    rating: 4.5,
    bestTimeToVisit: 'May to September',
    details: {
      overview: 'London, the capital of England and the UK, is a global city where history meets innovation. From royal palaces to modern art galleries, it offers endless cultural experiences.',
      geography: 'Located on the River Thames in southeast England. The city spans both sides of the river with numerous bridges connecting neighborhoods.',
      climate: 'Temperate maritime climate with mild winters, cool summers, and frequent rainfall year-round.',
      accessibility: 'Major international hub with Heathrow, Gatwick, Stansted airports, extensive Underground system, and comprehensive public transport.'
    },
    attractions: [
      {
        name: 'Tower of London',
        description: 'Historic castle housing Crown Jewels and centuries of royal history',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
        activities: ['Crown Jewels viewing', 'Historical tours', 'Beefeater tours', 'Ceremonial events'],
        entryFee: '£29.90 adults, £14.90 children',
        timing: '9:00 AM - 5:30 PM'
      },
      {
        name: 'British Museum',
        description: 'World\'s oldest national museum with global artifacts and treasures',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
        activities: ['Artifact viewing', 'Educational programs', 'Guided tours', 'Research'],
        entryFee: 'Free (special exhibitions may charge)',
        timing: '10:00 AM - 5:00 PM'
      },
      {
        name: 'Buckingham Palace',
        description: 'Official London residence of the British monarch',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
        activities: ["Changing of Guard", "Palace tours", "Photography", "Garden visits"],
        entryFee: 'Changing Guard free, Palace tours £26.50',
        timing: 'Changing Guard 11:00 AM, Palace tours vary'
      },
      {
        name: 'London Eye',
        description: 'Giant Ferris wheel offering panoramic city views',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
        activities: ['City views', 'Photography', 'Champagne experiences', 'Private capsules'],
        entryFee: '£27-42 per person',
        timing: '11:00 AM - 6:00 PM'
      }
    ],
    activities: [
      {
        name: 'West End Show',
        description: 'Watch world-class theater performance in London\'s theater district',
        duration: '2-3 hours',
        cost: '£20-100+ per ticket',
        bestSeason: 'Year round'
      },
      {
        name: 'Thames River Cruise',
        description: 'Boat tour passing major landmarks with commentary',
        duration: '30 minutes - 3 hours',
        cost: '£10-30 depending on route',
        bestSeason: 'April to September'
      },
      {
        name: 'Camden Market Tour',
        description: 'Explore alternative culture, street food, and unique shopping',
        duration: '2-3 hours',
        cost: 'Free entry, food and shopping varies',
        bestSeason: 'Year round'
      }
    ],
    accommodation: {
      budget: [
        { name: 'Hostels in central London', price: '£25-50 per night', amenities: ['Dorm beds', 'Central location', 'Social atmosphere'] },
        { name: 'Budget hotels in outer zones', price: '£60-100 per night', amenities: ['Private rooms', 'Tube access', 'Basic amenities'] }
      ],
      midRange: [
        { name: 'Boutique hotels in Covent Garden', price: '£150-250 per night', amenities: ['Central location', 'Character', 'Modern facilities'] },
        { name: 'Business hotels in Paddington', price: '£120-200 per night', amenities: ['Transport links', 'Modern rooms', 'Business services'] }
      ],
      luxury: [
        { name: 'The Ritz London', price: '£400-800+ per night', amenities: ['Palace luxury', 'Afternoon tea', 'Fine dining', 'Spa'] },
        { name: 'The Savoy', price: '£350-700+ per night', amenities: ['5-star luxury', 'River views', 'Historic charm', 'Theater district'] }
      ]
    },
    cuisine: {
      localSpecialties: [
        { name: 'Fish and Chips', description: 'Battered fish with fried chips, British classic', price: '£8-15' },
        { name: 'Full English Breakfast', description: 'Hearty breakfast with eggs, bacon, sausage, beans', price: '£8-12' },
        { name: 'Afternoon Tea', description: 'Tea with scones, sandwiches, and pastries', price: '£25-50' }
      ],
      popularRestaurants: [
        { name: 'Rules', cuisine: 'Traditional British', priceRange: '£40-70 per person', specialty: 'Game meats and classic dishes' },
        { name: 'Dishoom', cuisine: 'Indian-British', priceRange: '£25-40 per person', specialty: 'Bombay café style' },
        { name: 'Borough Market', cuisine: 'Street food', priceRange: '£5-20 per person', specialty: 'Global street food' }
      ]
    },
    transportation: {
      gettingAround: ['London Underground (Tube)', 'Buses', 'Walking', 'Black cabs', 'Uber'],
      nearestAirport: 'Heathrow (LHR), Gatwick (LGW), Stansted (STN)',
      railwayConnectivity: 'Major stations: King\'s Cross, Paddington, Victoria - national and international rail',
      roadConnectivity: 'M25 orbital motorway, but congestion charge applies in central London'
    },
    travelTips: [
      'Get an Oyster card or use contactless payment for cheaper transport',
      'Book theater tickets online for better prices and availability',
      'Many museums are free - take advantage of this',
      'Pack an umbrella - London weather is unpredictable',
      'Pub culture is important - try local pubs for authentic experience'
    ]
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    region: 'Catalonia',
    description: 'A vibrant Mediterranean city where Gaudí\'s architectural masterpieces meet beautiful beaches, tapas culture, and passionate Catalan traditions.',
    image: 'https://images.unsplash.com/photo-1583422409516-2885b9c2d1b1?w=800&h=600&fit=crop',
    category: 'Architectural & Coastal Destination',
    rating: 4.6,
    bestTimeToVisit: 'May to June, September to October',
    details: {
      overview: 'Barcelona, the capital of Catalonia, is famous for Antoni Gaudí\'s unique architecture, Mediterranean beaches, world-class cuisine, and vibrant cultural scene.',
      geography: 'Located on the northeastern coast of Spain along the Mediterranean Sea. The city is framed by the Collserola ridge and has multiple beaches.',
      climate: 'Mediterranean climate with hot summers, mild winters, and most rainfall in spring and autumn.',
      accessibility: 'Barcelona-El Prat Airport (BCN) is major international hub. Extensive metro system, buses, and walkable historic center.'
    },
    attractions: [
      {
        name: 'Sagrada Família',
        description: 'Gaudí\'s unfinished masterpiece basilica with unique architecture',
        image: 'https://images.unsplash.com/photo-1583422409516-2885b9c2d1b1?w=400&h=300&fit=crop',
        activities: ['Architecture viewing', 'Tower climbs', 'Museum visits', 'Photography'],
        entryFee: '€26 adults, €21 students, €14 children',
        timing: '9:00 AM - 8:00 PM'
      },
      {
        name: 'Park Güell',
        description: 'Gaudí\'s whimsical public park with mosaic creations and city views',
        image: 'https://images.unsplash.com/photo-1583422409516-2885b9c2d1b1?w=400&h=300&fit=crop',
        activities: ['Architecture viewing', 'Photography', 'City views', 'Nature walks'],
        entryFee: '€10 adults, €7 children',
        timing: '9:30 AM - 7:30 PM'
      },
      {
        name: 'Las Ramblas',
        description: 'Famous tree-lined pedestrian mall with street performers and markets',
        image: 'https://images.unsplash.com/photo-1583422409516-2885b9c2d1b1?w=400&h=300&fit=crop',
        activities: ['Walking', 'People watching', 'Shopping', 'Street entertainment'],
        entryFee: 'Free',
        timing: 'Open 24/7'
      },
      {
        name: 'Gothic Quarter',
        description: 'Medieval neighborhood with narrow streets, cathedrals, and plazas',
        image: 'https://images.unsplash.com/photo-1583422409516-2885b9c2d1b1?w=400&h=300&fit=crop',
        activities: ['Historical walking', 'Shopping', 'Dining', 'Photography'],
        entryFee: 'Free',
        timing: 'Open 24/7'
      }
    ],
    activities: [
      {
        name: 'Tapas Walking Tour',
        description: 'Sample various tapas and drinks in local bars and restaurants',
        duration: '3-4 hours',
        cost: '€60-90',
        bestSeason: 'Year round'
      },
      {
        name: 'Beach Day at Barceloneta',
        description: 'Relax on Mediterranean beach with water sports and beach bars',
        duration: 'Full day',
        cost: 'Free to €30 for activities',
        bestSeason: 'May to September'
      },
      {
        name: 'Montserrat Day Trip',
        description: 'Visit mountain monastery with spiritual significance and mountain views',
        duration: 'Full day',
        cost: '€30-50 including transport',
        bestSeason: 'Year round'
      }
    ],
    accommodation: {
      budget: [
        { name: 'Hostels in El Raval', price: '€25-45 per night', amenities: ['Dorm beds', 'Central location', 'Social atmosphere'] },
        { name: 'Pensiónes in Gothic Quarter', price: '€50-80 per night', amenities: ['Basic rooms', 'Historic location', 'Shared facilities'] }
      ],
      midRange: [
        { name: 'Boutique hotels in Eixample', price: '€120-200 per night', amenities: ['Modernist architecture', 'Central location', 'Rooftop terraces'] },
        { name: 'Hotels near Barceloneta beach', price: '€100-180 per night', amenities: ['Beach access', 'Sea views', 'Modern amenities'] }
      ],
      luxury: [
        { name: 'Hotel Arts Barcelona', price: '€400-800+ per night', amenities: ['Luxury rooms', 'Beachfront', 'Spa', 'Fine dining'] },
        { name: 'Mandarin Oriental', price: '€500-1000+ per night', amenities: ['5-star luxury', 'Central location', 'Spa', 'Michelin dining'] }
      ]
    },
    cuisine: {
      localSpecialties: [
        { name: 'Tapas variety', description: 'Small plates of various Spanish dishes', price: '€3-8 per plate' },
        { name: 'Paella', description: 'Traditional rice dish with seafood or meat', price: '€15-25' },
        { name: 'Crema Catalana', description: 'Catalan custard dessert with caramelized sugar', price: '€5-8' }
      ],
      popularRestaurants: [
        { name: 'El Nacional', cuisine: 'Spanish', priceRange: '€30-50 per person', specialty: 'Multiple Spanish restaurants under one roof' },
        { name: 'Tickets Bar', cuisine: 'Tapas', priceRange: '€40-60 per person', specialty: 'Avant-garde tapas' },
        { name: 'La Cova Fumada', cuisine: 'Tapas', priceRange: '€20-35 per person', specialty: 'Traditional tapas, bombas' }
      ]
    },
    transportation: {
      gettingAround: ['Metro', 'Buses', 'Walking', 'Bicycles', 'Taxis'],
      nearestAirport: 'Barcelona-El Prat Airport (BCN)',
      railwayConnectivity: 'Sants Station - high-speed AVE trains and regional services',
      roadConnectivity: 'Connected by Spanish motorways, but parking in city is difficult'
    },
    travelTips: [
      'Book Sagrada Família tickets online weeks in advance',
      'Be aware of pickpockets in tourist areas',
      'Many restaurants close for siesta (2-5 PM)',
      'Learn basic Catalan phrases - locals appreciate it',
      'Beach quality is good but not as pristine as other Mediterranean destinations'
    ]
  }
];

// Get all popular places
router.get('/', (req, res) => {
  try {
    res.json(popularPlaces);
  } catch (error) {
    console.error('Popular places API error:', error);
    res.status(500).json({ error: 'Failed to fetch popular places data' });
  }
});

// Get specific popular place
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const place = popularPlaces.find(p => p.id === id);
    
    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }
    
    res.json(place);
  } catch (error) {
    console.error('Popular place API error:', error);
    res.status(500).json({ error: 'Failed to fetch place data' });
  }
});

module.exports = router;