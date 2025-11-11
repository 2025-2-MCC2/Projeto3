import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

async function createDatabase() {
  let client;
  
  try {
    client = new Client(dbConfig);
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL');
    
    // Criar tabelas
    console.log('🏗️ Criando estrutura do banco...');
    
    // Tabela grupos
    await client.query(`
      CREATE TABLE IF NOT EXISTS grupos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) UNIQUE NOT NULL,
        descricao TEXT,
        mentor_id INTEGER UNIQUE,
        ativo BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('   ✅ Tabela grupos criada');
    
    // Tabela usuarios
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        senha_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'mentor', 'aluno')),
        grupo_id INTEGER REFERENCES grupos(id) ON DELETE SET NULL,
        ativo BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('   ✅ Tabela usuarios criada');
    
    // Tabela doacoes
    await client.query(`
      CREATE TABLE IF NOT EXISTS doacoes (
        id SERIAL PRIMARY KEY,
        descricao TEXT NOT NULL,
        quantidade DECIMAL(10,2) NOT NULL,
        categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('alimento', 'fundos', 'brinquedos')),
        status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovada', 'rejeitada')),
        usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        grupo_id INTEGER NOT NULL REFERENCES grupos(id) ON DELETE CASCADE,
        mentor_aprovador_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
        motivo_rejeicao TEXT,
        risco_score INTEGER DEFAULT 0,
        risco_nivel VARCHAR(20) DEFAULT 'baixo' CHECK (risco_nivel IN ('baixo', 'medio', 'alto')),
        fotos TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('   ✅ Tabela doacoes criada');
    
    // Tabela auditoria
    await client.query(`
      CREATE TABLE IF NOT EXISTS auditoria (
        id SERIAL PRIMARY KEY,
        doacao_id INTEGER REFERENCES doacoes(id) ON DELETE CASCADE,
        usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        acao VARCHAR(50) NOT NULL,
        dados_anteriores TEXT,
        dados_novos TEXT,
        observacoes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('   ✅ Tabela auditoria criada');
    
    // Criar índices
    await client.query('CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_doacoes_status ON doacoes(status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_doacoes_grupo ON doacoes(grupo_id)');
    console.log('   ✅ Índices criados');
    
    // Inserir dados iniciais
    console.log('📊 Inserindo dados iniciais...');
    
    // Verificar se admin já existe
    const adminCheck = await client.query('SELECT COUNT(*) FROM usuarios WHERE role = $1', ['admin']);
    
    if (parseInt(adminCheck.rows[0].count) === 0) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      await client.query(
        'INSERT INTO usuarios (nome, email, senha_hash, role) VALUES ($1, $2, $3, $4)',
        ['Administrador', 'admin@sistema.com', adminPassword, 'admin']
      );
      console.log('   ✅ Usuário admin criado');
    }
    
    // Inserir grupos de exemplo
    const grupos = [
      ['Equipe Alpha', 'Grupo focado em doações de alimentos'],
      ['Equipe Beta', 'Grupo especializado em arrecadação de fundos'],
      ['Equipe Gamma', 'Grupo dedicado à coleta de brinquedos'],
      ['Equipe Delta', 'Grupo multidisciplinar']
    ];
    
    for (const [nome, descricao] of grupos) {
      await client.query(
        'INSERT INTO grupos (nome, descricao) VALUES ($1, $2) ON CONFLICT (nome) DO NOTHING',
        [nome, descricao]
      );
    }
    console.log('   ✅ Grupos de exemplo criados');
    
    console.log('\n🎉 Database PostgreSQL criado com sucesso!');
    console.log('\n📋 Credenciais padrão:');
    console.log('   Admin: admin@sistema.com / admin123');
    
  } catch (error) {
    console.error('❌ Erro ao criar database:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.end();
    }
  }
}

createDatabase();
