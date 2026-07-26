# PrepStreak

PrepStreak is a modern mobile learning app built with Expo and React Native for people preparing for coding interviews, DSA rounds, system design discussions, and cloud engineering interviews.

The app helps users stay consistent through structured roadmaps, progress tracking, streaks, XP, reminders, and searchable study content.

## Features

- Personalized interview-prep experience with roadmaps for:
  - DSA
  - System Design
  - AWS Cloud
  - Go backend engineering
  - Interview preparation
- Daily study progress tracking
- Streaks, XP, levels, and achievements
- Study calendar and heatmap views
- Search across topics and practice questions
- Offline-friendly local storage and content experience
- Modern UI with theme support

## Tech Stack

- React Native
- Expo
- Expo Router
- TypeScript
- NativeWind
- Zustand
- SQLite / local persistence
- Lucide icons

## Project Structure

- app/ - app screens and navigation routes
- src/components/ - shared UI and content components
- src/content/ - structured learning content for various topics
- src/database/ - local database setup and seed data
- src/modules/ - feature modules like home, roadmap, progress, search, settings
- src/repository/ - repository layer for app data access
- src/services/ - reminders, streaks, XP, and content helpers
- src/store/ - global state management

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open the Expo app on your device or emulator.

## Available Scripts

- npm run dev - start the Expo development server
- npm run build:web - export the web build
- npm run lint - run Expo lint
- npm run typecheck - run TypeScript checks
- npm run android - run on Android
- npm run ios - run on iOS

## Notes

This project uses Expo Router and local app state/storage for a smooth, self-contained study experience. The content and progress system are designed to support consistent interview preparation over time.
