import { Doacao } from '../models/Doacao.js';

// GET /api/doacoes - Listar doações
export async function getAllDoacoes(req, res) {
  try {
    const { status, categoria, grupo_id, usuario_id, risco_nivel, data_inicio, data_fim, limit } = req.query;
    const user = req.user;
    
    const filters = {};
    
    // Apply role-based filters
    if (user.role === 'aluno') {
      filters.usuario_id = user.id; // Students can only see their own donations
    } else if (user.role === 'mentor') {
      filters.grupo_id = user.grupo_id; // Mentors can only see their group's donations
    }
    // Admin can see all donations (no additional filters)
    
    // Apply query filters
    if (status) filters.status = status;
    if (categoria) filters.categoria = categoria;
    if (grupo_id && user.role === 'admin') filters.grupo_id = grupo_id;
    if (usuario_id && user.role === 'admin') filters.usuario_id = usuario_id;
    if (risco_nivel) filters.risco_nivel = risco_nivel;
    if (data_inicio) filters.data_inicio = data_inicio;
    if (data_fim) filters.data_fim = data_fim;
    if (limit) filters.limit = limit;
    
    const doacoes = await Doacao.findAll(filters);
    
    res.json({
      success: true,
      data: doacoes,
      message: 'Doações listadas com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// GET /api/doacoes/:id - Buscar doação por ID
export async function getDoacaoById(req, res) {
  try {
    const { id } = req.params;
    const user = req.user;
    
    const doacao = await Doacao.findById(id);
    
    if (!doacao) {
      return res.status(404).json({
        success: false,
        message: 'Doação não encontrada'
      });
    }
    
    // Check access permissions
    if (user.role === 'aluno' && doacao.usuario_id !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }
    
    if (user.role === 'mentor' && doacao.grupo_id !== user.grupo_id) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }
    
    res.json({
      success: true,
      data: doacao,
      message: 'Doação encontrada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// POST /api/doacoes - Criar doação (Aluno only)
export async function createDoacao(req, res) {
  try {
    const { descricao, quantidade, categoria, fotos } = req.body;
    const user = req.user;
    
    // Validation
    if (!descricao || !quantidade || !categoria) {
      return res.status(400).json({
        success: false,
        message: 'Descrição, quantidade e categoria são obrigatórios'
      });
    }
    
    if (!['alimento', 'fundos', 'brinquedos'].includes(categoria)) {
      return res.status(400).json({
        success: false,
        message: 'Categoria deve ser: alimento, fundos ou brinquedos'
      });
    }
    
    if (quantidade <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantidade deve ser maior que zero'
      });
    }
    
    // Calculate risk score (simplified)
    let risco_score = 0;
    let risco_nivel = 'baixo';
    
    if (categoria === 'fundos' && quantidade > 500) {
      risco_score = 8;
      risco_nivel = 'alto';
    } else if (categoria === 'fundos' && quantidade > 200) {
      risco_score = 5;
      risco_nivel = 'medio';
    } else if (quantidade > 100) {
      risco_score = 3;
      risco_nivel = 'medio';
    }
    
    const doacao = await Doacao.create({
      descricao,
      quantidade,
      categoria,
      usuario_id: user.id,
      grupo_id: user.grupo_id,
      risco_score,
      risco_nivel,
      fotos
    });
    
    // Register audit
    await Doacao.registerAudit(doacao.id, user.id, 'criada', {
      descricao,
      quantidade,
      categoria
    });
    
    res.status(201).json({
      success: true,
      data: doacao,
      message: 'Doação criada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// PUT /api/doacoes/:id - Atualizar doação (Aluno only, apenas pendentes)
export async function updateDoacao(req, res) {
  try {
    const { id } = req.params;
    const { descricao, quantidade, categoria, fotos } = req.body;
    const user = req.user;
    
    // Check if donation exists and belongs to user
    const existingDoacao = await Doacao.findById(id);
    if (!existingDoacao) {
      return res.status(404).json({
        success: false,
        message: 'Doação não encontrada'
      });
    }
    
    if (existingDoacao.usuario_id !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'Você só pode editar suas próprias doações'
      });
    }
    
    if (existingDoacao.status !== 'pendente') {
      return res.status(400).json({
        success: false,
        message: 'Só é possível editar doações pendentes'
      });
    }
    
    // Validation
    if (!descricao || !quantidade || !categoria) {
      return res.status(400).json({
        success: false,
        message: 'Descrição, quantidade e categoria são obrigatórios'
      });
    }
    
    const doacao = await Doacao.update(id, {
      descricao,
      quantidade,
      categoria,
      fotos
    });
    
    if (!doacao) {
      return res.status(400).json({
        success: false,
        message: 'Não foi possível atualizar a doação'
      });
    }
    
    // Register audit
    await Doacao.registerAudit(id, user.id, 'editada', {
      descricao,
      quantidade,
      categoria
    });
    
    res.json({
      success: true,
      data: doacao,
      message: 'Doação atualizada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// PUT /api/doacoes/:id/aprovar - Aprovar doação (Mentor only)
export async function aprovarDoacao(req, res) {
  try {
    const { id } = req.params;
    const { observacoes } = req.body;
    const user = req.user;
    
    // Check if donation exists and belongs to mentor's group
    const doacao = await Doacao.findById(id);
    if (!doacao) {
      return res.status(404).json({
        success: false,
        message: 'Doação não encontrada'
      });
    }
    
    if (doacao.grupo_id !== user.grupo_id) {
      return res.status(403).json({
        success: false,
        message: 'Você só pode aprovar doações do seu grupo'
      });
    }
    
    if (doacao.status !== 'pendente') {
      return res.status(400).json({
        success: false,
        message: 'Só é possível aprovar doações pendentes'
      });
    }
    
    const doacaoAprovada = await Doacao.approve(id, user.id, observacoes);
    
    if (!doacaoAprovada) {
      return res.status(400).json({
        success: false,
        message: 'Não foi possível aprovar a doação'
      });
    }
    
    res.json({
      success: true,
      data: doacaoAprovada,
      message: 'Doação aprovada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// PUT /api/doacoes/:id/rejeitar - Rejeitar doação (Mentor only)
export async function rejeitarDoacao(req, res) {
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    const user = req.user;
    
    if (!motivo) {
      return res.status(400).json({
        success: false,
        message: 'Motivo da rejeição é obrigatório'
      });
    }
    
    // Check if donation exists and belongs to mentor's group
    const doacao = await Doacao.findById(id);
    if (!doacao) {
      return res.status(404).json({
        success: false,
        message: 'Doação não encontrada'
      });
    }
    
    if (doacao.grupo_id !== user.grupo_id) {
      return res.status(403).json({
        success: false,
        message: 'Você só pode rejeitar doações do seu grupo'
      });
    }
    
    if (doacao.status !== 'pendente') {
      return res.status(400).json({
        success: false,
        message: 'Só é possível rejeitar doações pendentes'
      });
    }
    
    const doacaoRejeitada = await Doacao.reject(id, user.id, motivo);
    
    if (!doacaoRejeitada) {
      return res.status(400).json({
        success: false,
        message: 'Não foi possível rejeitar a doação'
      });
    }
    
    res.json({
      success: true,
      data: doacaoRejeitada,
      message: 'Doação rejeitada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// DELETE /api/doacoes/:id - Deletar doação (Admin only)
export async function deleteDoacao(req, res) {
  try {
    const { id } = req.params;
    
    const deleted = await Doacao.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Doação não encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Doação deletada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// GET /api/doacoes/pendentes - Doações pendentes (Mentor)
export async function getDoacoesPendentes(req, res) {
  try {
    const user = req.user;
    
    if (user.role !== 'mentor') {
      return res.status(403).json({
        success: false,
        message: 'Acesso restrito a mentores'
      });
    }
    
    const doacoes = await Doacao.findPendingByGroup(user.grupo_id);
    
    res.json({
      success: true,
      data: doacoes,
      message: 'Doações pendentes listadas com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// GET /api/doacoes/estatisticas - Estatísticas das doações
export async function getEstatisticas(req, res) {
  try {
    const { grupo_id, data_inicio, data_fim } = req.query;
    const user = req.user;
    
    const filters = {};
    
    // Apply role-based filters
    if (user.role === 'mentor') {
      filters.grupo_id = user.grupo_id;
    } else if (user.role === 'admin' && grupo_id) {
      filters.grupo_id = grupo_id;
    }
    
    if (data_inicio) filters.data_inicio = data_inicio;
    if (data_fim) filters.data_fim = data_fim;
    
    const statistics = await Doacao.getStatistics(filters);
    const ranking = await Doacao.getGroupRanking(filters);
    
    res.json({
      success: true,
      data: {
        statistics,
        ranking
      },
      message: 'Estatísticas obtidas com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
