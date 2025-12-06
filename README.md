# SuisoruIX

<div align="center">

![SuisoruIX Logo](https://blog.rincynar.top/assets/img/image/image@20250126pas01.png)

**A beautiful Material You start page with powerful search capabilities**

[![Vue](https://img.shields.io/badge/Vue-3.3.4-42b883?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4.5-646cff?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-GPL--3.0-blue)](./LICENSE)

[English](./README.md) · [简体中文](./README_CN.md)

</div>

## ✨ Features

- 🎨 **Material You Design** - Modern Material Design 3 aesthetics with dynamic colors and smooth animations
- 🔍 **Multi-Engine Search** - Support for Google, Bing, Baidu, DuckDuckGo, Yandex, 360, Sogou, and custom engines
- 🌈 **Dynamic Wallpapers** - Daily Bing wallpaper, random scenery, anime images, or custom backgrounds
- ⏰ **Time & Weather** - Real-time clock with weather information and lunar calendar support
- 🔖 **Quick Shortcuts** - Customizable website shortcuts for quick access
- 📱 **Responsive Design** - Perfect display on desktop, tablet, and mobile devices
- 🌓 **Dark Mode** - Automatic theme switching with light and dark modes
- 💾 **Data Persistence** - Local storage of settings and shortcuts
- 🚀 **PWA Support** - Install as a progressive web app

## 📸 Screenshots

### Desktop View
![Desktop](https://blog.rincynar.top/assets/img/image/image@20250126pas01.png)

### Mobile View
![Mobile](https://blog.rincynar.top/assets/img/image/image@20250126pas00.png)

## 🚀 Quick Start

### Prerequisites

- Node.js >= 16.0.0
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/RinCynar/SuisoruIX.git

# Navigate to project directory
cd SuisoruIX

# Install dependencies
pnpm install
# or
npm install
```

### Development

```bash
# Start development server
pnpm dev
# or
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
# Build for production
pnpm build
# or
npm run build

# Preview production build
pnpm preview
# or
npm preview
```

## ⚙️ Configuration

Create a `.env` file in the root directory to customize your settings:

```env
# Site Information
VITE_SITE_TITLE = "SuisoruIX"
VITE_SITE_ANTHOR = "RinCynar"
VITE_SITE_KEYWORDS = "SuisoruIX,StartPage,RinCynar,SearchEngine"
VITE_SITE_DES = "StartPage"
VITE_SITE_LOGO = "/favicon.png"
VITE_SITE_APPLE_LOGO = "/logo/logo.png"
VITE_SITE_COPYRIGHTLINK = "https://rincynar.top"

# Welcome Text
VITE_WELCOME_TEXT = "Ciallo～(∠・ω< )⌒☆"

# Search Input Placeholder
VITE_INPUT_TIP = "Search or type URL"

# ICP (Leave empty if not needed)
VITE_ICP = ""

# Weather API Key (Get from https://lbs.amap.com/)
VITE_WEATHER_KEY = ""
```

## 🎨 Material You Design

This project has been refactored to follow Material Design 3 (Material You) guidelines:

- **Color System**: Dynamic purple palette with proper surface containers
- **Typography**: Prominent display text with proper hierarchy
- **Shapes**: Rounded corners throughout (8px to 28px)
- **Motion**: Smooth animations with standard easing curves
- **Elevation**: Proper shadow system with glassmorphism effects

## 🛠️ Technology Stack

### Core
- [Vue 3](https://vuejs.org/) - Progressive JavaScript framework
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [Pinia](https://pinia.vuejs.org/) - State management
- [Sass](https://sass-lang.com/) - CSS preprocessor

### UI Components
- [Naive UI](https://www.naiveui.com/) - Vue 3 component library
- [iconfont](https://www.iconfont.cn/) - Icon solution

### Utilities
- [Axios](https://axios-http.com/) - HTTP client
- [lunar-calendar](https://www.npmjs.com/package/lunar-calendar) - Lunar calendar support

## 📦 Project Structure

```
SuisoruIX/
├── public/              # Static assets
│   ├── background/      # Background images
│   ├── icon/           # Icons
│   └── lib/            # Icon fonts
├── src/
│   ├── api/            # API services
│   ├── assets/         # Project assets
│   ├── components/     # Vue components
│   │   ├── AllFunc/    # Main function components
│   │   └── SearchInput/ # Search components
│   ├── stores/         # Pinia stores
│   ├── style/          # Global styles
│   ├── utils/          # Utility functions
│   ├── App.vue         # Root component
│   └── main.js         # Entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Dependencies
└── vite.config.js      # Vite configuration
```

## 🌟 Features in Detail

### Search Engines
- **Built-in Engines**: Google, Bing, Baidu, DuckDuckGo, Yandex, 360, Sogou
- **Custom Engine**: Add your own search engine URL
- **Search Suggestions**: Real-time search suggestions (configurable)
- **Smart Detection**: Automatically detect URLs and email addresses

### Wallpapers
- **Local Default**: Random default wallpapers
- **Daily Bing**: Bing's daily featured image
- **Random Scenery**: Beautiful landscape photos
- **Random Anime**: Anime-style illustrations
- **Custom URL**: Use your own image URL

### Time & Weather
- **Multiple Clock Styles**: Horizontal or vertical layout
- **12/24 Hour Format**: Choose your preferred time format
- **Seconds Display**: Optional seconds display
- **Lunar Calendar**: Traditional Chinese calendar
- **Weather Info**: Real-time weather with temperature and wind

### Customization
- **Theme**: Light and dark mode
- **Search Box**: Auto-collapse, auto-focus options
- **Wallpaper Effects**: Blur and mask adjustments
- **Data Backup**: Export and import your settings

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the GPL-3.0 License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [Lime Start](https://limestart.cn/) - Design inspiration
- [SNav](https://github.com/imsyy/SNav) - Original project base
- [Material Design 3](https://m3.material.io/) - Design system

## 📧 Contact

RinCynar - [@RinCynar](https://github.com/RinCynar)

Project Link: [https://github.com/RinCynar/SuisoruIX](https://github.com/RinCynar/SuisoruIX)

---

<div align="center">

Made with ❤️ by [RinCynar](https://rincynar.top)

</div>
