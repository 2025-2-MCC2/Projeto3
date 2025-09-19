import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';
import leaderRoutes from './routes/leaderRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// CORS: suporta múltiplas origens separadas por vírgula na env ORIGIN
const defaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5500',
  'http://localhost:5500'
];
const envOrigins = (process.env.ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);
const allowedOrigins = envOrigins.length ? envOrigins : defaultOrigins;

app.use(cors({
  origin: function (origin, callback) {
    // Permite ferramentas locais sem origin explícito (ex.: curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/leaders', leaderRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Gestão de Lideranças API está funcionando',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Erro:', error);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
});

// Start server
async function startServer() {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.log('⚠️  Servidor iniciado sem conexão com banco de dados');
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📍 API Leaders: http://localhost:${PORT}/api/leaders`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();
