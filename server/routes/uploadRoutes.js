import express from 'express';
import { generateUploadUrl, generateMultipleUploadUrls } from '../controllers/uploadControllers.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';

const router = express.Router();

// Routes that require authentication
router.post('/upload', verifyAdmin, generateUploadUrl);
router.post('/urls/multiple', verifyAdmin, generateMultipleUploadUrls);
// router.get('/download/:filePath', generateDownloadUrl);

export default router;
