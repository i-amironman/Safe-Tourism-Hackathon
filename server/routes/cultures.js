const express = require('express');
const router = express.Router();

// Comprehensive cultures data from around the world
const culturesData = [
  {
    id: 'japanese',
    name: 'Japanese Culture',
    region: 'East Asia',
    description: 'A harmonious blend of ancient traditions and cutting-edge modernity, emphasizing respect, precision, and aesthetic beauty.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
    details: {
      overview: 'Japanese culture is deeply rooted in Shinto and Buddhist traditions, with a strong emphasis on harmony (wa), group consensus, and attention to detail. The culture seamlessly preserves ancient customs while embracing technological innovation.',
      history: 'Japan has a rich history spanning over 2,000 years, from the Jomon period through feudal times, isolation, to modernization. Key periods include the Heian period (cultural golden age), feudal era with samurai, and the Meiji Restoration modernization.',
      philosophy: 'Key concepts include wa (harmony), giri (social obligation), on (debt of gratitude), and the pursuit of perfection in crafts. Zen Buddhism heavily influences aesthetics and mindfulness.',
      socialStructure: 'Traditionally hierarchical with respect for age and position. Modern Japan maintains elements of this while becoming more egalitarian.'
    },
    traditions: {
      clothing: ['Kimono', 'Yukata', 'Hakama', 'Tabi socks', 'Geta sandals'],
      cuisine: ['Sushi', 'Ramen', 'Tempura', 'Kaiseki', 'Izakaya dining', 'Tea ceremony'],
      arts: ['Origami', 'Ikebana', 'Calligraphy', 'Tea Ceremony', 'Kabuki Theater', 'Anime/Manga'],
      customs: ['Bowing', 'Removing shoes indoors', 'Gift-giving', 'Cherry blossom viewing', 'Onsen bathing']
    },
    festivals: [
      {
        name: 'Cherry Blossom Festival (Hanami)',
        description: 'Spring celebration where people gather under cherry trees for picnics and appreciation of transient beauty',
        month: 'March-April',
        significance: 'Celebrates the beauty and impermanence of life'
      },
      {
        name: 'Gion Matsuri',
        description: 'Kyoto\'s most famous festival featuring elaborate floats, traditional music, and street food',
        month: 'July',
        significance: 'Dates back to 869 CE, originally to purify the city'
      },
      {
        name: 'Obon',
        description: 'Buddhist festival honoring ancestral spirits with dances and lanterns',
        month: 'August',
        significance: 'Believed that ancestors\' spirits return to visit relatives'
      }
    ],
    places: [
      {
        name: 'Kyoto',
        description: 'Ancient capital with thousands of temples, traditional gardens, and geisha districts',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop',
        attractions: ['Fushimi Inari Shrine', 'Kinkaku-ji Temple', 'Arashiyama Bamboo Grove', 'Gion District']
      },
      {
        name: 'Tokyo',
        description: 'Modern metropolis blending ultra-modern technology with traditional culture',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
        attractions: ['Senso-ji Temple', 'Meiji Shrine', 'Shibuya Crossing', 'Traditional gardens']
      },
      {
        name: 'Nara',
        description: 'First permanent capital of Japan, home to Great Buddha and friendly deer',
        image: 'https://images.unsplash.com/photo-1574664079035-d4ff9b5dcbf8?w=400&h=300&fit=crop',
        attractions: ['Todai-ji Temple', 'Nara Park', 'Kasuga Taisha', 'Isuien Garden']
      }
    ],
    people: {
      lifestyle: 'Japanese people value harmony, group consensus, and meticulous attention to detail. Work culture is intense but evolving toward better work-life balance.',
      values: ['Respect for elders', 'Group harmony', 'Perfectionism', 'Politeness', 'Punctuality'],
      hospitality: 'Omotenashi - selfless hospitality anticipating guests\' needs without being asked. Exceptional service standards.',
      dailyLife: 'Efficient public transport, convenience store culture, seasonal appreciation, and community participation.'
    }
  },
  {
    id: 'indian',
    name: 'Indian Culture',
    region: 'South Asia',
    description: 'One of the world\'s oldest and most diverse cultures, characterized by spiritual depth, colorful traditions, and incredible regional variety.',
    image: 'https://s7ap1.scene7.com/is/image/incredibleindia/people-and-culture-hero-new?qlt=82&ts=1726640287102',
    details: {
      overview: 'Indian culture is a tapestry of thousands of years of history, diverse religions, languages, and traditions. It\'s known for its spiritual depth, artistic expression, and family values.',
      history: 'Dating back over 5,000 years to the Indus Valley Civilization, Indian culture has been shaped by ancient kingdoms, Mughal rule, British colonization, and modern democracy.',
      philosophy: 'Rooted in ancient texts like Vedas and Upanishads. Key concepts include dharma (duty), karma (action and consequence), and moksha (liberation).',
      socialStructure: 'Traditionally organized by caste system, though modern India is moving toward greater equality. Family and community remain central.'
    },
    traditions: {
      clothing: ['Sari', 'Salwar Kameez', 'Kurta', 'Dhoti', 'Sherwani', 'Lehenga'],
      cuisine: ['Curry varieties', 'Biryani', 'Dosas', 'Samosas', 'Tandoori', 'Regional sweets'],
      arts: ['Classical dances', 'Bollywood', 'Classical music', 'Madhubani paintings', 'Textile arts'],
      customs: ['Namaste greeting', 'Fasting', 'Pilgrimages', 'Joint family system', 'Festival celebrations']
    },
    festivals: [
      {
        name: 'Diwali',
        description: 'Festival of Lights with oil lamps, fireworks, sweets, and family gatherings',
        month: 'October-November',
        significance: 'Celebrates victory of light over darkness, good over evil'
      },
      {
        name: 'Holi',
        description: 'Festival of Colors where people throw colored powder and water joyfully',
        month: 'March',
        significance: 'Celebrates spring arrival and divine love of Radha-Krishna'
      },
      {
        name: 'Durga Puja',
        description: 'Elaborate celebration of goddess Durga with artistic pandals and cultural performances',
        month: 'October',
        significance: 'Celebrates goddess Durga\'s victory over buffalo demon Mahishasur'
      }
    ],
    places: [
      {
        name: 'Varanasi',
        description: 'Spiritual capital on the Ganges, one of world\'s oldest continuously inhabited cities',
        image: 'https://images.unsplash.com/photo-1524492412937-b28074a5687a?w=400&h=300&fit=crop',
        attractions: ['Ghats of Ganges', 'Kashi Vishwanath Temple', 'Sarnath', 'Evening aarti ceremonies']
      },
      {
        name: 'Rajasthan',
        description: 'Land of kings with magnificent forts, palaces, and desert culture',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop',
        attractions: ['Amber Fort', 'City Palace Udaipur', 'Jaisalmer Fort', 'Pushkar Camel Fair']
      },
      {
        name: 'Kerala',
        description: 'Tropical paradise known for backwaters, Ayurveda, and rich cultural traditions',
        image: 'https://images.unsplash.com/photo-1574664079035-d4ff9b5dcbf8?w=400&h=300&fit=crop',
        attractions: ['Backwater houseboats', 'Kathakali performances', 'Ayurvedic resorts', 'Tea plantations']
      }
    ],
    people: {
      lifestyle: 'Indians generally value family, community, and tradition. Lifestyle varies greatly between urban and rural areas, with rapid modernization in cities.',
      values: ['Family bonds', 'Respect for elders', 'Religious tolerance', 'Hospitality', 'Education'],
      hospitality: 'Atithi Devo Bhava (Guest is God) - Indians are known for warm hospitality and treating visitors like family.',
      dailyLife: 'Strong family ties, community celebrations, religious practices, and increasing modernization while maintaining traditions.'
    }
  }, 
  {
    id: 'mediterranean',
    name: 'Mediterranean Culture',
    region: 'Southern Europe',
    description: 'A vibrant culture centered around family, food, and relaxed lifestyle, influenced by ancient civilizations and sea trade.',
    image: 'https://images.fineartamerica.com/images-medium-large-5/romantic-travel-destination-oia-mbbirdy.jpg',
    details: {
      overview: 'Mediterranean culture spans countries like Greece, Italy, Spain, and others. It\'s characterized by emphasis on family, fresh food, relaxed pace of life, and rich historical heritage.',
      history: 'Birthplace of Western civilization, with influences from ancient Greece, Roman Empire, Byzantine Empire, and various maritime trade cultures.',
      philosophy: 'Emphasis on work-life balance, family values, enjoying simple pleasures, and living in harmony with nature and seasons.',
      socialStructure: 'Family-centered with strong multigenerational bonds. Community and social connections are highly valued.'
    },
    traditions: {
      clothing: ['Light linen fabrics', 'Traditional folk costumes', 'Beachwear', 'Casual elegant style'],
      cuisine: ['Olive oil', 'Fresh seafood', 'Mediterranean vegetables', 'Wine', 'Cheese varieties', 'Fresh herbs'],
      arts: ['Renaissance art', 'Folk music', 'Traditional dances', 'Pottery', 'Mosaic art'],
      customs: ['Siesta tradition', 'Family meals', 'Wine culture', 'Beach gatherings', 'Festival celebrations']
    },
    festivals: [
      {
        name: 'La Tomatina',
        description: 'Spanish tomato throwing festival where participants throw tomatoes at each other',
        month: 'August',
        significance: 'Pure celebration and community fun'
      },
      {
        name: 'Orthodox Easter',
        description: 'Major religious celebration with church services, feasts, and family gatherings',
        month: 'April-May',
        significance: 'Most important religious holiday in Orthodox Christianity'
      },
      {
        name: 'Venice Carnival',
        description: 'Elaborate masquerade festival with costumes, masks, and grand balls',
        month: 'February',
        significance: 'Celebrates history and artistic expression'
      }
    ],
    places: [
      {
        name: 'Santorini, Greece',
        description: 'Iconic island with white-washed buildings, blue domes, and spectacular sunsets',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop',
        attractions: ['Oia sunset', 'Red Beach', 'Ancient Thira', 'Wine tours']
      },
      {
        name: 'Amalfi Coast, Italy',
        description: 'Stunning coastline with colorful cliffside villages and Mediterranean charm',
        image: 'https://images.unsplash.com/photo-1549580335-c6a2ff85cc2f?w=400&h=300&fit=crop',
        attractions: ['Positano', 'Ravello', 'Emerald Grotto', 'Lemon groves']
      },
      {
        name: 'Barcelona, Spain',
        description: 'Vibrant city combining Gothic architecture, modernist masterpieces, and beach culture',
        image: 'https://images.unsplash.com/photo-1515895309288-a3815ab7cf81?w=400&h=300&fit=crop',
        attractions: ['Sagrada Familia', 'Park Güell', 'Gothic Quarter', 'Beachfront']
      }
    ],
    people: {
      lifestyle: 'Mediterranean people value family, food, and taking time to enjoy life. Work-life balance is important, with emphasis on leisure and social connections.',
      values: ['Family time', 'Food and wine', 'Relaxed pace', 'Social connections', 'Outdoor living'],
      hospitality: 'Warm and welcoming, Mediterranean hosts take pride in feeding guests and making them feel like family.',
      dailyLife: 'Long meals with family, evening strolls (passegiata), beach culture, and strong community ties.'
    }
  },
  {
    id: 'nordic',
    name: 'Nordic Culture',
    region: 'Northern Europe',
    description: 'A culture emphasizing nature connection, social equality, and hygge - the art of cozy contentment and simple pleasures.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    details: {
      overview: 'Nordic culture encompasses Denmark, Norway, Sweden, Finland, and Iceland. It values nature, equality, simplicity, and community well-being over individual achievement.',
      history: 'Viking heritage, followed by periods of kingdoms, unions, and modern social democracies. Strong connection to nature and seasonal changes.',
      philosophy: 'Emphasis on lagom (just right), hygge (coziness), friluftsliv (outdoor life), and collective responsibility for social welfare.',
      socialStructure: 'Highly egalitarian with strong social safety nets. Trust in institutions and high levels of social equality.'
    },
    traditions: {
      clothing: ['Functional minimalist design', 'Warm woolens', 'Outdoor gear', 'Sustainable fashion'],
      cuisine: ['Smoked salmon', 'Rye bread', 'Berries', 'Pickled herring', 'Cinnamon buns', 'Coffee culture'],
      arts: ['Scandinavian design', 'Nordic noir', ' Folk music', 'Minimalist architecture', 'Nature photography'],
      customs: ['Coffee breaks (fika)', 'Sauna culture', 'Midsummer celebrations', 'Christmas traditions', 'Outdoor activities']
    },
    festivals: [
      {
        name: 'Midsummer',
        description: 'Summer solstice celebration with maypole dancing, flower crowns, and all-night festivities',
        month: 'June',
        significance: 'Celebrates longest day of year and nature\'s abundance'
      },
      {
        name: 'St. Lucia Day',
        description: 'Festival of light with candle crowns, saffron buns, and processions',
        month: 'December 13th',
        significance: 'Brings light during darkest time of year'
      },
      {
        name: 'Northern Lights Festivals',
        description: 'Winter celebrations celebrating the aurora borealis with outdoor activities',
        month: 'September-March',
        significance: 'Celebrates natural wonder and winter beauty'
      }
    ],
    places: [
      {
        name: 'Norwegian Fjords',
        description: 'Spectacular natural landscapes with deep blue fjords, waterfalls, and dramatic cliffs',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        attractions: ['Geirangerfjord', 'Preikestolen', 'Trolltunga', 'Bergen']
      },
      {
        name: 'Copenhagen, Denmark',
        description: 'Cozy capital known for colorful harbors, castles, and happy lifestyle',
        image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400&h=300&fit=crop',
        attractions: ['Nyhavn Harbor', 'Tivoli Gardens', 'Amalienborg Palace', 'Legoland']
      },
      {
        name: 'Iceland',
        description: 'Land of fire and ice with glaciers, volcanoes, hot springs, and Northern Lights',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        attractions: ['Blue Lagoon', 'Golden Circle', 'Northern Lights', 'Glacier hiking']
      }
    ],
    people: {
      lifestyle: 'Nordic people value work-life balance, nature connection, and community. High trust in society and emphasis on collective well-being.',
      values: ['Equality', 'Nature connection', 'Work-life balance', 'Sustainability', 'Social trust'],
      hospitality: 'Reserved but genuinely welcoming. Nordic hosts value authenticity and making guests feel comfortable in their homes.',
      dailyLife: 'Strong coffee culture, outdoor activities regardless of weather, cozy home life, and community participation.'
    }
  },
  {
    id: 'latin-american',
    name: 'Latin American Culture',
    region: 'Central and South America',
    description: 'A passionate and vibrant culture blending indigenous traditions, colonial heritage, and modern influences, known for music, dance, and family values.',
    image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&h=600&fit=crop',
    details: {
      overview: 'Latin American culture is a rich tapestry woven from indigenous civilizations, Spanish and Portuguese colonial influences, African traditions, and modern global trends. It\'s characterized by passion, family orientation, and celebration.',
      history: 'Ancient civilizations like Aztec, Maya, and Inca laid foundations, followed by Spanish and Portuguese colonization, independence movements, and modern nation-building.',
      philosophy: 'Emphasis on family, community, celebration of life, and personal relationships. Time is more flexible, and human connections take precedence over strict schedules.',
      socialStructure: 'Family-centered with strong extended family networks. Community bonds are important, and social hierarchies exist but are more fluid than in many cultures.'
    },
    traditions: {
      clothing: ['Colorful traditional garments', 'Ponchos', 'Sombreros', 'Embroidered textiles', 'Modern urban fashion'],
      cuisine: ['Tacos and empanadas', 'Ceviche', 'Asado barbecue', 'Corn-based dishes', 'Plantains', 'Dulce de leche'],
      arts: ['Salsa dancing', 'Tango', 'Mariachi music', 'Carnival celebrations', 'Indigenous crafts', 'Magical realism literature'],
      customs: ['Family gatherings', 'Siesta tradition', 'Religious festivals', 'Community celebrations', 'Hospitality to strangers']
    },
    festivals: [
      {
        name: 'Carnival',
        description: 'Elaborate pre-Lenten celebration with parades, costumes, music, and dancing',
        month: 'February-March',
        significance: 'Final celebration before Lent, most famous in Rio de Janeiro'
      },
      {
        name: 'Día de los Muertos',
        description: 'Day of the Dead honoring deceased loved ones with altars, food, and celebrations',
        month: 'November 1-2',
        significance: 'Celebrates the eternal bond between living and deceased family members'
      },
      {
        name: 'Inti Raymi',
        description: 'Incan sun festival with traditional ceremonies, music, and colorful celebrations',
        month: 'June 24',
        significance: 'Honors the sun god Inti and celebrates winter solstice in Southern Hemisphere'
      }
    ],
    places: [
      {
        name: 'Machu Picchu, Peru',
        description: 'Ancient Incan citadel high in the Andes Mountains, one of the world\'s most archaeological wonders',
        image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400&h=300&fit=crop',
        attractions: ['Huayna Picchu', 'Temple of the Sun', 'Inca Trail', 'Sacred Valley']
      },
      {
        name: 'Rio de Janeiro, Brazil',
        description: 'Vibrant coastal city famous for Carnival, beaches, and iconic Christ the Redeemer statue',
        image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400&h=300&fit=crop',
        attractions: ['Christ the Redeemer', 'Copacabana Beach', 'Sugarloaf Mountain', 'Carnival parades']
      },
      {
        name: 'Mexico City, Mexico',
        description: 'Massive capital blending Aztec heritage, colonial architecture, and modern urban culture',
        image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400&h=300&fit=crop',
        attractions: ['Zócalo', 'National Museum of Anthropology', 'Chapultepec Park', 'Frida Kahlo Museum']
      }
    ],
    people: {
      lifestyle: 'Latin Americans are generally warm, family-oriented, and passionate about life. Social relationships are highly valued, and celebrations are important community events.',
      values: ['Family unity', 'Friendship', 'Celebration', 'Religious faith', 'Personal relationships'],
      hospitality: 'Extremely warm and welcoming. Guests are treated like family, and it\'s common to be invited into homes for meals and celebrations.',
      dailyLife: 'Extended family gatherings, community festivals, passionate discussions about soccer and politics, and a generally relaxed approach to time.'
    }
  },
  {
    id: 'middle-eastern',
    name: 'Middle Eastern Culture',
    region: 'Middle East and North Africa',
    description: 'An ancient and sophisticated culture blending Islamic traditions, tribal customs, and modern innovations, known for hospitality, commerce, and artistic heritage.',
    image: 'https://cms-b-assets.familysearch.org/dims4/default/abc5aff/2147483647/strip/true/crop/800x500+0+0/resize/800x500!/format/webp/quality/90/?url=http%3A%2F%2Ffh.familysearch.org%2Fsystem%2Ffiles%2Fteam%2Fait%2Fimages%2Fblog%2Fdome-of-the-rock-jerusalem.jpg',
    details: {
      overview: 'Middle Eastern culture is rooted in ancient civilizations and Islamic traditions, emphasizing family honor, hospitality, and community. It spans from Morocco to Iran, with regional variations but shared core values.',
      history: 'Cradle of civilization with ancient Mesopotamia, Egypt, and Persia. Rise of Islam in 7th century CE, followed by golden ages of science, philosophy, and art.',
      philosophy: 'Emphasis on family honor, hospitality to guests, community responsibility, and balance between tradition and modernity. Time is seen as cyclical rather than linear.',
      socialStructure: 'Family and clan-centered with respect for elders. Traditional gender roles evolving in modern times. Community and religious institutions play important roles.'
    },
    traditions: {
      clothing: ['Thobes and abayas', 'Head coverings', 'Traditional embroidery', 'Modern modest fashion', 'Luxury fabrics'],
      cuisine: ['Hummus and falafel', 'Grilled meats', 'Rice pilaf', 'Fresh dates', 'Mint tea', 'Baklava'],
      arts: ['Calligraphy', 'Geometric patterns', 'Carpet weaving', 'Poetry', 'Music with oud and darbuka', 'Islamic architecture'],
      customs: ['Hospitality to guests', 'Family honor', 'Religious observance', 'Community gatherings', 'Business negotiations over tea']
    },
    festivals: [
      {
        name: 'Ramadan',
        description: 'Month of fasting from dawn to sunset with special prayers, family meals, and community gatherings',
        month: 'Varies (Islamic calendar)',
        significance: 'Month when Quran was revealed, time for spiritual reflection and self-discipline'
      },
      {
        name: 'Eid al-Fitr',
        description: 'Festival breaking the Ramadan fast with celebrations, new clothes, gifts, and feasting',
        month: 'Varies (Islamic calendar)',
        significance: 'Celebrates completion of Ramadan fasting, emphasizes charity and community'
      },
      {
        name: 'Nowruz',
        description: 'Persian New Year celebration with spring cleaning, family gatherings, and symbolic foods',
        month: 'March 21',
        significance: 'Celebrates spring renewal and rebirth, dating back to Zoroastrian traditions'
      }
    ],
    places: [
      {
        name: 'Dubai, UAE',
        description: 'Modern metropolis with futuristic architecture, luxury shopping, and traditional souks',
        image: 'https://images.unsplash.com/photo-1548919873-d49801cb957e?w=400&h=300&fit=crop',
        attractions: ['Burj Khalifa', 'Dubai Mall', 'Gold Souk', 'Desert safaris', 'Palm Jumeirah']
      },
      {
        name: 'Istanbul, Turkey',
        description: 'Historic crossroads of civilizations bridging Europe and Asia with stunning architecture',
        image: 'https://images.unsplash.com/photo-1548919873-d49801cb957e?w=400&h=300&fit=crop',
        attractions: ['Hagia Sophia', 'Blue Mosque', 'Grand Bazaar', 'Bosporus Strait', 'Topkapi Palace']
      },
      {
        name: 'Marrakech, Morocco',
        description: 'Enchanting city with vibrant souks, stunning palaces, and bustling main square',
        image: 'https://images.unsplash.com/photo-1548919873-d49801cb957e?w=400&h=300&fit=crop',
        attractions: ['Djemaa el-Fna', 'Majorelle Garden', 'Souks', 'Medersa Ben Youssef', 'Traditional hammams']
      }
    ],
    people: {
      lifestyle: 'Middle Eastern people value family, tradition, and hospitality. Daily life balances modern work with traditional practices and strong community connections.',
      values: ['Family honor', 'Hospitality', 'Religious faith', 'Community responsibility', 'Respect for tradition'],
      hospitality: 'Legendary hospitality - guests are considered blessings from God and are treated with utmost generosity and respect.',
      dailyLife: 'Family meals, prayer times, business conducted over tea or coffee, strong community ties, and celebration of religious and cultural traditions.'
    }
  }
];

// Get all cultures
router.get('/', (req, res) => {
  try {
    res.json(culturesData);
  } catch (error) {
    console.error('Cultures API error:', error);
    res.status(500).json({ error: 'Failed to fetch cultures data' });
  }
});

// Get specific culture
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const culture = culturesData.find(c => c.id === id);
    
    if (!culture) {
      return res.status(404).json({ error: 'Culture not found' });
    }
    
    res.json(culture);
  } catch (error) {
    console.error('Culture API error:', error);
    res.status(500).json({ error: 'Failed to fetch culture data' });
  }
});

module.exports = router;