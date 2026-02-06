import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INSTRUCTIONS_FILE = path.join(__dirname, 'last-instructions.md');
const QA_API_URL = process.env.QA_API_URL;

if (!QA_API_URL) {
  console.error('Error: QA_API_URL environment variable is required');
  console.error('Example: QA_API_URL=http://localhost:4000 npm start');
  process.exit(1);
}

const app = express();
const PORT = 3000;

// Timestamp logging helper
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Get saved instructions
app.get('/api/instructions', (req, res) => {
  try {
    if (fs.existsSync(INSTRUCTIONS_FILE)) {
      const instructions = fs.readFileSync(INSTRUCTIONS_FILE, 'utf8');
      res.json({ instructions });
    } else {
      res.json({ instructions: '' });
    }
  } catch (error) {
    res.json({ instructions: '' });
  }
});

// Save instructions
app.post('/api/instructions', (req, res) => {
  const { instructions } = req.body;
  try {
    fs.writeFileSync(INSTRUCTIONS_FILE, instructions || '', 'utf8');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save instructions' });
  }
});

// Start a new QA job - proxy to qa-agent-project API
app.post('/api/start-qa', async (req, res) => {
  const { instructions } = req.body;

  log('Request received');
  log(`Instructions: ${instructions ? instructions.substring(0, 100) + (instructions.length > 100 ? '...' : '') : '(empty)'}`);

  if (!instructions) {
    log('Error: Instructions are required');
    return res.status(400).json({ error: 'Instructions are required' });
  }

  log(`Proxy mode: forwarding to ${QA_API_URL}`);
  try {
    const response = await fetch(`${QA_API_URL}/api/qa/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instructions })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    // Return jobId with proxy marker
    res.json({ jobId: data.jobId, proxy: true });
  } catch (error) {
    log(`Proxy error: ${error.message}`);
    res.status(502).json({ error: `Failed to connect to QA API: ${error.message}` });
  }
});

// Stream job output via SSE - proxy from qa-agent-project API
app.get('/api/stream/:jobId', async (req, res) => {
  const jobId = parseInt(req.params.jobId);

  log(`Job ${jobId}: Proxy mode - connecting to upstream SSE`);
  try {
    const upstreamResponse = await fetch(`${QA_API_URL}/api/qa/stream/${jobId}`);

    if (!upstreamResponse.ok) {
      return res.status(upstreamResponse.status).json({ error: 'Job not found' });
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Pipe the upstream SSE stream to the client
    const reader = upstreamResponse.body.getReader();
    const decoder = new TextDecoder();

    const pump = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            res.end();
            break;
          }
          const chunk = decoder.decode(value, { stream: true });
          res.write(chunk);
        }
      } catch (error) {
        log(`Job ${jobId}: Proxy stream error: ${error.message}`);
        res.end();
      }
    };

    pump();

    // Handle client disconnect
    req.on('close', () => {
      log(`Job ${jobId}: Client disconnected from proxy`);
      reader.cancel();
    });
  } catch (error) {
    log(`Job ${jobId}: Proxy connection error: ${error.message}`);
    res.status(502).json({ error: `Failed to connect to QA API: ${error.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`Local QA UI running at http://localhost:${PORT}`);
  console.log(`Mode: Proxy to ${QA_API_URL}`);
});
