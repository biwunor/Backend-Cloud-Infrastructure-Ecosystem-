// This script launches the application using server-start.js
import('./server-start.js').catch(err => {
  console.error('Failed to start the application:', err);
  process.exit(1);
});