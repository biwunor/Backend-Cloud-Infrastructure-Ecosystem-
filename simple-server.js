// Simplified server for UW Help App
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express application
const app = express();

// Serve static files from client directory
app.use(express.static(path.join(__dirname, 'client')));

// Basic status API endpoint
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'UW Help App simple server is running' });
});

// Catch-all route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Start server on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`UW Help App simple server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} in your browser`);
});