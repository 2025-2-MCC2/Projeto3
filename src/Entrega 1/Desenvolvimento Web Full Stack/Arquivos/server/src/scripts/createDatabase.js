import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || ''
};

async function createDatabase() {
  let connection;
  
  try {
    // Connect without database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conectado ao MySQL');
    
    // Create database if not exists
    const dbName = process.env.DB_NAME || 'gestao_doacoes';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✅ Database '${dbName}' criado/verificado`);
    
    // Use database
    await connection.execute(`USE ${dbName}`);
    
    // Create grupos table
    const createGruposTable = `
      CREATE TABLE IF NOT EXISTS grupos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL UNIQUE,
        descricao TEXT,
        mentor_id INT UNIQUE,
        ativo BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_mentor (mentor_id)
      )
    `;
    await connection.execute(createGruposTable);
    console.log('✅ Tabela grupos criada/verificada');
    
    // Create usuarios table
    const createUsuariosTable = `
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(120) NOT NULL,
        email VARCHAR(180) UNIQUE NOT NULL,
        senha_hash VARCHAR(255) NOT NULL,
        role ENUM('admin', 'mentor', 'aluno') NOT NULL,
        grupo_id INT,
        ativo BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE SET NULL,
        INDEX idx_email (email),
        INDEX idx_role (role),
        INDEX idx_grupo (grupo_id)
      )
    `;
    await connection.execute(createUsuariosTable);
    console.log('✅ Tabela usuarios criada/verificada');
    
    // Add foreign key constraint for mentor_id in grupos
    try {
      await connection.execute(`
        ALTER TABLE grupos 
        ADD CONSTRAINT fk_grupos_mentor 
        FOREIGN KEY (mentor_id) REFERENCES usuarios(id) ON DELETE SET NULL
      `);
    } catch (error) {
      // Constraint already exists
      if (!error.message.includes('Duplicate key name')) {
        console.log('⚠️ Foreign key constraint já existe ou erro:', error.message);
      }
    }
    
    // Create doacoes table
    const createDoacoesTable = `
      CREATE TABLE IF NOT EXISTS doacoes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        descricao TEXT NOT NULL,
        quantidade DECIMAL(10,2) NOT NULL,
        categoria ENUM('alimento', 'fundos', 'brinquedos') NOT NULL,
        status ENUM('pendente', 'aprovada', 'rejeitada') DEFAULT 'pendente',
        usuario_id INT NOT NULL,
        grupo_id INT NOT NULL,
        mentor_aprovador_id INT NULL,
        motivo_rejeicao TEXT NULL,
        risco_score INT DEFAULT 0,
        risco_nivel ENUM('baixo', 'medio', 'alto') DEFAULT 'baixo',
        fotos JSON NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE,
        FOREIGN KEY (mentor_aprovador_id) REFERENCES usuarios(id) ON DELETE SET NULL,
        INDEX idx_status (status),
        INDEX idx_categoria (categoria),
        INDEX idx_grupo (grupo_id),
        INDEX idx_usuario (usuario_id)
      )
    `;
    await connection.execute(createDoacoesTable);
    console.log('✅ Tabela doacoes criada/verificada');
    
    // Create auditoria table
    const createAuditoriaTable = `
      CREATE TABLE IF NOT EXISTS auditoria (
        id INT AUTO_INCREMENT PRIMARY KEY,
        doacao_id INT NOT NULL,
        usuario_id INT NOT NULL,
        acao ENUM('criada', 'aprovada', 'rejeitada', 'editada') NOT NULL,
        dados_anteriores JSON NULL,
        dados_novos JSON NULL,
        observacoes TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (doacao_id) REFERENCES doacoes(id) ON DELETE CASCADE,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        INDEX idx_doacao (doacao_id),
        INDEX idx_data (created_at)
      )
    `;
    await connection.execute(createAuditoriaTable);
    console.log('✅ Tabela auditoria criada/verificada');
    
    // Check if admin exists
    const [adminCheck] = await connection.execute(
      'SELECT COUNT(*) as count FROM usuarios WHERE role = "admin"'
    );
    
    if (adminCheck[0].count === 0) {
      // Create admin user
      const adminPassword = await bcrypt.hash('admin123', 10);
      await connection.execute(`
        INSERT INTO usuarios (nome, email, senha_hash, role) 
        VALUES ('Administrador', 'admin@sistema.com', ?, 'admin')
      `, [adminPassword]);
      console.log('✅ Usuário admin criado (email: admin@sistema.com, senha: admin123)');
    }
    
    // Insert sample grupos if empty
    const [gruposCheck] = await connection.execute('SELECT COUNT(*) as count FROM grupos');
    if (gruposCheck[0].count === 0) {
      const sampleGrupos = [
        ['Equipe Alpha', 'Grupo focado em doações de alimentos'],
        ['Equipe Beta', 'Grupo especializado em arrecadação de fundos'],
        ['Equipe Gamma', 'Grupo dedicado à coleta de brinquedos'],
        ['Equipe Delta', 'Grupo multidisciplinar']
      ];
      
      for (const [nome, descricao] of sampleGrupos) {
        await connection.execute(
          'INSERT INTO grupos (nome, descricao) VALUES (?, ?)',
          [nome, descricao]
        );
      }
      console.log('✅ Grupos de exemplo criados');
    }
    
    console.log('🎉 Estrutura do banco criada com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro na criação do banco:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createDatabase();
