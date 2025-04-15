#!/usr/bin/env node

import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting UW Help App...');

// Check if package.json exists
if (!fs.existsSync('./package.json')) {
  console.error('Error: package.json not found. Make sure you are in the project root directory.');
  process.exit(1);
}

// Start the server
console.log('Starting server...');
const server = spawn('node', ['start-app.js'], {
  stdio: 'inherit',
  shell: true
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
});

server.on('close', (code) => {
  if (code !== 0) {
    console.log(`Server process exited with code ${code}`);
  }
});

// Keep the process running
process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.kill();
  process.exit(0);
});

console.log('UW Help App is running!');