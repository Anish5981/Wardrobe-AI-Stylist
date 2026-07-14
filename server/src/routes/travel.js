// ============================================
// TRAVEL ROUTES
// Trip planning, checklist generation,
// gap detection, and checklist toggling
// ============================================

import { Router } from 'express';
import prisma from '../config/database.js';
import authenticate from '../middleware/auth.js';
import { generateTravelChecklist, getClimateForDestination } from '../engines/travelGapEngine.js';

const router = Router();
router.use(authenticate);

// ---- POST /api/travel/plan ----
// Generate a travel checklist with gap detection
router.post('/plan', async (req, res, next) => {
  try {
    const { destination, tripType, startDate, endDate } = req.body;

    if (!destination || !tripType || !startDate || !endDate) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Destination, trip type, start date, and end date are required',
      });
    }

    // Fetch user's closet for gap analysis
    const closetItems = await prisma.closetItem.findMany({
      where: { userId: req.user.id },
    });

    // Generate checklist via AI engine
    const checklist = generateTravelChecklist({
      destination,
      tripType,
      startDate,
      endDate,
      closetItems,
    });

    // Persist trip to database
    const trip = await prisma.trip.create({
      data: {
        userId: req.user.id,
        destination,
        tripType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        numDays: checklist.numDays,
        climateProfile: checklist.climate,
        wardrobeOutfits: checklist.wardrobeOutfits,
        activityGear: checklist.activityGear,
        essentials: checklist.essentials,
        gapWarnings: checklist.gaps,
      },
    });

    // Auto-add gap items to shopping list
    if (checklist.gaps.length > 0) {
      const shoppingItems = checklist.gaps.map(gap => ({
        userId: req.user.id,
        name: gap.item,
        brand: gap.suggestedBrand,
        category: 'Outerwear',
        color: '#4A4A4A',
        colorName: 'Grey',
        price: gap.estimatedPrice,
        reason: gap.reason,
        affiliateUrl: '#',
        store: `${gap.suggestedBrand} Official`,
        gapType: 'travel',
      }));

      await prisma.shoppingItem.createMany({ data: shoppingItems });
    }

    res.status(201).json({
      message: 'Trip planned successfully',
      trip,
      gapsFound: checklist.gaps.length,
      gapsAddedToShop: checklist.gaps.length,
    });
  } catch (error) {
    next(error);
  }
});

// ---- GET /api/travel ----
// Fetch all trips
router.get('/', async (req, res, next) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ trips, count: trips.length });
  } catch (error) {
    next(error);
  }
});

// ---- GET /api/travel/:id ----
router.get('/:id', async (req, res, next) => {
  try {
    const trip = await prisma.trip.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!trip) {
      return res.status(404).json({ error: 'Not Found', message: 'Trip not found' });
    }

    res.json({ trip });
  } catch (error) {
    next(error);
  }
});

// ---- PUT /api/travel/:id ----
// Update trip (toggle checklist items, update details)
router.put('/:id', async (req, res, next) => {
  try {
    const existing = await prisma.trip.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Not Found', message: 'Trip not found' });
    }

    const { activityGear, essentials, wardrobeOutfits, ...otherFields } = req.body;

    const trip = await prisma.trip.update({
      where: { id: req.params.id },
      data: {
        ...(activityGear !== undefined && { activityGear }),
        ...(essentials !== undefined && { essentials }),
        ...(wardrobeOutfits !== undefined && { wardrobeOutfits }),
        ...otherFields,
      },
    });

    res.json({ message: 'Trip updated', trip });
  } catch (error) {
    next(error);
  }
});

// ---- DELETE /api/travel/:id ----
router.delete('/:id', async (req, res, next) => {
  try {
    const existing = await prisma.trip.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Not Found', message: 'Trip not found' });
    }

    await prisma.trip.delete({ where: { id: req.params.id } });
    res.json({ message: 'Trip deleted' });
  } catch (error) {
    next(error);
  }
});

// ---- GET /api/travel/climate/:destination ----
// Preview climate data for a destination
router.get('/climate/:destination', async (req, res) => {
  const climate = getClimateForDestination(req.params.destination);
  res.json({ climate });
});

export default router;
