# UW Help App

## Project Overview

The UW Help App is designed to assist users in managing waste disposal efficiently. It provides features like waste disposal preferences, notifications, and user profiles.

## Features

- Onboarding screens for new users.
- User authentication (Login, Register).
- Dashboard with waste statistics and navigation.
- Waste disposal preferences setup.
- Notifications and user profile management.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd uw-help-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Directory Structure

```
src/
  components/
    Authentication/
      Login.jsx
      Register.jsx
      SignUpAs.jsx
    Dashboard/
      Dashboard.jsx
      Notifications.jsx
      ...
    DisposeWaste/
      Default.jsx
    shared/
      FooterNavBar.jsx
      Header.jsx
    ui/
      select.jsx
      button.jsx
      ...
  assets/
    images/
      uw-logo.png
      ...
```

## Usage

- Access the app at `http://localhost:3000` after starting the development server.
- Navigate through the app using the footer navigation bar.

## Dependencies

- React
- React Router
- Tailwind CSS

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License.
