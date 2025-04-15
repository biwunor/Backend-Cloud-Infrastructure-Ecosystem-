// Simple script to check if we're in production or development mode
// and start the appropriate server

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if we're in production (dist folder exists with files)
const distFolder = path.join(__dirname, 'dist');
const isProduction = fs.existsSync(distFolder) && 
                    fs.readdirSync(distFolder).length > 0;

console.log(`Starting server in ${isProduction ? 'production' : 'development'} mode...`);

try {
  if (isProduction) {
    // In production, serve the static files from the dist folder
    console.log('Starting static file server...');
    import('./server.js');
  } else {
    // In development, build and then serve
    console.log('Building application first...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('Starting static file server...');
    import('./server.js');
  }
} catch (error) {
  console.error('Error starting server:', error);
  process.exit(1);
}