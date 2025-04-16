import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
import { createRequire } from 'module';
import process from 'process';

dotenv.config();

// GitHub configuration
const owner = 'biwunor';
const repo = 'Backend-Cloud-Infrastructure-Ecosystem-';

// For importing CommonJS modules
const require = createRequire(import.meta.url);

async function main() {
  console.log('Starting GitHub deployment process...');
  
  // Create Octokit instance with the provided token
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('Error: GitHub token not found in environment variables.');
    console.log('Please set the GITHUB_TOKEN environment variable.');
    process.exit(1);
  }
  
  const octokit = new Octokit({
    auth: token
  });

  try {
    console.log(`Connecting to GitHub repository: ${owner}/${repo}`);
    
    // Check if repository exists
    try {
      const { data: repository } = await octokit.repos.get({
        owner,
        repo
      });
      console.log(`Repository found: ${repository.html_url}`);
    } catch (error) {
      if (error.status === 404) {
        console.log('Repository not found. Creating a new repository...');
        // Create repository if it doesn't exist
        const { data: newRepo } = await octokit.repos.createForAuthenticatedUser({
          name: repo,
          description: 'A dynamic digital sustainability platform tailored for Africa, transforming environmental responsibility into an engaging, technology-driven experience.',
          private: false
        });
        console.log(`Repository created: ${newRepo.html_url}`);
      } else {
        throw error;
      }
    }

    // Define the files we want to commit and push
    console.log('Preparing files for deployment...');
    
    // Show a menu of deployment options
    showMainMenu();
    
  } catch (error) {
    console.error('Error during GitHub deployment:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

function showMainMenu() {
  console.log('\n----- GitHub Deployment Menu -----');
  console.log('1. Deploy to GitHub Pages');
  console.log('2. Deploy to AWS');
  console.log('3. Deploy to Netlify');
  console.log('4. Build project only');
  console.log('5. Exit');
  console.log('----------------------------------');
  console.log('Please select an option by running:');
  console.log('node deploy.js [option]');
  console.log('Example: node deploy.js 1');
}

async function deployToGitHubPages() {
  console.log('Starting GitHub Pages deployment...');
  try {
    const ghpages = require('gh-pages');
    
    ghpages.publish('.', {
      branch: 'gh-pages',
      message: 'Auto-generated commit from deployment script',
      repo: `https://${process.env.GITHUB_TOKEN}@github.com/${owner}/${repo}.git`,
      user: {
        name: 'Bonaventure',
        email: 'biwunor@example.com'
      }
    }, function(err) {
      if (err) {
        console.error('Error during GitHub Pages deployment:', err);
        process.exit(1);
      } else {
        console.log('Successfully deployed to GitHub Pages!');
        console.log(`Visit: https://${owner}.github.io/${repo}/`);
      }
    });
  } catch (error) {
    console.error('Error loading gh-pages module:', error);
    process.exit(1);
  }
}

async function buildOnly() {
  console.log('Building project for manual deployment...');
  try {
    const fs = require('fs');
    const path = require('path');
    const { execSync } = require('child_process');
    
    // Create temporary directory for build
    const buildDir = path.join('/tmp', 'africa-help-app-build');
    if (fs.existsSync(buildDir)) {
      execSync(`rm -rf ${buildDir}`);
    }
    fs.mkdirSync(buildDir, { recursive: true });
    
    // Copy all files to build directory
    console.log('Copying project files...');
    execSync(`cp -r . ${buildDir}`);
    
    // Create zip archive
    console.log('Creating zip archive...');
    const zipPath = path.join('/tmp', 'africa-help-app.zip');
    execSync(`cd ${buildDir} && zip -r ${zipPath} .`);
    
    console.log(`\nBuild completed successfully!`);
    console.log(`Zip archive created at: ${zipPath}`);
    console.log(`Size: ${(fs.statSync(zipPath).size / (1024 * 1024)).toFixed(2)} MB`);
    console.log('\nYou can download this file and manually upload it to your repository.');
    
  } catch (error) {
    console.error('Error during build process:', error);
    process.exit(1);
  }
}

// Process command line arguments
const option = process.argv[2];
if (option) {
  switch (option) {
    case '1':
      deployToGitHubPages();
      break;
    case '2':
      console.log('AWS deployment option selected. Feature coming soon.');
      break;
    case '3':
      console.log('Netlify deployment option selected. Feature coming soon.');
      break;
    case '4':
      buildOnly();
      break;
    case '5':
      console.log('Exiting deployment tool.');
      process.exit(0);
      break;
    default:
      console.log('Invalid option selected.');
      showMainMenu();
      break;
  }
} else {
  main().catch(console.error);
}