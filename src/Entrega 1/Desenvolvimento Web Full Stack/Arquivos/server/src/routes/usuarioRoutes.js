import express from 'express';
import {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  getUsuariosByGrupo
} from '../controllers/usuarioController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// GET /api/usuarios - Listar usuários (Admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), getAllUsuarios);

// GET /api/usuarios/:id - Buscar usuário por ID (Admin only)
router.get('/:id', authenticateToken, authorizeRoles('admin'), getUsuarioById);

// POST /api/usuarios - Criar usuário (Admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), createUsuario);

// PUT /api/usuarios/:id - Atualizar usuário (Admin only)
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateUsuario);

// DELETE /api/usuarios/:id - Deletar usuário (Admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteUsuario);

// GET /api/usuarios/grupo/:grupoId - Listar usuários do grupo (Admin, Mentor)
router.get('/grupo/:grupoId', authenticateToken, authorizeRoles('admin', 'mentor'), getUsuariosByGrupo);

export default router;
