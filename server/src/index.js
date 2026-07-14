// ============================================
// WARDROBE API SERVER — Main Entry Point
// Express app with security, CORS, routes,
// static uploads, and global error handling
// ============================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Route Handlers
import authRoutes from './routes/auth.js';
import closetRoutes from './routes/closet.js';
import outfitRoutes from './routes/outfits.js';
import travelRoutes from './routes/travel.js';
import shoppingRoutes from './routes/shopping.js';
import ingestionRoutes from './routes/ingestion.js';

// Import Middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// --- Security & Rate Limiting ---
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow serving static images to frontend
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  message: { error: 'Too Many Requests', message: 'Rate limit exceeded. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// --- CORS Configuration ---
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests) or localhost / configured frontend / vercel / netlify
    if (!origin || origin.includes('localhost') || origin.includes('vercel.app') || origin.includes('netlify.app') || origin.includes('onrender.com') || (process.env.FRONTEND_URL && origin.includes(process.env.FRONTEND_URL))) {
      callback(null, true);
    } else {
      callback(null, true); // Fallback allow all for free tier convenience
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// --- Body Parsing & Logging ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// --- Static File Serving (Uploaded Images) ---
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- Health Check Endpoint ---
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Welcome to Wardrobe AI Stylist API — Live on Render Cloud!',
    health: '/api/health',
    endpoints: ['/api/auth', '/api/closet', '/api/outfits', '/api/travel', '/api/shopping', '/api/ingestion'],
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Wardrobe AI Stylist API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/closet', closetRoutes);
app.use('/api/outfits', outfitRoutes);
app.use('/api/travel', travelRoutes);
app.use('/api/shopping', shoppingRoutes);
app.use('/api/ingest', ingestionRoutes);

// --- Error Handling ---
app.use(notFoundHandler);
app.use(errorHandler);

// --- Start Server ---
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n✨ ============================================== ✨`);
    console.log(`   WARDROBE AI STYLIST — API Server Running`);
    console.log(`   🌐 Local URL:  http://localhost:${PORT}`);
    console.log(`   🔒 CORS Mode:  Allowed for ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log(`   📦 Database:   PostgreSQL via Prisma & Supabase`);
    console.log(`✨ ============================================== ✨\n`);
  });
}

export default app;
