// This file is intended to be used with the Replit run command
// Starting our simplified express server to serve the React app

// Import the express module from node_modules
import('./node_modules/express/index.js').then(expressModule => {
  const express = expressModule.default;
  
  // Import other required modules using dynamic imports
  Promise.all([
    import('fs'),
    import('path'),
    import('url')
  ]).then(([fs, path, url]) => {
    const __filename = url.fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    // Create Express app
    const app = express();
    const PORT = 3000;
    
    // Middleware to log requests
    app.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      next();
    });
    
    // Serve static files from client directory
    app.use(express.static(path.join(__dirname, 'client')));
    
    // Handle API routes
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', message: 'Server is running' });
    });
    
    // For any other request, serve the fallback page
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'client', 'fallback.html'));
    });
    
    // Start the server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running at http://0.0.0.0:${PORT}`);
    });
  });
});