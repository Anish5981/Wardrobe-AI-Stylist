// ============================================
// WARDROBE — Master Mock Data Layer
// Pre-seeded high-fashion catalog, user personas,
// climate profiles, and affiliate recommendations
// ============================================

// ---- Color Season Palettes ----
export const COLOR_SEASONS = {
  'Winter Jewel': {
    name: 'Winter Jewel',
    description: 'Bold, high-contrast hues that complement cool, deep undertones',
    undertones: ['Cool'],
    harmonious: ['#1B1B1B', '#FFFFFF', '#1C3A5F', '#6B1D3A', '#0D4D4D', '#2E1A47', '#8B0000', '#C0C0C0', '#003366', '#4A0E2E'],
    avoid: ['#F5DEB3', '#FFD700', '#FF8C00', '#FFDAB9', '#E6C87A'],
    emoji: '❄️',
  },
  'Summer Soft': {
    name: 'Summer Soft',
    description: 'Muted, cool-toned pastels with a soft, elegant presence',
    undertones: ['Cool', 'Neutral'],
    harmonious: ['#B0C4DE', '#C8A2C8', '#708090', '#778899', '#D8BFD8', '#87CEEB', '#DDA0DD', '#A9A9A9', '#E6E6FA', '#AFEEEE'],
    avoid: ['#FF4500', '#FF6347', '#FFD700', '#FF8C00', '#8B0000'],
    emoji: '🌸',
  },
  'Autumn Earth': {
    name: 'Autumn Earth',
    description: 'Rich, warm earthy tones that ground a warm, golden complexion',
    undertones: ['Warm'],
    harmonious: ['#8B4513', '#D2691E', '#556B2F', '#B8860B', '#A0522D', '#6B8E23', '#CD853F', '#704214', '#2E4A1E', '#DAA520'],
    avoid: ['#FF69B4', '#E6E6FA', '#87CEEB', '#C0C0C0', '#000080'],
    emoji: '🍂',
  },
  'Spring Pastel': {
    name: 'Spring Pastel',
    description: 'Warm, clear, and vibrant pastels with a fresh energy',
    undertones: ['Warm', 'Neutral'],
    harmonious: ['#FF6B6B', '#FFA07A', '#98FB98', '#FFD700', '#87CEEB', '#F0E68C', '#FF7F50', '#DDA0DD', '#40E0D0', '#FFDAB9'],
    avoid: ['#1B1B1B', '#2E1A47', '#1C3A5F', '#4A0E2E', '#36454F'],
    emoji: '🌷',
  },
};

// ---- User Personas ----
export const DEMO_USERS = {
  elena: {
    id: 'user_elena',
    name: 'Elena Marchetti',
    persona: 'Minimalist Chic',
    gender: 'Female',
    bodyType: 'Hourglass',
    height: "5'7\"",
    weight: '135 lbs',
    skinTone: 'Fair / Porcelain',
    undertone: 'Cool',
    colorSeason: 'Winter Jewel',
    avatar: '👩🏻',
  },
  marcus: {
    id: 'user_marcus',
    name: 'Marcus Chen',
    persona: 'Urban Tailored',
    gender: 'Male',
    bodyType: 'Athletic',
    height: "5'11\"",
    weight: '175 lbs',
    skinTone: 'Medium / Olive',
    undertone: 'Warm',
    colorSeason: 'Autumn Earth',
    avatar: '👨🏻',
  },
};

// ---- Closet Item Categories ----
export const CATEGORIES = ['Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Accessories', 'Dresses', 'Activewear'];

export const OCCASIONS = ['Business Formal', 'Smart Casual', 'Casual', 'Date Night', 'Gallery Opening', 'Brunch', 'Travel', 'Workout', 'Beach'];

export const WEATHER_CONDITIONS = ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Windy', 'Hot & Humid', 'Mild'];

// ---- Closet Items (Pre-seeded) ----
export const CLOSET_ITEMS = [
  // -- Tops --
  { id: 'item_001', name: 'Ribbed Merino Turtleneck', brand: 'COS', category: 'Tops', color: '#1B1B1B', colorName: 'Jet Black', seasonTags: ['Autumn', 'Winter'], formality: 4, weatherMin: -5, weatherMax: 15, rainResistant: false, image: null, source: 'Manual Upload' },
  { id: 'item_002', name: 'Oversized Poplin Shirt', brand: 'Totême', category: 'Tops', color: '#FFFFFF', colorName: 'Pure White', seasonTags: ['Spring', 'Summer'], formality: 3, weatherMin: 15, weatherMax: 35, rainResistant: false, image: null, source: 'Email Receipt' },
  { id: 'item_003', name: 'Silk Blend Camp Collar', brand: 'Lemaire', category: 'Tops', color: '#D2B48C', colorName: 'Tan', seasonTags: ['Spring', 'Summer'], formality: 3, weatherMin: 18, weatherMax: 32, rainResistant: false, image: null, source: 'Manual Upload' },
  { id: 'item_004', name: 'Brushed Cotton Henley', brand: 'Arket', category: 'Tops', color: '#708090', colorName: 'Slate Grey', seasonTags: ['Autumn', 'Winter', 'Spring'], formality: 2, weatherMin: 5, weatherMax: 22, rainResistant: false, image: null, source: 'Email Receipt' },
  { id: 'item_005', name: 'Cashmere V-Neck Sweater', brand: 'Acne Studios', category: 'Tops', color: '#2E1A47', colorName: 'Deep Plum', seasonTags: ['Autumn', 'Winter'], formality: 4, weatherMin: -5, weatherMax: 15, rainResistant: false, image: null, source: 'Manual Upload' },

  // -- Bottoms --
  { id: 'item_006', name: 'Relaxed Wool Trousers', brand: 'Lemaire', category: 'Bottoms', color: '#36454F', colorName: 'Charcoal', seasonTags: ['Autumn', 'Winter', 'Spring'], formality: 4, weatherMin: 0, weatherMax: 22, rainResistant: false, image: null, source: 'Manual Upload' },
  { id: 'item_007', name: 'Straight-Leg Raw Denim', brand: 'Acne Studios', category: 'Bottoms', color: '#191970', colorName: 'Indigo', seasonTags: ['Spring', 'Summer', 'Autumn'], formality: 2, weatherMin: 5, weatherMax: 28, rainResistant: false, image: null, source: 'Email Receipt' },
  { id: 'item_008', name: 'Linen Wide-Leg Pants', brand: 'COS', category: 'Bottoms', color: '#F5F5DC', colorName: 'Natural Linen', seasonTags: ['Summer'], formality: 3, weatherMin: 22, weatherMax: 38, rainResistant: false, image: null, source: 'Manual Upload' },
  { id: 'item_009', name: 'Tailored Chinos', brand: 'Arket', category: 'Bottoms', color: '#556B2F', colorName: 'Olive', seasonTags: ['Spring', 'Autumn'], formality: 3, weatherMin: 10, weatherMax: 28, rainResistant: false, image: null, source: 'Manual Upload' },

  // -- Outerwear --
  { id: 'item_010', name: 'Structured Wool Overcoat', brand: 'COS', category: 'Outerwear', color: '#2C2C2C', colorName: 'Charcoal Black', seasonTags: ['Autumn', 'Winter'], formality: 5, weatherMin: -10, weatherMax: 10, rainResistant: false, image: null, source: 'Manual Upload' },
  { id: 'item_011', name: 'Cotton Trench Coat', brand: 'Totême', category: 'Outerwear', color: '#C3B091', colorName: 'Khaki', seasonTags: ['Spring', 'Autumn'], formality: 4, weatherMin: 8, weatherMax: 20, rainResistant: true, image: null, source: 'Email Receipt' },
  { id: 'item_012', name: 'Quilted Liner Jacket', brand: 'Arket', category: 'Outerwear', color: '#4A4A4A', colorName: 'Dark Grey', seasonTags: ['Autumn', 'Winter', 'Spring'], formality: 2, weatherMin: 0, weatherMax: 15, rainResistant: false, image: null, source: 'Manual Upload' },
  { id: 'item_013', name: 'Gore-Tex Shell Jacket', brand: 'Salomon', category: 'Outerwear', color: '#1C3A5F', colorName: 'Deep Navy', seasonTags: ['Winter', 'Spring'], formality: 1, weatherMin: -15, weatherMax: 12, rainResistant: true, image: null, source: 'Manual Upload' },

  // -- Footwear --
  { id: 'item_014', name: 'Leather Chelsea Boots', brand: 'COS', category: 'Footwear', color: '#1B1B1B', colorName: 'Black', seasonTags: ['Autumn', 'Winter', 'Spring'], formality: 4, weatherMin: -5, weatherMax: 18, rainResistant: false, image: null, source: 'Manual Upload' },
  { id: 'item_015', name: 'Minimalist White Sneakers', brand: 'Acne Studios', category: 'Footwear', color: '#FFFFFF', colorName: 'White', seasonTags: ['Spring', 'Summer'], formality: 2, weatherMin: 10, weatherMax: 32, rainResistant: false, image: null, source: 'Email Receipt' },
  { id: 'item_016', name: 'Suede Loafers', brand: 'Lemaire', category: 'Footwear', color: '#8B6914', colorName: 'Cognac', seasonTags: ['Spring', 'Summer', 'Autumn'], formality: 3, weatherMin: 12, weatherMax: 30, rainResistant: false, image: null, source: 'Manual Upload' },
  { id: 'item_017', name: 'Trail Running Shoes', brand: 'Salomon', category: 'Footwear', color: '#2E4A1E', colorName: 'Forest', seasonTags: ['Spring', 'Summer', 'Autumn'], formality: 1, weatherMin: 0, weatherMax: 35, rainResistant: true, image: null, source: 'Manual Upload' },

  // -- Accessories --
  { id: 'item_018', name: 'Cashmere Scarf', brand: 'Acne Studios', category: 'Accessories', color: '#708090', colorName: 'Grey Melange', seasonTags: ['Autumn', 'Winter'], formality: 3, weatherMin: -10, weatherMax: 12, rainResistant: false, image: null, source: 'Manual Upload' },
  { id: 'item_019', name: 'Leather Tote Bag', brand: 'Totême', category: 'Accessories', color: '#1B1B1B', colorName: 'Black', seasonTags: ['Spring', 'Summer', 'Autumn', 'Winter'], formality: 4, weatherMin: -15, weatherMax: 40, rainResistant: false, image: null, source: 'Email Receipt' },
  { id: 'item_020', name: 'UV400 Sunglasses', brand: 'Acne Studios', category: 'Accessories', color: '#2C2C2C', colorName: 'Matte Black', seasonTags: ['Spring', 'Summer'], formality: 3, weatherMin: 15, weatherMax: 40, rainResistant: false, image: null, source: 'Manual Upload' },
  { id: 'item_021', name: 'Wool Beanie', brand: 'Arket', category: 'Accessories', color: '#36454F', colorName: 'Charcoal', seasonTags: ['Autumn', 'Winter'], formality: 2, weatherMin: -15, weatherMax: 8, rainResistant: false, image: null, source: 'Manual Upload' },

  // -- Activewear --
  { id: 'item_022', name: 'Performance Running Tee', brand: 'Salomon', category: 'Activewear', color: '#2E4A1E', colorName: 'Forest Green', seasonTags: ['Spring', 'Summer'], formality: 1, weatherMin: 10, weatherMax: 35, rainResistant: false, image: null, source: 'Manual Upload' },
  { id: 'item_023', name: 'Stretch Training Shorts', brand: 'Arket', category: 'Activewear', color: '#1B1B1B', colorName: 'Black', seasonTags: ['Spring', 'Summer'], formality: 1, weatherMin: 15, weatherMax: 38, rainResistant: false, image: null, source: 'Manual Upload' },

  // -- Dresses --
  { id: 'item_024', name: 'Drape Midi Dress', brand: 'Totême', category: 'Dresses', color: '#1B1B1B', colorName: 'Black', seasonTags: ['Spring', 'Summer', 'Autumn'], formality: 4, weatherMin: 12, weatherMax: 30, rainResistant: false, image: null, source: 'Manual Upload' },
  { id: 'item_025', name: 'Linen Shirt Dress', brand: 'COS', category: 'Dresses', color: '#F5F5DC', colorName: 'Natural', seasonTags: ['Summer'], formality: 3, weatherMin: 22, weatherMax: 38, rainResistant: false, image: null, source: 'Email Receipt' },
];

// ---- Climate Profiles for Travel Destinations ----
export const CLIMATE_DATA = {
  'Tokyo, Japan – Autumn': { avgTemp: 16, condition: 'Mild', precipitation: 'Light Rain', humidity: 65, season: 'Autumn', windSpeed: 12 },
  'Swiss Alps – Winter': { avgTemp: -4, condition: 'Snowy', precipitation: 'Heavy Snow', humidity: 70, season: 'Winter', windSpeed: 25 },
  'Bali, Indonesia – Wet Season': { avgTemp: 28, condition: 'Hot & Humid', precipitation: 'Heavy Rain', humidity: 85, season: 'Summer', windSpeed: 8 },
  'Paris, France – Spring': { avgTemp: 14, condition: 'Mild', precipitation: 'Light Rain', humidity: 60, season: 'Spring', windSpeed: 15 },
  'New York, USA – Spring': { avgTemp: 12, condition: 'Mild', precipitation: 'Occasional Rain', humidity: 55, season: 'Spring', windSpeed: 18 },
  'Barcelona, Spain – Summer': { avgTemp: 27, condition: 'Sunny', precipitation: 'None', humidity: 60, season: 'Summer', windSpeed: 10 },
  'Reykjavik, Iceland – Winter': { avgTemp: -1, condition: 'Windy', precipitation: 'Sleet & Snow', humidity: 75, season: 'Winter', windSpeed: 35 },
  'Cape Town, SA – Summer': { avgTemp: 24, condition: 'Sunny', precipitation: 'None', humidity: 50, season: 'Summer', windSpeed: 20 },
  'Patagonia – Autumn': { avgTemp: 6, condition: 'Windy', precipitation: 'Light Rain', humidity: 65, season: 'Autumn', windSpeed: 40 },
  'Kyoto, Japan – Spring': { avgTemp: 15, condition: 'Mild', precipitation: 'Light Rain', humidity: 60, season: 'Spring', windSpeed: 10 },
};

// ---- Trip Types & Required Gear ----
export const TRIP_TYPES = {
  'Trekking / Hiking': {
    gear: ['Hiking Boots', 'Backpack (40L+)', 'Rain Cover', 'Trekking Poles', 'Headlamp', 'First Aid Kit', 'Water Bottle', 'Quick-Dry Towel'],
    essentials: ['Passport', 'Travel Insurance', 'Phone Charger', 'Sunscreen SPF50', 'Insect Repellent'],
    weatherOverrides: { rain: ['Waterproof Shell Jacket', 'Rain Poncho', 'Waterproof Pants'], cold: ['Thermal Base Layer', 'Insulated Down Jacket', 'Warm Gloves', 'Merino Wool Socks'] },
  },
  'Beach Vacation': {
    gear: ['Swimwear', 'Beach Towel', 'Snorkel Gear', 'Flip Flops', 'Waterproof Phone Case', 'Cooler Bag'],
    essentials: ['Passport', 'Sunscreen SPF50', 'After-Sun Lotion', 'Phone Charger', 'Sunglasses', 'Travel Adapter'],
    weatherOverrides: { rain: ['Light Rain Jacket', 'Umbrella'], cold: [] },
  },
  'Business Conference': {
    gear: ['Laptop Bag', 'Notebook & Pen', 'Business Cards', 'Portable Charger', 'Presentation Clicker'],
    essentials: ['Passport', 'Phone Charger', 'Travel Adapter', 'Toiletries Kit', 'Garment Bag'],
    weatherOverrides: { rain: ['Compact Umbrella'], cold: ['Wool Overcoat'] },
  },
  'Ski Trip': {
    gear: ['Ski Goggles', 'Ski Gloves', 'Helmet', 'Neck Gaiter', 'Hand Warmers', 'Ski Pass Holder', 'Boot Bag'],
    essentials: ['Passport', 'Travel Insurance', 'Lip Balm SPF', 'Sunscreen SPF50', 'Phone Charger'],
    weatherOverrides: { rain: [], cold: ['Thermal Base Layer', 'Insulated Ski Jacket', 'Ski Pants', 'Heavy Wool Socks', 'Insulated Down Vest'] },
  },
  'City Exploration': {
    gear: ['Daypack', 'Comfortable Walking Shoes', 'Reusable Water Bottle', 'Portable Charger', 'Guidebook / Maps'],
    essentials: ['Passport', 'Phone Charger', 'Travel Adapter', 'Toiletries Kit', 'Medications'],
    weatherOverrides: { rain: ['Compact Umbrella', 'Light Rain Jacket'], cold: ['Warm Scarf', 'Insulated Jacket'] },
  },
};

// ---- Affiliate Shopping Recommendations ----
export const SHOPPING_RECOMMENDATIONS = [
  { id: 'shop_001', name: 'Waterproof Shell Jacket', brand: 'Arc\'teryx', category: 'Outerwear', color: '#1C3A5F', colorName: 'Storm Navy', price: '$450', reason: 'Missing for rainy-season treks', affiliateUrl: '#', store: 'SSENSE', gapType: 'travel' },
  { id: 'shop_002', name: 'Merino Wool Base Layer', brand: 'Icebreaker', category: 'Tops', color: '#1B1B1B', colorName: 'Black', price: '$100', reason: 'Essential thermal layer for alpine conditions', affiliateUrl: '#', store: 'REI', gapType: 'travel' },
  { id: 'shop_003', name: 'Tailored Blazer', brand: 'COS', category: 'Outerwear', color: '#36454F', colorName: 'Charcoal', price: '$250', reason: 'Elevates smart-casual and date night looks', affiliateUrl: '#', store: 'COS Official', gapType: 'daily' },
  { id: 'shop_004', name: 'Silk Pocket Square', brand: 'Drake\'s', category: 'Accessories', color: '#6B1D3A', colorName: 'Burgundy', price: '$75', reason: 'Adds formal finishing to business outfits', affiliateUrl: '#', store: 'Mr Porter', gapType: 'daily' },
  { id: 'shop_005', name: 'Insulated Down Vest', brand: 'Patagonia', category: 'Outerwear', color: '#2E4A1E', colorName: 'Forest Green', price: '$200', reason: 'Versatile layering for skiing & hiking', affiliateUrl: '#', store: 'Nordstrom', gapType: 'travel' },
  { id: 'shop_006', name: 'Leather Belt', brand: 'Acne Studios', category: 'Accessories', color: '#1B1B1B', colorName: 'Black', price: '$180', reason: 'Core wardrobe essential missing from closet', affiliateUrl: '#', store: 'SSENSE', gapType: 'daily' },
  { id: 'shop_007', name: 'Canvas Tote (Travel)', brand: 'Aesther Ekme', category: 'Accessories', color: '#C3B091', colorName: 'Sand', price: '$285', reason: 'Lightweight travel carry-on alternative', affiliateUrl: '#', store: 'Net-a-Porter', gapType: 'travel' },
  { id: 'shop_008', name: 'Rain Poncho (Packable)', brand: 'Rains', category: 'Outerwear', color: '#4A4A4A', colorName: 'Smoke', price: '$85', reason: 'Critical for monsoon treks and wet-season travel', affiliateUrl: '#', store: 'Rains Official', gapType: 'travel' },
];

// ---- Complexion Options ----
export const SKIN_TONES = ['Very Fair / Porcelain', 'Fair / Light', 'Light Medium', 'Medium', 'Medium / Olive', 'Tan', 'Deep / Dark', 'Very Deep / Ebony'];

export const UNDERTONES = ['Cool (Pink / Blue undertones)', 'Warm (Yellow / Golden undertones)', 'Neutral (Mix of both)'];

export const BODY_TYPES = ['Slim / Ectomorph', 'Athletic / Mesomorph', 'Stocky / Endomorph', 'Hourglass', 'Pear', 'Apple', 'Rectangle', 'Inverted Triangle'];

export const GENDERS = ['Male', 'Female', 'Non-Binary', 'Prefer not to say'];

// ---- Formality Labels ----
export const FORMALITY_LABELS = {
  1: 'Athletic / Casual',
  2: 'Casual',
  3: 'Smart Casual',
  4: 'Business / Semi-Formal',
  5: 'Formal / Black Tie',
};
