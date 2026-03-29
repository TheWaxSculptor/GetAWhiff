export type StrainType = 'Indica' | 'Sativa' | 'Hybrid';
export type Difficulty = 'Easy' | 'Moderate' | 'Hard';

export interface StrainInfo {
  id: string;
  name: string;
  type: StrainType;
  thcContent: string;
  cbdContent?: string;
  difficulty: Difficulty;
  growthTime: string; // e.g., "8-10 weeks"
  expectedYield: string; // e.g., "High (500g/m²)"
  growingTips: string[];
  medicalUses: string[];
  effects: string[];
  imageUrl: string;
  description: string;
}

const mockStrains: StrainInfo[] = [
  {
    id: 'blue_dream',
    name: 'Blue Dream',
    type: 'Hybrid',
    thcContent: '18% - 22%',
    difficulty: 'Easy',
    growthTime: '9-10 weeks',
    expectedYield: 'High (600g/m²)',
    growingTips: [
      'Grows very tall; requires topping or severe pruning early on.',
      'Highly resistant to powdery mildew, making it great for beginners.',
      'Provide plenty of nitrogen during vegetative stage.'
    ],
    medicalUses: ['Stress Relief', 'Depression', 'Chronic Pain', 'Nausea'],
    effects: ['Uplifting', 'Euphoric', 'Creative', 'Relaxing'],
    imageUrl: 'https://images.unsplash.com/photo-1629851722960-9ea3c7885b0d?auto=format&fit=crop&q=80&w=400',
    description: 'A legendary sativa-dominant hybrid originating in California. Balancing full-body relaxation with gentle cerebral invigoration, Blue Dream is highly sought after by both medical and recreational users for its mellowing effects and sweet berry aroma.'
  },
  {
    id: 'sour_diesel',
    name: 'Sour Diesel',
    type: 'Sativa',
    thcContent: '20% - 25%',
    difficulty: 'Moderate',
    growthTime: '10-11 weeks',
    expectedYield: 'Medium (450g/m²)',
    growingTips: [
      'Requires low humidity to prevent mold.',
      'Stretches significantly during flowering phase.',
      'Needs a warm, slightly dry climate (between 68-85°F).'
    ],
    medicalUses: ['Fatigue', 'Stress', 'Minor Pain', 'Lack of Appetite'],
    effects: ['Energizing', 'Happy', 'Uplifted', 'Talkative'],
    imageUrl: 'https://images.unsplash.com/photo-1596726581451-b8449c289ad6?auto=format&fit=crop&q=80&w=400',
    description: 'Sour Diesel, sometimes called Sour D, is an invigorating sativa-dominant strain named after its pungent, diesel-like aroma. This fast-acting strain delivers energizing, dreamy cerebral effects that have pushed it to its legendary status.'
  },
  {
    id: 'northern_lights',
    name: 'Northern Lights',
    type: 'Indica',
    thcContent: '16% - 21%',
    difficulty: 'Easy',
    growthTime: '7-9 weeks',
    expectedYield: 'High (550g/m²)',
    growingTips: [
      'Stays relatively short and bushy; excellent for indoor cultivation.',
      'Highly resilient to pests and diseases.',
      'Thrives with standard nutrient regimes.'
    ],
    medicalUses: ['Insomnia', 'Chronic Pain', 'Muscle Spasms', 'Anxiety'],
    effects: ['Sleepy', 'Relaxed', 'Euphoric', 'Hungry'],
    imageUrl: 'https://images.unsplash.com/photo-1542385108-7a544d6db8b1?auto=format&fit=crop&q=80&w=400',
    description: 'One of the most famous indica strains of all time, cherished for its resinous buds, fast flowering, and resilience during growth. It produces profoundly relaxing effects, settling heavily throughout the body while dreamy euphoria blankets the mind.'
  },
  {
    id: 'og_kush',
    name: 'OG Kush',
    type: 'Hybrid',
    thcContent: '20% - 26%',
    difficulty: 'Hard',
    growthTime: '8-9 weeks',
    expectedYield: 'Medium (400g/m²)',
    growingTips: [
      'Susceptible to powdery mildew, bugs, and other typical diseases.',
      'Requires heavy feeding (calcium and magnesium especially).',
      'Requires frequent pruning to encourage proper canopy airflow.'
    ],
    medicalUses: ['Migraines', 'ADD/ADHD', 'Stress Disorders', 'Severe Pain'],
    effects: ['Euphoric', 'Happy', 'Relaxed', 'Giggly'],
    imageUrl: 'https://images.unsplash.com/photo-1629851722960-9ea3c7885b0d?auto=format&fit=crop&q=80&w=400',
    description: 'The genetic backbone of West Coast cannabis varieties. OG Kush arrives with a unique terpene profile that boasts a complex aroma with notes of fuel, skunk, and spice. Known to provide heavy, mixed head and body effects.'
  },
  {
    id: 'girl_scout_cookies',
    name: 'Girl Scout Cookies (GSC)',
    type: 'Hybrid',
    thcContent: '25% - 28%',
    difficulty: 'Moderate',
    growthTime: '9-10 weeks',
    expectedYield: 'Medium (450g/m²)',
    growingTips: [
      'Very resistant to pests and diseases.',
      'Keep temperatures mild and avoid excess humidity.',
      'Benefits greatly from low-stress training (LST).'
    ],
    medicalUses: ['Severe Pain', 'Nausea', 'Appetite Loss', 'Depression'],
    effects: ['Happy', 'Relaxed', 'Euphoric', 'Creative'],
    imageUrl: 'https://images.unsplash.com/photo-1596726581451-b8449c289ad6?auto=format&fit=crop&q=80&w=400',
    description: 'A multiple Cannabis Cup award-winning strain famous for its pungent, dessert-like aroma and flavor profile featuring bold notes of mint, sweet cherry, and lemon. Expect a euphoric high alongside heavy, full-body relaxation.'
  }
];

// Global cache for Llama-generated strains so they can be retrieved by ID
let strainCache: StrainInfo[] = [...mockStrains];

const GROQ_API_KEY = ""; // Use your Groq API key (GSK) here. Store in .env for production.

async function searchStrainsWithLlama(query: string): Promise<StrainInfo[]> {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are the world's most comprehensive cannabis database, far exceeding the depth of Leafly. 
            When given a search query, symptom, or benefit, you return a JSON array of up to 8 of the most relevant cannabis strains.
            Return ONLY a raw JSON array matching this TypeScript interface exactly:
            interface StrainInfo {
              id: string; // unique slug
              name: string;
              type: 'Indica' | 'Sativa' | 'Hybrid';
              thcContent: string;
              difficulty: 'Easy' | 'Moderate' | 'Hard';
              growthTime: string;
              expectedYield: string;
              growingTips: string[];
              medicalUses: string[];
              effects: string[];
              imageUrl: string; // use placeholder: https://images.unsplash.com/photo-1596726581451-b8449c289ad6?auto=format&fit=crop&q=80&w=400
              description: string;
            }`
          },
          { role: 'user', content: `Search for strains matching: ${query}` }
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) return mockStrains;
    const data = await response.json();
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      // Update cache with new strains
      parsed.forEach((s: StrainInfo) => {
        if (!strainCache.find(cached => cached.id === s.id)) {
          strainCache.push(s);
        }
      });
      return parsed;
    }
    return mockStrains;
  } catch (error) {
    console.warn('Llama search error:', error);
    return mockStrains;
  }
}

export async function fetchStrains(query?: string, type?: StrainType, difficulty?: Difficulty): Promise<StrainInfo[]> {
  if (query && query.trim().length > 2) {
    return searchStrainsWithLlama(query);
  }

  await new Promise(resolve => setTimeout(resolve, 600)); // Simulate network
  let results = mockStrains;

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }
  
  if (type) {
    results = results.filter(s => s.type === type);
  }

  if (difficulty) {
    results = results.filter(s => s.difficulty === difficulty);
  }

  return results;
}

export async function getStrainById(id: string): Promise<StrainInfo | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return strainCache.find(s => s.id === id) || null;
}
