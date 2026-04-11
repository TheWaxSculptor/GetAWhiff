export interface PlantCareInfo {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  imageUrl: string;
  careTiers: {
    watering: string;
    sunlight: string;
    humidity: string;
    temperature: string;
    soil: string;
    petToxicity: 'Toxic' | 'Non-Toxic';
  };
  description: string;
  funFact: string;
}

const plantCache = new Map<string, PlantCareInfo>();

const PLANT_DATABASE: PlantCareInfo[] = [
  {
    id: 'monstera_deliciosa',
    name: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    category: 'Tropical Houseplant',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=400',
    careTiers: { watering: 'Every 1-2 weeks; let soil dry halfway between waterings.', sunlight: 'Bright indirect light. Avoid harsh direct sun.', humidity: '60-80% — mist leaves or use a humidifier.', temperature: '65-85°F (18-29°C). No drafts or cold windows.', soil: 'Well-draining potting mix with perlite.', petToxicity: 'Toxic' },
    description: 'The iconic "Swiss Cheese Plant" is beloved for its dramatic split leaves and easy-going nature. Native to the rainforests of Central America, it thrives in bright, warm interiors.',
    funFact: 'The holes in its leaves (called fenestrations) help it withstand hurricane-force winds in the wild.',
  },
  {
    id: 'snake_plant',
    name: 'Snake Plant',
    scientificName: 'Dracaena trifasciata',
    category: 'Succulent / Air Purifier',
    imageUrl: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?auto=format&fit=crop&q=80&w=400',
    careTiers: { watering: 'Every 2-6 weeks; extremely drought tolerant. Overwatering is its only weakness.', sunlight: 'Tolerates low light but grows faster in bright indirect light.', humidity: '30-50%. Tolerates dry air well.', temperature: '60-80°F (15-27°C). Protect from frost.', soil: 'Sandy, well-draining cactus/succulent mix.', petToxicity: 'Toxic' },
    description: 'One of the most forgiving plants on Earth, the Snake Plant filters indoor air and thrives on neglect. A perfect starter plant for any level of gardener.',
    funFact: 'NASA studies found Snake Plants remove benzene, formaldehyde, and carbon monoxide from indoor air.',
  },
  {
    id: 'pothos',
    name: 'Golden Pothos',
    scientificName: 'Epipremnum aureum',
    category: 'Trailing Vine',
    imageUrl: 'https://images.unsplash.com/photo-1616626627632-9c2c7d6cec7f?auto=format&fit=crop&q=80&w=400',
    careTiers: { watering: 'Every 1-2 weeks; allow top inch of soil to dry.', sunlight: 'Thrives in low to bright indirect light. Variegation fades in low light.', humidity: '50-70%. Average home humidity is fine.', temperature: '65-85°F (18-29°C).', soil: 'Any standard potting mix.', petToxicity: 'Toxic' },
    description: 'The ultimate beginner plant — Pothos will grow almost anywhere with almost any light. Its cascading vines and heart-shaped leaves brighten up shelves, bathrooms, and offices.',
    funFact: 'Pothos is called "Devil\'s Ivy" because it stays green even in the dark and is nearly impossible to kill.',
  },
  {
    id: 'peace_lily',
    name: 'Peace Lily',
    scientificName: 'Spathiphyllum wallisii',
    category: 'Flowering Houseplant',
    imageUrl: 'https://images.unsplash.com/photo-1598880940080-ff9a29891bb5?auto=format&fit=crop&q=80&w=400',
    careTiers: { watering: 'Every 1-2 weeks; drooping leaves signal it needs water.', sunlight: 'Low to medium indirect light. One of the few flowering plants that thrives in shade.', humidity: '50-60%. Mist occasionally.', temperature: '65-80°F (18-27°C).', soil: 'Rich, loamy potting mix.', petToxicity: 'Toxic' },
    description: 'A graceful flowering plant with glossy leaves and elegant white blooms. Peace Lilies are excellent air purifiers and one of the few plants that flower in low-light conditions.',
    funFact: 'Peace Lilies don\'t actually produce true flowers — the white "petal" is a modified leaf called a spathe.',
  },
  {
    id: 'aloe_vera',
    name: 'Aloe Vera',
    scientificName: 'Aloe barbadensis miller',
    category: 'Succulent / Medicinal',
    imageUrl: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=400',
    careTiers: { watering: 'Every 3-4 weeks in summer, less in winter. Deep soak then dry completely.', sunlight: '6+ hours of bright direct or indirect sunlight daily.', humidity: '30-40%. Dry air is preferred.', temperature: '55-80°F (13-27°C). No frost tolerance.', soil: 'Coarse cactus or succulent mix with sand.', petToxicity: 'Toxic' },
    description: 'A centuries-old medicinal plant, Aloe Vera is famous for its soothing gel used to treat burns, skin irritation, and more. It\'s also a strikingly architectural houseplant.',
    funFact: 'The gel inside Aloe leaves is 99% water, but that remaining 1% contains over 75 active compounds.',
  },
  {
    id: 'fiddle_leaf_fig',
    name: 'Fiddle Leaf Fig',
    scientificName: 'Ficus lyrata',
    category: 'Statement Houseplant',
    imageUrl: 'https://images.unsplash.com/photo-1599598425947-5202edd56fdb?auto=format&fit=crop&q=80&w=400',
    careTiers: { watering: 'Every 1-2 weeks; water deeply then allow to dry 50-75% before watering again.', sunlight: 'Bright indirect light — near a window but not in direct sun.', humidity: '30-65%. Hates dry forced air.', temperature: '60-85°F (15-29°C). Hates cold drafts.', soil: 'Fast-draining potting soil with good aeration.', petToxicity: 'Toxic' },
    description: 'The superstar of interior design, the Fiddle Leaf Fig commands attention with its large, violin-shaped leaves. It\'s a diva that rewards consistent care with stunning architectural beauty.',
    funFact: 'Fiddle Leaf Figs can feel stress — rotating them or moving them can cause sudden leaf drop.',
  },
  {
    id: 'lavender',
    name: 'Lavender',
    scientificName: 'Lavandula angustifolia',
    category: 'Herb / Aromatic',
    imageUrl: 'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?auto=format&fit=crop&q=80&w=400',
    careTiers: { watering: 'Every 2-3 weeks; very drought tolerant once established.', sunlight: 'Full sun — at least 6-8 hours of direct sunlight daily.', humidity: '30-50%. Dislikes humid conditions.', temperature: '60-80°F (15-27°C). Hardy to 10°F (-12°C).', soil: 'Sandy, alkaline, well-draining soil. Avoid clay.', petToxicity: 'Non-Toxic' },
    description: 'Lavender\'s delicate purple blooms and intoxicating fragrance have made it one of humanity\'s most beloved herbs for thousands of years — used in aromatherapy, cooking, and medicine.',
    funFact: 'Ancient Egyptians used Lavender in the mummification process and as a perfume for over 2,500 years.',
  },
  {
    id: 'rosemary',
    name: 'Rosemary',
    scientificName: 'Salvia rosmarinus',
    category: 'Culinary Herb',
    imageUrl: 'https://images.unsplash.com/photo-1515586000433-45406d8e6662?auto=format&fit=crop&q=80&w=400',
    careTiers: { watering: 'Every 1-2 weeks; allow soil to dry completely between waterings.', sunlight: 'Full sun — 6-8 hours daily. South or west-facing window indoors.', humidity: '30-50%. Prefers dry Mediterranean conditions.', temperature: '65-80°F (18-27°C). Protect below 30°F (-1°C).', soil: 'Sandy, well-draining, slightly alkaline soil.', petToxicity: 'Non-Toxic' },
    description: 'A fragrant Mediterranean herb used in cooking, medicine, and aromatherapy. Rosemary is associated with memory and focus, and its pine-like scent is instantly recognizable.',
    funFact: 'Ancient Greek scholars wore rosemary garlands during exams, believing it enhanced memory.',
  },
  {
    id: 'spider_plant',
    name: 'Spider Plant',
    scientificName: 'Chlorophytum comosum',
    category: 'Air-Purifying Houseplant',
    imageUrl: 'https://images.unsplash.com/photo-1572688484438-313a6e50c333?auto=format&fit=crop&q=80&w=400',
    careTiers: { watering: 'Every 1-2 weeks. Water well then let soil dry slightly.', sunlight: 'Indirect bright to medium light. Avoid direct sun.', humidity: '40-60%. Tolerates average home humidity.', temperature: '60-80°F (15-27°C). Avoid temps below 50°F.', soil: 'Standard well-draining potting mix.', petToxicity: 'Non-Toxic' },
    description: 'A cheerful, fast-growing plant with arching green-and-white striped leaves that produces cascading "spiderettes" on long runners. Incredibly easy to propagate and share.',
    funFact: 'Spider Plants were one of the plants studied on NASA\'s Clean Air Study and are safe for pets and children.',
  },
  {
    id: 'basil',
    name: 'Sweet Basil',
    scientificName: 'Ocimum basilicum',
    category: 'Culinary Herb',
    imageUrl: 'https://images.unsplash.com/photo-1618375531912-867984bdfd87?auto=format&fit=crop&q=80&w=400',
    careTiers: { watering: 'Daily or every other day — basil loves moisture. Keep soil consistently damp.', sunlight: 'Full sun — 6-8 hours daily. Grows best outdoors or in a sunny south window.', humidity: '40-60%.', temperature: '70-90°F (21-32°C). Extremely frost sensitive.', soil: 'Rich, moist, well-draining garden soil.', petToxicity: 'Non-Toxic' },
    description: 'The king of culinary herbs, Basil is essential in Italian, Thai, and Mediterranean cuisines. Fresh basil adds a bright, peppery sweetness that dried basil simply cannot replicate.',
    funFact: 'Basil is sacred in Hinduism and is believed to protect against evil spirits when planted near entrances.',
  },
  {
    id: 'rubber_plant',
    name: 'Rubber Plant',
    scientificName: 'Ficus elastica',
    category: 'Statement Houseplant',
    imageUrl: 'https://images.unsplash.com/photo-1599598425947-5202edd56fdb?auto=format&fit=crop&q=80&w=400',
    careTiers: { watering: 'Every 1-2 weeks; allow top 2 inches to dry between waterings.', sunlight: 'Bright indirect light. Burgundy varieties need more sun for color.', humidity: '40-50%. Average humidity is fine.', temperature: '60-80°F (15-27°C).', soil: 'Well-draining potting mix.', petToxicity: 'Toxic' },
    description: 'With its large, glossy leaves in deep green, burgundy, or variegated patterns, the Rubber Plant is a bold and architectural statement piece for any interior.',
    funFact: 'Before synthetic rubber was invented, Ficus elastica was actually harvested for its latex to make rubber products.',
  },
  {
    id: 'orchid',
    name: 'Phalaenopsis Orchid',
    scientificName: 'Phalaenopsis amabilis',
    category: 'Flowering Houseplant',
    imageUrl: 'https://images.unsplash.com/photo-1592591409893-89cfe3547f24?auto=format&fit=crop&q=80&w=400',
    careTiers: { watering: 'Every 7-10 days; water thoroughly then let dry. Never let sit in standing water.', sunlight: 'Bright indirect light. East or west-facing window ideal.', humidity: '50-70%. Place on a pebble tray with water or use a humidifier.', temperature: '65-80°F (18-27°C). A 10°F night drop triggers blooming.', soil: 'Orchid bark mix — never use regular potting soil.', petToxicity: 'Non-Toxic' },
    description: 'The most popular orchid in the world, Phalaenopsis produces stunning blooms that last 2-3 months. With the right care, it can rebloom year after year.',
    funFact: 'Phalaenopsis means "moth-like" in Greek — the flowers were thought to resemble moths in flight.',
  },
  {
    id: 'tomato',
    name: 'Tomato Plant',
    scientificName: 'Solanum lycopersicum',
    category: 'Vegetable / Fruit',
    imageUrl: 'https://images.unsplash.com/photo-1592154585553-a47b64b7c9c6?auto=format&fit=crop&q=80&w=400',
    careTiers: { watering: 'Deeply every 2-3 days. Consistent moisture prevents blossom end rot.', sunlight: '8+ hours of full direct sun daily.', humidity: '40-70%. Good airflow prevents fungal disease.', temperature: '65-85°F (18-29°C) during day. Fruit set stops above 95°F.', soil: 'Rich, slightly acidic soil (pH 6.0-6.8) with compost.', petToxicity: 'Toxic' },
    description: 'The world\'s most popular garden plant, tomatoes reward attentive growers with an abundance of juicy fruit. From cherry to beefsteak, there are thousands of varieties to explore.',
    funFact: 'Tomatoes are botanically a fruit, but legally classified as a vegetable by the US Supreme Court in 1893.',
  },
  {
    id: 'zz_plant',
    name: 'ZZ Plant',
    scientificName: 'Zamioculcas zamiifolia',
    category: 'Low-Maintenance Houseplant',
    imageUrl: 'https://images.unsplash.com/photo-1602923668104-8f9e03e77e62?auto=format&fit=crop&q=80&w=400',
    careTiers: { watering: 'Every 2-4 weeks. Its rhizomes store water — overwatering will rot it.', sunlight: 'Tolerates very low light but prefers bright indirect.', humidity: '40-50%. Not fussy.', temperature: '65-85°F (18-29°C). Tolerates drier conditions.', soil: 'Well-draining cactus or succulent mix.', petToxicity: 'Toxic' },
    description: 'The ZZ Plant is the definition of low-maintenance luxury — its glossy, dark green leaves look plastic-perfect even under near-total neglect. A must for offices and dimly lit rooms.',
    funFact: 'ZZ Plants can go for 4 months without water and still survive — they\'re practically indestructible.',
  },
];

export async function identifyPlant(_base64Image: string): Promise<PlantCareInfo> {
  // Offline plant identification — randomly samples from 14 plant profiles
  // In production, connect a vision AI (PlantNet API, etc.) for real identification
  await new Promise(r => setTimeout(r, 2000));
  const plant = PLANT_DATABASE[Math.floor(Math.random() * PLANT_DATABASE.length)];
  const result = { ...plant, id: `${plant.id}_${Date.now()}` };
  plantCache.set(result.id, result);
  return result;
}

export async function getPlantById(id: string): Promise<PlantCareInfo | null> {
  return plantCache.get(id) || null;
}