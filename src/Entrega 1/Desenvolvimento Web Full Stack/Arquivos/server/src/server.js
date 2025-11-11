import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import grupoRoutes from './routes/grupoRoutes.js';
import doacaoRoutes from './routes/doacaoRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import leaderRoutes from './routes/leaderRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// CORS: suporta múltiplas origens separadas por vírgula na env ORIGIN
const defaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://localhost:8000'
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

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/grupos', grupoRoutes);
app.use('/api/doacoes', doacaoRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/uploads', uploadRoutes);
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

// Start server (apenas se não for Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    testConnection();
  });
}

// Export para Vercel
export default app;
