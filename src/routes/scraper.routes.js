import { Router } from 'express';
import { getScrapedData } from '../controllers/scraper.controller.js';

const router = Router();

// Endpoint funcional tipo GET /scrape
router.get('/scrape', getScrapedData);

export default router;