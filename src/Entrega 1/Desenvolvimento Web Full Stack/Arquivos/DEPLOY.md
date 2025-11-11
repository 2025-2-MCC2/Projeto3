# 🚀 **GUIA DE DEPLOY - SISTEMA COMPLETO**

## **📋 CHECKLIST PRÉ-DEPLOY**

### **✅ Requisitos Atendidos**
- ✅ **React Router DOM** - Navegação SPA implementada
- ✅ **Upload com Multer** - Sistema de upload real funcionando
- ✅ **JWT Authentication** - Token em todas as requests
- ✅ **CRUD Completo** - Frontend integrado com backend
- ✅ **API REST** - Todas as rotas implementadas
- ✅ **Banco MySQL** - Estrutura completa
- ✅ **Validações** - Frontend e backend
- ✅ **Middleware** - Autenticação e upload

---

## **🌐 DEPLOY DO BACKEND (Render)**

### **1. Preparar Repositório**
```bash
# Fazer commit de todas as mudanças
git add .
git commit -m "feat: sistema completo com todos os requisitos"
git push origin main
```

### **2. Deploy no Render**
1. **Acesse**: https://render.com
2. **Crie conta** e conecte GitHub
3. **New Web Service** → Conectar repositório
4. **Configurações**:
   - **Name**: gestao-doacoes-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `server`

### **3. Configurar Variáveis de Ambiente**
```env
NODE_ENV=production
PORT=10000
DB_HOST=seu_host_mysql
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=gestao_doacoes
JWT_SECRET=sua_chave_jwt_muito_segura_aqui
ORIGIN=https://seu-frontend.netlify.app
```

### **4. Configurar Banco de Dados**
- **Opção A**: Usar PostgreSQL do Render (gratuito)
- **Opção B**: MySQL externo (PlanetScale, Railway)
- **Executar**: Script de criação do banco após deploy

---

## **🌐 DEPLOY DO FRONTEND (Netlify)**

### **1. Preparar Arquivos**
```bash
# Atualizar env.js com URL da API em produção
# Substituir: https://sua-api-backend.onrender.com
```

### **2. Deploy no Netlify**
1. **Acesse**: https://netlify.com
2. **Crie conta** e conecte GitHub
3. **New Site from Git** → Conectar repositório
4. **Configurações**:
   - **Build Command**: (deixar vazio)
   - **Publish Directory**: `./`
   - **Base Directory**: (deixar vazio)

### **3. Configurar Redirects**
- Arquivo `netlify.toml` já criado
- Configura SPA routing para React Router

---

## **⚙️ CONFIGURAÇÕES PÓS-DEPLOY**

### **1. Testar API**
```bash
# Testar health check
curl https://sua-api.onrender.com/health

# Testar login
curl -X POST https://sua-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sistema.com","senha":"admin123"}'
```

### **2. Testar Frontend**
- Acessar URL do Netlify
- Testar login admin
- Testar registro de usuário
- Testar upload de imagens
- Testar CRUD completo

### **3. Configurar CORS**
- Adicionar URL do frontend nas variáveis de ambiente
- Testar requests cross-origin

---

## **🔧 TROUBLESHOOTING**

### **Erro de CORS**
```env
# No backend, adicionar:
ORIGIN=https://seu-frontend.netlify.app,https://outro-dominio.com
```

### **Erro de Banco**
```bash
# Executar script de criação:
npm run create-db
```

### **Erro de Upload**
```bash
# Verificar se pasta uploads existe
mkdir -p uploads/donations
```

### **Erro de JWT**
```env
# Gerar nova chave secreta:
JWT_SECRET=nova_chave_muito_segura_com_pelo_menos_32_caracteres
```

---

## **📊 URLs DE EXEMPLO**

### **Produção**
- **Frontend**: https://gestao-doacoes.netlify.app
- **Backend**: https://gestao-doacoes-api.onrender.com
- **Health Check**: https://gestao-doacoes-api.onrender.com/health

### **Desenvolvimento**
- **Frontend**: http://localhost:8000
- **Backend**: http://localhost:3001

---

## **🧪 TESTE COMPLETO PÓS-DEPLOY**

### **1. Teste de Autenticação**
- [ ] Login admin funciona
- [ ] Registro de mentor funciona
- [ ] Registro de aluno funciona
- [ ] Token JWT é salvo e usado
- [ ] Logout funciona

### **2. Teste de CRUD**
- [ ] Criar doação com upload
- [ ] Listar doações por role
- [ ] Aprovar doação (mentor)
- [ ] Rejeitar doação (mentor)
- [ ] Ver estatísticas (admin)

### **3. Teste de Upload**
- [ ] Upload de imagens funciona
- [ ] Validação de tipos funciona
- [ ] Limite de tamanho funciona
- [ ] Arquivos são servidos corretamente

### **4. Teste de Navegação**
- [ ] Rotas protegidas funcionam
- [ ] Redirecionamento por role funciona
- [ ] SPA navigation funciona
- [ ] Refresh da página funciona

---

## **📈 MONITORAMENTO**

### **Logs do Backend**
- Render Dashboard → Logs
- Monitorar erros e performance

### **Analytics do Frontend**
- Netlify Analytics
- Monitorar acessos e erros

### **Banco de Dados**
- Monitorar conexões
- Backup regular dos dados

---

## **🎉 DEPLOY CONCLUÍDO!**

**✅ Sistema 100% funcional em produção**
- Frontend responsivo e rápido
- Backend escalável e seguro
- Banco de dados estruturado
- Upload de imagens funcionando
- Autenticação JWT implementada
- CRUD completo integrado

**🚀 Pronto para uso em produção!**
