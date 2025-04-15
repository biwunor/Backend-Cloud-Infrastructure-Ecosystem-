// Simple launcher script for the UW Help App
console.log('Starting UW Help App...');

// Import and run the server
import('./server/index.ts').catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});