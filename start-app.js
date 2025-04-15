const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/dist')));

// API endpoint to verify server is running
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'UW Help App server is running' });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back the index.html file.
app.get('*', (req, res) => {
  const clientPath = path.join(__dirname, 'client/dist/index.html');
  if (fs.existsSync(clientPath)) {
    res.sendFile(clientPath);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>UW Help App</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background-color: #f5f5f5;
            }
            .container {
              text-align: center;
              padding: 2rem;
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              max-width: 600px;
            }
            h1 {
              color: #4e2a84; /* UW purple */
            }
            p {
              margin-top: 1rem;
              line-height: 1.5;
            }
            .loader {
              border: 5px solid #f3f3f3;
              border-radius: 50%;
              border-top: 5px solid #4e2a84;
              width: 40px;
              height: 40px;
              animation: spin 1s linear infinite;
              margin: 2rem auto;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>UW Help App</h1>
            <div class="loader"></div>
            <p>The application is still building. This should only take a moment...</p>
            <p>If this message persists, check the Replit console for any errors.</p>
          </div>
        </body>
      </html>
    `);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`UW Help App server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} in your browser`);
});