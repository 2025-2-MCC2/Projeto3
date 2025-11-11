import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gestao_doacoes'
};

async function resetDatabase() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conectado ao banco de dados');
    
    // Desabilitar verificação de chaves estrangeiras temporariamente
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    
    // Limpar todas as tabelas
    console.log('🧹 Limpando dados existentes...');
    
    await connection.execute('DELETE FROM auditoria');
    console.log('   ✅ Tabela auditoria limpa');
    
    await connection.execute('DELETE FROM doacoes');
    console.log('   ✅ Tabela doacoes limpa');
    
    await connection.execute('DELETE FROM usuarios WHERE role != "admin"');
    console.log('   ✅ Usuários não-admin removidos');
    
    await connection.execute('DELETE FROM grupos');
    console.log('   ✅ Tabela grupos limpa');
    
    // Reabilitar verificação de chaves estrangeiras
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    
    // Resetar AUTO_INCREMENT
    await connection.execute('ALTER TABLE auditoria AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE doacoes AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE usuarios AUTO_INCREMENT = 2'); // Manter admin com ID 1
    await connection.execute('ALTER TABLE grupos AUTO_INCREMENT = 1');
    
    console.log('🔄 AUTO_INCREMENT resetado');
    
    // Verificar se admin existe, se não, criar
    const [adminCheck] = await connection.execute(
      'SELECT COUNT(*) as count FROM usuarios WHERE role = "admin"'
    );
    
    if (adminCheck[0].count === 0) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      await connection.execute(`
        INSERT INTO usuarios (nome, email, senha_hash, role) 
        VALUES ('Administrador', 'admin@sistema.com', ?, 'admin')
      `, [adminPassword]);
      console.log('👤 Usuário admin criado');
    } else {
      console.log('👤 Usuário admin já existe');
    }
    
    // Criar grupos de exemplo limpos
    const gruposExemplo = [
      ['Equipe Alpha', 'Grupo focado em doações de alimentos'],
      ['Equipe Beta', 'Grupo especializado em arrecadação de fundos'],
      ['Equipe Gamma', 'Grupo dedicado à coleta de brinquedos'],
      ['Equipe Delta', 'Grupo multidisciplinar']
    ];
    
    console.log('🏢 Criando grupos de exemplo...');
    for (const [nome, descricao] of gruposExemplo) {
      await connection.execute(
        'INSERT INTO grupos (nome, descricao) VALUES (?, ?)',
        [nome, descricao]
      );
    }
    console.log('   ✅ 4 grupos criados');
    
    console.log('\n🎉 Database resetado com sucesso!');
    console.log('\n📋 Estado atual:');
    console.log('   👤 1 Admin: admin@sistema.com / admin123');
    console.log('   🏢 4 Grupos vazios (sem mentores)');
    console.log('   🎁 0 Doações');
    console.log('   📊 0 Registros de auditoria');
    console.log('\n✨ Pronto para testar o CRUD completo!');
    
  } catch (error) {
    console.error('❌ Erro ao resetar database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

resetDatabase();
