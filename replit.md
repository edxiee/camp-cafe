# Camp Cafe - Ionic Angular Application

## Overview
Camp Cafe is an Ionic Angular mobile-first application with authentication features including login and signup pages. The app uses a tab-based navigation structure with three main tabs and is built using Angular 20 and Ionic 8.

## Project Information
- **Name:** Camp Cafe
- **Type:** Ionic Angular Application
- **Framework:** Angular 20.0.0
- **UI Framework:** Ionic 8.0.0
- **Package Manager:** npm
- **Build Tool:** Angular CLI
- **Output Directory:** www

## Recent Changes
- **October 30, 2025:** Initial Replit environment setup
  - Configured Angular dev server for Replit proxy (host: 0.0.0.0, port: 5000, disableHostCheck: true)
  - Set up workflow to run Angular dev server
  - Installed all npm dependencies
  - Verified application is running successfully

## Project Architecture

### Directory Structure
- `src/app/` - Main application code
  - `pages/` - Page components (login, signup)
  - `tabs/` - Tab navigation and tab pages (tab1, tab2, tab3)
  - `explore-container/` - Reusable container component
- `src/assets/` - Static assets (images, icons, logos)
- `src/theme/` - SCSS theme files
- `src/environments/` - Environment configuration files
- `resources/` - App icons and splash screens for mobile

### Key Features
1. **Authentication System**
   - Login page with username/password fields
   - Signup page for new user registration
   - Default route redirects to login page

2. **Tab Navigation**
   - Three main tabs (tab1, tab2, tab3)
   - Tab-based navigation structure using Ionic components

3. **Mobile-First Design**
   - Built with Ionic for cross-platform mobile compatibility
   - Capacitor integration for native mobile features
   - Responsive UI components

### Technology Stack
- **Frontend Framework:** Angular 20.0.0
- **UI Components:** Ionic 8.0.0
- **Mobile Runtime:** Capacitor 7.4.4
- **Language:** TypeScript 5.8.0
- **Styling:** SCSS
- **Icons:** Ionicons 7.0.0
- **State Management:** RxJS 7.8.0

## Development

### Running the Application
The application is configured to run automatically via the "Server" workflow which executes:
```bash
ng serve
```

The dev server runs on:
- **Host:** 0.0.0.0
- **Port:** 5000
- **Host Check:** Disabled (required for Replit proxy)

### Available Scripts
- `npm start` - Start the dev server
- `npm run build` - Build for production
- `npm run watch` - Build in watch mode
- `npm test` - Run unit tests
- `npm run lint` - Run ESLint

### Configuration Files
- `angular.json` - Angular CLI configuration with Replit-specific dev server settings
- `ionic.config.json` - Ionic CLI configuration
- `capacitor.config.ts` - Capacitor configuration for mobile platforms
- `tsconfig.json` - TypeScript compiler configuration

## Deployment
The application can be deployed using Replit's deployment feature. The production build outputs to the `www` directory.

## User Preferences
No specific user preferences recorded yet.

## Notes
- Analytics are disabled in Angular CLI configuration
- The application uses Angular standalone components for pages (lazy loaded)
- Capacitor is configured but platforms (iOS/Android) are not yet added
- Development mode is the default configuration for the dev server
