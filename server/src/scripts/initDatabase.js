import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || ''
};

async function initDatabase() {
  let connection;
  
  try {
    // Connect without database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conectado ao MySQL');
    
    // Create database if not exists
    const dbName = process.env.DB_NAME || 'gestao_liderancas';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✅ Database '${dbName}' criado/verificado`);
    
    // Use database
    await connection.execute(`USE ${dbName}`);
    
    // Create leaders table
    const createLeadersTable = `
      CREATE TABLE IF NOT EXISTS leaders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        role VARCHAR(120) NOT NULL,
        email VARCHAR(180) UNIQUE NOT NULL,
        team VARCHAR(120) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await connection.execute(createLeadersTable);
    console.log('✅ Tabela leaders criada/verificada');
    
    // Insert sample data
    const checkData = await connection.execute('SELECT COUNT(*) as count FROM leaders');
    const count = checkData[0][0].count;
    
    if (count === 0) {
      const sampleLeaders = [
        ['Carlos Silva', 'Mentor Sênior', 'carlos@fecap.com', 'Equipe Alpha'],
        ['Ana Santos', 'Coordenadora', 'ana@fecap.com', 'Equipe Beta'],
        ['João Almeida', 'Líder de Projeto', 'joao@fecap.com', 'Equipe Gamma'],
        ['Maria Oliveira', 'Supervisora', 'maria@fecap.com', 'Equipe Alpha'],
        ['Pedro Costa', 'Gerente', 'pedro@fecap.com', 'Equipe Beta']
      ];
      
      const insertQuery = 'INSERT INTO leaders (name, role, email, team) VALUES ?';
      await connection.execute(insertQuery, [sampleLeaders]);
      console.log('✅ Dados de exemplo inseridos');
    } else {
      console.log(`ℹ️  Já existem ${count} leaders na base de dados`);
    }
    
    console.log('🎉 Inicialização do banco concluída com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro na inicialização:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();
