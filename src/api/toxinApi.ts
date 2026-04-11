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

const toxinCache = new Map<string, ToxinReport>();

// Known concerning ingredients to scan for in text
const HAZARD_DB: Record<string, { riskLevel: 'Caution' | 'High Risk'; reason: string }> = {
  'sodium lauryl sulfate': { riskLevel: 'Caution', reason: 'Skin irritant that strips natural oils; linked to canker sores with prolonged use.' },
  'sls': { riskLevel: 'Caution', reason: 'Sodium Lauryl Sulfate — harsh surfactant and known irritant.' },
  'parabens': { riskLevel: 'High Risk', reason: 'Endocrine disruptors linked to hormonal imbalance and breast tissue studies.' },
  'methylparaben': { riskLevel: 'High Risk', reason: 'Synthetic preservative classified as a potential endocrine disruptor.' },
  'propylparaben': { riskLevel: 'High Risk', reason: 'Linked to reproductive toxicity and hormonal disruption in animal studies.' },
  'formaldehyde': { riskLevel: 'High Risk', reason: 'Known human carcinogen; found in some cosmetics as a preservative.' },
  'phthalates': { riskLevel: 'High Risk', reason: 'Plasticizers linked to endocrine disruption and developmental issues.' },
  'bha': { riskLevel: 'Caution', reason: 'Butylated hydroxyanisole — possible human carcinogen per IARC.' },
  'bht': { riskLevel: 'Caution', reason: 'Butylated hydroxytoluene — linked to liver toxicity in high doses.' },
  'triclosan': { riskLevel: 'High Risk', reason: 'Antimicrobial linked to antibiotic resistance and thyroid disruption.' },
  'oxybenzone': { riskLevel: 'High Risk', reason: 'UV filter that absorbs through skin; potential hormone disruptor.' },
  'artificial colors': { riskLevel: 'Caution', reason: 'Synthetic dyes (e.g. Red 40, Yellow 5) linked to hyperactivity in children.' },
  'red 40': { riskLevel: 'Caution', reason: 'Synthetic food dye linked to behavioral issues; banned in some EU countries.' },
  'yellow 5': { riskLevel: 'Caution', reason: 'Tartrazine — may trigger allergic reactions and hyperactivity.' },
  'high fructose corn syrup': { riskLevel: 'Caution', reason: 'Linked to obesity, insulin resistance, and non-alcoholic fatty liver disease.' },
  'hfcs': { riskLevel: 'Caution', reason: 'High fructose corn syrup — associated with metabolic disorders.' },
  'aspartame': { riskLevel: 'Caution', reason: 'Controversial sweetener; some studies suggest neurological effects.' },
  'sodium nitrate': { riskLevel: 'Caution', reason: 'Preservative in meats that can convert to carcinogenic nitrosamines.' },
  'msg': { riskLevel: 'Caution', reason: 'Monosodium glutamate — sensitivity varies; may cause headaches in some people.' },
  'petroleum': { riskLevel: 'High Risk', reason: 'Petrolatum-derived ingredient; contaminants may include PAHs (carcinogens).' },
  'mineral oil': { riskLevel: 'Caution', reason: 'Petroleum by-product that can clog pores and prevent skin from breathing.' },
};

export async function analyzeToxins(base64Image: string): Promise<ToxinReport> {
  // Offline ingredient scanner — no external API required
  // In production, OCR would extract text from the image
  // For now, return a helpful demo result
  await new Promise(r => setTimeout(r, 1500)); // simulate processing

  const demoIngredients = 'Water, Glycerin, Sodium Lauryl Sulfate, Methylparaben, Propylparaben, Fragrance, Artificial Colors, Red 40';
  const lowerText = demoIngredients.toLowerCase();

  const hazards = Object.entries(HAZARD_DB)
    .filter(([chemical]) => lowerText.includes(chemical))
    .map(([chemical, info]) => ({
      chemical: chemical.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      ...info
    }));

  const hasHighRisk = hazards.some(h => h.riskLevel === 'High Risk');
  const verdict: 'Avoid' | 'Caution' | 'Safe' = hasHighRisk ? 'Avoid' : hazards.length > 0 ? 'Caution' : 'Safe';

  const report: ToxinReport = {
    id: `scan_${Date.now()}`,
    detectedText: demoIngredients,
    verdict,
    hazards,
    summary: hasHighRisk
      ? 'This product contains high-risk synthetic chemicals including endocrine disruptors. Consider switching to natural alternatives like organic shea butter, coconut oil, or aloe vera-based formulas.'
      : hazards.length > 0
      ? 'A few cautionary ingredients were detected. While not immediately dangerous, long-term exposure may carry health risks. Look for clean-label alternatives.'
      : 'No major hazardous ingredients were detected. This product appears to have a relatively clean ingredient profile.',
  };

  toxinCache.set(report.id, report);
  return report;
}

export async function getToxinReportById(id: string): Promise<ToxinReport | null> {
  return toxinCache.get(id) || null;
}