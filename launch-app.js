// Launch script for UW Help App
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting UW Help App...');

try {
  // Run the development server
  execSync('NODE_ENV=development npx tsx server/index.ts', {
    stdio: 'inherit'
  });
} catch (error) {
  console.error('Error starting the app:', error);
}