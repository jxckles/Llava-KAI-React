import express from 'express';
import cors from 'cors';
import ollama from 'ollama';

const app = express();
const PORT = 5000;

// Use CORS middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Specify your frontend's origin
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { model, messages, images } = req.body;

    const response = await ollama.chat({
      model,
      messages,
      images,
    });

    res.json(response);
  } catch (error) {
    console.error('Error with ollama API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
