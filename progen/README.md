# 🎨 Pro-Gen - Lightweight 3D Modeling Desktop App

**Pro-Gen** is a fast, lightweight Electron desktop application for intuitive 3D modeling. Built with performance in mind, it provides professional tools in a streamlined interface without the bloat.

![Pro-Gen Interface](https://via.placeholder.com/1200x600/1a1a2e/667eea?text=Pro-Gen+Desktop+App)

## ✨ Key Features

### 🚀 Lightweight & Fast
- **Electron-based desktop app** - Runs natively on Windows, Mac, and Linux
- **Optimized rendering** - Smooth 60 FPS with efficient resource usage
- **Quick startup** - No waiting, start creating immediately
- **Small footprint** - Minimal disk space and memory usage

### 🎯 Intuitive Interface
- **Click-based workflow** - No complex keyboard shortcuts needed
- **Visual tool palette** - All tools one click away
- **Real-time properties** - Edit position, scale, rotation, color instantly
- **Scene hierarchy** - Manage objects easily

### 🔥 Heat Analysis for Electronics
Built for electronics designers who need thermal considerations:
- **One-click toggle** for heat analysis mode
- **Temperature slider** (0°C to 500°C)
- **Color-coded safety zones**:
  - 🟢 **Safe** (< 150°C)
  - 🟡 **Moderate** (150-300°C)
  - 🔴 **Danger** (> 300°C)
- **Visual feedback** - Objects change color based on temperature

### 🎨 Enhanced UX
- **Toast notifications** - Non-intrusive feedback instead of alert dialogs
- **Smooth animations** - Polished transitions and interactions
- **Keyboard shortcuts** - Power user features available
- **Responsive layout** - Adapts to different window sizes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
cd progen
npm install
```

### Run Desktop App

```bash
npm start
```

Or in development mode:

```bash
npm run dev
```

### Build for Production

**Windows:**
```bash
npm run build:win
```

**macOS:**
```bash
npm run build:mac
```

**Linux:**
```bash
npm run build:linux
```

Builds are output to the `release/` folder.

## 📖 User Guide

### Creating Your First Model

1. **Add Shapes**: Click any shape button in the left toolbar
   - Cube, Sphere, Cylinder, Cone, Torus
2. **Select Objects**: Click on objects in the viewport
3. **Edit Properties**: Use the right panel to adjust:
   - Position (X, Y, Z)
   - Scale (X, Y, Z)
   - Rotation (X, Y, Z in degrees)
   - Color
4. **Duplicate/Delete**: Use action buttons or shortcuts
   - `Ctrl+D` - Duplicate
   - `Delete` - Remove selected
   - `Escape` - Deselect all
5. **Navigate Viewport**:
   - Left-click + drag to rotate
   - Right-click + drag to pan
   - Scroll to zoom

### Using Heat Analysis

1. Toggle **🔥 Heat Analysis** in the header
2. Adjust temperature slider
3. Watch objects change color based on heat levels
4. Read safety status in the overlay

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Delete` / `Backspace` | Delete selected object |
| `Ctrl+D` | Duplicate selected object |
| `Escape` | Deselect all objects |

## 🏗️ Architecture

```
progen/
├── main.js              # Electron main process
├── preload.js           # Secure context bridge
├── public/
│   ├── index.html       # App UI
│   ├── style.css        # Dark theme styles
│   └── main.js          # Three.js 3D engine
├── package.json         # Dependencies & scripts
└── release/             # Built applications
```

## 🎨 Why Pro-Gen?

| Feature | Traditional Tools | Pro-Gen |
|---------|------------------|---------|
| Learning Curve | Steep (weeks) | Gentle (minutes) |
| Interface | Complex menus | Simple clicks |
| File Size | 100MB+ | ~5MB |
| Startup Time | 10+ seconds | Instant |
| Heat Analysis | Manual setup | Built-in toggle |
| Focus | General purpose | Electronics-friendly |

## 🔒 Privacy & Security

- **No telemetry** - Zero usage data collection
- **Local processing** - All rendering happens locally
- **Secure context** - Electron sandbox with context isolation
- **Open source** - Inspect all code yourself

## 🛠️ Tech Stack

- **Electron** - Cross-platform desktop framework
- **Three.js** - WebGL 3D rendering engine
- **Vanilla JavaScript** - No framework overhead
- **CSS Variables** - Customizable theming

## 🐛 Troubleshooting

### App won't start
- Ensure all dependencies installed: `npm install`
- Check Node.js version: `node --version` (need 18+)
- Try rebuilding: `npm rebuild`

### Performance issues
- Close other GPU-intensive applications
- Reduce scene complexity
- Update graphics drivers

### Build fails
- Ensure you have proper OS build tools installed
- Check available disk space
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## 📝 License

ISC License - Free to use, modify, and distribute.

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Better export formats (STL, OBJ, STEP)
- More primitive shapes
- Boolean operations
- Texture support
- Animation tools

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) - Amazing 3D library
- [Electron](https://electron.dev/) - Desktop app framework

---

**Made with ❤️ for makers and creators who want a lightweight, focused 3D tool.**

*Pro-Gen v2.0.0*
