// ============================================
// OUTFIT ROUTES
// AI outfit generation, lookbook CRUD
// ============================================

import { Router } from 'express';
import prisma from '../config/database.js';
import authenticate from '../middleware/auth.js';
import { generateOutfit, getLayeringAdvice } from '../engines/outfitEngine.js';

const router = Router();
router.use(authenticate);

// ---- POST /api/outfits/generate ----
// Generate an AI outfit from the user's closet
router.post('/generate', async (req, res, next) => {
  try {
    const { weather, occasion, city, temperature } = req.body;

    if (!occasion) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Occasion is required (e.g., "Smart Casual", "Business Formal")',
      });
    }

    // Fetch user's closet items and color season
    const [items, user] = await Promise.all([
      prisma.closetItem.findMany({ where: { userId: req.user.id } }),
      prisma.user.findUnique({
        where: { id: req.user.id },
        select: { colorSeason: true },
      }),
    ]);

    if (items.length === 0) {
      return res.status(400).json({
        error: 'Empty Closet',
        message: 'Add items to your closet before generating outfits',
      });
    }

    const outfit = generateOutfit(items, {
      weather: weather || 'Mild',
      occasion,
      colorSeason: user?.colorSeason,
      temperature: temperature ?? 18,
    });

    if (!outfit.success) {
      return res.status(400).json({ error: 'Generation Failed', message: outfit.error });
    }

    // Include city & layering advice
    outfit.city = city || null;
    outfit.layeringAdvice = getLayeringAdvice(temperature ?? 18, weather || 'Mild');

    res.json({ outfit });
  } catch (error) {
    next(error);
  }
});

// ---- POST /api/outfits ----
// Save a generated outfit to the lookbook
router.post('/', async (req, res, next) => {
  try {
    const { occasion, weather, city, temperature, commentary, pieces } = req.body;

    if (!occasion || !pieces || !Array.isArray(pieces) || pieces.length === 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Occasion and at least one piece are required',
      });
    }

    const outfit = await prisma.outfit.create({
      data: {
        userId: req.user.id,
        occasion,
        weather: weather || 'Mild',
        city,
        temperature,
        commentary,
        pieces: {
          create: pieces.map(p => ({
            closetItemId: p.closetItemId,
            slot: p.slot,
          })),
        },
      },
      include: {
        pieces: {
          include: { closetItem: true },
        },
      },
    });

    res.status(201).json({ message: 'Outfit saved to Lookbook', outfit });
  } catch (error) {
    next(error);
  }
});

// ---- GET /api/outfits ----
// Fetch all saved outfits (lookbook)
router.get('/', async (req, res, next) => {
  try {
    const outfits = await prisma.outfit.findMany({
      where: { userId: req.user.id },
      include: {
        pieces: {
          include: { closetItem: true },
        },
      },
      orderBy: { generatedAt: 'desc' },
    });

    res.json({ outfits, count: outfits.length });
  } catch (error) {
    next(error);
  }
});

// ---- DELETE /api/outfits/:id ----
router.delete('/:id', async (req, res, next) => {
  try {
    const outfit = await prisma.outfit.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!outfit) {
      return res.status(404).json({ error: 'Not Found', message: 'Outfit not found' });
    }

    await prisma.outfit.delete({ where: { id: req.params.id } });
    res.json({ message: 'Outfit removed from Lookbook' });
  } catch (error) {
    next(error);
  }
});

// ---- GET /api/outfits/layering/:temp ----
// Get layering advice for a temperature
router.get('/layering/:temp', async (req, res) => {
  const temp = parseInt(req.params.temp);
  if (isNaN(temp)) {
    return res.status(400).json({ error: 'Invalid temperature' });
  }
  const advice = getLayeringAdvice(temp, req.query.condition || 'Mild');
  res.json({ advice });
});

export default router;
