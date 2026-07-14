// ============================================
// TRAVEL GAP ENGINE
// Gap Finder & Dynamic Checklist Generator
// Compares destination climate against closet
// inventory to detect missing critical items
// ============================================

import { TRIP_TYPES, CLIMATE_DATA } from '../data/mockData.js';

/**
 * Generate a complete travel checklist with outfit formulas,
 * activity gear, essentials, and gap warnings.
 * @param {object} params - Trip configuration
 * @param {Array} closetItems - User's closet inventory
 * @returns {object} Complete checklist with gaps
 */
export function generateTravelChecklist({
  destination,
  tripType,
  startDate,
  endDate,
  closetItems = [],
}) {
  const climate = getClimateForDestination(destination);
  const tripConfig = TRIP_TYPES[tripType] || TRIP_TYPES['City Exploration'];
  const numDays = calculateDays(startDate, endDate);
  const isCold = climate.avgTemp < 10;
  const isRainy = climate.precipitation.toLowerCase().includes('rain');
  const isSnowy = climate.precipitation.toLowerCase().includes('snow');

  // ---- 1. Generate Wardrobe Outfits (day-by-day) ----
  const wardrobeOutfits = generateTripOutfits(closetItems, climate, numDays, tripType);

  // ---- 2. Activity Gear Checklist ----
  let gearItems = [...tripConfig.gear];

  // Add weather-specific gear overrides
  if (isRainy && tripConfig.weatherOverrides.rain) {
    gearItems = [...gearItems, ...tripConfig.weatherOverrides.rain];
  }
  if ((isCold || isSnowy) && tripConfig.weatherOverrides.cold) {
    gearItems = [...gearItems, ...tripConfig.weatherOverrides.cold];
  }

  // Deduplicate
  gearItems = [...new Set(gearItems)];

  const activityGear = gearItems.map((item, idx) => ({
    id: `gear_${idx}`,
    name: item,
    checked: false,
    category: 'gear',
  }));

  // ---- 3. Essentials Checklist ----
  const essentials = tripConfig.essentials.map((item, idx) => ({
    id: `essential_${idx}`,
    name: item,
    checked: false,
    category: 'essential',
  }));

  // ---- 4. Gap Finder ----
  const gaps = findGaps(closetItems, climate, tripConfig, { isCold, isRainy, isSnowy });

  return {
    id: `trip_${Date.now()}`,
    destination,
    tripType,
    startDate,
    endDate,
    numDays,
    climate,
    wardrobeOutfits,
    activityGear,
    essentials,
    gaps,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Get climate profile for a destination (fuzzy match).
 * @param {string} destination
 * @returns {object} Climate data
 */
export function getClimateForDestination(destination) {
  if (!destination) return { avgTemp: 18, condition: 'Mild', precipitation: 'None', humidity: 50, season: 'Spring', windSpeed: 10 };

  const lower = destination.toLowerCase();

  // Fuzzy match against known destinations
  for (const [key, data] of Object.entries(CLIMATE_DATA)) {
    const keyWords = key.toLowerCase().split(/[\s,–-]+/);
    const matchCount = keyWords.filter(w => lower.includes(w)).length;
    if (matchCount >= 1) return data;
  }

  // Heuristic fallback based on keywords
  if (lower.includes('alps') || lower.includes('ski') || lower.includes('swiss') || lower.includes('mountain')) {
    return { avgTemp: -2, condition: 'Snowy', precipitation: 'Heavy Snow', humidity: 70, season: 'Winter', windSpeed: 20 };
  }
  if (lower.includes('beach') || lower.includes('bali') || lower.includes('tropical') || lower.includes('island')) {
    return { avgTemp: 29, condition: 'Hot & Humid', precipitation: 'Tropical Rain', humidity: 85, season: 'Summer', windSpeed: 8 };
  }
  if (lower.includes('desert') || lower.includes('sahara') || lower.includes('dubai')) {
    return { avgTemp: 38, condition: 'Hot & Dry', precipitation: 'None', humidity: 20, season: 'Summer', windSpeed: 15 };
  }

  // Generic temperate default
  return { avgTemp: 18, condition: 'Mild', precipitation: 'Occasional Rain', humidity: 55, season: 'Spring', windSpeed: 12 };
}

/**
 * Generate day-by-day outfit formulas for a trip.
 */
function generateTripOutfits(closetItems, climate, numDays, tripType) {
  const outfits = [];
  const isCold = climate.avgTemp < 10;
  const isHot = climate.avgTemp > 25;

  // Filter weather-appropriate items
  const suitable = closetItems.filter(item =>
    item.weatherMin <= climate.avgTemp + 5 && item.weatherMax >= climate.avgTemp - 5
  );

  const tops = suitable.filter(i => i.category === 'Tops');
  const bottoms = suitable.filter(i => i.category === 'Bottoms');
  const outerwear = suitable.filter(i => i.category === 'Outerwear');
  const footwear = suitable.filter(i => i.category === 'Footwear');
  const accessories = suitable.filter(i => i.category === 'Accessories');

  for (let day = 1; day <= Math.min(numDays, 10); day++) {
    const outfit = {
      day,
      label: `Day ${day}`,
      pieces: [],
      checked: false,
    };

    // Rotate through available items
    if (tops.length > 0) outfit.pieces.push(tops[(day - 1) % tops.length]);
    if (bottoms.length > 0) outfit.pieces.push(bottoms[(day - 1) % bottoms.length]);
    if (footwear.length > 0) outfit.pieces.push(footwear[Math.min(day - 1, footwear.length - 1) % footwear.length]);
    if (isCold && outerwear.length > 0) outfit.pieces.push(outerwear[(day - 1) % outerwear.length]);
    if (accessories.length > 0 && day % 2 === 0) outfit.pieces.push(accessories[(day - 1) % accessories.length]);

    outfits.push(outfit);
  }

  return outfits;
}

/**
 * Find critical missing items (gaps) in the user's closet
 * relative to trip requirements.
 * @returns {Array} Gap warnings with shopping recommendations
 */
function findGaps(closetItems, climate, tripConfig, { isCold, isRainy, isSnowy }) {
  const gaps = [];
  const ownedCategories = closetItems.map(i => i.name.toLowerCase());
  const ownedCats = closetItems.map(i => i.category);

  // Check weather override items
  if (isRainy) {
    for (const item of (tripConfig.weatherOverrides.rain || [])) {
      const hasIt = closetItems.some(ci =>
        ci.rainResistant ||
        ci.name.toLowerCase().includes(item.toLowerCase().split(' ')[0])
      );
      if (!hasIt) {
        gaps.push({
          item,
          severity: 'critical',
          reason: `Required for ${climate.precipitation.toLowerCase()} conditions at destination`,
          suggestedBrand: item.includes('Shell') ? "Arc'teryx" : 'Rains',
          estimatedPrice: item.includes('Shell') ? '$450' : '$85',
        });
      }
    }
  }

  if (isCold || isSnowy) {
    for (const item of (tripConfig.weatherOverrides.cold || [])) {
      const hasIt = closetItems.some(ci =>
        ci.name.toLowerCase().includes(item.toLowerCase().split(' ')[0]) ||
        (item.toLowerCase().includes('thermal') && ci.weatherMin <= 0)
      );
      if (!hasIt) {
        gaps.push({
          item,
          severity: climate.avgTemp < 0 ? 'critical' : 'recommended',
          reason: `Needed for ${climate.avgTemp}°C ${climate.condition.toLowerCase()} conditions`,
          suggestedBrand: item.includes('Down') ? 'Patagonia' : 'Icebreaker',
          estimatedPrice: item.includes('Down') ? '$300' : '$100',
        });
      }
    }
  }

  // Check basic category coverage
  if (!ownedCats.includes('Outerwear') && climate.avgTemp < 15) {
    gaps.push({
      item: 'Layering Jacket',
      severity: 'recommended',
      reason: 'No outerwear found in closet for cooler temperatures',
      suggestedBrand: 'COS',
      estimatedPrice: '$200',
    });
  }

  return gaps;
}

/**
 * Calculate number of days between two dates.
 */
function calculateDays(startDate, endDate) {
  if (!startDate || !endDate) return 5;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.min(diff, 30));
}
