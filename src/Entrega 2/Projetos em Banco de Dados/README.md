A tabela usuario possui chave primária para controlar os logins e cadastros, evitando duplicidades. A tabela doacao tem chave primária para não cadastrar doações iguais e chave estrangeira ligando com a tabela usuario. A tabela item_doacao também tem chave primária para evitar itens duplicados e chave estrangeira conectando com a tabela doacao.

Relacionamentos:

usuario -> doacao: Um usuário pode fazer várias doações, mas cada doação pertence a apenas um usuário (1,n)

doacao -> item_doacao: Uma doação pode ter vários itens, mas cada item pertence a apenas uma doação (1,n)

Table usuario {
  id_usuario int [pk, increment]
  nome varchar
  email varchar
  senha varchar
  telefone varchar
  papel varchar // ADMIN, MENTOR ou ALUNO
}

Table doacao {
  id_doacao int [pk, increment]
  id_usuario int [ref: > usuario.id_usuario]
  data_doacao datetime
  forma_pagamento varchar
  status varchar
}

Table item_doacao {
  id_item int [pk, increment]
  id_doacao int [ref: > doacao.id_doacao]
  brinquedos_qtd int
  alimentos_kg decimal(10,2)
  arrecadacoes_valor decimal(10,2)
  descricao varchar
  estado varchar
}

Foram implementadas chaves estrangeiras conectando as tabelas (usuário > doacao > item_doacao)
Também foi adicionado um sistema hierarquico para que os alunos façam doações que tenham itens
Um controle de acesso foi colocado através de do campo papel (ADMIN, MENTOR, ALUNO) junto com uma rastreabilidade das doações completa, iniciando usuários até os itens que foram doados.'