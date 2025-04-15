// Deployment utility script
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ANSI color codes for prettier output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Print colored header
console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}   UW Help App Deployment Utility      ${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log();

// Main menu function
function showMainMenu() {
  console.log(`${colors.bright}Select a deployment target:${colors.reset}`);
  console.log(`${colors.green}1. GitHub Pages${colors.reset}`);
  console.log(`${colors.blue}2. AWS S3 + CloudFront${colors.reset}`);
  console.log(`${colors.yellow}3. Netlify${colors.reset}`);
  console.log(`${colors.dim}4. Build Only (No Deployment)${colors.reset}`);
  console.log(`${colors.red}5. Exit${colors.reset}`);
  console.log();
  
  rl.question(`${colors.bright}Enter your choice (1-5): ${colors.reset}`, (answer) => {
    switch(answer.trim()) {
      case '1':
        deployToGitHubPages();
        break;
      case '2':
        deployToAWS();
        break;
      case '3':
        deployToNetlify();
        break;
      case '4':
        buildOnly();
        break;
      case '5':
        console.log(`${colors.yellow}Exiting deployment utility.${colors.reset}`);
        rl.close();
        break;
      default:
        console.log(`${colors.red}Invalid option. Please try again.${colors.reset}`);
        showMainMenu();
    }
  });
}

// Build the project
function buildProject() {
  console.log(`${colors.yellow}Building project...${colors.reset}`);
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log(`${colors.green}Build completed successfully!${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Build failed:${colors.reset}`, error.message);
    return false;
  }
}

// Deploy to GitHub Pages
function deployToGitHubPages() {
  console.log(`${colors.green}Preparing for GitHub Pages deployment...${colors.reset}`);
  
  // Check if gh-pages package is installed
  try {
    execSync('npm list gh-pages', { stdio: 'pipe' });
  } catch (error) {
    console.log(`${colors.yellow}Installing gh-pages package...${colors.reset}`);
    execSync('npm install --save-dev gh-pages', { stdio: 'inherit' });
  }
  
  // Check for repository configuration
  let packageJson;
  try {
    packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (!packageJson.homepage) {
      rl.question(`${colors.yellow}Enter your GitHub Pages URL (e.g., https://username.github.io/repo-name/): ${colors.reset}`, (homepage) => {
        packageJson.homepage = homepage.trim();
        fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
        console.log(`${colors.green}Updated package.json with homepage: ${packageJson.homepage}${colors.reset}`);
        continueWithGitHubDeployment();
      });
    } else {
      continueWithGitHubDeployment();
    }
  } catch (error) {
    console.error(`${colors.red}Error reading package.json:${colors.reset}`, error.message);
    returnToMainMenu();
  }
}

function continueWithGitHubDeployment() {
  if (buildProject()) {
    console.log(`${colors.green}Deploying to GitHub Pages...${colors.reset}`);
    try {
      execSync('npm run deploy', { stdio: 'inherit' });
      console.log(`${colors.green}Deployment to GitHub Pages completed successfully!${colors.reset}`);
    } catch (error) {
      console.error(`${colors.red}Deployment failed:${colors.reset}`, error.message);
    }
  }
  returnToMainMenu();
}

// Deploy to AWS
function deployToAWS() {
  console.log(`${colors.blue}Preparing for AWS deployment...${colors.reset}`);
  
  // Check for AWS CLI
  try {
    execSync('aws --version', { stdio: 'pipe' });
  } catch (error) {
    console.log(`${colors.red}AWS CLI is not installed or not in PATH.${colors.reset}`);
    console.log(`${colors.yellow}Please install AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html${colors.reset}`);
    returnToMainMenu();
    return;
  }
  
  // Get AWS configuration
  rl.question(`${colors.blue}Enter your S3 bucket name: ${colors.reset}`, (bucketName) => {
    rl.question(`${colors.blue}Enter your CloudFront distribution ID (optional): ${colors.reset}`, (distributionId) => {
      if (buildProject()) {
        console.log(`${colors.blue}Deploying to S3 bucket: ${bucketName}${colors.reset}`);
        try {
          execSync(`aws s3 sync dist/ s3://${bucketName} --delete`, { stdio: 'inherit' });
          console.log(`${colors.green}S3 deployment completed successfully!${colors.reset}`);
          
          if (distributionId) {
            console.log(`${colors.blue}Creating CloudFront invalidation...${colors.reset}`);
            execSync(`aws cloudfront create-invalidation --distribution-id ${distributionId} --paths "/*"`, { stdio: 'inherit' });
            console.log(`${colors.green}CloudFront invalidation created successfully!${colors.reset}`);
          }
        } catch (error) {
          console.error(`${colors.red}AWS deployment failed:${colors.reset}`, error.message);
        }
      }
      returnToMainMenu();
    });
  });
}

// Deploy to Netlify
function deployToNetlify() {
  console.log(`${colors.yellow}Preparing for Netlify deployment...${colors.reset}`);
  
  // Check for Netlify CLI
  try {
    execSync('netlify --version', { stdio: 'pipe' });
  } catch (error) {
    console.log(`${colors.yellow}Installing Netlify CLI...${colors.reset}`);
    try {
      execSync('npm install netlify-cli -g', { stdio: 'inherit' });
    } catch (cliError) {
      console.log(`${colors.red}Could not install Netlify CLI. Try running:${colors.reset} npm install netlify-cli -g`);
      returnToMainMenu();
      return;
    }
  }
  
  if (buildProject()) {
    console.log(`${colors.yellow}Deploying to Netlify...${colors.reset}`);
    try {
      // Check if user is logged in to Netlify
      execSync('netlify status', { stdio: 'pipe' });
      
      // Ask if they want to create a new site or deploy to existing
      rl.question(`${colors.yellow}Deploy to a new Netlify site? (y/n): ${colors.reset}`, (answer) => {
        const createNewSite = answer.toLowerCase() === 'y';
        
        try {
          if (createNewSite) {
            execSync('netlify sites:create', { stdio: 'inherit' });
          }
          
          execSync('netlify deploy --dir=dist --prod', { stdio: 'inherit' });
          console.log(`${colors.green}Netlify deployment completed successfully!${colors.reset}`);
        } catch (deployError) {
          console.error(`${colors.red}Netlify deployment failed:${colors.reset}`, deployError.message);
        }
        
        returnToMainMenu();
      });
    } catch (error) {
      console.log(`${colors.yellow}You need to log in to Netlify first.${colors.reset}`);
      try {
        execSync('netlify login', { stdio: 'inherit' });
        deployToNetlify();
      } catch (loginError) {
        console.error(`${colors.red}Netlify login failed:${colors.reset}`, loginError.message);
        returnToMainMenu();
      }
    }
  } else {
    returnToMainMenu();
  }
}

// Build only
function buildOnly() {
  buildProject();
  returnToMainMenu();
}

// Return to main menu
function returnToMainMenu() {
  console.log();
  console.log(`${colors.bright}${colors.cyan}----------------------------------------${colors.reset}`);
  showMainMenu();
}

// Start the utility
showMainMenu();

// Handle exit
rl.on('close', () => {
  console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}   Thank you for using the deployment utility!${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
  process.exit(0);
});