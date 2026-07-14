// ============================================
// INGESTION ENGINE
// E-receipt parsing and background removal
// simulation for manual garment uploads
// ============================================

import { CATEGORIES } from '../data/mockData';

// ---- Brand & Category Keywords ----
const BRAND_KEYWORDS = [
  'COS', 'Zara', 'H&M', 'Uniqlo', 'Nordstrom', 'SSENSE', 'Acne Studios',
  'Totême', 'Lemaire', 'Arket', 'Aritzia', 'Nike', 'Adidas', 'Salomon',
  'Arc\'teryx', 'Patagonia', 'Mango', 'Massimo Dutti', 'Everlane', 'Muji',
  'Net-a-Porter', 'Mr Porter', 'Farfetch', 'END.', 'MATCHES',
];

const CATEGORY_KEYWORDS = {
  Tops: ['shirt', 'tee', 't-shirt', 'blouse', 'sweater', 'hoodie', 'pullover', 'polo', 'henley', 'tank', 'crop', 'turtleneck', 'knit', 'jersey', 'sweatshirt', 'cardigan', 'vest top'],
  Bottoms: ['pants', 'trousers', 'jeans', 'denim', 'shorts', 'skirt', 'chinos', 'joggers', 'culottes', 'leggings', 'cargo'],
  Outerwear: ['coat', 'jacket', 'blazer', 'parka', 'trench', 'bomber', 'windbreaker', 'anorak', 'puffer', 'overcoat', 'raincoat', 'poncho', 'cape', 'vest', 'gilet'],
  Footwear: ['shoes', 'boots', 'sneakers', 'sandals', 'loafers', 'mules', 'heels', 'flats', 'runners', 'trainers', 'oxfords', 'derby', 'slippers', 'flip flops'],
  Accessories: ['bag', 'scarf', 'belt', 'watch', 'hat', 'cap', 'beanie', 'sunglasses', 'gloves', 'wallet', 'tie', 'pocket square', 'bracelet', 'necklace', 'earrings', 'tote', 'backpack', 'clutch'],
  Dresses: ['dress', 'gown', 'romper', 'jumpsuit', 'midi', 'maxi', 'mini dress'],
  Activewear: ['running', 'gym', 'yoga', 'performance', 'training', 'athletic', 'compression', 'sports bra', 'workout'],
};

const COLOR_KEYWORDS = {
  '#1B1B1B': ['black', 'noir', 'jet'],
  '#FFFFFF': ['white', 'bright white', 'snow'],
  '#191970': ['navy', 'indigo', 'dark blue'],
  '#1C3A5F': ['blue', 'cobalt', 'steel blue'],
  '#708090': ['grey', 'gray', 'slate', 'heather'],
  '#36454F': ['charcoal', 'dark grey', 'anthracite'],
  '#8B4513': ['brown', 'chocolate', 'cocoa'],
  '#D2B48C': ['tan', 'camel', 'sand', 'beige'],
  '#C3B091': ['khaki', 'stone', 'taupe'],
  '#F5F5DC': ['cream', 'ivory', 'off-white', 'ecru', 'oat', 'natural'],
  '#556B2F': ['olive', 'moss', 'military green'],
  '#2E4A1E': ['forest', 'dark green', 'pine'],
  '#8B0000': ['burgundy', 'wine', 'maroon', 'oxblood'],
  '#6B1D3A': ['plum', 'berry', 'deep purple', 'aubergine'],
  '#D2691E': ['rust', 'terracotta', 'sienna', 'burnt orange'],
  '#DAA520': ['mustard', 'gold', 'saffron'],
  '#FF6B6B': ['coral', 'salmon', 'peach'],
  '#87CEEB': ['sky blue', 'light blue', 'powder blue'],
  '#DDA0DD': ['lavender', 'lilac', 'mauve'],
  '#F0E68C': ['yellow', 'lemon', 'butter'],
};

/**
 * Parse raw e-receipt text and extract garment details.
 * @param {string} rawText - Raw email receipt content
 * @returns {object} Parsed garment data
 */
export function parseReceipt(rawText) {
  if (!rawText || rawText.trim().length < 10) {
    return { success: false, error: 'Receipt text is too short to parse' };
  }

  const lower = rawText.toLowerCase();
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  // Extract brand
  let brand = 'Unknown';
  for (const b of BRAND_KEYWORDS) {
    if (lower.includes(b.toLowerCase())) {
      brand = b;
      break;
    }
  }

  // Extract category
  let category = 'Tops'; // default
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        category = cat;
        break;
      }
    }
    if (category !== 'Tops' || lower.includes('shirt') || lower.includes('tee')) break;
  }

  // Extract color
  let color = '#708090';
  let colorName = 'Grey';
  for (const [hex, keywords] of Object.entries(COLOR_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        color = hex;
        colorName = kw.charAt(0).toUpperCase() + kw.slice(1);
        break;
      }
    }
    if (color !== '#708090') break;
  }

  // Extract product name (first line with substantial text)
  let name = lines.find(l => l.length > 5 && l.length < 80) || 'Imported Garment';
  name = name.replace(/order|confirmation|receipt|thank|#\d+/gi, '').trim();
  if (name.length < 3) name = `${brand} ${category.slice(0, -1)}`;

  // Extract size
  const sizeMatch = rawText.match(/size\s*:?\s*(XXS|XS|S|M|L|XL|XXL|\d{1,2})/i);
  const size = sizeMatch ? sizeMatch[1].toUpperCase() : null;

  // Extract price
  const priceMatch = rawText.match(/\$\s*[\d,.]+|\d+[.,]\d{2}\s*(?:USD|EUR|GBP)/i);
  const price = priceMatch ? priceMatch[0] : null;

  // Determine season suitability based on category and keywords
  let seasonTags = ['Spring', 'Summer', 'Autumn'];
  if (lower.includes('winter') || lower.includes('wool') || lower.includes('cashmere') || lower.includes('thermal')) {
    seasonTags = ['Autumn', 'Winter'];
  } else if (lower.includes('summer') || lower.includes('linen') || lower.includes('lightweight')) {
    seasonTags = ['Summer'];
  }

  return {
    success: true,
    item: {
      id: `item_receipt_${Date.now()}`,
      name: name.length > 60 ? name.substring(0, 57) + '...' : name,
      brand,
      category,
      color,
      colorName,
      seasonTags,
      formality: category === 'Activewear' ? 1 : 3,
      weatherMin: seasonTags.includes('Winter') ? -5 : 10,
      weatherMax: seasonTags.includes('Summer') ? 35 : 25,
      rainResistant: lower.includes('waterproof') || lower.includes('rain') || lower.includes('gore-tex'),
      image: null,
      source: 'Email Receipt',
      size,
      price,
    },
  };
}

/**
 * Simulate AI background removal processing on uploaded images.
 * Returns a sequence of processing states for UI animation.
 * @returns {Array<{stage: string, progress: number, message: string}>}
 */
export function getBackgroundRemovalStages() {
  return [
    { stage: 'uploading', progress: 15, message: 'Uploading garment image...' },
    { stage: 'detecting', progress: 35, message: 'AI detecting garment edges...' },
    { stage: 'segmenting', progress: 55, message: 'Segmenting fabric from background...' },
    { stage: 'refining', progress: 75, message: 'Refining edge detail & transparency...' },
    { stage: 'enhancing', progress: 90, message: 'Enhancing color accuracy...' },
    { stage: 'complete', progress: 100, message: 'Background removed successfully!' },
  ];
}

/**
 * Validate that an uploaded file is a suitable garment image.
 * @param {File} file
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateGarmentImage(file) {
  if (!file) return { valid: false, error: 'No file selected' };
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload a JPEG, PNG, or WebP image' };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: 'Image must be under 10MB' };
  }
  return { valid: true };
}
