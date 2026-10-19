# UoL Eats

A mobile app that helps University of Lincoln students find food venues nearby. Built with React Native, Expo and TypeScript.
## Features

- Venues sorted by distance from your current location, with a fallback to central Lincoln if location permission is denied
- Search and filters (Quiet, Social, Study, Quick, Date, Discount only, Open now)
- Open/closed status and opening hours for each venue
- Interactive map of venues
- Reviews with star ratings, written feedback and optional photos (add, edit and delete)
- Favourites saved on the device
- Weather information
- Light and dark mode

## How it's built

- React Native with Expo and Expo Router, using bottom tab navigation (Home, Nearby, Map, Saved, Settings)
- TypeScript
- Location and photo access through Expo modules, with runtime permission handling
- Reviews and favourites stored locally with AsyncStorage, so data persists across app restarts without a backend
- Live weather data from the Open-Meteo API

## Tech stack

React Native, Expo, Expo Router, TypeScript, AsyncStorage, react-native-maps, expo-location, expo-image-picker, Open-Meteo API

## Run it locally

You need [Node.js](https://nodejs.org) and the Expo Go app on your phone (or an Android emulator).

From the project folder, run:

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `a` to open an Android emulator.