export type StrainType = 'Indica' | 'Sativa' | 'Hybrid';
export type Difficulty = 'Easy' | 'Moderate' | 'Hard';
export type StrainEra = 'Landrace' | 'Legacy' | 'Modern';

export interface StrainInfo {
  id: string;
  name: string;
  type: StrainType;
  era: StrainEra;
  thcContent: string;
  cbdContent?: string;
  difficulty: Difficulty;
  growthTime: string;
  expectedYield: string;
  growingTips: string[];
  medicalUses: string[];
  effects: string[];
  imageUrl: string;
  description: string;
  lineage: {
    parents: string[];
    origin?: string;
    heritage?: string;
  };
  breeder?: string;
  funFact?: string;
}

const strainDatabase: StrainInfo[] = [

  // ─── LANDRACES ────────────────────────────────────────────────────────────

  {
    id: 'lambs_bread',
    name: "Lamb's Bread",
    type: 'Sativa',
    era: 'Landrace',
    thcContent: '16% - 21%',
    cbdContent: '0.3%',
    difficulty: 'Moderate',
    growthTime: '10-12 weeks',
    expectedYield: 'Medium (350g/m²)',
    growingTips: [
      'Thrives in warm, humid tropical climates — mimick Jamaica\'s environment indoors.',
      'Stretches dramatically in flower; use SCROG or topping early.',
      'Prefers organic soil over hydroponics to express its full terpene profile.',
    ],
    medicalUses: ['Depression', 'Fatigue', 'Stress', 'Lack of Motivation'],
    effects: ['Euphoric', 'Energetic', 'Uplifted', 'Creative', 'Focused'],
    imageUrl: 'https://images.unsplash.com/photo-1603909223427-51f4f9c6c43e?auto=format&fit=crop&q=80&w=400',
    description: "Jamaica's most sacred strain and Bob Marley's legendary daily smoke. Lamb's Bread — also spelled Lamb's Breath — is a bright green, sticky sativa that delivers a sharp, energetic cerebral high. It has been a cornerstone of Rastafarian spiritual practice for generations.",
    lineage: { parents: ['Jamaican Landrace'], origin: 'Jamaica', heritage: 'Pure Jamaican Sativa' },
    funFact: "Bob Marley called Lamb's Bread 'the herb of life' and credited it with much of his creative inspiration.",
  },
  {
    id: 'afghani',
    name: 'Afghani',
    type: 'Indica',
    era: 'Landrace',
    thcContent: '17% - 20%',
    cbdContent: '0.6%',
    difficulty: 'Easy',
    growthTime: '7-8 weeks',
    expectedYield: 'High (500g/m²)',
    growingTips: [
      'Extremely hardy — tolerates cooler temps and temp swings well.',
      'Produces enormous amounts of resin; ideal for hash production.',
      'Finishes very early; great for multiple harvests per year.',
    ],
    medicalUses: ['Insomnia', 'Chronic Pain', 'Muscle Spasms', 'Anxiety', 'PTSD'],
    effects: ['Deeply Relaxed', 'Sedated', 'Euphoric', 'Sleepy', 'Peaceful'],
    imageUrl: 'https://images.unsplash.com/photo-1542385108-7a544d6db8b1?auto=format&fit=crop&q=80&w=400',
    description: 'The mother of all indicas. Originating from the harsh mountain valleys of Afghanistan and Pakistan, this ancient landrace is the genetic foundation of nearly every modern indica variety in existence. Dense, frosty buds with an earthy, hash-like aroma.',
    lineage: { parents: ['Afghan Landrace'], origin: 'Afghanistan / Pakistan', heritage: 'Pure Hindu Kush Indica' },
    funFact: 'Afghani has been cultivated for over 3,000 years and was brought to the West along the Hippie Trail in the 1960s-70s.',
  },
  {
    id: 'hindu_kush',
    name: 'Hindu Kush',
    type: 'Indica',
    era: 'Landrace',
    thcContent: '15% - 20%',
    cbdContent: '1%',
    difficulty: 'Easy',
    growthTime: '7-8 weeks',
    expectedYield: 'Medium (400g/m²)',
    growingTips: [
      'Naturally compact — perfect for small grow spaces.',
      'Remarkably mold and pest resistant due to its thick resin coat.',
      'Thrives in cool, dry environments similar to its native mountain range.',
    ],
    medicalUses: ['Pain Relief', 'Insomnia', 'Nausea', 'Stress', 'Appetite Loss'],
    effects: ['Relaxed', 'Sleepy', 'Happy', 'Hungry', 'Calm'],
    imageUrl: 'https://images.unsplash.com/photo-1596726581451-b8449c289ad6?auto=format&fit=crop&q=80&w=400',
    description: 'Named after the 800km Hindu Kush mountain range stretching between Afghanistan and Pakistan, this pure indica landrace developed a thick protective coat of trichomes to survive the harsh alpine climate. One of the most historically significant strains ever cultivated.',
    lineage: { parents: ['Hindu Kush Landrace'], origin: 'Afghanistan / Pakistan', heritage: 'Pure Mountain Indica' },
    funFact: 'Hindu Kush is the direct ancestor of the entire Kush family, including OG Kush, Bubba Kush, and Master Kush.',
  },
  {
    id: 'durban_poison',
    name: 'Durban Poison',
    type: 'Sativa',
    era: 'Landrace',
    thcContent: '17% - 26%',
    cbdContent: '0.1%',
    difficulty: 'Easy',
    growthTime: '8-9 weeks',
    expectedYield: 'Medium (450g/m²)',
    growingTips: [
      'One of the fastest-finishing pure sativas — unusually short flower time for its type.',
      'Produces exceptionally large, round resin glands; ideal for extractions.',
      'Very tolerant of cold and humidity variations.',
    ],
    medicalUses: ['Depression', 'Anxiety', 'Fatigue', 'ADHD', 'Nausea'],
    effects: ['Energetic', 'Uplifted', 'Happy', 'Focused', 'Creative'],
    imageUrl: 'https://images.unsplash.com/photo-1603909223427-51f4f9c6c43e?auto=format&fit=crop&q=80&w=400',
    description: "South Africa's gift to the cannabis world. Durban Poison is a beloved pure sativa from the port city of Durban, known for its sweet anise-like aroma, enormous trichome production, and clean, clear-headed euphoria. A parent of Girl Scout Cookies.",
    lineage: { parents: ['South African Landrace'], origin: 'Durban, South Africa', heritage: 'Pure African Sativa' },
    funFact: 'Durban Poison was brought to the US in the 1970s by cannabis pioneer Ed Rosenthal, who collected seeds directly from South Africa.',
  },
  {
    id: 'acapulco_gold',
    name: 'Acapulco Gold',
    type: 'Sativa',
    era: 'Landrace',
    thcContent: '15% - 23%',
    cbdContent: '0.1%',
    difficulty: 'Hard',
    growthTime: '10-11 weeks',
    expectedYield: 'Medium (350g/m²)',
    growingTips: [
      'Requires long warm seasons — best grown outdoors in tropical or subtropical climates.',
      'Produces golden-amber trichomes that give it its iconic coloring.',
      'One of the most difficult landraces to grow at scale; rewards patient cultivators.',
    ],
    medicalUses: ['Fatigue', 'Stress', 'Nausea', 'Pain', 'Depression'],
    effects: ['Euphoric', 'Energizing', 'Uplifted', 'Happy', 'Creative'],
    imageUrl: 'https://images.unsplash.com/photo-1629851722960-9ea3c7885b0d?auto=format&fit=crop&q=80&w=400',
    description: 'One of the most legendary strains of the 1960s and 70s, Acapulco Gold hails from the coastal city of Acapulco, Mexico. Its burnt orange and gold-flecked buds with a caramel-toffee scent made it the premier cannabis of the counterculture era.',
    lineage: { parents: ['Mexican Landrace'], origin: 'Acapulco, Mexico', heritage: 'Pure Mexican Sativa' },
    funFact: 'Acapulco Gold was so revered in the 70s that it was featured in Time Magazine and became a symbol of premium cannabis.',
  },
  {
    id: 'colombian_gold',
    name: 'Colombian Gold',
    type: 'Sativa',
    era: 'Landrace',
    thcContent: '14% - 19%',
    cbdContent: '0.2%',
    difficulty: 'Moderate',
    growthTime: '11-12 weeks',
    expectedYield: 'Medium (300g/m²)',
    growingTips: [
      'Needs a long, warm, humid growing season — ideal for outdoor equatorial climates.',
      'A parent strain of Skunk #1 and many other classic hybrids.',
      'Provides a clear, spacious high without anxiety — even suitable for beginners consuming.',
    ],
    medicalUses: ['Depression', 'Fatigue', 'Stress', 'Mood Disorders'],
    effects: ['Energetic', 'Uplifted', 'Creative', 'Social', 'Clear-headed'],
    imageUrl: 'https://images.unsplash.com/photo-1603909223427-51f4f9c6c43e?auto=format&fit=crop&q=80&w=400',
    description: 'A pure sativa landrace from the Santa Marta mountains of Colombia. Colombian Gold was the most sought-after cannabis in America throughout the 1970s — famously smuggled north and traded for gold. Its lineage flows through nearly every modern hybrid.',
    lineage: { parents: ['Colombian Landrace'], origin: 'Santa Marta, Colombia', heritage: 'Pure Colombian Sativa' },
    funFact: 'Colombian Gold is a grandparent of Skunk #1, which itself became a parent of hundreds of modern strains.',
  },
  {
    id: 'panama_red',
    name: 'Panama Red',
    type: 'Sativa',
    era: 'Landrace',
    thcContent: '10% - 16%',
    cbdContent: '0.3%',
    difficulty: 'Hard',
    growthTime: '11-12 weeks',
    expectedYield: 'Low (250g/m²)',
    growingTips: [
      'Best cultivated outdoors in tropical climates with a long warm season.',
      'Very slow grower — patience is essential.',
      'Old-school genetics that produce a uniquely clear, functional high despite lower THC.',
    ],
    medicalUses: ['Depression', 'Fatigue', 'Stress', 'Creative Blocks'],
    effects: ['Happy', 'Euphoric', 'Energetic', 'Giggly', 'Talkative'],
    imageUrl: 'https://images.unsplash.com/photo-1603909223427-51f4f9c6c43e?auto=format&fit=crop&q=80&w=400',
    description: 'A counterculture icon of the late 1960s and early 70s, Panama Red was the strain of Woodstock and the Summer of Love. Its long, wispy red-haired buds delivered a slow-building, euphoric high that became the standard by which all sativas were measured.',
    lineage: { parents: ['Panamanian Landrace'], origin: 'Panama', heritage: 'Pure Central American Sativa' },
    funFact: 'Panama Red inspired music, poetry, and an entire generation — it was even name-dropped in a New Riders of the Purple Sage song.',
  },
  {
    id: 'thai',
    name: 'Thai (Thai Stick)',
    type: 'Sativa',
    era: 'Landrace',
    thcContent: '12% - 22%',
    cbdContent: '0.1%',
    difficulty: 'Hard',
    growthTime: '12-14 weeks',
    expectedYield: 'Medium (300g/m²)',
    growingTips: [
      'Requires very long growing season — outdoor in tropical/subtropical regions only.',
      'One of the genetic parents of Voodoo, Juicy Fruit, and many 90s strains.',
      'Extremely difficult to grow outside its native climate.',
    ],
    medicalUses: ['Depression', 'Fatigue', 'Creative Blocks', 'Stress'],
    effects: ['Cerebral', 'Energetic', 'Psychedelic', 'Euphoric', 'Focused'],
    imageUrl: 'https://images.unsplash.com/photo-1603909223427-51f4f9c6c43e?auto=format&fit=crop&q=80&w=400',
    description: 'Thai Stick refers to the traditional way cannabis was prepared in Thailand — buds tied around bamboo sticks and coated in hash oil. The genetics from these legendary Thai sativas form the backbone of the famous Haze family and countless other classics.',
    lineage: { parents: ['Thai Landrace'], origin: 'Thailand', heritage: 'Pure Southeast Asian Sativa' },
    funFact: 'Thai genetics were crossbred with Colombian and Mexican landraces by American breeders in the 1970s to create the legendary "Haze" strain.',
  },

  // ─── LEGACY ───────────────────────────────────────────────────────────────

  {
    id: 'jack_herer',
    name: 'Jack Herer',
    type: 'Sativa',
    era: 'Legacy',
    thcContent: '18% - 24%',
    cbdContent: '0.1%',
    difficulty: 'Moderate',
    growthTime: '10-11 weeks',
    expectedYield: 'Medium (450g/m²)',
    growingTips: [
      'Performs best indoors or in warm, Mediterranean-like climates.',
      'Produces four distinct phenotypes — some indica-leaning, some very sativa.',
      'Responds excellently to topping and LST training.',
    ],
    medicalUses: ['Depression', 'Fatigue', 'Anxiety', 'PTSD', 'Stress'],
    effects: ['Creative', 'Energetic', 'Happy', 'Focused', 'Inspired'],
    imageUrl: 'https://images.unsplash.com/photo-1629851722960-9ea3c7885b0d?auto=format&fit=crop&q=80&w=400',
    description: "Named after the cannabis legalization activist and author of 'The Emperor Wears No Clothes,' Jack Herer is a masterpiece blend of Haze, Northern Lights, and Shiva Skunk. It has won numerous awards and is revered as one of the finest sativas ever created.",
    lineage: { parents: ['Haze', 'Northern Lights #5', 'Shiva Skunk'], origin: 'Netherlands', heritage: 'Haze x NL5 x Skunk' },
    breeder: 'Sensi Seeds',
    funFact: "Jack Herer is a prescribed medical strain in the Netherlands under the name 'Bedrocan Sativa.'",
  },
  {
    id: 'white_widow',
    name: 'White Widow',
    type: 'Hybrid',
    era: 'Legacy',
    thcContent: '18% - 25%',
    cbdContent: '0.3%',
    difficulty: 'Easy',
    growthTime: '8-9 weeks',
    expectedYield: 'High (500g/m²)',
    growingTips: [
      'One of the most beginner-friendly strains to grow indoors.',
      'Grows compact and manageable; rarely needs topping.',
      'Covered in white trichomes by week 7 — nearly looks ready before it is.',
    ],
    medicalUses: ['Pain', 'Depression', 'Stress', 'Fatigue', 'PTSD'],
    effects: ['Euphoric', 'Energetic', 'Uplifted', 'Creative', 'Sociable'],
    imageUrl: 'https://images.unsplash.com/photo-1596726581451-b8449c289ad6?auto=format&fit=crop&q=80&w=400',
    description: "A Dutch coffeeshop staple since the mid-1990s that took the cannabis world by storm with its explosive resin production. White Widow's silvery-white buds deliver a powerful burst of euphoria and energy followed by spacious, creative relaxation.",
    lineage: { parents: ['Brazilian Sativa Landrace', 'South Indian Indica'], origin: 'Netherlands', heritage: 'Brazilian x Indian' },
    breeder: 'Green House Seeds',
    funFact: "White Widow won the Cannabis Cup in 1995 and has been a fixture of Amsterdam's coffeeshops for 30+ years.",
  },
  {
    id: 'ak47',
    name: 'AK-47',
    type: 'Hybrid',
    era: 'Legacy',
    thcContent: '17% - 23%',
    cbdContent: '0.1%',
    difficulty: 'Moderate',
    growthTime: '7-9 weeks',
    expectedYield: 'Medium-High (450g/m²)',
    growingTips: [
      'Pungent — carbon filters essential for odor control.',
      'Very sticky — gloves recommended during late-stage trimming.',
      'Resilient and straightforward to grow; handles stress well.',
    ],
    medicalUses: ['Stress', 'Anxiety', 'Depression', 'Pain', 'Insomnia'],
    effects: ['Relaxed', 'Happy', 'Uplifted', 'Mellow', 'Steady'],
    imageUrl: 'https://images.unsplash.com/photo-1629851722960-9ea3c7885b0d?auto=format&fit=crop&q=80&w=400',
    description: "Despite its aggressive name, AK-47 is a mellow, steady strain that leaves you mentally alert while deeply relaxing the body. This multiple Cannabis Cup winner is a precise blend of four world-class landraces, producing long-lasting single-hit satisfaction.",
    lineage: { parents: ['Colombian', 'Mexican', 'Thai', 'Afghani'], origin: 'Netherlands', heritage: 'Quadruple Landrace Cross' },
    breeder: 'Serious Seeds',
    funFact: 'AK-47 has won more cannabis awards than almost any strain in history, including multiple High Times Cannabis Cup victories.',
  },
  {
    id: 'skunk_no1',
    name: 'Skunk #1',
    type: 'Hybrid',
    era: 'Legacy',
    thcContent: '15% - 19%',
    cbdContent: '0.3%',
    difficulty: 'Easy',
    growthTime: '8-9 weeks',
    expectedYield: 'High (500g/m²)',
    growingTips: [
      'The parent of hundreds of modern strains — study this one to understand cannabis genetics.',
      'Extremely vigorous and forgiving; great for beginners.',
      'Produces a very strong, skunky odor — carbon filtration is a must.',
    ],
    medicalUses: ['Stress', 'Anxiety', 'Pain', 'Depression', 'Insomnia'],
    effects: ['Happy', 'Relaxed', 'Uplifted', 'Euphoric', 'Creative'],
    imageUrl: 'https://images.unsplash.com/photo-1542385108-7a544d6db8b1?auto=format&fit=crop&q=80&w=400',
    description: 'The genetic cornerstone of modern cannabis. Developed by Sacred Seeds in California in the late 1970s, Skunk #1 was the first stable hybrid combining multiple landrace genetics. Its influence on subsequent breeding is incalculable.',
    lineage: { parents: ['Afghani', 'Acapulco Gold', 'Colombian Gold'], origin: 'California, USA', heritage: 'Landrace Triple Cross' },
    breeder: 'Sacred Seeds (Sam the Skunkman)',
    funFact: "Skunk #1's genetics flow through nearly 40% of all modern cannabis strains. It's the single most influential strain in breeding history.",
  },
  {
    id: 'northern_lights',
    name: 'Northern Lights',
    type: 'Indica',
    era: 'Legacy',
    thcContent: '16% - 21%',
    difficulty: 'Easy',
    growthTime: '7-9 weeks',
    expectedYield: 'High (550g/m²)',
    growingTips: [
      'Stays short and bushy — excellent for indoor cultivation.',
      'Highly resilient to pests and diseases.',
      'Thrives with standard nutrient regimes.',
    ],
    medicalUses: ['Insomnia', 'Chronic Pain', 'Muscle Spasms', 'Anxiety'],
    effects: ['Sleepy', 'Relaxed', 'Euphoric', 'Hungry'],
    imageUrl: 'https://images.unsplash.com/photo-1542385108-7a544d6db8b1?auto=format&fit=crop&q=80&w=400',
    description: 'One of the most decorated indicas of all time. Northern Lights produces profoundly relaxing effects with dreamy euphoria. A milestone in indoor cannabis cultivation, it paved the way for the modern indoor growing industry.',
    lineage: { parents: ['Afghani Landrace', 'Thai Sativa'], origin: 'Washington, USA', heritage: 'Afghani x Thai' },
    funFact: "Northern Lights won the Cannabis Cup 5 times — more than any other indica strain in the cup's history.",
  },
  {
    id: 'super_silver_haze',
    name: 'Super Silver Haze',
    type: 'Sativa',
    era: 'Legacy',
    thcContent: '18% - 23%',
    cbdContent: '0.1%',
    difficulty: 'Hard',
    growthTime: '10-11 weeks',
    expectedYield: 'High (550g/m²)',
    growingTips: [
      'Stretches dramatically in flower — expect 2-3x height increase.',
      'Needs at least 10 weeks in flower; resist the urge to harvest early.',
      'Responds very well to SCROG training to manage its tall growth.',
    ],
    medicalUses: ['Depression', 'Stress', 'Fatigue', 'Chronic Pain', 'Nausea'],
    effects: ['Energetic', 'Euphoric', 'Creative', 'Uplifted', 'Long-lasting'],
    imageUrl: 'https://images.unsplash.com/photo-1603909223427-51f4f9c6c43e?auto=format&fit=crop&q=80&w=400',
    description: "A 3-time Cannabis Cup champion and the jewel of the Haze family. Super Silver Haze combines the legendary Haze with Northern Lights' resin production and Skunk's growth stability to create one of the most celebrated sativas ever produced.",
    lineage: { parents: ['Skunk #1', 'Northern Lights', 'Haze'], origin: 'Netherlands', heritage: 'Haze x Skunk x NL' },
    breeder: 'Green House Seeds',
    funFact: "Super Silver Haze won the Cannabis Cup three years in a row (1997, 1998, 1999) — an unprecedented achievement.",
  },
  {
    id: 'chemdawg',
    name: 'Chemdawg',
    type: 'Hybrid',
    era: 'Legacy',
    thcContent: '18% - 26%',
    cbdContent: '0.1%',
    difficulty: 'Hard',
    growthTime: '9-10 weeks',
    expectedYield: 'Medium (400g/m²)',
    growingTips: [
      'Very susceptible to mold and mildew — maintain 45-50% humidity in flower.',
      'Extremely pungent; requires serious odor control.',
      'The genetic mother of OG Kush and Sour Diesel — study this lineage carefully.',
    ],
    medicalUses: ['Anxiety', 'Stress', 'PTSD', 'Migraines', 'Chronic Pain'],
    effects: ['Cerebral', 'Euphoric', 'Happy', 'Relaxed', 'Potent'],
    imageUrl: 'https://images.unsplash.com/photo-1629851722960-9ea3c7885b0d?auto=format&fit=crop&q=80&w=400',
    description: 'One of the most mysterious and influential strains in cannabis history. Chemdawg\'s murky origin story involves a Grateful Dead concert parking lot in the late 1980s, but its legacy is undeniable — it is the parent of both OG Kush and Sour Diesel.',
    lineage: { parents: ['Unknown (possibly Thai x Nepalese)'], origin: 'USA (origin disputed)', heritage: 'Unknown Landrace' },
    funFact: 'Chemdawg seeds were discovered in a bag of high-quality cannabis purchased at a Grateful Dead concert in 1991.',
  },

  // ─── MODERN ───────────────────────────────────────────────────────────────

  {
    id: 'blue_dream',
    name: 'Blue Dream',
    type: 'Hybrid',
    era: 'Modern',
    thcContent: '18% - 22%',
    difficulty: 'Easy',
    growthTime: '9-10 weeks',
    expectedYield: 'High (600g/m²)',
    growingTips: [
      'Grows tall; requires topping or pruning early on.',
      'Highly resistant to powdery mildew — great for beginners.',
      'Provide plenty of nitrogen during vegetative stage.',
    ],
    medicalUses: ['Stress Relief', 'Depression', 'Chronic Pain', 'Nausea'],
    effects: ['Uplifting', 'Euphoric', 'Creative', 'Relaxing'],
    imageUrl: 'https://images.unsplash.com/photo-1629851722960-9ea3c7885b0d?auto=format&fit=crop&q=80&w=400',
    description: 'A legendary California sativa-dominant hybrid balancing full-body relaxation with gentle cerebral invigoration. Blue Dream is one of the top-selling strains in legal markets for its versatility and approachable high.',
    lineage: { parents: ['DJ Short Blueberry', 'Super Silver Haze'], origin: 'California, USA', heritage: 'Blueberry x Haze' },
    breeder: 'Santa Cruz',
  },
  {
    id: 'sour_diesel',
    name: 'Sour Diesel',
    type: 'Sativa',
    era: 'Modern',
    thcContent: '20% - 25%',
    difficulty: 'Moderate',
    growthTime: '10-11 weeks',
    expectedYield: 'Medium (450g/m²)',
    growingTips: [
      'Requires low humidity to prevent mold.',
      'Stretches significantly during flowering.',
      'Needs a warm, dry climate between 68-85°F.',
    ],
    medicalUses: ['Fatigue', 'Stress', 'Minor Pain', 'Appetite'],
    effects: ['Energizing', 'Happy', 'Uplifted', 'Talkative'],
    imageUrl: 'https://images.unsplash.com/photo-1596726581451-b8449c289ad6?auto=format&fit=crop&q=80&w=400',
    description: "Named after its pungent diesel-like aroma, this fast-acting New York legend delivers energizing, dreamy cerebral effects that have earned it icon status on both coasts.",
    lineage: { parents: ['Chemdawg 91', 'Super Skunk'], origin: 'New York, USA', heritage: 'Diesel x Skunk' },
  },
  {
    id: 'og_kush',
    name: 'OG Kush',
    type: 'Hybrid',
    era: 'Modern',
    thcContent: '20% - 26%',
    difficulty: 'Hard',
    growthTime: '8-9 weeks',
    expectedYield: 'Medium (400g/m²)',
    growingTips: [
      'Susceptible to powdery mildew — maintain airflow.',
      'Requires heavy feeding with calcium & magnesium.',
      'Frequent pruning encourages proper canopy development.',
    ],
    medicalUses: ['Migraines', 'ADD/ADHD', 'Stress', 'Severe Pain'],
    effects: ['Euphoric', 'Happy', 'Relaxed', 'Giggly'],
    imageUrl: 'https://images.unsplash.com/photo-1629851722960-9ea3c7885b0d?auto=format&fit=crop&q=80&w=400',
    description: "The genetic backbone of West Coast cannabis. OG Kush's complex terpene profile of fuel, skunk, and spice delivers heavy mixed head and body effects that defined California cannabis culture.",
    lineage: { parents: ['Chemdawg', 'Hindu Kush'], origin: 'Florida, USA', heritage: 'Kush x Chemdawg' },
  },
  {
    id: 'girl_scout_cookies',
    name: 'Girl Scout Cookies (GSC)',
    type: 'Hybrid',
    era: 'Modern',
    thcContent: '25% - 28%',
    difficulty: 'Moderate',
    growthTime: '9-10 weeks',
    expectedYield: 'Medium (450g/m²)',
    growingTips: [
      'Very resistant to pests and diseases.',
      'Keep humidity below 50% to avoid mold on dense buds.',
      'Benefits greatly from low-stress training (LST).',
    ],
    medicalUses: ['Severe Pain', 'Nausea', 'Appetite Loss', 'Depression'],
    effects: ['Happy', 'Relaxed', 'Euphoric', 'Creative'],
    imageUrl: 'https://images.unsplash.com/photo-1596726581451-b8449c289ad6?auto=format&fit=crop&q=80&w=400',
    description: 'Award-winning Bay Area hybrid with a pungent dessert aroma of mint, sweet cherry, and lemon. GSC delivers euphoric cerebral effects alongside heavy full-body relaxation.',
    lineage: { parents: ['OG Kush', 'Durban Poison'], origin: 'San Francisco, CA', heritage: 'Cookies x Kush' },
  },
  {
    id: 'gorilla_glue_4',
    name: 'Gorilla Glue #4',
    type: 'Hybrid',
    era: 'Modern',
    thcContent: '25% - 30%',
    cbdContent: '0.1%',
    difficulty: 'Moderate',
    growthTime: '8-9 weeks',
    expectedYield: 'High (600g/m²)',
    growingTips: [
      'Produces enormous amounts of resin — scissors and hands glue up instantly during trimming.',
      'Scrog training dramatically increases yield potential.',
      'Watch for moisture in dense buds during late flower.',
    ],
    medicalUses: ['Depression', 'Insomnia', 'Pain', 'PTSD', 'Muscle Spasms'],
    effects: ['Euphoric', 'Relaxed', 'Heavy', 'Happy', 'Sedated'],
    imageUrl: 'https://images.unsplash.com/photo-1542385108-7a544d6db8b1?auto=format&fit=crop&q=80&w=400',
    description: "GG#4's absurd resin production — so sticky it makes scissors unusable — and its heavyweight couch-lock effects made it a sensation when it first emerged. A multiple Cannabis Cup winner and one of the decade's most influential strains.",
    lineage: { parents: ['Chem Sister', 'Sour Dubb', 'Chocolate Diesel'], origin: 'USA', heritage: 'Chem x Sour x Diesel' },
    breeder: 'GG Strains',
    funFact: "GG#4 was created by accident — Joesy Whales's entire Chem Sis crop became hermaphroditic, but one accidental cross produced GG#4.",
  },
  {
    id: 'wedding_cake',
    name: 'Wedding Cake',
    type: 'Hybrid',
    era: 'Modern',
    thcContent: '24% - 27%',
    cbdContent: '0.1%',
    difficulty: 'Moderate',
    growthTime: '8-9 weeks',
    expectedYield: 'High (550g/m²)',
    growingTips: [
      'Dense buds benefit from defoliation to improve airflow and light penetration.',
      'Rich in caryophyllene — a pepper-rich terpene known for anti-inflammatory properties.',
      'Tolerates both indoor and outdoor cultivation well.',
    ],
    medicalUses: ['Anxiety', 'Pain', 'Insomnia', 'Stress', 'Appetite Loss'],
    effects: ['Relaxed', 'Happy', 'Euphoric', 'Uplifted', 'Hungry'],
    imageUrl: 'https://images.unsplash.com/photo-1629851722960-9ea3c7885b0d?auto=format&fit=crop&q=80&w=400',
    description: "Also known as Pink Cookies, Wedding Cake is a rich tangy indica-dominant strain with undertones of earthy pepper. Its dense, resin-covered buds and bakery-like aroma have made it one of the most popular strains sold in legal dispensaries.",
    lineage: { parents: ['Triangle Kush', 'Animal Mints'], origin: 'California, USA', heritage: 'Cookies x Kush' },
    breeder: 'Seed Junky Genetics',
  },
  {
    id: 'gelato',
    name: 'Gelato',
    type: 'Hybrid',
    era: 'Modern',
    thcContent: '20% - 26%',
    cbdContent: '0.1%',
    difficulty: 'Moderate',
    growthTime: '8-9 weeks',
    expectedYield: 'Medium (450g/m²)',
    growingTips: [
      'Produces colorful purple and orange phenotypes — cooler night temperatures enhance coloring.',
      'Multiple phenotypes exist (Gelato #33 "Larry Bird" is most celebrated).',
      'Dense buds need low humidity to prevent mold; keep below 45% in late flower.',
    ],
    medicalUses: ['Muscle Spasms', 'Chronic Pain', 'Fatigue', 'Inflammation'],
    effects: ['Euphoric', 'Relaxed', 'Creative', 'Energetic', 'Uplifted'],
    imageUrl: 'https://images.unsplash.com/photo-1596726581451-b8449c289ad6?auto=format&fit=crop&q=80&w=400',
    description: "Sunset Sherbet and Thin Mint GSC combined to create this dessert-flavored California masterpiece. Gelato delivers a potent rush of euphoria and relaxation without heavy sedation, wrapped in a sweet, fruity, sherbet-like aroma.",
    lineage: { parents: ['Sunset Sherbet', 'Thin Mint Girl Scout Cookies'], origin: 'San Francisco, CA', heritage: 'Cookies x Sherbet' },
    breeder: 'Cookie Fam Genetics',
  },
  {
    id: 'zkittlez',
    name: 'Zkittlez',
    type: 'Indica',
    era: 'Modern',
    thcContent: '15% - 23%',
    cbdContent: '0.2%',
    difficulty: 'Moderate',
    growthTime: '8-9 weeks',
    expectedYield: 'Medium (400g/m²)',
    growingTips: [
      'Stays compact and manageable — excellent for small indoor spaces.',
      'Produces vibrant aromas of grape, grapefruit, and tropical fruit.',
      'Benefits from calcium and magnesium supplements throughout the grow.',
    ],
    medicalUses: ['Stress', 'Anxiety', 'Pain', 'Depression', 'Insomnia'],
    effects: ['Happy', 'Relaxed', 'Uplifted', 'Calm', 'Sleepy'],
    imageUrl: 'https://images.unsplash.com/photo-1542385108-7a544d6db8b1?auto=format&fit=crop&q=80&w=400',
    description: "Named for the candy, Zkittlez dazzles with an explosion of tropical, fruity aromas and a calm, winning euphoria that fades into deep full-body relaxation. A multiple Cannabis Cup champion and one of the most colorful, flavorful strains available.",
    lineage: { parents: ['Grape Ape', 'Grapefruit', 'Unknown Third Parent'], origin: 'California, USA', heritage: 'Fruit Cross' },
    breeder: 'Dying Breed Seeds / 3rd Gen Family',
  },
];

export async function fetchStrains(query?: string, type?: StrainType, difficulty?: Difficulty, era?: StrainEra): Promise<StrainInfo[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  let results = [...strainDatabase];

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.lineage.origin?.toLowerCase().includes(q) ||
      s.lineage.parents.some(p => p.toLowerCase().includes(q)) ||
      (s.lineage.heritage && s.lineage.heritage.toLowerCase().includes(q)) ||
      (s.funFact && s.funFact.toLowerCase().includes(q))
    );
  }

  if (type) results = results.filter(s => s.type === type);
  if (difficulty) results = results.filter(s => s.difficulty === difficulty);
  if (era) results = results.filter(s => s.era === era);

  return results;
}

export async function getStrainById(id: string): Promise<StrainInfo | null> {
  return strainDatabase.find(s => s.id === id) || null;
}

export async function getStrainEras(): Promise<StrainEra[]> {
  return ['Landrace', 'Legacy', 'Modern'];
}