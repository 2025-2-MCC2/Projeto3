import pool from '../config/database.js';
import bcrypt from 'bcrypt';

export class Usuario {
  constructor(data) {
    this.id = data.id;
    this.nome = data.nome;
    this.email = data.email;
    this.role = data.role;
    this.grupo_id = data.grupo_id;
    this.ativo = data.ativo;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Create new user
  static async create(userData) {
    const { nome, email, senha, role, grupo_id } = userData;
    
    // Hash password
    const senha_hash = await bcrypt.hash(senha, 10);
    
    const query = `
      INSERT INTO usuarios (nome, email, senha_hash, role, grupo_id) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    try {
      const [result] = await pool.execute(query, [nome, email, senha_hash, role, grupo_id]);
      const newUser = await Usuario.findById(result.insertId);
      
      // If user is a mentor, assign them to the group
      if (role === 'mentor' && grupo_id) {
        await pool.execute(
          'UPDATE grupos SET mentor_id = ? WHERE id = ?',
          [result.insertId, grupo_id]
        );
      }
      
      return newUser;
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  // Find all users
  static async findAll(filters = {}) {
    let query = `
      SELECT u.*, g.nome as grupo_nome 
      FROM usuarios u 
      LEFT JOIN grupos g ON u.grupo_id = g.id 
      WHERE u.ativo = TRUE
    `;
    const params = [];
    
    if (filters.role) {
      query += ' AND u.role = ?';
      params.push(filters.role);
    }
    
    if (filters.grupo_id) {
      query += ' AND u.grupo_id = ?';
      params.push(filters.grupo_id);
    }
    
    query += ' ORDER BY u.created_at DESC';
    
    try {
      const [rows] = await pool.execute(query, params);
      return rows.map(row => new Usuario(row));
    } catch (error) {
      throw new Error(`Erro ao buscar usuários: ${error.message}`);
    }
  }

  // Find user by ID
  static async findById(id) {
    const query = `
      SELECT u.*, g.nome as grupo_nome 
      FROM usuarios u 
      LEFT JOIN grupos g ON u.grupo_id = g.id 
      WHERE u.id = ? AND u.ativo = TRUE
    `;
    
    try {
      const [rows] = await pool.execute(query, [id]);
      return rows.length > 0 ? new Usuario(rows[0]) : null;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }

  // Find user by email
  static async findByEmail(email) {
    const query = `
      SELECT u.*, g.nome as grupo_nome 
      FROM usuarios u 
      LEFT JOIN grupos g ON u.grupo_id = g.id 
      WHERE u.email = ? AND u.ativo = TRUE
    `;
    
    try {
      const [rows] = await pool.execute(query, [email]);
      return rows.length > 0 ? new Usuario(rows[0]) : null;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário por email: ${error.message}`);
    }
  }

  // Validate password
  static async validatePassword(email, senha) {
    const query = 'SELECT * FROM usuarios WHERE email = ? AND ativo = TRUE';
    
    try {
      const [rows] = await pool.execute(query, [email]);
      if (rows.length === 0) return null;
      
      const user = rows[0];
      const isValid = await bcrypt.compare(senha, user.senha_hash);
      
      return isValid ? new Usuario(user) : null;
    } catch (error) {
      throw new Error(`Erro na validação: ${error.message}`);
    }
  }

  // Update user
  static async update(id, userData) {
    const { nome, email, role, grupo_id } = userData;
    
    const query = `
      UPDATE usuarios 
      SET nome = ?, email = ?, role = ?, grupo_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND ativo = TRUE
    `;
    
    try {
      const [result] = await pool.execute(query, [nome, email, role, grupo_id, id]);
      
      if (result.affectedRows === 0) {
        return null;
      }
      
      return await Usuario.findById(id);
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  // Update password
  static async updatePassword(id, novaSenha) {
    const senha_hash = await bcrypt.hash(novaSenha, 10);
    
    const query = `
      UPDATE usuarios 
      SET senha_hash = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND ativo = TRUE
    `;
    
    try {
      const [result] = await pool.execute(query, [senha_hash, id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Erro ao atualizar senha: ${error.message}`);
    }
  }

  // Soft delete user
  static async delete(id) {
    const query = `
      UPDATE usuarios 
      SET ativo = FALSE, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    try {
      const [result] = await pool.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar usuário: ${error.message}`);
    }
  }

  // Find users by group
  static async findByGrupo(grupo_id) {
    const query = `
      SELECT u.*, g.nome as grupo_nome 
      FROM usuarios u 
      LEFT JOIN grupos g ON u.grupo_id = g.id 
      WHERE u.grupo_id = ? AND u.ativo = TRUE
      ORDER BY u.role DESC, u.nome ASC
    `;
    
    try {
      const [rows] = await pool.execute(query, [grupo_id]);
      return rows.map(row => new Usuario(row));
    } catch (error) {
      throw new Error(`Erro ao buscar usuários do grupo: ${error.message}`);
    }
  }
}
