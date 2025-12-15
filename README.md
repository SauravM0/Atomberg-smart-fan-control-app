# Atomberg Fan Control Application

## Overview
This is a production-ready web application for controlling Atomberg smart fans. It utilizes the official Atomberg Developer API to authenticate users, discover devices, and control fan speed and power states. The application is built with Next.js 16 (App Router) and features a responsive, modern UI styled with Tailwind CSS.

## Architecture
- **Frontend**: Next.js (React 19), Tailwind CSS, Lucide React (Icons).
- **Backend (BFF)**: Next.js API Routes act as a "Backend for Frontend" to securely proxy requests to the Atomberg API, handling token storage and refreshing via `iron-session`.
- **Authentication**: Usage of Atomberg's API Key & Refresh Token mechanism to exchange for short-lived Access Tokens.
- **State Management**: Server-side session management for secure token handling; Client-side optimistic UI updates for responsive controls.

## Hosted / Website
https://atomberg-smart-fan-control-app.vercel.app/login

## Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- An Atomberg Developer Account with a valid API Key and Refresh Token.

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd atomberg-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create a `.env.local` file in the root directory (do not commit this file).
   ```env
   # .env.local
   ATOMBERG_API_KEY=your_api_key_here
   ATOMBERG_REFRESH_TOKEN=your_refresh_token_here
   IRON_SESSION_PASSWORD=complex_password_at_least_32_characters_long
   NODE_ENV=production
   ```
   > **Note**: `IRON_SESSION_PASSWORD` must be at least 32 characters long.

## Running the Application

### Development Mode
To run the application locally with hot-reloading:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
To create an optimized production build:
```bash
npm run build
npm start
```

## Usage
1. **Login**: Navigate to the home page. If `ATOMBERG_API_KEY` and `ATOMBERG_REFRESH_TOKEN` are configured in `.env.local`, you may auto-login or use the credentials form if implemented.
2. **Dashboard**: View all your connected Atomberg fans.
3. **Control**:
   - Toggle the **Power** button to turn the fan On/Off.
   - Use the **Slider** or **Buttons** to change the fan speed (0-5).

## Limitations & Assumptions
- **Official Hardware Required**: The application strictly communicates with the Atomberg API. You must have actual compatible Atomberg devices linked to your developer account. Mock data has been removed for production safety.
- **Token Expiry**: The application handles access token refreshing automatically. If the Refresh Token itself expires (usually long-lived), you must update it in `.env.local`.
- **Network**: Requires an active internet connection to communicate with Atomberg servers.

## Troubleshooting
- **Build Errors**: Ensure `eslint` passes. Run `npm run lint`.
- **Auth Errors**: Verify your API Key and Refresh Token in `.env.local`. Ensure they are not expired.
- **Device Not Found**: Ensure devices are online and linked to your Atomberg account.

## Submission Checklist
- [x] End-to-End Authentication
- [x] Device Control (Speed/Power)
- [x] Production Build Optimized
- [x] No Debug Logs
- [x] Secure Session Handling
