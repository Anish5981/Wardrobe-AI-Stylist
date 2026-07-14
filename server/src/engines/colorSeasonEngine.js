// ============================================
// COLOR SEASON ENGINE
// Maps user complexion & undertone to one of 4
// master seasonal palettes and scores garments
// ============================================

import { COLOR_SEASONS } from '../data/mockData.js';

/**
 * Determine the user's color season based on skin tone and undertone.
 * @param {string} skinTone - e.g., 'Fair / Porcelain', 'Medium / Olive'
 * @param {string} undertone - 'Cool', 'Warm', or 'Neutral'
 * @returns {string} Color season key
 */
export function determineColorSeason(skinTone, undertone) {
  const tone = skinTone?.toLowerCase() || '';
  const under = (undertone || '').toLowerCase();

  // Extract core undertone from descriptive string
  let coreUndertone = 'neutral';
  if (under.includes('cool')) coreUndertone = 'cool';
  else if (under.includes('warm')) coreUndertone = 'warm';

  // Depth classification
  const isDeep = tone.includes('deep') || tone.includes('dark') || tone.includes('ebony');
  const isFair = tone.includes('fair') || tone.includes('porcelain') || tone.includes('very fair');
  const isLight = tone.includes('light') && !tone.includes('medium');

  // Season mapping logic
  if (coreUndertone === 'cool') {
    if (isDeep || isFair) return 'Winter Jewel';
    return 'Summer Soft';
  }

  if (coreUndertone === 'warm') {
    if (isDeep || tone.includes('tan') || tone.includes('olive')) return 'Autumn Earth';
    return 'Spring Pastel';
  }

  // Neutral undertone
  if (isDeep || tone.includes('medium')) return 'Autumn Earth';
  if (isFair || isLight) return 'Summer Soft';
  return 'Spring Pastel';
}

/**
 * Get the full palette data for a color season.
 * @param {string} seasonKey - e.g., 'Winter Jewel'
 * @returns {object} Season palette data
 */
export function getSeasonPalette(seasonKey) {
  return COLOR_SEASONS[seasonKey] || COLOR_SEASONS['Summer Soft'];
}

/**
 * Calculate the distance between two hex colors in RGB space.
 */
function colorDistance(hex1, hex2) {
  const r1 = parseInt(hex1.slice(1, 3), 16);
  const g1 = parseInt(hex1.slice(3, 5), 16);
  const b1 = parseInt(hex1.slice(5, 7), 16);
  const r2 = parseInt(hex2.slice(1, 3), 16);
  const g2 = parseInt(hex2.slice(3, 5), 16);
  const b2 = parseInt(hex2.slice(5, 7), 16);
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

/**
 * Score a garment's color against a user's color season.
 * @param {string} itemColor - Hex color of the garment
 * @param {string} seasonKey - User's color season
 * @returns {{ score: number, label: string }} -1 Clashing, 0 Neutral, +1 Harmonious
 */
export function scoreGarmentColor(itemColor, seasonKey) {
  const palette = getSeasonPalette(seasonKey);
  if (!itemColor || !palette) return { score: 0, label: 'Neutral' };

  const THRESHOLD = 80;

  // Check if close to any harmonious color
  for (const harmColor of palette.harmonious) {
    if (colorDistance(itemColor, harmColor) < THRESHOLD) {
      return { score: 1, label: 'Harmonious' };
    }
  }

  // Check if close to any color to avoid
  for (const avoidColor of palette.avoid) {
    if (colorDistance(itemColor, avoidColor) < THRESHOLD) {
      return { score: -1, label: 'Clashing' };
    }
  }

  // Neutrals (black, white, grey) are always safe
  const r = parseInt(itemColor.slice(1, 3), 16);
  const g = parseInt(itemColor.slice(3, 5), 16);
  const b = parseInt(itemColor.slice(5, 7), 16);
  const saturation = Math.max(r, g, b) - Math.min(r, g, b);
  if (saturation < 30) return { score: 1, label: 'Harmonious' };

  return { score: 0, label: 'Neutral' };
}

/**
 * Score all items in a closet against a color season.
 * @param {Array} closetItems - Array of garment objects
 * @param {string} seasonKey - User's color season
 * @returns {Array} Items with colorScore and colorLabel added
 */
export function scoreCloset(closetItems, seasonKey) {
  return closetItems.map(item => {
    const { score, label } = scoreGarmentColor(item.color, seasonKey);
    return { ...item, colorScore: score, colorLabel: label };
  });
}
