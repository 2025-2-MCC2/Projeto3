import pool from '../config/database.js';

export class Grupo {
  constructor(data) {
    this.id = data.id;
    this.nome = data.nome;
    this.descricao = data.descricao;
    this.mentor_id = data.mentor_id;
    this.mentor_nome = data.mentor_nome;
    this.ativo = data.ativo;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Create new group
  static async create(groupData) {
    const { nome, descricao, mentor_id } = groupData;
    
    const query = `
      INSERT INTO grupos (nome, descricao, mentor_id) 
      VALUES (?, ?, ?)
    `;
    
    try {
      const [result] = await pool.execute(query, [nome, descricao, mentor_id]);
      return await Grupo.findById(result.insertId);
    } catch (error) {
      throw new Error(`Erro ao criar grupo: ${error.message}`);
    }
  }

  // Find all groups
  static async findAll(includeInactive = false) {
    let query = `
      SELECT g.*, u.nome as mentor_nome 
      FROM grupos g 
      LEFT JOIN usuarios u ON g.mentor_id = u.id
    `;
    
    if (!includeInactive) {
      query += ' WHERE g.ativo = TRUE';
    }
    
    query += ' ORDER BY g.nome ASC';
    
    try {
      const [rows] = await pool.execute(query);
      return rows.map(row => new Grupo(row));
    } catch (error) {
      throw new Error(`Erro ao buscar grupos: ${error.message}`);
    }
  }

  // Find group by ID
  static async findById(id) {
    const query = `
      SELECT g.*, u.nome as mentor_nome 
      FROM grupos g 
      LEFT JOIN usuarios u ON g.mentor_id = u.id 
      WHERE g.id = ?
    `;
    
    try {
      const [rows] = await pool.execute(query, [id]);
      return rows.length > 0 ? new Grupo(rows[0]) : null;
    } catch (error) {
      throw new Error(`Erro ao buscar grupo: ${error.message}`);
    }
  }

  // Find groups without mentor
  static async findWithoutMentor() {
    const query = `
      SELECT g.*, u.nome as mentor_nome 
      FROM grupos g 
      LEFT JOIN usuarios u ON g.mentor_id = u.id 
      WHERE g.mentor_id IS NULL AND g.ativo = TRUE
      ORDER BY g.nome ASC
    `;
    
    try {
      const [rows] = await pool.execute(query);
      return rows.map(row => new Grupo(row));
    } catch (error) {
      throw new Error(`Erro ao buscar grupos sem mentor: ${error.message}`);
    }
  }

  // Update group
  static async update(id, groupData) {
    const { nome, descricao, mentor_id } = groupData;
    
    const query = `
      UPDATE grupos 
      SET nome = ?, descricao = ?, mentor_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    try {
      const [result] = await pool.execute(query, [nome, descricao, mentor_id, id]);
      
      if (result.affectedRows === 0) {
        return null;
      }
      
      return await Grupo.findById(id);
    } catch (error) {
      throw new Error(`Erro ao atualizar grupo: ${error.message}`);
    }
  }

  // Assign mentor to group
  static async assignMentor(grupoId, mentorId) {
    const query = `
      UPDATE grupos 
      SET mentor_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    try {
      const [result] = await pool.execute(query, [mentorId, grupoId]);
      
      if (result.affectedRows === 0) {
        return null;
      }
      
      // Update mentor's group
      await pool.execute(
        'UPDATE usuarios SET grupo_id = ? WHERE id = ?',
        [grupoId, mentorId]
      );
      
      return await Grupo.findById(grupoId);
    } catch (error) {
      throw new Error(`Erro ao atribuir mentor: ${error.message}`);
    }
  }

  // Remove mentor from group
  static async removeMentor(grupoId) {
    const query = `
      UPDATE grupos 
      SET mentor_id = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    try {
      const [result] = await pool.execute(query, [grupoId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Erro ao remover mentor: ${error.message}`);
    }
  }

  // Soft delete group
  static async delete(id) {
    const query = `
      UPDATE grupos 
      SET ativo = FALSE, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    try {
      const [result] = await pool.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar grupo: ${error.message}`);
    }
  }

  // Get group statistics
  static async getStatistics(id) {
    const query = `
      SELECT 
        COUNT(CASE WHEN u.role = 'aluno' THEN 1 END) as total_alunos,
        COUNT(CASE WHEN u.role = 'mentor' THEN 1 END) as total_mentores,
        COUNT(d.id) as total_doacoes,
        COUNT(CASE WHEN d.status = 'pendente' THEN 1 END) as doacoes_pendentes,
        COUNT(CASE WHEN d.status = 'aprovada' THEN 1 END) as doacoes_aprovadas,
        COUNT(CASE WHEN d.status = 'rejeitada' THEN 1 END) as doacoes_rejeitadas,
        COALESCE(SUM(CASE WHEN d.categoria = 'fundos' AND d.status = 'aprovada' THEN d.quantidade END), 0) as total_fundos,
        COALESCE(SUM(CASE WHEN d.categoria = 'alimento' AND d.status = 'aprovada' THEN d.quantidade END), 0) as total_alimentos,
        COALESCE(SUM(CASE WHEN d.categoria = 'brinquedos' AND d.status = 'aprovada' THEN d.quantidade END), 0) as total_brinquedos
      FROM grupos g
      LEFT JOIN usuarios u ON g.id = u.grupo_id AND u.ativo = TRUE
      LEFT JOIN doacoes d ON g.id = d.grupo_id
      WHERE g.id = ?
      GROUP BY g.id
    `;
    
    try {
      const [rows] = await pool.execute(query, [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error(`Erro ao buscar estatísticas do grupo: ${error.message}`);
    }
  }

  // Find group by name
  static async findByName(nome) {
    const query = `
      SELECT g.*, u.nome as mentor_nome 
      FROM grupos g 
      LEFT JOIN usuarios u ON g.mentor_id = u.id 
      WHERE g.nome = ? AND g.ativo = TRUE
    `;
    
    try {
      const [rows] = await pool.execute(query, [nome]);
      return rows.length > 0 ? new Grupo(rows[0]) : null;
    } catch (error) {
      throw new Error(`Erro ao buscar grupo por nome: ${error.message}`);
    }
  }
}
