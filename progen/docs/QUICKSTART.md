# Pro-Gen Quick Start Guide

Get up and running with Pro-Gen in minutes!

## Prerequisites

Make sure you have:
- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)

Verify installation:
```bash
node --version  # Should show v18.x.x or higher
npm --version
```

## Installation

1. **Navigate to the project directory:**
   ```bash
   cd progen
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

   This installs all required packages including:
   - Electron (desktop app framework)
   - Three.js (3D rendering)
   - Express (API server)
   - Development tools

## Running the Application

Pro-Gen has two components that run separately:

### Option 1: Desktop App (Recommended)

Run the full Electron desktop application:

```bash
npm start
```

Or in development mode with auto-reload:

```bash
npm run dev
```

The app window will open automatically.

### Option 2: Browser + API Server

If you prefer to run in a browser:

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend API:**
```bash
npm run server
```

Then open http://localhost:3000 in your browser.

> ⚠️ **Note:** The browser version requires both terminals running. The desktop app (`npm start`) is self-contained.

## Your First Model

Once the app is running:

1. **Create a shape:** Click any shape button (Cube, Sphere, Cylinder, etc.) in the left toolbar
2. **Select it:** Click on the object in the 3D viewport
3. **Edit properties:** Use the right panel to adjust:
   - Position (X, Y, Z)
   - Scale (X, Y, Z)  
   - Rotation (X, Y, Z)
   - Color
4. **Navigate:** 
   - Left-click + drag to rotate view
   - Right-click + drag to pan
   - Scroll to zoom

## Heat Analysis Feature

Unique to Pro-Gen for electronics designers:

1. Toggle **🔥 Heat Analysis** in the header
2. Move the temperature slider (0°C - 500°C)
3. Watch objects change color:
   - 🟢 Green: Safe (< 150°C)
   - 🟡 Yellow: Moderate (150-300°C)
   - 🔴 Red: Danger (> 300°C)

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Delete` / `Backspace` | Delete selected object |
| `Ctrl+D` | Duplicate selected object |
| `Escape` | Deselect all |

## Next Steps

- [Full README](../README.md) - Complete feature overview
- [API Documentation](./API.md) - For developers and plugin creators
- [Contributing Guide](../CONTRIBUTING.md) - How to help improve Pro-Gen

## Troubleshooting

**App won't start?**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Getting errors about missing modules?**
Make sure you ran `npm install` in the `progen/` directory.

**Browser version shows blank screen?**
- Check that both frontend and backend servers are running
- Open browser DevTools (F12) to see any error messages
- Verify http://localhost:3000 is accessible

---

Ready to create? Start modeling! 🎨
