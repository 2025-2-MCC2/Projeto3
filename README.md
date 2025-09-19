# Gestão de Lideranças – PI1

Projeto Web Full Stack (Frontend React sem bundler via CDN + Backend Express + MySQL) com integração mínima e deploy.

## Stack
- Frontend: React 18 (UMD via CDN) + Babel Standalone (apenas dev, no navegador)
- Backend: Node.js, Express, mysql2, CORS, dotenv
- Banco: MySQL (tabela `leaders`)

## Estrutura de Pastas
- `index.html` (Frontend React em CDN)
- `env.js.example` (configuração de API em runtime)
- `server/` (Backend Express)
- `postman/` (Coleção Postman)

## Variáveis de Ambiente

Frontend (runtime, arquivo JS):
- Copie `./env.js.example` para `./env.js` e ajuste:
```js
window.__ENV = {
  API_URL: "http://localhost:3001"
}
```

Backend (`./server/.env` baseado em `./server/.env.example`):
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=gestao_liderancas
PORT=3001
NODE_ENV=development
ORIGIN=http://localhost
```

## Como rodar localmente
Pré-requisitos: MySQL 8+, Node 18+ (somente para o backend)

1) Backend (Express + MySQL)
- Instalar dependências
```
cd server
npm install
```
- Criar base e tabela, com seed (opcional)
```
npm run init-db
```
- Rodar o servidor
```
npm run dev
```
A API estará em: `http://localhost:3001`

2) Frontend (CDN)
- Copie `env.js.example` para `env.js` na raiz do projeto e ajuste `API_URL` se necessário
- Abra o arquivo `index.html` no navegador (duplo clique) OU sirva estaticamente com qualquer servidor HTTP
  - Ex.: via Python: `python -m http.server 5173` e acesse `http://localhost:5173`

## Rotas da API (leaders)
Base URL: `{API_URL}/api/leaders`

- GET `/` – Lista leaders
  - Resposta 200: `{ success, data: Leader[] }`
- GET `/:id` – Busca por id
  - 200 quando existe; 404 quando não encontrado
- POST `/` – Cria leader
  - Body JSON: `{ name: string, role: string, email: string, team?: string }`
  - Validação: `name`, `role`, `email` obrigatórios; `email` único
  - 201 em sucesso; 409 se email já usado; 400 campos inválidos
- PUT `/:id` – Atualiza leader
  - Body JSON igual ao POST
  - 200 em sucesso; 404 se não encontrado; 409 email em uso por outro
- DELETE `/:id` – Remove leader
  - 200 em sucesso; 404 se não encontrado

## Integração Frontend
- O `index.html` monta um app React com componentes `Header`, `Card` e `LeadersSection`
- `LeadersSection` faz `fetch` para `{API_URL}/api/leaders`, com estados de `Carregando…`, erro e vazio
- Página inicial com formulário controlado funcional (Create)

## Deploy

### Frontend (Netlify ou Vercel – site estático)
- Publicar a raiz do projeto contendo `index.html` e `env.js`
- Não há build. Certifique-se de incluir `env.js` com `API_URL` apontando para o backend público

### Backend (Railway/Render)
- Pasta de projeto: `server/`
- Start script: `npm start`
- Variáveis: `DB_*`, `PORT`, `ORIGIN=https://<seu-frontend-publico>`
- Healthcheck: `/health`

Após publicar, atualize abaixo:
- Frontend (URL pública): ...
- Backend (URL pública): ...

## Postman
- Coleção em `postman/PI.postman_collection.json` cobrindo CRUD leaders.

## Vídeo Demonstrativo
- Link: ...

## Limitações/Próximos Passos (PI2)
- Expandir domínio (auth real, times, atividades)
- Estados globais e testes

## Scripts úteis
- Backend: `npm run init-db` (cria DB e seed), `npm run dev`, `npm start`
