import pool from '../config/database.js';

export class Leader {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.role = data.role;
    this.email = data.email;
    this.team = data.team;
    this.created_at = data.created_at;
  }

  // Create new leader
  static async create(leaderData) {
    const { name, role, email, team } = leaderData;
    
    const query = `
      INSERT INTO leaders (name, role, email, team) 
      VALUES (?, ?, ?, ?)
    `;
    
    try {
      const [result] = await pool.execute(query, [name, role, email, team]);
      return await Leader.findById(result.insertId);
    } catch (error) {
      throw new Error(`Erro ao criar leader: ${error.message}`);
    }
  }

  // Find all leaders
  static async findAll() {
    const query = 'SELECT * FROM leaders ORDER BY created_at DESC';
    
    try {
      const [rows] = await pool.execute(query);
      return rows.map(row => new Leader(row));
    } catch (error) {
      throw new Error(`Erro ao buscar leaders: ${error.message}`);
    }
  }

  // Find leader by ID
  static async findById(id) {
    const query = 'SELECT * FROM leaders WHERE id = ?';
    
    try {
      const [rows] = await pool.execute(query, [id]);
      return rows.length > 0 ? new Leader(rows[0]) : null;
    } catch (error) {
      throw new Error(`Erro ao buscar leader: ${error.message}`);
    }
  }

  // Update leader
  static async update(id, leaderData) {
    const { name, role, email, team } = leaderData;
    
    const query = `
      UPDATE leaders 
      SET name = ?, role = ?, email = ?, team = ?
      WHERE id = ?
    `;
    
    try {
      const [result] = await pool.execute(query, [name, role, email, team, id]);
      
      if (result.affectedRows === 0) {
        return null;
      }
      
      return await Leader.findById(id);
    } catch (error) {
      throw new Error(`Erro ao atualizar leader: ${error.message}`);
    }
  }

  // Delete leader
  static async delete(id) {
    const query = 'DELETE FROM leaders WHERE id = ?';
    
    try {
      const [result] = await pool.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar leader: ${error.message}`);
    }
  }

  // Find by email (for validation)
  static async findByEmail(email) {
    const query = 'SELECT * FROM leaders WHERE email = ?';
    
    try {
      const [rows] = await pool.execute(query, [email]);
      return rows.length > 0 ? new Leader(rows[0]) : null;
    } catch (error) {
      throw new Error(`Erro ao buscar leader por email: ${error.message}`);
    }
  }
}
