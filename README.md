# SmartCast Video Player

[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PWA](https://img.shields.io/badge/PWA-Ready-purple?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

**SmartCast Video Player** is a modern Android-style video player built with React, Vite, Tailwind CSS, and Progressive Web App (PWA) standards. It is specifically designed for **independent Smart TV media casting**—allowing videos to play in fullscreen on any compatible Smart TV while keeping the mobile phone 100% free for browsing, multitasking (like WhatsApp or web browsing), and full tactile remote control without screen mirroring.

---

## 🌟 Key Highlights

### 1. 📺 Independent Smart TV Playback (Zero Screen Mirroring)
* **Dedicated Media Protocol**: The Smart TV directly renders the media stream via Google Cast / DLNA / Web Presentation API.
* **100% Free Phone**: Your phone screen is **never mirrored** onto the TV. You can browse local videos, switch folders, adjust settings, and use other mobile apps (WhatsApp, Chrome, Camera) without interrupting the TV video.
* **Smart Display Scaling Modes**:
  * **FIT**: Preserves the original aspect ratio with minimal letterboxing.
  * **FILL**: Fills the entire 16:9 TV canvas.
  * **CROP**: Intelligently zooms into the video with 0 black bars and zero distortion.
  * **ORIGINAL**: 1:1 pixel native aspect ratio presentation.

### 2. 📱 Full-Featured Mobile Player
* **Tactile Playback**: Play/Pause, ±10s seek buttons, scrubbable progress bar, and automatic resume playback prompts.
* **Gestures**: Left vertical swipe for brightness (30%–140%), right vertical swipe for volume, and double-tap seek indicators.
* **Playback Speed**: 0.5x, 0.75x, 1.0x, 1.25x, 1.5x, 2.0x.
* **Subtitles & Multi-Audio**: Embedded SRT/VTT subtitle engine with Hindi & English support, font size controls, and direct subtitle forwarding to the TV screen.
* **Tools**: Touch lock controls, Picture-in-Picture (PiP), orientation switch, and hardware acceleration decoding indicators (HEVC/H.265, AV1, H.264, VP9).

### 3. 📂 Local Storage Scanner & Custom Video Import
* **Format Support**: MP4, MKV, WebM, AVI, MOV.
* **Device Storage Picker**: Built-in file scanner allows users to pick any local video on their phone or PC with 100% private on-device processing.
* **Rich Metadata**: Video cards show duration, file size, resolution badge (4K UHD, 1440p, 1080p, 720p), codec info, and last-played progress bar.

### 4. 🎛️ TV Remote & Queue Management
* **Tactile Remote Controller**: Connected device info (Living Room Sony Bravia, Samsung QLED, LG OLED, Chromecast), display mode switcher, seek, volume slider, mute, and disconnect.
* **Playback Queue**: Add videos to queue, reorder, and toggle **Auto-Play Next** for uninterrupted TV streaming.

### 5. 📲 Progressive Web App (PWA) & Mobile Installation
* **Standalone Native App**: Runs without browser address bars on Android and iOS.
* **Offline Support**: Service worker caching powered by `vite-plugin-pwa`.
* **One-Click Install**: In-app install button and guided instructions for Android Chrome and iOS Safari.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher)
* npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/kumar19952022kunal-eng/Smart-video-player.git

# Navigate to the project directory
cd Smart-video-player

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Building for Production

```bash
npm run build
```

The optimized static production files will be output to the `dist/` folder.

---

## 📦 Converting into an Android APK

Since this project complies with all Progressive Web App (PWA) requirements:

### Method 1: PWABuilder (Easiest)
1. Deploy your app to any HTTPS host (Cloud Run, Vercel, Netlify, or GitHub Pages).
2. Go to [PWABuilder.com](https://www.pwabuilder.com).
3. Enter your deployed URL and click **Package for Android**.
4. Download the signed `.apk` or `.aab` file ready for installation or Google Play Store.

### Method 2: Bubblewrap CLI (Google Official)
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest=https://your-domain.com/manifest.webmanifest
bubblewrap build
```

### Method 3: Capacitor
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "SmartCast" "com.smartcast.videoplayer"
npx cap add android
npm run build
npx cap sync
npx cap open android
```

---

## 📄 License
This project is licensed under the Apache-2.0 License.
