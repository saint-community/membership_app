# Membership App

A React Native membership application built with Expo and styled with NativeWind. This app features a custom animated tab navigation, drawer navigation, and modern UI components.

## Features

- 🏠 **Home Dashboard** - Main app interface
- 🙏 **Prayer Section** - Prayer requests and spiritual content
- 📚 **Study Materials** - Educational resources and materials
- 👥 **Members Directory** - Community member listings
- 📋 **Lists & Tasks** - Organizational tools and task management
- 🎨 **Modern UI** - Built with NativeWind (Tailwind CSS for React Native)
- 📱 **Cross-platform** - iOS, Android, and Web support
- 🔄 **Animated Navigation** - Custom tab bar with smooth animations

## Tech Stack

- **React Native** with Expo
- **Expo Router** for navigation
- **NativeWind** for styling (Tailwind CSS)
- **@gorhom/bottom-sheet** for bottom sheet components
- **React Native SVG** for custom graphics
- **Expo Vector Icons** for iconography

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- For iOS development: Xcode (macOS only)
- For Android development: Android Studio

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd membership_app
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Prebuild the native projects (required for custom native code):

   ```bash
   npx expo prebuild
   ```

4. Start the development server:
   ```bash
   npx expo start
   ```

### Platform-Specific Setup

#### iOS Development

1. Install Xcode from the Mac App Store (macOS only)
2. Install iOS Simulator or connect a physical iOS device
3. After running `expo prebuild`, you can either:
   - Use Expo CLI: `npx expo run:ios`
   - Open `ios/membership_app.xcworkspace` in Xcode and build directly

#### Android Development

1. Install Android Studio
2. Set up Android SDK and create an AVD (Android Virtual Device)
3. Add Android SDK to your PATH:
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```
4. After running `expo prebuild`, you can either:
   - Use Expo CLI: `npx expo run:android`
   - Open `android/` folder in Android Studio and build directly

#### Web Development

1. No additional setup required
2. Run the web app:
   ```bash
   npx expo start --web
   # or
   npm run web
   ```

### Development Scripts

- `npm run start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run on web browser
- `npm run prebuild` - Generate native projects for iOS and Android
- `npm run lint` - Run ESLint and Prettier checks
- `npm run format` - Format code with ESLint and Prettier

## Key Dependencies

### NativeWind

This project uses [NativeWind](https://www.nativewind.dev/) for styling, which brings Tailwind CSS to React Native.

**Documentation:** [https://www.nativewind.dev/](https://www.nativewind.dev/)

### Bottom Sheet

This project uses [@gorhom/bottom-sheet](https://github.com/gorhom/react-native-bottom-sheet) for modal bottom sheet components.

**Documentation:** [https://gorhom.github.io/react-native-bottom-sheet/](https://gorhom.dev/react-native-bottom-sheet/modal)
