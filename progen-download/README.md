# 🚀 Pro-Gen Download - Lightest 3D Modeling Runtime

**Zero installation. Zero dependencies. Just open and create.**

## Quick Start

### Option 1: Auto-Setup Script (Recommended)

```bash
# Clone or download this folder
cd progen-download

# Run the auto-setup script
chmod +x setup.sh
./setup.sh
```

This creates `progen-standalone.html` - a single file that runs in any browser!

### Option 2: Direct Download

If you already have the standalone file, just:
1. Open `progen-standalone.html` in Chrome, Firefox, Edge, or Safari
2. That's it! No installation needed.

## What You Get

- **Single HTML file** (~64KB) - everything bundled together
- **No Node.js required** - runs directly in your browser
- **No npm install** - zero dependencies to manage
- **No build process** - instant setup
- **Lightest runtime possible** - just your web browser

## Features

✨ **20+ Primitive Shapes**
- Basic: Cube, Sphere, Cylinder, Cone, Torus, Knot
- Polyhedra: Dodecahedron, Icosahedron, Octahedron, Tetrahedron
- Custom: Capsule, Pyramid, Gear, Star
- Curves: Tube, Spiral, Spring, Ring
- Fluid Motion: Fluid Curve, Ergonomic Curve, Product Edge, Fill Gap

🔥 **Heat Analysis Mode**
- Toggle heat visualization with one click
- Temperature slider (0°C - 500°C)
- Color-coded safety zones:
  - 🟢 Safe (< 150°C)
  - 🟡 Moderate (150-300°C)
  - 🔴 Danger (> 300°C)

🎨 **Full 3D Editing**
- Click-based workflow (no complex shortcuts needed)
- Real-time property editing (position, scale, rotation, color)
- Scene hierarchy management
- Duplicate/delete objects
- Wireframe toggle
- Grid toggle
- Camera controls (rotate, pan, zoom)

⚡ **Performance**
- 60 FPS rendering
- Optimized WebGL rendering
- Minimal memory footprint
- Instant startup

## System Requirements

- **Any modern web browser** (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+)
- **JavaScript enabled**
- **WebGL support** (enabled by default in all modern browsers)

That's it! No other requirements.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Delete` / `Backspace` | Delete selected object |
| `Ctrl+D` | Duplicate selected object |
| `Escape` | Deselect all objects |
| `R` | Reset camera view |
| `G` | Toggle grid |
| `W` | Toggle wireframe |

## Mouse Controls

- **Left-click + drag** - Rotate view
- **Right-click + drag** - Pan view
- **Scroll wheel** - Zoom in/out
- **Click on object** - Select object

## File Structure

```
progen-download/
├── README.md           # This file
├── setup.sh            # Auto-setup script for Linux/Mac
├── setup.bat           # Auto-setup script for Windows
└── progen-standalone.html  # Generated single-file app (run setup first)
```

## Privacy & Security

✅ **100% Local Processing** - All rendering happens in your browser
✅ **No Telemetry** - Zero data collection
✅ **No Internet Required** (after initial load of Three.js CDN)
✅ **Open Source** - Inspect all code yourself
✅ **No Account Needed** - Just open and use

## Troubleshooting

**App won't load?**
- Make sure you're using a modern browser (Chrome, Firefox, Edge, Safari)
- Check if JavaScript is enabled
- Try clearing browser cache

**Performance issues?**
- Close other GPU-intensive applications
- Reduce number of objects in scene
- Update graphics drivers

**Objects not showing?**
- Check browser console for errors (F12)
- Ensure WebGL is enabled in browser settings
- Try a different browser

## Why This Version?

| Feature | Traditional 3D Apps | Pro-Gen Download |
|---------|-------------------|------------------|
| Installation | 100MB+ installer | Single 64KB HTML file |
| Setup Time | 5-10 minutes | 5 seconds |
| Dependencies | Multiple libraries | None (browser only) |
| Disk Space | 200MB+ | ~64KB |
| Startup Time | 10-30 seconds | Instant |
| Updates | Manual downloads | Always latest version |

## Technical Details

Built with:
- **Three.js r160** - Lightweight WebGL 3D engine (loaded from CDN)
- **Vanilla JavaScript** - No framework overhead
- **Modern CSS** - Clean, responsive design
- **ES6 Modules** - Efficient code organization

## License

ISC License - Free to use, modify, and distribute.

## Support

For issues or feature requests, please visit the main repository.

---

**Made with ❤️ for creators who want instant access to 3D modeling tools.**

*Pro-Gen v2.0.0 - The lightest 3D modeling runtime*
