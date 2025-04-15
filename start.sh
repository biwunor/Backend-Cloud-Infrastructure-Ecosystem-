#!/bin/bash

# Color codes for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting UW Help App Development Server${NC}"
echo -e "${BLUE}--------------------------------------------${NC}\n"

# Check if the environment is ready
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Installing dependencies...${NC}"
  npm install
fi

# Start the development server
echo -e "${GREEN}Starting Vite development server...${NC}"
npm run dev