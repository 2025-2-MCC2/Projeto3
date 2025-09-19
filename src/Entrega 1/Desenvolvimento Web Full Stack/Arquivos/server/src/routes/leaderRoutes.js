import express from 'express';
import {
  getAllLeaders,
  getLeaderById,
  createLeader,
  updateLeader,
  deleteLeader
} from '../controllers/leaderController.js';

const router = express.Router();

// GET /api/leaders - Listar todos os leaders
router.get('/', getAllLeaders);

// GET /api/leaders/:id - Buscar leader por ID
router.get('/:id', getLeaderById);

// POST /api/leaders - Criar novo leader
router.post('/', createLeader);

// PUT /api/leaders/:id - Atualizar leader
router.put('/:id', updateLeader);

// DELETE /api/leaders/:id - Deletar leader
router.delete('/:id', deleteLeader);

export default router;
