import express from 'express';
import {
  getAllDoacoes,
  getDoacaoById,
  createDoacao,
  updateDoacao,
  aprovarDoacao,
  rejeitarDoacao,
  deleteDoacao,
  getDoacoesPendentes,
  getEstatisticas
} from '../controllers/doacaoController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// GET /api/doacoes - Listar doações (All authenticated users with role-based filtering)
router.get('/', authenticateToken, getAllDoacoes);

// GET /api/doacoes/pendentes - Doações pendentes (Mentor only)
router.get('/pendentes', authenticateToken, authorizeRoles('mentor'), getDoacoesPendentes);

// GET /api/doacoes/estatisticas - Estatísticas das doações (Admin, Mentor)
router.get('/estatisticas', authenticateToken, authorizeRoles('admin', 'mentor'), getEstatisticas);

// GET /api/doacoes/:id - Buscar doação por ID (All authenticated users with access control)
router.get('/:id', authenticateToken, getDoacaoById);

// POST /api/doacoes - Criar doação (Aluno only)
router.post('/', authenticateToken, authorizeRoles('aluno'), createDoacao);

// PUT /api/doacoes/:id - Atualizar doação (Aluno only, own donations, pending only)
router.put('/:id', authenticateToken, authorizeRoles('aluno'), updateDoacao);

// PUT /api/doacoes/:id/aprovar - Aprovar doação (Mentor only, own group)
router.put('/:id/aprovar', authenticateToken, authorizeRoles('mentor'), aprovarDoacao);

// PUT /api/doacoes/:id/rejeitar - Rejeitar doação (Mentor only, own group)
router.put('/:id/rejeitar', authenticateToken, authorizeRoles('mentor'), rejeitarDoacao);

// DELETE /api/doacoes/:id - Deletar doação (Admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteDoacao);

export default router;
