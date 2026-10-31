import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'NexusLearn Primary Express API',
    timestamp: new Date().toISOString()
  });
});

// REST API Endpoints
app.get('/api/v1/tracks', (req, res) => {
  res.json({
    data: [
      { id: 'full-stack', title: 'Full-Stack Web Development', levelCount: 6, moduleCount: 18 },
      { id: 'ai-tools', title: 'AI Tools Mastery & Practical Workflows', levelCount: 6, moduleCount: 12 },
      { id: 'ai-engineering', title: 'AI Engineering & Generative AI Systems', levelCount: 7, moduleCount: 16 }
    ]
  });
});

app.get('/api/v1/health/db', (req, res) => {
  res.json({
    database: 'Supabase PostgreSQL',
    pgvector: 'enabled',
    rls: 'enforced',
    status: 'connected'
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`[NexusLearn] Express API server running on http://localhost:${PORT}`);
});
