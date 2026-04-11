export type CannabisType = 'Sativa' | 'Indica' | 'Hybrid';

export interface PlantCareInfo {
  id: string;
  name: string;
  cannabisType: CannabisType;
  confidence: 'High' | 'Moderate' | 'Low';
  scientificName: string;
  imageUrl: string;
  morphology: string;
  careTiers: {
    watering: string;
    light: string;
    humidity: string;
    temperature: string;
    floweringTime: string;
    yieldPotential: string;
  };
  description: string;
}

const plantCache = new Map<string, PlantCareInfo>();

const CANNABIS_PROFILES: PlantCareInfo[] = [
  {
    id: 'cannabis_sativa',
    name: 'Cannabis Sativa',
    cannabisType: 'Sativa',
    confidence: 'Moderate',
    scientificName: 'Cannabis sativa L.',
    imageUrl: 'https://images.unsplash.com/photo-1603909223427-51f4f9c6c43e?auto=format&fit=crop&q=80&w=400',
    morphology: 'Tall, elongated structure with narrow, finger-like leaflets. Long internodal spacing and loose, airy bud sites. Light green coloration with visible stretch during flowering.',
    careTiers: {
      watering: 'Water every 2-3 days. Allow top inch of soil to dry between waterings. Sativas are prone to overwatering.',
      light: '18/6 during veg, 12/12 to trigger flower. High light intensity (600-1000 PPFD). Needs room to stretch.',
      humidity: '60-70% RH in veg, 40-50% RH in flower. Lower in final weeks to prevent mold.',
      temperature: '70-85°F (21-29°C). Sativas tolerate higher temps better than Indicas.',
      floweringTime: '10-14 weeks. Longer flowering time than Indica.',
      yieldPotential: 'Moderate to high (400-600g/m²). Best results with LST or SCROG training.',
    },
    description: 'Sativa-dominant plants are known for their cerebral, energizing effects. They thrive in warm, tropical climates and produce an uplifting high favored by creative professionals. Their longer flowering time rewards patient growers with spacious, resinous buds.',
  },
  {
    id: 'cannabis_indica',
    name: 'Cannabis Indica',
    cannabisType: 'Indica',
    confidence: 'Moderate',
    scientificName: 'Cannabis indica Lam.',
    imageUrl: 'https://images.unsplash.com/photo-1596726581451-b8449c289ad6?auto=format&fit=crop&q=80&w=400',
    morphology: 'Short, bushy structure with wide, broad leaflets and dark green coloration. Dense internodal spacing and thick, compact bud formation. Wide fan leaves typical of mountain-adapted genetics.',
    careTiers: {
      watering: 'Water every 2-3 days. Indicas prefer slightly dryer conditions between waterings.',
      light: '18/6 during veg, 12/12 to trigger flower. 600-800 PPFD. No need for LST, naturally stays short.',
      humidity: '55-65% RH in veg, 40-45% RH in flower. Keep low humidity in dense buds to prevent bud rot.',
      temperature: '65-80°F (18-27°C). Prefers cooler nights — enhances purple coloration.',
      floweringTime: '7-9 weeks. Fast finisher, great for multiple harvests per year.',
      yieldPotential: 'High (400-500g/m²). Dense buds and compact structure maximize yield per canopy.',
    },
    description: 'Indica plants are prized for their relaxing, body-heavy effects and resinous, dense buds. Originating from the Hindu Kush mountain range, they are compact, fast-flowering, and incredibly mold-resistant — making them a favorite for indoor growers.',
  },
  {
    id: 'cannabis_hybrid',
    name: 'Cannabis Hybrid',
    cannabisType: 'Hybrid',
    confidence: 'Moderate',
    scientificName: 'Cannabis sativa L. x indica',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400',
    morphology: 'Mixed phenotype expression — medium height with moderately wide leaflets. Internodal spacing falls between Sativa stretch and Indica density. Bud structure varies by dominant parent.',
    careTiers: {
      watering: 'Water every 2-3 days. Hybrid vigor means more forgiving watering schedule than pure lines.',
      light: '18/6 during veg, 12/12 to flower. 700-900 PPFD recommended.',
      humidity: '55-65% RH in veg, 40-50% RH in flower.',
      temperature: '68-82°F (20-28°C). Adaptable to a wide range of conditions.',
      floweringTime: '8-10 weeks depending on Sativa/Indica ratio.',
      yieldPotential: 'High (500-600g/m²). Hybrid vigor often produces exceptional yields.',
    },
    description: 'Hybrid cannabis plants combine the best traits of both Sativa and Indica genetics. Modern hybrids are bred to offer balanced effects, faster flowering, and higher yields. They are the most common type found in dispensaries worldwide.',
  },
];

export async function identifyPlant(_base64Image: string): Promise<PlantCareInfo> {
  // Offline cannabis type identification
  // Randomly selects a cannabis type profile — in production, connect a vision AI
  await new Promise(r => setTimeout(r, 2000)); // simulate analysis time

  const profile = CANNABIS_PROFILES[Math.floor(Math.random() * CANNABIS_PROFILES.length)];
  const result = { ...profile, id: `${profile.id}_${Date.now()}` };
  plantCache.set(result.id, result);
  return result;
}

export async function getPlantById(id: string): Promise<PlantCareInfo | null> {
  return plantCache.get(id) || null;
}