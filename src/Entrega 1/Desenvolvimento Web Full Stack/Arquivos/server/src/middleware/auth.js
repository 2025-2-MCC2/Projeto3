import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario.js';

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_muito_segura';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Generate JWT token
export function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    grupo_id: user.grupo_id
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Authentication middleware
export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de acesso requerido'
    });
  }
  
  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    // Get fresh user data
    const user = await Usuario.findById(decoded.id);
    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Token inválido'
    });
  }
}

// Authorization middleware for roles
export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Permissão insuficiente.'
      });
    }
    
    next();
  };
}

// Check if user can access resource
export function authorizeResource(req, res, next) {
  const { user } = req;
  const resourceUserId = req.params.userId || req.body.usuario_id;
  const resourceGroupId = req.params.groupId || req.body.grupo_id;
  
  // Admin can access everything
  if (user.role === 'admin') {
    return next();
  }
  
  // Mentor can access their group resources
  if (user.role === 'mentor') {
    if (resourceGroupId && resourceGroupId != user.grupo_id) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Você só pode acessar recursos do seu grupo.'
      });
    }
    return next();
  }
  
  // Student can only access their own resources
  if (user.role === 'aluno') {
    if (resourceUserId && resourceUserId != user.id) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Você só pode acessar seus próprios recursos.'
      });
    }
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Acesso negado'
  });
}

// Check if user belongs to group
export async function checkGroupAccess(req, res, next) {
  const { user } = req;
  const grupoId = req.params.grupoId || req.body.grupo_id;
  
  // Admin can access all groups
  if (user.role === 'admin') {
    return next();
  }
  
  // Check if user belongs to the group
  if (user.grupo_id != grupoId) {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Você não pertence a este grupo.'
    });
  }
  
  next();
}
