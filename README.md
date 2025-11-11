## FECAP - Fundação de Comércio Álvares Penteado

<p align="center">
<a href= "https://www.fecap.br/"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhZPrRa89Kma0ZZogxm0pi-tCn_TLKeHGVxywp-LXAFGR3B1DPouAJYHgKZGV0XTEf4AE&usqp=CAU" alt="FECAP - Fundação de Comércio Álvares Penteado" border="0" width="450" height="450"></a>
</p>


## Grupo: DevLeaders


## Integrantes: <a href="https://www.linkedin.com/in/gustavo-pires0/">Gustavo Felizardo Pires</a>, <a href="https://www.linkedin.com/in/lucio-vecchio/">Lúcio Vecchio Huminski de Carvalho</a>, <a href="https://www.linkedin.com/in/luiz-miguel-de-toledo-b35701351/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"> Luiz Miguel de Toledo, <a href="https://www.linkedin.com/in/nathan-santos-de-lima-aa5401355/"> Nathan Santos de Lima


## Professores Orientadores: <a href="https://www.linkedin.com/in/cristina-machado-corr%C3%AAa-leite-630309160/">Cristina Machado Corrêa Leite</a>, <a href="https://www.linkedin.com/in/dolemes/">David de Oliveira Lemes</a>, <a href="https://www.linkedin.com/in/leonardo-fabris-lugoboni-a3369416/">Leonardo Fabris Lugoboni</a>, Katia Milani Lara Bossi, Francisco de Souza Escobar


## Descrição

<p align="center">
<img width="450" height="450" alt="logo dev leaders" src="https://github.com/user-attachments/assets/0565a7c5-2df8-4aa2-9f4c-e82369d371cf" />



Sistema web para gerenciar doações em organizações, com controle de usuários, aprovação de doações e upload de comprovantes.

## Funcionalidades
- **Autenticação JWT** com 3 tipos de usuário (Admin, Mentor, Aluno)
- **CRUD completo** de usuários, grupos e doações
- **Upload de arquivos** com Multer (fotos/comprovantes)
- **Sistema de aprovação** mentor para doações
- **Dashboard responsivo** com React SPA
- **Auditoria completa** de todas as ações

## Tecnologias
- **Frontend:** React 18, JavaScript ES6+, CSS3
- **Backend:** Node.js, Express.js, MySQL/PostgreSQL
- **Autenticação:** JWT + Bcrypt
- **Upload:** Multer
- **Deploy:** Vercel/Netlify + Railway/Render

## Rotas da API

Autenticação
POST /api/auth/login POST /api/auth/register

Usuários
GET /api/usuarios POST /api/usuarios

Grupos
GET /api/grupos POST /api/grupos

Doações
GET /api/doacoes POST /api/doacoes POST /api/doacoes/:id/aprovar POST /api/doacoes/:id/rejeitar

Upload
POST /api/upload/doacoes


## Estrutura de pastas

\-Raiz<br>
|<br>
|--\>documentos<br>
|--\>src<br>
|.gitignore<br>
|README.md


## Modelagem Banco de Dados

 A modelagem completa do banco de dados está disponível neste arquivo:  [Entrega 1](./src/Entrega%201/Projetos%20em%20Banco%20de%20Dados/README.md)


A descrição completa do banco de dados está disponível neste arquivo:  [Entrega 2](./src/Entrega%202/Projetos%20em%20Banco%20de%20Dados/README.md)


## Link do Projeto

 O Frontend e o Backend podem ser acessados publicamente através do link: https://gestaoliderancasempaticas.netlify.app/
