# UW Help App

A comprehensive waste management platform designed specifically for the University of Washington community, enabling sustainable disposal practices through innovative digital tools.

## Key Components

- React.js frontend
- Interactive mapping of disposal locations
- User profile system
- Waste tracking and scheduling capabilities
- Community-focused waste reduction features

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account (for authentication and database)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/uw-help-app.git
   cd uw-help-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase configuration (see `.env.example` for required variables)

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

To preview the production build locally:

```bash
npm run preview
```

## Deployment Options

This project supports multiple deployment options:

### GitHub Pages

To deploy to GitHub Pages:

```bash
npm run deploy
```

See [DEPLOY-HELP.md](./DEPLOY-HELP.md) for more details.

### AWS S3 + CloudFront

Automated deployment to AWS S3 and CloudFront is configured using GitHub Actions.

See [DEPLOY-HELP.md](./DEPLOY-HELP.md) and [GITHUB_SECRETS.md](./GITHUB_SECRETS.md) for setup instructions.

### Netlify

Deployment to Netlify is also supported through GitHub Actions or the Netlify CLI.

See [DEPLOY-HELP.md](./DEPLOY-HELP.md) and [GITHUB_SECRETS.md](./GITHUB_SECRETS.md) for configuration details.

## Deployment Utility

A deployment utility script is included to simplify the deployment process:

```bash
node deploy.js
```

This script provides an interactive menu for different deployment options.

## Project Structure

```
uw-help-app/
├── public/              # Static files
│   ├── 404.html         # Custom 404 page
│   └── uw-favicon.png   # Favicon
├── src/
│   ├── assets/          # Images and other assets
│   ├── components/      # React components
│   │   ├── Dashboard/   # Dashboard related components
│   │   ├── DisposeWaste/# Waste disposal components
│   │   ├── SplashScreen/# Splash screen components
│   │   ├── authentication/ # Authentication components
│   │   ├── shared/      # Shared components
│   │   └── ui/          # UI components (buttons, forms, etc.)
│   ├── lib/             # Utility functions
│   ├── App.jsx          # Main App component
│   ├── App.css          # App styles
│   ├── firebase.js      # Firebase configuration
│   ├── index.css        # Global styles
│   └── main.jsx         # Entry point
├── .env.example         # Example environment variables
├── .github/workflows/   # GitHub Actions workflows
├── netlify.toml         # Netlify configuration
├── package.json         # Project metadata and dependencies
└── vite.config.js       # Vite configuration
```

## Environment Variables

This project uses environment variables for configuration. See `.env.example` for the required variables.

In development, you can create a `.env` file in the project root with your actual values.

For production deployments, set these environment variables in your deployment platform (GitHub, AWS, Netlify).

## CI/CD

Continuous Integration and Continuous Deployment are set up with GitHub Actions:

- `.github/workflows/github-pages-deploy.yml` - Deploys to GitHub Pages
- `.github/workflows/aws-deploy.yml` - Deploys to AWS S3 and CloudFront
- `.github/workflows/netlify-deploy.yml` - Deploys to Netlify

See [GITHUB_SECRETS.md](./GITHUB_SECRETS.md) for information on setting up the required secrets.

## License

[MIT](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.