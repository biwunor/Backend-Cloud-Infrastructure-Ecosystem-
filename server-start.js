import express from 'express';
import { createServer } from 'http';
import { setupVite, serveStatic } from './server/vite.js';
import { registerRoutes } from './server/routes.js';

async function createServer() {
  const app = express();
  const httpServer = createServer(app);

  // Setup API routes
  await registerRoutes(app);
  
  // Serve static files in production
  if (process.env.NODE_ENV === 'production') {
    serveStatic(app);
  } else {
    // Setup Vite in development mode
    await setupVite(app, httpServer);
  }

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
  
  return httpServer;
}

createServer().catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});