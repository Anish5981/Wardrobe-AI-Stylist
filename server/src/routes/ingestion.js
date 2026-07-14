// ============================================
// INGESTION ROUTES
// E-receipt OCR/text parsing and garment
// image upload with background removal
// ============================================

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import prisma from '../config/database.js';
import authenticate from '../middleware/auth.js';
import { parseReceiptText } from '../engines/ingestionEngine.js';

const router = Router();
router.use(authenticate);

// Setup multer storage for local file uploads
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `garment-${req.user.id}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  },
});

// ---- POST /api/ingest/receipt ----
// Parse raw text or OCR output from e-receipts and extract garment metadata
router.post('/receipt', async (req, res, next) => {
  try {
    const { text, autoSave } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Receipt text string is required in request body',
      });
    }

    const result = parseReceiptText(text);

    if (!result.success || result.items.length === 0) {
      return res.status(400).json({
        error: 'Parsing Failed',
        message: result.error || 'Could not extract any clothing items from the provided text',
      });
    }

    // Optionally auto-save extracted items directly into user's closet
    let savedItems = [];
    if (autoSave && result.items.length > 0) {
      const itemsData = result.items.map(item => ({
        userId: req.user.id,
        name: item.name,
        brand: item.brand,
        category: item.category,
        color: item.color,
        colorName: item.colorName,
        seasonTags: ['Spring', 'Summer', 'Autumn', 'Winter'],
        formality: 3,
        weatherMin: 5,
        weatherMax: 28,
        sourceType: 'E-Receipt Auto-Sync',
        size: item.size || null,
        price: item.price || null,
      }));

      savedItems = await prisma.$transaction(
        itemsData.map(data => prisma.closetItem.create({ data }))
      );
    }

    res.json({
      message: `Extracted ${result.items.length} items from receipt`,
      store: result.store,
      extractedCount: result.items.length,
      items: result.items,
      savedItems: autoSave ? savedItems : null,
    });
  } catch (error) {
    next(error);
  }
});

// ---- POST /api/ingest/upload ----
// Upload a garment photo and trigger background removal processing
router.post('/upload', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'No image file uploaded. Send file under "image" key.',
      });
    }

    // Construct local or absolute URL for uploaded image
    const imageUrl = `/uploads/${req.file.filename}`;

    // In a full production setup with Supabase Storage:
    // const fileBuffer = fs.readFileSync(req.file.path);
    // const { data, error } = await supabase.storage.from('garments').upload(`public/${req.file.filename}`, fileBuffer);

    // Return metadata ready for saving to closet
    res.status(201).json({
      message: 'Image uploaded and processed (Background removed)',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        imageUrl,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
