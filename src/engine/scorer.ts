import riskData from '../data/ingredients-risk.json';
import { OpenFoodFactsProduct } from '../api/productApi';

export type RiskLevel = 'safe' | 'caution' | 'avoid';

export interface IngredientFlag {
  name: string;
  risk: RiskLevel;
  concern: string | null;
}

export interface NutritionalFacts {
  calories: number | null;
  totalFat: number | null;
  saturatedFat: number | null;
  transFat: number | null;
  cholesterol: number | null; // mg
  sodium: number | null; // mg
  totalCarbs: number | null;
  dietaryFiber: number | null;
  sugars: number | null;
  protein: number | null;
  calcium: number | null; // mg
  iron: number | null; // mg
  potassium: number | null; // mg
}

export interface ProductScore {
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  gradeColor: string;
  flags: IngredientFlag[];
  topRisks: IngredientFlag[];
  nutrimentFlags: IngredientFlag[];
  isUltraProcessed: boolean;
  summary: string;
  nutrition: NutritionalFacts | null;
}

const GRADE_COLORS: Record<string, string> = {
  A: '#00E676',
  B: '#69F0AE',
  C: '#FFCA28',
  D: '#FF7043',
  F: '#F44336',
};

function scoreToGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 80) return 'A';
  if (score >= 65) return 'B';
  if (score >= 45) return 'C';
  if (score >= 25) return 'D';
  return 'F';
}

function buildSummary(score: number, flags: IngredientFlag[]): string {
  const avoidCount = flags.filter(f => f.risk === 'avoid').length;
  const cautionCount = flags.filter(f => f.risk === 'caution').length;

  if (score >= 80) return 'Great choice! This product looks clean and safe.';
  if (score >= 65) return 'Decent product with minor things to watch.';
  if (score >= 45) {
    if (avoidCount > 0) return `Contains ${avoidCount} ingredient${avoidCount > 1 ? 's' : ''} to avoid.`;
    return `${cautionCount} ingredient${cautionCount > 1 ? 's' : ''} need caution.`;
  }
  if (score >= 25) return 'Several concerning ingredients. Look for alternatives.';
  return 'High risk product. Many problematic ingredients detected.';
}

export function analyzeProduct(product: OpenFoodFactsProduct): ProductScore {
  const flags: IngredientFlag[] = [];
  const nutrimentFlags: IngredientFlag[] = [];

  const ingredientsText = (product.product?.ingredients_text || '').toLowerCase();
  const additivesTags = product.product?.additives_tags || [];
  const nutriments = product.product?.nutriments || {};
  const novaGroup = product.product?.nova_group;

  // --- Check additives from tags (e.g. "en:e250") ---
  for (const tag of additivesTags) {
    const code = tag.replace(/^en:/, '').toLowerCase();
    const entry = (riskData.additives as Record<string, { name: string; risk: string; concern: string | null }>)[code];
    if (entry) {
      flags.push({
        name: entry.name,
        risk: entry.risk as RiskLevel,
        concern: entry.concern,
      });
    }
  }

  // --- Check cosmetic ingredients in text ---
  const cosmeticEntries = riskData.cosmetic_ingredients as Record<string, { name: string; risk: string; concern: string | null }>;
  for (const [key, entry] of Object.entries(cosmeticEntries)) {
    if (ingredientsText.includes(key)) {
      // Avoid duplicates
      if (!flags.find(f => f.name === entry.name)) {
        flags.push({
          name: entry.name,
          risk: entry.risk as RiskLevel,
          concern: entry.concern,
        });
      }
    }
  }

  // --- Check food nutriments ---
  const sugars = nutriments.sugars_100g;
  const salt = nutriments.salt_100g;
  const sodium = nutriments.sodium_100g;
  const satFat = nutriments['saturated-fat_100g'];
  const transFat = nutriments['trans-fat_100g'];

  if (transFat && transFat > 0) {
    nutrimentFlags.push({
      name: 'Trans Fat',
      risk: 'avoid',
      concern: 'Raises LDL, lowers HDL; strongly linked to heart disease. No safe level.',
    });
  }
  if (sugars !== undefined && sugars > 15) {
    nutrimentFlags.push({
      name: `High Sugar (${sugars.toFixed(1)}g per 100g)`,
      risk: 'caution',
      concern: 'Excess sugar contributes to obesity, diabetes, and heart disease.',
    });
  }
  const sodiumMg = (sodium ?? 0) * 1000 || (salt ?? 0) * 400;
  if (sodiumMg > 600) {
    nutrimentFlags.push({
      name: `High Sodium (${Math.round(sodiumMg)}mg per 100g)`,
      risk: 'caution',
      concern: 'Excess sodium raises blood pressure and cardiovascular risk.',
    });
  }
  if (satFat !== undefined && satFat > 5) {
    nutrimentFlags.push({
      name: `High Saturated Fat (${satFat.toFixed(1)}g per 100g)`,
      risk: 'caution',
      concern: 'Raises LDL cholesterol; linked to cardiovascular disease.',
    });
  }

  const isUltraProcessed = novaGroup === 4;
  if (isUltraProcessed) {
    nutrimentFlags.push({
      name: 'Ultra-Processed Food (NOVA 4)',
      risk: 'avoid',
      concern: 'Linked to cancer, obesity, cardiovascular disease, and poor health outcomes.',
    });
  }

  // Check seed oils in ingredients text
  const seedOilKeywords = ['canola oil', 'soybean oil', 'sunflower oil', 'corn oil', 'rapeseed oil', 'cottonseed oil'];
  for (const kw of seedOilKeywords) {
    if (ingredientsText.includes(kw)) {
      if (!nutrimentFlags.find(f => f.name.startsWith('Seed Oil'))) {
        nutrimentFlags.push({
          name: 'Seed Oil Present',
          risk: 'caution',
          concern: 'High in omega-6 fatty acids; may promote inflammation in excess.',
        });
      }
      break;
    }
  }

  const allFlags = [...flags, ...nutrimentFlags];

  // --- Score calculation ---
  let score = 100;
  for (const f of allFlags) {
    if (f.risk === 'avoid') score -= 20;
    else if (f.risk === 'caution') score -= 8;
  }
  score = Math.max(0, Math.min(100, score));

  // Boost from nutriscore
  const nutriscore = product.product?.nutriscore_grade?.toLowerCase();
  if (nutriscore === 'a') score = Math.min(100, score + 5);
  else if (nutriscore === 'b') score = Math.min(100, score + 2);
  else if (nutriscore === 'd') score = Math.max(0, score - 5);
  else if (nutriscore === 'e') score = Math.max(0, score - 10);

  const grade = scoreToGrade(score);
  const topRisks = [...allFlags]
    .sort((a, b) => {
      const order = { avoid: 0, caution: 1, safe: 2 };
      return order[a.risk] - order[b.risk];
    })
    .slice(0, 3);

  // Map Nutritional Panel data (fallback to 0/null where applicable)
  // OFF sometimes uses 'energy-kcal_100g' or 'energy_100g' (kJ vs kcal).
  const kcal = nutriments['energy-kcal_100g'] ?? (nutriments.energy_100g ? nutriments.energy_100g / 4.184 : null);
  
  const hasNutrition = kcal !== null || nutriments.carbohydrates_100g !== undefined || nutriments.fat_100g !== undefined;
  
  const nutrition: NutritionalFacts | null = hasNutrition ? {
    calories: kcal !== null ? Math.round(kcal) : null,
    totalFat: nutriments.fat_100g ?? null,
    saturatedFat: nutriments['saturated-fat_100g'] ?? null,
    transFat: nutriments['trans-fat_100g'] ?? null,
    cholesterol: nutriments.cholesterol_100g !== undefined ? nutriments.cholesterol_100g * 1000 : null, // Assuming base is g, OFF usually stores mostly g but sometimes mg. We'll multiply by 1000 to assume mg if it was stored in g, though OFF usually stores all in g.
    sodium: sodium !== undefined ? sodium * 1000 : null,
    totalCarbs: nutriments.carbohydrates_100g ?? null,
    dietaryFiber: nutriments.fiber_100g ?? null,
    sugars: nutriments.sugars_100g ?? null,
    protein: nutriments.proteins_100g ?? null,
    calcium: nutriments.calcium_100g !== undefined ? nutriments.calcium_100g * 1000 : null,
    iron: nutriments.iron_100g !== undefined ? nutriments.iron_100g * 1000 : null,
    potassium: nutriments.potassium_100g !== undefined ? nutriments.potassium_100g * 1000 : null,
  } : null;

  return {
    score: Math.round(score),
    grade,
    gradeColor: GRADE_COLORS[grade],
    flags,
    topRisks,
    nutrimentFlags,
    isUltraProcessed,
    summary: buildSummary(score, allFlags),
    nutrition,
  };
}
