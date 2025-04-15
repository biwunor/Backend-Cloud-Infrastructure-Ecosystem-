import { spawn } from 'child_process';

// Use npm run dev command to start the Vite development server
console.log('Starting Vite development server...');
const viteProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
});

viteProcess.on('error', (error) => {
  console.error('Failed to start Vite server:', error);
});

console.log('Server should be starting up...');