import { Usuario } from '../models/Usuario.js';

// GET /api/usuarios - Listar usuários
export async function getAllUsuarios(req, res) {
  try {
    const { role, grupo_id } = req.query;
    const filters = {};
    
    if (role) filters.role = role;
    if (grupo_id) filters.grupo_id = grupo_id;
    
    const usuarios = await Usuario.findAll(filters);
    
    res.json({
      success: true,
      data: usuarios,
      message: 'Usuários listados com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// GET /api/usuarios/:id - Buscar usuário por ID
export async function getUsuarioById(req, res) {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: usuario,
      message: 'Usuário encontrado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// POST /api/usuarios - Criar usuário (Admin only)
export async function createUsuario(req, res) {
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
        message: 'Seleção de grupo é obrigatória'
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
    
    const usuario = await Usuario.create({
      nome,
      email,
      senha,
      role,
      grupo_id
    });
    
    res.status(201).json({
      success: true,
      data: usuario,
      message: 'Usuário criado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// PUT /api/usuarios/:id - Atualizar usuário
export async function updateUsuario(req, res) {
  try {
    const { id } = req.params;
    const { nome, email, role, grupo_id } = req.body;
    
    // Validation
    if (!nome || !email || !role) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email e role são obrigatórios'
      });
    }
    
    // Prevent changing to admin role
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Não é possível alterar role para administrador'
      });
    }
    
    // Check if email is already used by another user
    const existingUser = await Usuario.findByEmail(email);
    if (existingUser && existingUser.id != id) {
      return res.status(409).json({
        success: false,
        message: 'Email já está em uso por outro usuário'
      });
    }
    
    const usuario = await Usuario.update(id, {
      nome,
      email,
      role,
      grupo_id
    });
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: usuario,
      message: 'Usuário atualizado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// DELETE /api/usuarios/:id - Deletar usuário
export async function deleteUsuario(req, res) {
  try {
    const { id } = req.params;
    
    // Prevent deleting admin
    const usuario = await Usuario.findById(id);
    if (usuario && usuario.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Não é possível deletar conta de administrador'
      });
    }
    
    const deleted = await Usuario.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Usuário deletado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// GET /api/usuarios/grupo/:grupoId - Listar usuários do grupo
export async function getUsuariosByGrupo(req, res) {
  try {
    const { grupoId } = req.params;
    const usuarios = await Usuario.findByGrupo(grupoId);
    
    res.json({
      success: true,
      data: usuarios,
      message: 'Usuários do grupo listados com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
