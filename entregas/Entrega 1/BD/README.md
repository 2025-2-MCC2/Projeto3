As tabelas criadas para o portal de doações foram: usuario, doacao e item_doacao.
A tabela usuario possui chaves primárias para que os login e cadastros não se repitam, podendo desorganizar as doações.
A tabela doacao possui uma chave primária para não cadastrar duas doações iguais e também uma chave estrangeira para conectar com a tabela usuario.
Assim como na tabela doacao, a mesma coisa se repete na item_doacao, que tem uma chave primária para não cadastrar dois produtos/itens iguais e outra para se relacionar com a tabela doacao.

Assim:
– uma relação entre as tabelas usuario e doacao com a cardinalidade (1,n);
– uma relação entre doacao e item_doacao com a cardinalidade (1,n).

Table usuario {
  id_usuario int [pk, increment] // PK
  nome varchar
  email varchar
  senha varchar
  telefone varchar
  papel varchar // ADMIN, MENTOR ou ALUNO
}

Table doacao {
  id_doacao int [pk, increment] // PK
  id_usuario int [ref: > usuario.id_usuario] // FK (usuario)
  data_doacao datetime
  forma_pagamento varchar
  status varchar
}

Table item_doacao {
  id_item int [pk, increment] // PK
  id_doacao int [ref: > doacao.id_doacao] // FK (doacao)
  brinquedos_qtd int // quantidade de brinquedos
  alimentos_kg decimal(10,2) // peso dos alimentos em kg
  arrecadacoes_valor decimal(10,2) // valor das arrecadações em reais
  descricao varchar
  estado varchar
}
