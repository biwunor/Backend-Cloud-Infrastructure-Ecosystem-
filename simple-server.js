import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, 'client')));

// API endpoint to verify server is running
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'UW Help App server is running' });
});

// Send index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`UW Help App simple server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} in your browser`);
});