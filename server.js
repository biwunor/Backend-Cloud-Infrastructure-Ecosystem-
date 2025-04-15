// Simple Express server to serve the UW Help App
import express from 'express';
import { createServer as createHttpServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  const server = createHttpServer(app);
  
  // Serve static files from the client directory
  app.use(express.static(path.join(__dirname, 'client')));

  // API endpoint to check server status
  app.get('/api/status', (req, res) => {
    res.json({ status: 'ok', message: 'UW Help App server is running' });
  });

  // Serve the index.html for all other routes (SPA support)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
  });

  // Start the server on port 5000 (Replit default)
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`UW Help App server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} in your browser`);
  });

  return server;
}

// Start the server
createServer().catch(err => {
  console.error('Failed to start server:', err);
});