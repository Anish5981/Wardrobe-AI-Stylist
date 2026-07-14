// ============================================
// AUTH ROUTES
// Signup, Login, Profile management
// ============================================

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { authenticate, generateToken } from '../middleware/auth.js';
import { determineColorSeason } from '../engines/colorSeasonEngine.js';

const router = Router();

// ---- POST /api/auth/signup ----
router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email, password, and name are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Password must be at least 6 characters',
      });
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'An account with this email already exists',
      });
    }

    // Hash password & create user
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, passwordHash, name },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        onboardingDone: true,
        createdAt: true,
      },
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'Account created successfully',
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
});

// ---- POST /api/auth/login ----
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email and password are required',
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({
        error: 'Invalid Credentials',
        message: 'No account found with this email',
      });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({
        error: 'Invalid Credentials',
        message: 'Incorrect password',
      });
    }

    const token = generateToken(user);

    const { passwordHash, ...safeUser } = user;
    res.json({
      message: 'Login successful',
      user: safeUser,
      token,
    });
  } catch (error) {
    next(error);
  }
});

// ---- GET /api/auth/profile ----
router.get('/profile', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, email: true, name: true, gender: true,
        bodyType: true, height: true, weight: true,
        skinTone: true, undertone: true, colorSeason: true,
        avatar: true, onboardingDone: true, createdAt: true,
        _count: { select: { closetItems: true, outfits: true, trips: true, shoppingItems: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Not Found', message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// ---- PUT /api/auth/profile ----
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const { gender, bodyType, height, weight, skinTone, undertone, name, avatar } = req.body;

    // Auto-compute color season if complexion data provided
    let colorSeason;
    if (skinTone && undertone) {
      colorSeason = determineColorSeason(skinTone, undertone);
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(gender && { gender }),
        ...(bodyType && { bodyType }),
        ...(height && { height }),
        ...(weight && { weight }),
        ...(skinTone && { skinTone }),
        ...(undertone && { undertone }),
        ...(colorSeason && { colorSeason }),
        ...(avatar && { avatar }),
        onboardingDone: true,
      },
      select: {
        id: true, email: true, name: true, gender: true,
        bodyType: true, height: true, weight: true,
        skinTone: true, undertone: true, colorSeason: true,
        avatar: true, onboardingDone: true,
      },
    });

    res.json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
