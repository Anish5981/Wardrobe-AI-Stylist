// ============================================
// CLOSET ROUTES
// CRUD for digital closet items
// ============================================

import { Router } from 'express';
import prisma from '../config/database.js';
import authenticate from '../middleware/auth.js';
import { scoreGarmentColor } from '../engines/colorSeasonEngine.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// ---- GET /api/closet ----
// Fetch all closet items for the authenticated user
router.get('/', async (req, res, next) => {
  try {
    const { category, search, sort } = req.query;

    const where = { userId: req.user.id };
    if (category && category !== 'All') {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { colorName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy = sort === 'brand'
      ? { brand: 'asc' }
      : sort === 'category'
        ? { category: 'asc' }
        : { createdAt: 'desc' };

    const items = await prisma.closetItem.findMany({
      where,
      orderBy,
    });

    // Enrich with color season scoring if user has a season
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { colorSeason: true },
    });

    const enriched = items.map(item => {
      if (user?.colorSeason) {
        const { score, label } = scoreGarmentColor(item.color, user.colorSeason);
        return { ...item, colorScore: score, colorLabel: label };
      }
      return item;
    });

    res.json({
      items: enriched,
      count: enriched.length,
    });
  } catch (error) {
    next(error);
  }
});

// ---- GET /api/closet/:id ----
router.get('/:id', async (req, res, next) => {
  try {
    const item = await prisma.closetItem.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!item) {
      return res.status(404).json({ error: 'Not Found', message: 'Closet item not found' });
    }

    res.json({ item });
  } catch (error) {
    next(error);
  }
});

// ---- POST /api/closet ----
// Add a new item to the closet
router.post('/', async (req, res, next) => {
  try {
    const {
      name, brand, category, color, colorName,
      seasonTags, formality, weatherMin, weatherMax,
      rainResistant, snowResistant, imageUrl, sourceType, size, price,
    } = req.body;

    if (!name || !brand || !category) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Name, brand, and category are required',
      });
    }

    const item = await prisma.closetItem.create({
      data: {
        userId: req.user.id,
        name,
        brand,
        category,
        color: color || '#708090',
        colorName: colorName || 'Grey',
        seasonTags: seasonTags || ['Spring', 'Summer', 'Autumn'],
        formality: formality || 3,
        weatherMin: weatherMin ?? 5,
        weatherMax: weatherMax ?? 28,
        rainResistant: rainResistant || false,
        snowResistant: snowResistant || false,
        imageUrl,
        sourceType: sourceType || 'Manual Upload',
        size,
        price,
      },
    });

    res.status(201).json({
      message: 'Item added to closet',
      item,
    });
  } catch (error) {
    next(error);
  }
});

// ---- PUT /api/closet/:id ----
router.put('/:id', async (req, res, next) => {
  try {
    // Verify ownership
    const existing = await prisma.closetItem.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Not Found', message: 'Closet item not found' });
    }

    const item = await prisma.closetItem.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json({ message: 'Item updated', item });
  } catch (error) {
    next(error);
  }
});

// ---- DELETE /api/closet/:id ----
router.delete('/:id', async (req, res, next) => {
  try {
    const existing = await prisma.closetItem.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Not Found', message: 'Closet item not found' });
    }

    await prisma.closetItem.delete({ where: { id: req.params.id } });

    res.json({ message: 'Item removed from closet' });
  } catch (error) {
    next(error);
  }
});

// ---- GET /api/closet/stats/summary ----
// Aggregate statistics for the closet
router.get('/stats/summary', async (req, res, next) => {
  try {
    const items = await prisma.closetItem.findMany({
      where: { userId: req.user.id },
      select: { category: true, brand: true, color: true },
    });

    const categories = {};
    const brands = {};
    items.forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + 1;
      brands[item.brand] = (brands[item.brand] || 0) + 1;
    });

    res.json({
      totalItems: items.length,
      categories,
      brands,
      topBrand: Object.entries(brands).sort((a, b) => b[1] - a[1])[0]?.[0] || null,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
