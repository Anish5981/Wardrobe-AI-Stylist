// ============================================
// OUTFIT ENGINE
// Daily outfit formulation combining weather
// conditions, occasion, and closet inventory
// ============================================

import { scoreGarmentColor } from './colorSeasonEngine';

/**
 * Generate a complete outfit ensemble from owned closet items.
 * @param {Array} closetItems - User's closet inventory
 * @param {object} params - { weather, occasion, colorSeason }
 * @returns {object} Generated outfit with pieces and commentary
 */
export function generateOutfit(closetItems, { weather = 'Mild', occasion = 'Casual', colorSeason = null, temperature = 18 }) {
  if (!closetItems || closetItems.length === 0) {
    return { success: false, error: 'Your closet is empty. Add items to get started!' };
  }

  const formalityMap = {
    'Business Formal': 5,
    'Smart Casual': 3,
    'Casual': 2,
    'Date Night': 4,
    'Gallery Opening': 4,
    'Brunch': 2,
    'Travel': 2,
    'Workout': 1,
    'Beach': 1,
  };

  const targetFormality = formalityMap[occasion] || 3;
  const isRainy = weather === 'Rainy';
  const isSnowy = weather === 'Snowy';
  const isCold = temperature < 10;
  const isHot = temperature > 25;

  // Filter items by weather suitability
  const weatherSuitable = closetItems.filter(item => {
    const minOk = item.weatherMin <= temperature + 5;
    const maxOk = item.weatherMax >= temperature - 5;
    if (isRainy && item.category === 'Outerwear' && !item.rainResistant) return false;
    return minOk && maxOk;
  });

  // Score items by formality proximity and color harmony
  function scoreItem(item) {
    let score = 0;
    const formalityDiff = Math.abs(item.formality - targetFormality);
    score += (5 - formalityDiff) * 2;

    if (colorSeason) {
      const colorResult = scoreGarmentColor(item.color, colorSeason);
      score += colorResult.score * 3;
    }

    // Prefer weather-appropriate items
    if (temperature >= item.weatherMin && temperature <= item.weatherMax) score += 2;

    return score;
  }

  function pickBest(items, category) {
    const candidates = items.filter(i => i.category === category);
    if (candidates.length === 0) return null;
    candidates.sort((a, b) => scoreItem(b) - scoreItem(a));

    // Add slight randomness to avoid identical outfits
    const topN = Math.min(3, candidates.length);
    const idx = Math.floor(Math.random() * topN);
    return candidates[idx];
  }

  // Build the ensemble
  const ensemble = {};

  // Core pieces
  const top = pickBest(weatherSuitable, 'Tops') || pickBest(closetItems, 'Tops');
  const bottom = pickBest(weatherSuitable, 'Bottoms') || pickBest(closetItems, 'Bottoms');
  const footwear = pickBest(weatherSuitable, 'Footwear') || pickBest(closetItems, 'Footwear');

  if (top) ensemble.top = top;
  if (bottom) ensemble.bottom = bottom;
  if (footwear) ensemble.footwear = footwear;

  // Dress as an alternative (for appropriate occasions)
  if (occasion === 'Date Night' || occasion === 'Gallery Opening' || occasion === 'Brunch') {
    const dress = pickBest(weatherSuitable, 'Dresses') || pickBest(closetItems, 'Dresses');
    if (dress) ensemble.dress = dress;
  }

  // Outerwear if cold or rainy
  if (isCold || isRainy || isSnowy) {
    const outerwear = pickBest(weatherSuitable, 'Outerwear') || pickBest(closetItems, 'Outerwear');
    if (outerwear) ensemble.outerwear = outerwear;
  }

  // Accessory
  const accessory = pickBest(weatherSuitable, 'Accessories') || pickBest(closetItems, 'Accessories');
  if (accessory) ensemble.accessory = accessory;

  // Generate editorial commentary
  const commentary = generateCommentary(ensemble, { weather, occasion, temperature });

  return {
    success: true,
    id: `outfit_${Date.now()}`,
    ensemble,
    commentary,
    weather,
    occasion,
    temperature,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Generate editorial styling commentary for an outfit.
 */
function generateCommentary(ensemble, { weather, occasion, temperature }) {
  const pieces = Object.values(ensemble).filter(Boolean);
  if (pieces.length === 0) return 'Add more items to your closet for personalized styling.';

  const brands = [...new Set(pieces.map(p => p.brand))];
  const brandMention = brands.length > 1
    ? `mixing ${brands.slice(0, -1).join(', ')} with ${brands[brands.length - 1]}`
    : `featuring ${brands[0]}`;

  const occasionComments = {
    'Business Formal': `A polished, commanding look ${brandMention}. This ensemble conveys authority while maintaining sartorial elegance for the boardroom.`,
    'Smart Casual': `Effortlessly refined — ${brandMention} creates a look that transitions seamlessly from the office to an evening cocktail.`,
    'Casual': `Relaxed yet intentional. ${brandMention.charAt(0).toUpperCase() + brandMention.slice(1)} for a considered approach to everyday dressing.`,
    'Date Night': `Understated allure, ${brandMention}. This combination strikes the perfect balance between effort and effortlessness.`,
    'Gallery Opening': `Architectural and gallery-ready. ${brandMention.charAt(0).toUpperCase() + brandMention.slice(1)} for a look that belongs among the art.`,
    'Brunch': `Weekend ease with a point of view. ${brandMention.charAt(0).toUpperCase() + brandMention.slice(1)} keeps it polished without trying too hard.`,
    'Travel': `Travel-ready versatility, ${brandMention}. Comfort meets style for long journeys and spontaneous exploration.`,
    'Workout': `Performance-driven and streamlined. ${brandMention.charAt(0).toUpperCase() + brandMention.slice(1)} for maximum mobility and breathability.`,
    'Beach': `Coastal ease with editorial sensibility. ${brandMention.charAt(0).toUpperCase() + brandMention.slice(1)} for sun-soaked days and seaside dining.`,
  };

  let comment = occasionComments[occasion] || `A thoughtful combination ${brandMention} suited for the day ahead.`;

  // Weather addendum
  if (weather === 'Rainy' && ensemble.outerwear) {
    comment += ` The ${ensemble.outerwear.name} provides essential rain protection without compromising the silhouette.`;
  } else if (temperature < 5 && ensemble.outerwear) {
    comment += ` Layered with the ${ensemble.outerwear.name} to combat the ${temperature}°C chill.`;
  }

  return comment;
}

/**
 * Get weather-based outfit recommendations for quick daily use.
 * @param {number} temperature
 * @param {string} condition
 * @returns {object} Layering advice
 */
export function getLayeringAdvice(temperature, condition) {
  if (temperature < 0) {
    return {
      layers: 4,
      advice: 'Heavy layering required: thermal base, insulating mid-layer, warm knit, and a protective outer shell.',
      icon: '🧊',
    };
  }
  if (temperature < 10) {
    return {
      layers: 3,
      advice: 'Three-layer system: breathable base, warm sweater or fleece, and a structured coat.',
      icon: '❄️',
    };
  }
  if (temperature < 18) {
    return {
      layers: 2,
      advice: 'Light layering: a quality top paired with a light jacket or blazer.',
      icon: '🍂',
    };
  }
  if (temperature < 25) {
    return {
      layers: 1,
      advice: 'Single-layer dressing: opt for breathable fabrics with clean lines.',
      icon: '🌤️',
    };
  }
  return {
    layers: 1,
    advice: 'Lightweight, breathable pieces only. Linen and cotton are your allies.',
    icon: '☀️',
  };
}
