// Simple script to start the development workflow
const { execSync } = require('child_process');

console.log('Starting development workflow...');

try {
  // Start the Vite development server
  console.log('Starting Vite development server...');
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting development workflow:', error);
  process.exit(1);
}