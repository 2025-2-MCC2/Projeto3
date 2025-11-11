import { Usuario } from '../models/Usuario.js';
import { generateToken } from '../middleware/auth.js';

// POST /api/auth/login
export async function login(req, res) {
  try {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }
    
    // Validate user credentials
    const user = await Usuario.validatePassword(email, senha);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Return user data without password
    const userData = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      grupo_id: user.grupo_id,
      grupo_nome: user.grupo_nome
    };
    
    res.json({
      success: true,
      data: {
        user: userData,
        token
      },
      message: 'Login realizado com sucesso'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// POST /api/auth/register
export async function register(req, res) {
  try {
    const { nome, email, senha, role, grupo_id } = req.body;
    
    // Validation
    if (!nome || !email || !senha || !role) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email, senha e role são obrigatórios'
      });
    }
    
    // Prevent creating admin accounts
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Não é possível criar contas de administrador'
      });
    }
    
    // Validate role (only mentor and aluno allowed)
    if (!['mentor', 'aluno'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role deve ser mentor ou aluno'
      });
    }
    
    // Group is MANDATORY for mentor and aluno
    if (!grupo_id) {
      return res.status(400).json({
        success: false,
        message: 'Seleção de grupo é obrigatória para criar uma conta'
      });
    }
    
    // Validate if group exists
    const { Grupo } = await import('../models/Grupo.js');
    const grupo = await Grupo.findById(grupo_id);
    if (!grupo) {
      return res.status(400).json({
        success: false,
        message: 'Grupo selecionado não existe'
      });
    }
    
    // Check if group already has a mentor (for mentor role)
    if (role === 'mentor' && grupo.mentor_id) {
      return res.status(400).json({
        success: false,
        message: 'Este grupo já possui um mentor. Escolha outro grupo.'
      });
    }
    
    // Check if email already exists
    const existingUser = await Usuario.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email já está em uso'
      });
    }
    
    // Create user
    const user = await Usuario.create({
      nome,
      email,
      senha,
      role,
      grupo_id
    });
    
    // Generate token
    const token = generateToken(user);
    
    // Return user data without password
    const userData = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      grupo_id: user.grupo_id,
      grupo_nome: user.grupo_nome
    };
    
    res.status(201).json({
      success: true,
      data: {
        user: userData,
        token
      },
      message: 'Usuário criado com sucesso'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// GET /api/auth/me
export async function getMe(req, res) {
  try {
    const user = req.user;
    
    const userData = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      grupo_id: user.grupo_id,
      grupo_nome: user.grupo_nome
    };
    
    res.json({
      success: true,
      data: userData,
      message: 'Dados do usuário obtidos com sucesso'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// POST /api/auth/logout
export async function logout(req, res) {
  // With JWT, logout is handled on client side by removing token
  res.json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
}

// PUT /api/auth/change-password
export async function changePassword(req, res) {
  try {
    const { senhaAtual, novaSenha } = req.body;
    const userId = req.user.id;
    
    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({
        success: false,
        message: 'Senha atual e nova senha são obrigatórias'
      });
    }
    
    // Validate current password
    const user = await Usuario.validatePassword(req.user.email, senhaAtual);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Senha atual incorreta'
      });
    }
    
    // Update password
    await Usuario.updatePassword(userId, novaSenha);
    
    res.json({
      success: true,
      message: 'Senha alterada com sucesso'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
