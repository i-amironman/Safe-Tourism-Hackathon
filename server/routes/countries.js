const express = require('express');
const router = express.Router();

const REST_COUNTRIES_API = 'https://restcountries.com/v3.1';

// Comprehensive tourism and cultural data for each country
const countryTourismData = {
  'india': {
    tourism: {
      description: "India, a diverse South Asian nation, offers an incredible tapestry of cultures, landscapes, and experiences. From the snow-capped Himalayas to tropical beaches, ancient monuments to modern cities, India presents endless opportunities for exploration.",
      bestTimeToVisit: "October to March",
      popularActivities: [
        "Visiting the Taj Mahal",
        "Exploring ancient temples",
        "Yoga and meditation retreats",
        "Wildlife safaris",
        "Beach relaxation in Goa",
        "Backwater cruises in Kerala"
      ],
      transportation: {
        domestic: "Extensive railway network, domestic flights, buses, and taxis",
        international: "Major international airports in Delhi, Mumbai, Bangalore, Chennai, and Kolkata"
      },
      accommodation: {
        budget: "Hostels and guesthouses starting from $5-15 per night",
        midRange: "3-star hotels and heritage properties $30-100 per night",
        luxury: "5-star hotels and palaces $150-500+ per night"
      }
    },
    culture: {
      overview: "India's culture is one of the world's oldest, dating back over 5,000 years. It's characterized by immense diversity, religious harmony, and rich traditions.",
      languages: ["Hindi", "Bengali", "Telugu", "Marathi", "Tamil", "Urdu", "Gujarati", "Kannada", "Malayalam", "Punjabi", "English"],
      religions: ["Hinduism", "Islam", "Christianity", "Sikhism", "Buddhism", "Jainism"],
      festivals: [
        {
          name: "Diwali",
          description: "Festival of Lights celebrated with fireworks, sweets, and oil lamps",
          month: "October-November"
        },
        {
          name: "Holi",
          description: "Festival of Colors where people throw colored powder and water",
          month: "March"
        },
        {
          name: "Durga Puja",
          description: "Celebration of goddess Durga with elaborate pandals and cultural performances",
          month: "October"
        },
        {
          name: "Eid",
          description: "Islamic festival marking the end of Ramadan",
          month: "Varies (Islamic calendar)"
        }
      ],
      traditions: {
        clothing: ["Sari", "Salwar Kameez", "Kurta", "Dhoti", "Sherwani"],
        cuisine: ["Curry", "Biryani", "Dosas", "Samosas", "Tandoori dishes", "Sweets like Gulab Jamun and Jalebi"],
        arts: ["Classical dances (Bharatanatyam, Kathak)", "Classical music", "Bollywood", "Madhubani paintings"]
      }
    },
    people: {
      lifestyle: "Indians generally value family, community, and tradition. The lifestyle varies greatly between urban and rural areas.",
      hospitality: "Known for 'Atithi Devo Bhava' (Guest is God) philosophy, Indians are extremely hospitable to visitors.",
      socialCustoms: ["Respect for elders", "Joint family system", "Festive celebrations", "Religious tolerance"]
    }
  },
  'usa': {
    tourism: {
      description: "The United States offers vast geographical diversity, from bustling cities to natural wonders. Experience American culture, innovation, and the great outdoors.",
      bestTimeToVisit: "May to September (varies by region)",
      popularActivities: [
        "Visiting National Parks",
        "Exploring New York City",
        "Road trips on Route 66",
        "Hiking in the Rockies",
        "Beach vacations in California and Florida",
        "Theme parks (Disney, Universal)"
      ],
      transportation: {
        domestic: "Extensive flight network, Amtrak trains, interstate highways, buses",
        international: "Major hubs: JFK, LAX, ORD, DFW, ATL, SFO"
      },
      accommodation: {
        budget: "Motels and hostels $40-80 per night",
        midRange: "Chain hotels $100-200 per night",
        luxury: "5-star hotels and resorts $250-600+ per night"
      }
    },
    culture: {
      overview: "American culture is a melting pot of global influences, characterized by individualism, innovation, and diversity.",
      languages: ["English", "Spanish", "Chinese", "French", "German"],
      religions: ["Christianity", "Judaism", "Islam", "Buddhism", "Hinduism"],
      festivals: [
        {
          name: "Thanksgiving",
          description: "Family feast expressing gratitude for harvest and blessings",
          month: "November"
        },
        {
          name: "Independence Day",
          description: "National day with fireworks, parades, and patriotic celebrations",
          month: "July 4th"
        },
        {
          name: "Halloween",
          description: "Costume parties, trick-or-treating, and spooky decorations",
          month: "October 31st"
        }
      ],
      traditions: {
        clothing: ["Jeans", "T-shirts", "Business casual", "Cowboy boots (regional)"],
        cuisine: ["Hamburgers", "Hot dogs", "BBQ", "Apple pie", "Mac and cheese", "Clam chowder"],
        arts: ["Hollywood movies", "Jazz music", "Broadway shows", "Abstract expressionism", "Country music"]
      }
    },
    people: {
      lifestyle: "Americans value independence, work-life balance, and personal achievement. Lifestyle varies significantly by region.",
      hospitality: "Generally friendly and informal, Americans welcome visitors with warmth and curiosity.",
      socialCustoms: ["Tipping culture", "Personal space", "Direct communication", "Sports enthusiasm"]
    }
  },
  'japan': {
    tourism: {
      description: "Japan seamlessly blends ancient traditions with cutting-edge technology. Experience serene temples, vibrant cities, exquisite cuisine, and natural beauty.",
      bestTimeToVisit: "March-May (cherry blossoms) and October-November (autumn colors)",
      popularActivities: [
        "Cherry blossom viewing (Hanami)",
        "Visiting ancient temples and shrines",
        "Experiencing traditional tea ceremonies",
        "Exploring Tokyo's modern districts",
        "Soaking in hot springs (Onsen)",
        "Hiking Mount Fuji"
      ],
      transportation: {
        domestic: "Shinkansen (bullet trains), extensive rail network, domestic flights",
        international: "Major airports: Narita, Haneda (Tokyo), Kansai (Osaka)"
      },
      accommodation: {
        budget: "Business hotels and hostels $30-70 per night",
        midRange: "Ryokans and 3-4 star hotels $80-200 per night",
        luxury: "5-star hotels and luxury ryokans $250-800+ per night"
      }
    },
    culture: {
      overview: "Japanese culture emphasizes harmony, respect, and precision. It's a unique blend of ancient traditions and modern innovation.",
      languages: ["Japanese", "English (in major cities)"],
      religions: ["Shintoism", "Buddhism"],
      festivals: [
        {
          name: "Cherry Blossom Festival",
          description: "Celebration of spring with picnics under cherry trees",
          month: "March-April"
        },
        {
          name: "Gion Matsuri",
          description: "Kyoto's famous festival with elaborate floats and traditional performances",
          month: "July"
        },
        {
          name: "Obon",
          description: "Buddhist festival honoring ancestors' spirits",
          month: "August"
        }
      ],
      traditions: {
        clothing: ["Kimono", "Yukata", "Hakama", "Business suits"],
        cuisine: ["Sushi", "Ramen", "Tempura", "Yakitori", "Miso soup", "Matcha desserts"],
        arts: ["Origami", "Ikebana (flower arranging)", "Calligraphy", "Tea ceremony", "Kabuki theater"]
      }
    },
    people: {
      lifestyle: "Japanese people value harmony, group consensus, and attention to detail. Work-life balance is evolving but remains important.",
      hospitality: "Known for exceptional service and politeness (omotenashi), Japanese hosts go above and beyond for guests.",
      socialCustoms: ["Bowing", "Removing shoes indoors", "Gift-giving etiquette", "Quiet public behavior"]
    }
  },
  'united kingdom': {
    tourism: {
      description: "The United Kingdom offers a rich tapestry of history, culture, and modern attractions. From London's iconic landmarks to Scotland's highlands, experience centuries of heritage and contemporary British life.",
      bestTimeToVisit: "May to September",
      popularActivities: [
        "Visiting Buckingham Palace and Tower of London",
        "Exploring Edinburgh Castle",
        "Stonehenge and Bath tours",
        "Theater shows in London's West End",
        "Hiking in the Scottish Highlands",
        "Pub culture experiences"
      ],
      transportation: {
        domestic: "Extensive rail network, buses, London Underground, domestic flights",
        international: "Major hubs: Heathrow, Gatwick, Manchester, Edinburgh"
      },
      accommodation: {
        budget: "Hostels and B&Bs £25-60 per night",
        midRange: "3-star hotels and inns £80-150 per night",
        luxury: "5-star hotels and luxury apartments £200-500+ per night"
      }
    },
    culture: {
      overview: "British culture is known for its politeness, queuing, love of tea, and rich literary traditions. It's a blend of ancient customs and modern multiculturalism.",
      languages: ["English", "Welsh", "Scottish Gaelic", "Irish Gaelic"],
      religions: ["Christianity", "Islam", "Hinduism", "Sikhism", "Judaism"],
      festivals: [
        {
          name: "Christmas",
          description: "Major holiday with traditions like Christmas trees, crackers, and festive meals",
          month: "December 25th"
        },
        {
          name: "Easter",
          description: "Christian celebration with egg hunts and special meals",
          month: "March-April"
        },
        {
          name: "Bonfire Night",
          description: "Celebration with fireworks and bonfires commemorating Guy Fawkes",
          month: "November 5th"
        }
      ],
      traditions: {
        clothing: ["Formal wear", "Tweed jackets", "Raincoats", "Business suits"],
        cuisine: ["Fish and chips", "Sunday roast", "Full English breakfast", "Afternoon tea", "Shepherd's pie"],
        arts: ["Shakespeare", "The Beatles", "The Royal Ballet", "BBC productions", "Street art"]
      }
    },
    people: {
      lifestyle: "British people value politeness, tradition, and work-life balance. Pub culture and afternoon tea are important social rituals.",
      hospitality: "Known for their politeness and dry wit, British hosts are welcoming though sometimes reserved.",
      socialCustoms: ["Queuing", "Tea drinking", "Pub socializing", "Respect for personal space"]
    }
  }
};

// Get all countries
router.get('/', async (req, res) => {
  try {
    const response = await fetch(`${REST_COUNTRIES_API}/all`);
    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }
    
    const countries = await response.json();
    
    // Add tourism data to each country
    const countriesWithTourism = countries.map(country => ({
      ...country,
      tourism: countryTourismData[country.name.common.toLowerCase()] || 
              countryTourismData[country.name.official.toLowerCase()] ||
              generateDefaultTourismData(country)
    }));

    res.json(countriesWithTourism);
  } catch (error) {
    console.error('Countries API error:', error);
    res.status(500).json({ error: 'Failed to fetch country data' });
  }
});

// Get specific country
router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const response = await fetch(`${REST_COUNTRIES_API}/name/${encodeURIComponent(name)}`);
    
    if (!response.ok) {
      throw new Error(`Country not found: ${name}`);
    }
    
    const [countryData] = await response.json();
    const tourismInfo = countryTourismData[countryData.name.common.toLowerCase()] || 
                       countryTourismData[countryData.name.official.toLowerCase()] ||
                       generateDefaultTourismData(countryData);

    res.json({
      ...countryData,
      tourism: tourismInfo
    });
  } catch (error) {
    console.error('Country API error:', error);
    res.status(500).json({ error: 'Failed to fetch country data' });
  }
});

function generateDefaultTourismData(country) {
  return {
    tourism: {
      description: `${country.name.common} offers unique cultural experiences and attractions for visitors to explore and enjoy.`,
      bestTimeToVisit: "Varies by region",
      popularActivities: [
        "Exploring local markets",
        "Visiting historical sites",
        "Trying local cuisine",
        "Meeting local people",
        "Learning about local culture"
      ],
      transportation: {
        domestic: "Local transportation available",
        international: `International airports serve ${country.name.common}`
      },
      accommodation: {
        budget: "Budget options available",
        midRange: "Mid-range hotels available",
        luxury: "Luxury accommodations available"
      }
    },
    culture: {
      overview: `${country.name.common} has a rich cultural heritage worth exploring.`,
      languages: country.languages ? Object.values(country.languages) : ["Local languages"],
      religions: ["Various religions"],
      festivals: [
        {
          name: "National Day",
          description: "Celebration of national independence or heritage",
          month: "Varies"
        }
      ],
      traditions: {
        clothing: ["Traditional and modern attire"],
        cuisine: ["Local and international dishes"],
        arts: ["Traditional and contemporary arts"]
      }
    },
    people: {
      lifestyle: "Local lifestyle reflects cultural heritage and modern influences",
      hospitality: "Local people are generally welcoming to visitors",
      socialCustoms: ["Respect local customs and traditions"]
    }
  };
}

module.exports = router;