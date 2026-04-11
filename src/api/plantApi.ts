import axios from 'axios';

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

const GEMINI_API_KEY = ""; // Set your Gemini API key here
const plantCache = new Map<string, PlantCareInfo>();

export async function identifyPlant(base64Image: string): Promise<PlantCareInfo> {
  const prompt = `You are a master cannabis cultivator and botanist with 30 years of growing experience.
Analyze the plant in this image and classify it as Cannabis Sativa, Indica, or Hybrid based on visual morphology.

Look for these visual cues:
- SATIVA: Tall/lanky, narrow finger-like leaves, loose airy structure, long internodal spacing, lighter green
- INDICA: Short/bushy, wide broad leaves, dense compact structure, short internodal spacing, darker green  
- HYBRID: Mix of the above traits — describe which parent traits dominate

Return ONLY a valid JSON object (no markdown, no code blocks, pure JSON):
{
  "id": "a unique slug like cannabis_sativa_tall_specimen",
  "name": "Cannabis Sativa" or "Cannabis Indica" or "Cannabis Hybrid",
  "cannabisType": "Sativa" or "Indica" or "Hybrid",
  "confidence": "High" or "Moderate" or "Low",
  "scientificName": "Cannabis sativa L." or "Cannabis indica Lam." or "Cannabis sativa L. x indica",
  "imageUrl": "",
  "morphology": "2-3 sentences describing the specific visual traits observed that led to this classification",
  "careTiers": {
    "watering": "Watering frequency and method advice",
    "light": "Light schedule (e.g. 18/6 veg, 12/12 flower) and intensity",
    "humidity": "VPD or RH % range for current growth stage",
    "temperature": "Optimal temp range in Fahrenheit",
    "floweringTime": "Estimated flowering time if Sativa/Indica/Hybrid",
    "yieldPotential": "Expected yield range (e.g. moderate, heavy, light)"
  },
  "description": "2-3 engaging sentences about this cannabis type, its effects profile, and what growers love about it."
}`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/jpeg", data: base64Image } }
          ]
        }]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const responseText = response.data.candidates[0].content.parts[0].text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to parse Gemini JSON output');

    const plant: PlantCareInfo = JSON.parse(jsonMatch[0]);

    if (!plant.imageUrl) {
      const fallbacks: Record<CannabisType, string> = {
        Sativa: 'https://images.unsplash.com/photo-1603909223427-51f4f9c6c43e?auto=format&fit=crop&q=80&w=400',
        Indica: 'https://images.unsplash.com/photo-1596726581451-b8449c289ad6?auto=format&fit=crop&q=80&w=400',
        Hybrid: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400',
      };
      plant.imageUrl = fallbacks[plant.cannabisType] ?? fallbacks.Hybrid;
    }

    plantCache.set(plant.id, plant);
    return plant;
  } catch (error) {
    console.warn('Gemini Vision API Error:', error);
    throw new Error('Failed to analyze image. Please try again.');
  }
}

export async function getPlantById(id: string): Promise<PlantCareInfo | null> {
  return plantCache.get(id) || null;
}
