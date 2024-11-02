import express from 'express';
import cors from 'cors';
import ollama from 'ollama';

const app = express();
const PORT = 5000;

// Enhanced CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));

// Increase payload limit for base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Add basic request validation middleware
const validateChatRequest = (req, res, next) => {
  const { model, messages } = req.body;
  
  if (!model || !messages || !Array.isArray(messages)) {
    return res.status(400).json({
      error: 'Invalid request format. Required fields: model, messages (array)'
    });
  }
  
  if (!messages.length) {
    return res.status(400).json({
      error: 'Messages array cannot be empty'
    });
  }
  
  next();
};

app.post('/api/chat', validateChatRequest, async (req, res) => {
  try {
    const { model, messages, images } = req.body;

    // Add timeout to ollama request
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000); // 25 second timeout

    try {
      const response = await ollama.chat({
        model,
        messages,
        images,
        signal: controller.signal
      });

      clearTimeout(timeout);
      res.json(response);
    } catch (error) {
      clearTimeout(timeout);
      throw error; // Re-throw to be caught by outer catch block
    }
  } catch (error) {
    console.error('Error with ollama API:', error);
    
    // Provide more specific error messages
    if (error.name === 'AbortError') {
      res.status(504).json({ error: 'Request timed out' });
    } else if (error.code === 'ECONNREFUSED') {
      res.status(503).json({ error: 'Cannot connect to Ollama service' });
    } else {
      res.status(500).json({ 
        error: 'Internal Server Error',
        details: error.message
      });
    }
  }
});

// Add health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});