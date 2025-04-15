// Simple static file server
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

console.log(`Starting server on port ${PORT}`);
console.log(`Serving files from: ${DIST_DIR}`);

const server = http.createServer((req, res) => {
  let url = req.url;
  
  // Handle URL paths to serve index.html for client-side routing
  if (url !== '/' && !url.includes('.')) {
    url = '/index.html';
  }
  
  // Default to index.html for root path
  if (url === '/') {
    url = '/index.html';
  }
  
  const filePath = path.join(DIST_DIR, url);
  
  // Security check to prevent directory traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // If the specific file wasn't found, try serving index.html for SPA routing
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(DIST_DIR, 'index.html'), (err, indexData) => {
          if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
          }
          
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(indexData);
        });
        return;
      }
      
      res.writeHead(500);
      res.end('Server error');
      return;
    }
    
    // Set the correct content type
    const ext = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (ext) {
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
    }
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}/`);
});