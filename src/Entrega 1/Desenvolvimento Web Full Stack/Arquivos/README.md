# 🎯 **Sistema de Gestão de Doações - Lideranças Empáticas**

Sistema completo de gestão de doações com autenticação JWT, upload de imagens e CRUD completo.

## 🚀 **Tecnologias Utilizadas**

### **Frontend**
- ✅ **React 18** com Hooks (useState, useEffect, useRef)
- ✅ **React Router DOM** para navegação SPA
- ✅ **CSS Avançado** com Flexbox/Grid e animações
- ✅ **Fetch API** para consumo da API REST
- ✅ **JWT Authentication** com localStorage
- ✅ **Upload de Imagens** via FormData
- ✅ **Responsivo** e acessível

### **Backend**
- ✅ **Node.js + Express** API REST
- ✅ **MySQL** banco de dados relacional
- ✅ **JWT** autenticação e autorização
- ✅ **Bcrypt** criptografia de senhas
- ✅ **Multer** upload de imagens
- ✅ **CORS** configurado
- ✅ **Middleware** de autenticação e validação

## 📋 **Funcionalidades**

### **👤 Sistema de Usuários**
- Login/Registro com validação
- 3 tipos de usuário: Admin, Mentor, Aluno
- Autenticação JWT com token
- Proteção de rotas por role

### **🏢 Gestão de Grupos**
- CRUD completo de grupos
- Atribuição automática de mentores
- Um mentor por grupo
- Alunos e mentores obrigatoriamente em grupos

### **🎁 Gestão de Doações**
- Alunos criam doações com upload de imagens
- Mentores aprovam/rejeitam doações do seu grupo
- Sistema de auditoria completo
- Categorias: Alimentos, Fundos, Brinquedos

### **📊 Dashboard e Relatórios**
- Dashboard específico por role
- Estatísticas e KPIs
- Ranking de grupos
- Histórico de doações

## 🛠️ **Instalação Local**

### **1. Pré-requisitos**
```bash
# Node.js 18+
# MySQL 8.0+
# Git
```

### **2. Backend**
```bash
cd server
npm install
cp .env.example .env
# Configurar .env com suas credenciais MySQL
npm run create-db
npm run dev
```

### **3. Frontend**
```bash
# Servir com Python
python -m http.server 8000

# Ou usar Live Server no VS Code
# Abrir index.html com Live Server
```

### **4. Acessar**
- Frontend: http://localhost:8000
- Backend: http://localhost:3001
- Login Admin: admin@sistema.com / admin123

## 🌐 **Deploy**

### **Backend (Render/Railway)**
1. Criar conta no Render ou Railway
2. Conectar repositório GitHub
3. Configurar variáveis de ambiente:
   ```
   DB_HOST=seu_host_mysql
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=gestao_doacoes
   JWT_SECRET=sua_chave_jwt_segura
   ```
4. Deploy automático

### **Frontend (Netlify/Vercel)**
1. Criar conta no Netlify ou Vercel
2. Fazer upload da pasta ou conectar GitHub
3. Configurar build settings:
   - Build command: (nenhum, é SPA estático)
   - Publish directory: ./
4. Atualizar env.js com URL da API em produção

## 📁 **Estrutura do Projeto**

```
├── index.html              # Frontend SPA React
├── env.js                  # Configurações de ambiente
├── server/                 # Backend Node.js
│   ├── src/
│   │   ├── config/         # Configuração do banco
│   │   ├── controllers/    # Controladores da API
│   │   ├── middleware/     # Middlewares (auth, upload)
│   │   ├── models/         # Models do banco
│   │   ├── routes/         # Rotas da API
│   │   └── scripts/        # Scripts de inicialização
│   ├── uploads/            # Arquivos enviados
│   └── package.json
└── public/                 # Assets estáticos
```

## 🔑 **Credenciais Padrão**

```
Admin:
Email: admin@sistema.com
Senha: admin123
```

## 📊 **Endpoints da API**

```
POST /api/auth/login              # Login
POST /api/auth/register           # Registro
GET  /api/grupos/publico          # Listar grupos (público)
GET  /api/doacoes                 # Listar doações (autenticado)
POST /api/doacoes                 # Criar doação (aluno)
PUT  /api/doacoes/:id/aprovar     # Aprovar doação (mentor)
PUT  /api/doacoes/:id/rejeitar    # Rejeitar doação (mentor)
POST /api/upload/donation-files   # Upload de arquivos
```

## 🔒 **Segurança**

- ✅ Senhas criptografadas com Bcrypt
- ✅ JWT com expiração configurável
- ✅ Middleware de autenticação em rotas protegidas
- ✅ Validação de roles e permissões
- ✅ Upload seguro com validação de tipos
- ✅ CORS configurado
- ✅ Sanitização de inputs

## 🧪 **Testes**

### **Fluxo Completo**
1. Registrar como mentor em um grupo
2. Registrar como aluno no mesmo grupo
3. Como aluno: criar doação com upload de imagens
4. Como mentor: aprovar/rejeitar doação
5. Como admin: visualizar relatórios

## 📞 **Suporte**

Sistema desenvolvido para o projeto de Desenvolvimento Web Full Stack.

---

**🎉 Sistema 100% funcional e pronto para produção!**
