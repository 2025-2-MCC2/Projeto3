import pool from '../config/database.js';

export class Doacao {
  constructor(data) {
    this.id = data.id;
    this.descricao = data.descricao;
    this.quantidade = data.quantidade;
    this.categoria = data.categoria;
    this.status = data.status;
    this.usuario_id = data.usuario_id;
    this.grupo_id = data.grupo_id;
    this.mentor_aprovador_id = data.mentor_aprovador_id;
    this.motivo_rejeicao = data.motivo_rejeicao;
    this.risco_score = data.risco_score;
    this.risco_nivel = data.risco_nivel;
    this.fotos = data.fotos ? JSON.parse(data.fotos) : null;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    
    // Campos relacionados
    this.usuario_nome = data.usuario_nome;
    this.grupo_nome = data.grupo_nome;
    this.mentor_nome = data.mentor_nome;
  }

  // Create new donation
  static async create(donationData) {
    const { 
      descricao, quantidade, categoria, usuario_id, grupo_id, 
      risco_score = 0, risco_nivel = 'baixo', fotos = null 
    } = donationData;
    
    const query = `
      INSERT INTO doacoes (descricao, quantidade, categoria, usuario_id, grupo_id, risco_score, risco_nivel, fotos) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    try {
      const fotosJson = fotos ? JSON.stringify(fotos) : null;
      const [result] = await pool.execute(query, [
        descricao, quantidade, categoria, usuario_id, grupo_id, 
        risco_score, risco_nivel, fotosJson
      ]);
      
      return await Doacao.findById(result.insertId);
    } catch (error) {
      throw new Error(`Erro ao criar doação: ${error.message}`);
    }
  }

  // Find all donations with filters
  static async findAll(filters = {}) {
    let query = `
      SELECT d.*, 
             u.nome as usuario_nome, 
             g.nome as grupo_nome,
             m.nome as mentor_nome
      FROM doacoes d
      JOIN usuarios u ON d.usuario_id = u.id
      JOIN grupos g ON d.grupo_id = g.id
      LEFT JOIN usuarios m ON d.mentor_aprovador_id = m.id
      WHERE 1=1
    `;
    const params = [];
    
    if (filters.status) {
      query += ' AND d.status = ?';
      params.push(filters.status);
    }
    
    if (filters.categoria) {
      query += ' AND d.categoria = ?';
      params.push(filters.categoria);
    }
    
    if (filters.grupo_id) {
      query += ' AND d.grupo_id = ?';
      params.push(filters.grupo_id);
    }
    
    if (filters.usuario_id) {
      query += ' AND d.usuario_id = ?';
      params.push(filters.usuario_id);
    }
    
    if (filters.risco_nivel) {
      query += ' AND d.risco_nivel = ?';
      params.push(filters.risco_nivel);
    }
    
    if (filters.data_inicio) {
      query += ' AND d.created_at >= ?';
      params.push(filters.data_inicio);
    }
    
    if (filters.data_fim) {
      query += ' AND d.created_at <= ?';
      params.push(filters.data_fim);
    }
    
    query += ' ORDER BY d.created_at DESC';
    
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }
    
    try {
      const [rows] = await pool.execute(query, params);
      return rows.map(row => new Doacao(row));
    } catch (error) {
      throw new Error(`Erro ao buscar doações: ${error.message}`);
    }
  }

  // Find donation by ID
  static async findById(id) {
    const query = `
      SELECT d.*, 
             u.nome as usuario_nome, 
             g.nome as grupo_nome,
             m.nome as mentor_nome
      FROM doacoes d
      JOIN usuarios u ON d.usuario_id = u.id
      JOIN grupos g ON d.grupo_id = g.id
      LEFT JOIN usuarios m ON d.mentor_aprovador_id = m.id
      WHERE d.id = ?
    `;
    
    try {
      const [rows] = await pool.execute(query, [id]);
      return rows.length > 0 ? new Doacao(rows[0]) : null;
    } catch (error) {
      throw new Error(`Erro ao buscar doação: ${error.message}`);
    }
  }

  // Update donation
  static async update(id, donationData) {
    const { descricao, quantidade, categoria, fotos } = donationData;
    
    const query = `
      UPDATE doacoes 
      SET descricao = ?, quantidade = ?, categoria = ?, fotos = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND status = 'pendente'
    `;
    
    try {
      const fotosJson = fotos ? JSON.stringify(fotos) : null;
      const [result] = await pool.execute(query, [descricao, quantidade, categoria, fotosJson, id]);
      
      if (result.affectedRows === 0) {
        return null;
      }
      
      return await Doacao.findById(id);
    } catch (error) {
      throw new Error(`Erro ao atualizar doação: ${error.message}`);
    }
  }

  // Approve donation
  static async approve(id, mentorId, observacoes = null) {
    const query = `
      UPDATE doacoes 
      SET status = 'aprovada', mentor_aprovador_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND status = 'pendente'
    `;
    
    try {
      const [result] = await pool.execute(query, [mentorId, id]);
      
      if (result.affectedRows === 0) {
        return null;
      }
      
      // Register audit
      await Doacao.registerAudit(id, mentorId, 'aprovada', { observacoes });
      
      return await Doacao.findById(id);
    } catch (error) {
      throw new Error(`Erro ao aprovar doação: ${error.message}`);
    }
  }

  // Reject donation
  static async reject(id, mentorId, motivo) {
    const query = `
      UPDATE doacoes 
      SET status = 'rejeitada', mentor_aprovador_id = ?, motivo_rejeicao = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND status = 'pendente'
    `;
    
    try {
      const [result] = await pool.execute(query, [mentorId, motivo, id]);
      
      if (result.affectedRows === 0) {
        return null;
      }
      
      // Register audit
      await Doacao.registerAudit(id, mentorId, 'rejeitada', { motivo });
      
      return await Doacao.findById(id);
    } catch (error) {
      throw new Error(`Erro ao rejeitar doação: ${error.message}`);
    }
  }

  // Delete donation
  static async delete(id) {
    const query = 'DELETE FROM doacoes WHERE id = ?';
    
    try {
      const [result] = await pool.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar doação: ${error.message}`);
    }
  }

  // Get pending donations for mentor
  static async findPendingByGroup(grupoId) {
    return await Doacao.findAll({ 
      status: 'pendente', 
      grupo_id: grupoId 
    });
  }

  // Get user donations
  static async findByUser(usuarioId) {
    return await Doacao.findAll({ usuario_id: usuarioId });
  }

  // Get statistics
  static async getStatistics(filters = {}) {
    let query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pendente' THEN 1 END) as pendentes,
        COUNT(CASE WHEN status = 'aprovada' THEN 1 END) as aprovadas,
        COUNT(CASE WHEN status = 'rejeitada' THEN 1 END) as rejeitadas,
        COUNT(CASE WHEN categoria = 'alimento' THEN 1 END) as alimentos,
        COUNT(CASE WHEN categoria = 'fundos' THEN 1 END) as fundos,
        COUNT(CASE WHEN categoria = 'brinquedos' THEN 1 END) as brinquedos,
        COALESCE(SUM(CASE WHEN categoria = 'fundos' AND status = 'aprovada' THEN quantidade END), 0) as total_fundos,
        COALESCE(SUM(CASE WHEN categoria = 'alimento' AND status = 'aprovada' THEN quantidade END), 0) as total_alimentos,
        COALESCE(SUM(CASE WHEN categoria = 'brinquedos' AND status = 'aprovada' THEN quantidade END), 0) as total_brinquedos,
        COUNT(CASE WHEN risco_nivel = 'alto' THEN 1 END) as alto_risco,
        COUNT(CASE WHEN risco_nivel = 'medio' THEN 1 END) as medio_risco,
        COUNT(CASE WHEN risco_nivel = 'baixo' THEN 1 END) as baixo_risco
      FROM doacoes d
      WHERE 1=1
    `;
    const params = [];
    
    if (filters.grupo_id) {
      query += ' AND d.grupo_id = ?';
      params.push(filters.grupo_id);
    }
    
    if (filters.data_inicio) {
      query += ' AND d.created_at >= ?';
      params.push(filters.data_inicio);
    }
    
    if (filters.data_fim) {
      query += ' AND d.created_at <= ?';
      params.push(filters.data_fim);
    }
    
    try {
      const [rows] = await pool.execute(query, params);
      return rows[0];
    } catch (error) {
      throw new Error(`Erro ao buscar estatísticas: ${error.message}`);
    }
  }

  // Register audit event
  static async registerAudit(doacaoId, usuarioId, acao, metadata = {}) {
    const query = `
      INSERT INTO auditoria (doacao_id, usuario_id, acao, dados_novos, observacoes)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    try {
      const dadosNovos = JSON.stringify(metadata);
      await pool.execute(query, [
        doacaoId, usuarioId, acao, dadosNovos, metadata.observacoes || null
      ]);
    } catch (error) {
      console.error('Erro ao registrar auditoria:', error.message);
    }
  }

  // Get donations by group with statistics
  static async getGroupRanking(filters = {}) {
    let query = `
      SELECT 
        g.id,
        g.nome as grupo_nome,
        COUNT(d.id) as total_doacoes,
        COUNT(CASE WHEN d.status = 'aprovada' THEN 1 END) as doacoes_aprovadas,
        COALESCE(SUM(CASE WHEN d.categoria = 'fundos' AND d.status = 'aprovada' THEN d.quantidade END), 0) as total_fundos,
        COALESCE(SUM(CASE WHEN d.categoria = 'alimento' AND d.status = 'aprovada' THEN d.quantidade END), 0) as total_alimentos,
        COALESCE(SUM(CASE WHEN d.categoria = 'brinquedos' AND d.status = 'aprovada' THEN d.quantidade END), 0) as total_brinquedos
      FROM grupos g
      LEFT JOIN doacoes d ON g.id = d.grupo_id
      WHERE g.ativo = TRUE
    `;
    const params = [];
    
    if (filters.data_inicio) {
      query += ' AND (d.created_at >= ? OR d.created_at IS NULL)';
      params.push(filters.data_inicio);
    }
    
    if (filters.data_fim) {
      query += ' AND (d.created_at <= ? OR d.created_at IS NULL)';
      params.push(filters.data_fim);
    }
    
    query += ' GROUP BY g.id, g.nome ORDER BY doacoes_aprovadas DESC, total_doacoes DESC';
    
    try {
      const [rows] = await pool.execute(query, params);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar ranking de grupos: ${error.message}`);
    }
  }
}
