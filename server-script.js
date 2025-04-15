// Server script that will run the simple server in the background
import { exec } from 'child_process';

console.log('Starting UW Help App server in background...');

// Run the simple server
const server = exec('node simple-server.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});

// Handle server output
server.stdout.on('data', (data) => {
  console.log(`Server: ${data}`);
});

server.stderr.on('data', (data) => {
  console.error(`Server Error: ${data}`);
});

// Log when server exits
server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Keep the process alive but exit script normally
console.log('UW Help App server started in background. Access it at http://localhost:5000');
console.log('Exiting server script gracefully...');