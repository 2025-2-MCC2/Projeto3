O banco de dados do Portal de Doações foi expandido com duas novas tabelas essenciais: a tabela categoria_doacao organiza e classifica os tipos de doações em categorias como Roupas, Brinquedos, Alimentos e Financeiro, controlando quais estão ativas ou inativas no sistema; já a tabela historico_status registra todo o histórico de mudanças no ciclo de vida das doações, armazenando quem alterou o status, quando foi modificado e o motivo da alteração, garantindo total rastreabilidade e transparência no processo de aprovação e gestão das doações desde o início até a finalização.

CREATE TABLE categoria_doacao (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL, -- Ex: Dinheiro, Brinquedos, Alimentos
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE historico_status (
    id_historico INT AUTO_INCREMENT PRIMARY KEY,
    id_doacao INT NOT NULL,
    status_anterior VARCHAR(50),
    status_novo VARCHAR(50) NOT NULL,
    alterado_por INT NOT NULL,
    data_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo TEXT,
    FOREIGN KEY (id_doacao) REFERENCES doacao(id_doacao) ON DELETE CASCADE,
    FOREIGN KEY (alterado_por) REFERENCES usuario(id_usuario)
);

O sistema possui relacionamentos hierárquicos bem definidos. Na base está o usuário que pode realizar múltiplas doações (relacionamento 1:N). Cada doação pertence a uma categoria específica (relacionamento 1:1) e pode conter vários itens (relacionamento 1:N). Além disso, cada doação possui um histórico de status que registra todas as suas alterações ao longo do tempo (relacionamento 1:N), onde cada mudança de status é vinculada ao usuário que realizou a modificação.