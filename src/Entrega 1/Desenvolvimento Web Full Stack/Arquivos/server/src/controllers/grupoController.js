import { Grupo } from '../models/Grupo.js';
import { Usuario } from '../models/Usuario.js';

// GET /api/grupos - Listar grupos
export async function getAllGrupos(req, res) {
  try {
    const { includeInactive } = req.query;
    const grupos = await Grupo.findAll(includeInactive === 'true');
    
    res.json({
      success: true,
      data: grupos,
      message: 'Grupos listados com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// GET /api/grupos/:id - Buscar grupo por ID
export async function getGrupoById(req, res) {
  try {
    const { id } = req.params;
    const grupo = await Grupo.findById(id);
    
    if (!grupo) {
      return res.status(404).json({
        success: false,
        message: 'Grupo não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: grupo,
      message: 'Grupo encontrado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// POST /api/grupos - Criar grupo (Admin only)
export async function createGrupo(req, res) {
  try {
    const { nome, descricao, mentor_id } = req.body;
    
    if (!nome) {
      return res.status(400).json({
        success: false,
        message: 'Nome do grupo é obrigatório'
      });
    }
    
    // Check if group name already exists
    const existingGroup = await Grupo.findByName(nome);
    if (existingGroup) {
      return res.status(409).json({
        success: false,
        message: 'Já existe um grupo com este nome'
      });
    }
    
    // If mentor_id is provided, validate mentor
    if (mentor_id) {
      const mentor = await Usuario.findById(mentor_id);
      if (!mentor || mentor.role !== 'mentor') {
        return res.status(400).json({
          success: false,
          message: 'Mentor inválido'
        });
      }
    }
    
    const grupo = await Grupo.create({
      nome,
      descricao,
      mentor_id
    });
    
    res.status(201).json({
      success: true,
      data: grupo,
      message: 'Grupo criado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// PUT /api/grupos/:id - Atualizar grupo
export async function updateGrupo(req, res) {
  try {
    const { id } = req.params;
    const { nome, descricao, mentor_id } = req.body;
    
    if (!nome) {
      return res.status(400).json({
        success: false,
        message: 'Nome do grupo é obrigatório'
      });
    }
    
    // Check if group name is already used by another group
    const existingGroup = await Grupo.findByName(nome);
    if (existingGroup && existingGroup.id != id) {
      return res.status(409).json({
        success: false,
        message: 'Já existe outro grupo com este nome'
      });
    }
    
    // If mentor_id is provided, validate mentor
    if (mentor_id) {
      const mentor = await Usuario.findById(mentor_id);
      if (!mentor || mentor.role !== 'mentor') {
        return res.status(400).json({
          success: false,
          message: 'Mentor inválido'
        });
      }
    }
    
    const grupo = await Grupo.update(id, {
      nome,
      descricao,
      mentor_id
    });
    
    if (!grupo) {
      return res.status(404).json({
        success: false,
        message: 'Grupo não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: grupo,
      message: 'Grupo atualizado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// DELETE /api/grupos/:id - Deletar grupo
export async function deleteGrupo(req, res) {
  try {
    const { id } = req.params;
    
    const deleted = await Grupo.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Grupo não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Grupo deletado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// GET /api/grupos/disponiveis - Grupos sem mentor
export async function getGruposDisponiveis(req, res) {
  try {
    const grupos = await Grupo.findWithoutMentor();
    
    res.json({
      success: true,
      data: grupos,
      message: 'Grupos disponíveis listados com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// PUT /api/grupos/:id/mentor - Atribuir mentor ao grupo
export async function assignMentor(req, res) {
  try {
    const { id } = req.params;
    const { mentor_id } = req.body;
    
    if (!mentor_id) {
      return res.status(400).json({
        success: false,
        message: 'ID do mentor é obrigatório'
      });
    }
    
    // Validate mentor
    const mentor = await Usuario.findById(mentor_id);
    if (!mentor || mentor.role !== 'mentor') {
      return res.status(400).json({
        success: false,
        message: 'Mentor inválido'
      });
    }
    
    const grupo = await Grupo.assignMentor(id, mentor_id);
    
    if (!grupo) {
      return res.status(404).json({
        success: false,
        message: 'Grupo não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: grupo,
      message: 'Mentor atribuído com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// DELETE /api/grupos/:id/mentor - Remover mentor do grupo
export async function removeMentor(req, res) {
  try {
    const { id } = req.params;
    
    const removed = await Grupo.removeMentor(id);
    
    if (!removed) {
      return res.status(404).json({
        success: false,
        message: 'Grupo não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Mentor removido com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// GET /api/grupos/:id/estatisticas - Estatísticas do grupo
export async function getGrupoStatistics(req, res) {
  try {
    const { id } = req.params;
    
    const grupo = await Grupo.findById(id);
    if (!grupo) {
      return res.status(404).json({
        success: false,
        message: 'Grupo não encontrado'
      });
    }
    
    const statistics = await Grupo.getStatistics(id);
    
    res.json({
      success: true,
      data: {
        grupo,
        statistics
      },
      message: 'Estatísticas do grupo obtidas com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
