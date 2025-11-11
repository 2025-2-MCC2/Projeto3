import { executeQuery, testConnection } from '../src/config/database.js';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método não permitido. Use POST.' 
    });
  }

  try {
    // Testar conexão
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Não foi possível conectar ao banco de dados');
    }
    
    // Criar tabelas (PostgreSQL syntax)
    await executeQuery(`
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
    
    await executeQuery(`
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
    
    await executeQuery(`
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
    
    await executeQuery(`
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
    
    // Criar índices
    await executeQuery('CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)');
    await executeQuery('CREATE INDEX IF NOT EXISTS idx_doacoes_status ON doacoes(status)');
    await executeQuery('CREATE INDEX IF NOT EXISTS idx_doacoes_grupo ON doacoes(grupo_id)');
    
    // Verificar se admin já existe
    const adminCheck = await executeQuery('SELECT COUNT(*) as count FROM usuarios WHERE role = $1', ['admin']);
    
    if (parseInt(adminCheck[0].count) === 0) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      await executeQuery(
        'INSERT INTO usuarios (nome, email, senha_hash, role) VALUES ($1, $2, $3, $4)',
        ['Administrador', 'admin@sistema.com', adminPassword, 'admin']
      );
    }
    
    // Inserir grupos de exemplo
    const grupos = [
      ['Equipe Alpha', 'Grupo focado em doações de alimentos'],
      ['Equipe Beta', 'Grupo especializado em arrecadação de fundos'],
      ['Equipe Gamma', 'Grupo dedicado à coleta de brinquedos'],
      ['Equipe Delta', 'Grupo multidisciplinar']
    ];
    
    for (const [nome, descricao] of grupos) {
      try {
        await executeQuery(
          'INSERT INTO grupos (nome, descricao) VALUES ($1, $2)',
          [nome, descricao]
        );
      } catch (error) {
        // Ignora erro se já existir
        if (!error.message.includes('duplicate key')) {
          throw error;
        }
      }
    }
    
    res.json({
      success: true,
      message: 'Banco de dados inicializado com sucesso!',
      data: {
        admin: 'admin@sistema.com / admin123'
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao inicializar banco: ' + error.message
    });
  }
}
