import { Leader } from '../models/Leader.js';

// GET /api/leaders - Listar todos os leaders
export async function getAllLeaders(req, res) {
  try {
    const leaders = await Leader.findAll();
    res.json({
      success: true,
      data: leaders,
      message: 'Leaders listados com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// GET /api/leaders/:id - Buscar leader por ID
export async function getLeaderById(req, res) {
  try {
    const { id } = req.params;
    const leader = await Leader.findById(id);
    
    if (!leader) {
      return res.status(404).json({
        success: false,
        message: 'Leader não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: leader,
      message: 'Leader encontrado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// POST /api/leaders - Criar novo leader
export async function createLeader(req, res) {
  try {
    const { name, role, email, team } = req.body;
    
    // Validação básica
    if (!name || !role || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nome, cargo e email são obrigatórios'
      });
    }
    
    // Verificar se email já existe
    const existingLeader = await Leader.findByEmail(email);
    if (existingLeader) {
      return res.status(409).json({
        success: false,
        message: 'Email já está em uso'
      });
    }
    
    const leader = await Leader.create({ name, role, email, team });
    
    res.status(201).json({
      success: true,
      data: leader,
      message: 'Leader criado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// PUT /api/leaders/:id - Atualizar leader
export async function updateLeader(req, res) {
  try {
    const { id } = req.params;
    const { name, role, email, team } = req.body;
    
    // Validação básica
    if (!name || !role || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nome, cargo e email são obrigatórios'
      });
    }
    
    // Verificar se email já existe em outro leader
    const existingLeader = await Leader.findByEmail(email);
    if (existingLeader && existingLeader.id != id) {
      return res.status(409).json({
        success: false,
        message: 'Email já está em uso por outro leader'
      });
    }
    
    const leader = await Leader.update(id, { name, role, email, team });
    
    if (!leader) {
      return res.status(404).json({
        success: false,
        message: 'Leader não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: leader,
      message: 'Leader atualizado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// DELETE /api/leaders/:id - Deletar leader
export async function deleteLeader(req, res) {
  try {
    const { id } = req.params;
    
    const deleted = await Leader.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Leader não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Leader deletado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
