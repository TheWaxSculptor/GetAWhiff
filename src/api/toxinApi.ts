import axios from 'axios';

export interface ToxinReport {
  id: string;
  detectedText: string;
  verdict: 'Safe' | 'Caution' | 'Avoid';
  hazards: {
    chemical: string;
    riskLevel: 'Caution' | 'High Risk';
    reason: string;
  }[];
  summary: string;
}

const GEMINI_API_KEY = ""; // Use your Gemini API key here.
const toxinCache = new Map<string, ToxinReport>();

export async function analyzeToxins(base64Image: string): Promise<ToxinReport> {
  const prompt = `You are a certified toxicologist and holistic natural living expert for 'Wakeup Whiff'.
Analyze this photo of an ingredient label or chemical list. Extract the text and cross-reference it against FDA/EU safety databases for carcinogens, endocrine disruptors, allergens, or harsh synthetic additives.
Return ONLY a valid JSON object matching this schema exactly (no markdown formatting, just pure JSON):
{
  "id": "a unique slug",
  "detectedText": "The raw ingredient text you successfully OCR'd",
  "verdict": "Safe" or "Caution" or "Avoid",
  "hazards": [
    {
      "chemical": "Name of the harmful ingredient",
      "riskLevel": "Caution" or "High Risk",
      "reason": "Why is it harmful? Keep it to 1 sentence."
    }
  ],
  "summary": "A 2 sentence overall safety summary of this product's ingredient profile. Heavily prioritize natural, chemical-free living and actively suggest natural holistic alternatives (like organic herbs or roots) if dangerous toxins are found."
}`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
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
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to parse Gemini JSON output structure');

    const report: ToxinReport = JSON.parse(jsonMatch[0]);
    toxinCache.set(report.id, report);
    return report;
  } catch (error) {
    console.warn('Gemini 1.5 Pro API Error:', error);
    throw new Error('Failed to analyze label toxins. Please try again.');
  }
}

export async function getToxinReportById(id: string): Promise<ToxinReport | null> {
  return toxinCache.get(id) || null;
}
