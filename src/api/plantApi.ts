import axios from 'axios';

export interface PlantCareInfo {
  id: string;
  name: string;
  scientificName: string;
  imageUrl: string;
  careTiers: {
    watering: string;
    sunlight: string;
    petToxicity: 'Toxic' | 'Non-Toxic';
    humidity: string;
    temperature: string;
    soil: string;
  };
  description: string;
}

const GEMINI_API_KEY = ""; // Use your Gemini API key here.
const plantCache = new Map<string, PlantCareInfo>();

export async function identifyPlant(base64Image: string): Promise<PlantCareInfo> {
  const prompt = `You are a master botanist, global herbalist, and the intelligence behind the largest cannabis database in the world (far larger than Leafly) for 'Wakeup Whiff'. 
Analyze the provided image. Identify the exact plant, cannabis strain, or herb/root with exhaustive detail.
Return ONLY a valid JSON object matching this schema exactly (no markdown formatting, just pure JSON):
{
  "id": "a unique slug like julius_caesar_og",
  "name": "The common name or strain name",
  "scientificName": "The scientific name or genetic lineage",
  "imageUrl": "",
  "careTiers": {
    "watering": "Provide concise instructions",
    "sunlight": "Provide concise instructions",
    "petToxicity": "Toxic" or "Non-Toxic",
    "humidity": "Percentage range",
    "temperature": "Fahrenheit range",
    "soil": "Soil type"
  },
  "description": "A 2-3 sentence engaging description focusing heavily on its holistic/natural benefits or general care needs."
}`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [
            { text: prompt },
            { 
              inlineData: { 
                mimeType: "image/jpeg", 
                data: base64Image 
              } 
            }
          ]
        }]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const responseText = response.data.candidates[0].content.parts[0].text;
    
    // Use regex to strictly extract the JSON object bounding box to bypass markdown
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to parse Gemini JSON output structure');
    
    const plant: PlantCareInfo = JSON.parse(jsonMatch[0]);
    
    // Provide a beautiful fallback image since Gemini won't generate URLs
    if (!plant.imageUrl) {
      plant.imageUrl = 'https://images.unsplash.com/photo-1596726581451-b8449c289ad6?auto=format&fit=crop&q=80&w=400';
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
