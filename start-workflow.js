// This script is used to start the UW Help App in a Replit workflow
console.log('Starting UW Help App...');

// Set environment variable for development
process.env.NODE_ENV = 'development';

// Import server entry point
import('./server/index.ts').catch(err => {
  console.error('Failed to start the application:', err);
  process.exit(1);
});