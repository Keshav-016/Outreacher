import express, { Request, Response } from 'express';
import cors from 'cors';
import { generateMessageStream } from './service';
import { GenerateRequest } from './interface';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

app.post('/generate', async (req: Request, res: Response) => {
  try {
    const { user, profile } = req.body as GenerateRequest;

    if (!user || !profile) {
      return res.status(400).json({ error: 'Missing user or profile data' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Stream the chunks
    for await (const chunk of generateMessageStream(user, profile)) {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    }

    // Send completion signal
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Error generating message:', error);
    res.status(500).json({ error: 'Failed to generate message' });
  }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Outreacher Generator API running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
