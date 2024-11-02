import express from 'express';
import cors from 'cors';
import ollama from 'ollama';

const app = express();
const PORT = 5000;

// Configure CORS middleware with specific options
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Access-Control-Allow-Credentials'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));

// Add a preflight handler for the chat endpoint
app.options('/api/chat', cors(corsOptions));

app.post('/api/chat', cors(corsOptions), async (req, res) => {
  try {
    const { model, messages, images } = req.body;
    
    // Set CORS headers explicitly for this route
    res.header('Access-Control-Allow-Credentials', 'true');
    
    const response = await ollama.chat({
      model,
      messages,
      images,
    });
    
    res.json(response);
  } catch (error) {
    console.error('Error with ollama API:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});