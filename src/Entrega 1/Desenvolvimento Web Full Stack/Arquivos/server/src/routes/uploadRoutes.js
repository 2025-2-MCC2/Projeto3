import express from 'express';
import { uploadDonationFiles, getUploadInfo } from '../controllers/uploadController.js';
import { 
  uploadDonationFiles as uploadMiddleware, 
  handleUploadError,
  serveUploadedFile 
} from '../middleware/upload.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// GET /api/upload/info - Informações sobre upload (público)
router.get('/info', getUploadInfo);

// POST /api/upload/donation-files - Upload de arquivos de doação (autenticado)
router.post('/donation-files', 
  authenticateToken,
  authorizeRoles('aluno', 'mentor', 'admin'),
  uploadMiddleware,
  handleUploadError,
  uploadDonationFiles
);

// GET /api/uploads/:filename - Servir arquivos estáticos
router.get('/:filename', serveUploadedFile);

export default router;
