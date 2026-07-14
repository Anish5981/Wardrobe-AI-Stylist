// ============================================
// AUTH MIDDLEWARE
// JWT verification with Supabase + fallback
// local JWT for development without Supabase
// ============================================

import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';
import prisma from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

/**
 * Authentication middleware.
 * Validates JWT from Authorization header and attaches user to request.
 * Supports both Supabase JWTs and local JWTs.
 */
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please provide a valid Bearer token in the Authorization header',
      });
    }

    const token = authHeader.split(' ')[1];

    // Attempt 1: Verify with Supabase
    if (process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('localhost')) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (user && !error) {
          req.user = { id: user.id, email: user.email };
          req.token = token;
          return next();
        }
      } catch {
        // Fall through to local JWT verification
      }
    }

    // Attempt 2: Verify with local JWT secret
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = { id: decoded.id, email: decoded.email };
      req.token = token;
      return next();
    } catch (jwtError) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Your session has expired. Please log in again.',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: 'Authentication error',
      message: 'An unexpected error occurred during authentication',
    });
  }
}

/**
 * Generate a local JWT token for development/testing.
 * In production, Supabase Auth handles token generation.
 */
export function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

/**
 * Optional auth — attaches user if token present, but doesn't block.
 */
export async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = { id: decoded.id, email: decoded.email };
      req.token = token;
    } catch {
      // Token invalid, proceed without user
    }
  }
  next();
}

export default authenticate;
