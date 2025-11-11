import express from 'express';
import {
  getAllGrupos,
  getGrupoById,
  createGrupo,
  updateGrupo,
  deleteGrupo,
  getGruposDisponiveis,
  assignMentor,
  removeMentor,
  getGrupoStatistics
} from '../controllers/grupoController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// GET /api/grupos/publico - Listar grupos (Public access for registration)
router.get('/publico', getAllGrupos);

// GET /api/grupos - Listar grupos (All authenticated users)
router.get('/', authenticateToken, getAllGrupos);

// GET /api/grupos/disponiveis - Grupos sem mentor (All authenticated users)
router.get('/disponiveis', authenticateToken, getGruposDisponiveis);

// GET /api/grupos/:id - Buscar grupo por ID (All authenticated users)
router.get('/:id', authenticateToken, getGrupoById);

// POST /api/grupos - Criar grupo (Admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), createGrupo);

// PUT /api/grupos/:id - Atualizar grupo (Admin only)
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateGrupo);

// DELETE /api/grupos/:id - Deletar grupo (Admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteGrupo);

// PUT /api/grupos/:id/mentor - Atribuir mentor (Admin only)
router.put('/:id/mentor', authenticateToken, authorizeRoles('admin'), assignMentor);

// DELETE /api/grupos/:id/mentor - Remover mentor (Admin only)
router.delete('/:id/mentor', authenticateToken, authorizeRoles('admin'), removeMentor);

// GET /api/grupos/:id/estatisticas - Estatísticas do grupo (Admin, Mentor of the group)
router.get('/:id/estatisticas', authenticateToken, authorizeRoles('admin', 'mentor'), getGrupoStatistics);

export default router;
