// ============================================
// SHOPPING ROUTES
// Smart shopping list CRUD with affiliate
// tracking and gap type filtering
// ============================================

import { Router } from 'express';
import prisma from '../config/database.js';
import authenticate from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

// ---- GET /api/shopping ----
// Fetch shopping list with optional gap type filter
router.get('/', async (req, res, next) => {
  try {
    const { gapType, purchased } = req.query;

    const where = { userId: req.user.id };
    if (gapType && gapType !== 'all') {
      where.gapType = gapType;
    }
    if (purchased !== undefined) {
      where.purchased = purchased === 'true';
    }

    const items = await prisma.shoppingItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Aggregate counts
    const allItems = await prisma.shoppingItem.findMany({
      where: { userId: req.user.id },
      select: { gapType: true },
    });

    const counts = {
      total: allItems.length,
      travel: allItems.filter(i => i.gapType === 'travel').length,
      daily: allItems.filter(i => i.gapType === 'daily').length,
    };

    res.json({ items, counts });
  } catch (error) {
    next(error);
  }
});

// ---- POST /api/shopping ----
// Add item to shopping list
router.post('/', async (req, res, next) => {
  try {
    const { name, brand, category, color, colorName, price, reason, affiliateUrl, store, gapType } = req.body;

    if (!name || !brand) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Name and brand are required',
      });
    }

    const item = await prisma.shoppingItem.create({
      data: {
        userId: req.user.id,
        name,
        brand,
        category: category || 'Other',
        color: color || '#708090',
        colorName: colorName || 'Grey',
        price,
        reason,
        affiliateUrl,
        store,
        gapType: gapType || 'daily',
      },
    });

    res.status(201).json({ message: 'Item added to shopping list', item });
  } catch (error) {
    next(error);
  }
});

// ---- PUT /api/shopping/:id ----
// Update item (e.g., mark as purchased)
router.put('/:id', async (req, res, next) => {
  try {
    const existing = await prisma.shoppingItem.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Not Found', message: 'Shopping item not found' });
    }

    const item = await prisma.shoppingItem.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json({ message: 'Shopping item updated', item });
  } catch (error) {
    next(error);
  }
});

// ---- DELETE /api/shopping/:id ----
router.delete('/:id', async (req, res, next) => {
  try {
    const existing = await prisma.shoppingItem.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Not Found', message: 'Shopping item not found' });
    }

    await prisma.shoppingItem.delete({ where: { id: req.params.id } });
    res.json({ message: 'Item removed from shopping list' });
  } catch (error) {
    next(error);
  }
});

// ---- POST /api/shopping/:id/track-click ----
// Track affiliate link click for monetization analytics
router.post('/:id/track-click', async (req, res, next) => {
  try {
    const item = await prisma.shoppingItem.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!item) {
      return res.status(404).json({ error: 'Not Found' });
    }

    // In production, this would log to an analytics table
    console.log(`[AFFILIATE CLICK] User: ${req.user.id} | Item: ${item.name} | Store: ${item.store} | URL: ${item.affiliateUrl}`);

    res.json({
      message: 'Click tracked',
      redirectUrl: item.affiliateUrl || '#',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
