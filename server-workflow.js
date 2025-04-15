// This file sets up a node server to run the application
import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Start the dev server using the npm script
console.log('Starting dev server...');
const devProcess = spawn('tsx', ['server/index.ts'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

devProcess.on('close', (code) => {
  console.log(`Dev server process exited with code ${code}`);
});