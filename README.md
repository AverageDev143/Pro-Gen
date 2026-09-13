# Pro-Gen: Natural 3D Modeling Hub (BETA)

**Have you ever wanted to model something or design a product but always found Blender and other free solutions hard?**

**Pro-Gen** is a lightweight Electron desktop app that makes it feel natural to model items — primitives, curves, and now full layered texture painting — without Blender's learning curve.

## Quick Start

```bash
cd progen
npm install
npm start
```

This launches the Pro-Gen desktop app (Electron). There's no separate frontend/backend dev server to run — it's a single app.

## Key Features (working today)

- **Natural 3D Modeling**: Click-to-create primitives (cubes, spheres, curves, gears, and more), drag-to-position, no shortcuts to memorize
- **Layered Texture Painting**: Paint directly onto models across 4 PBR channels — albedo, normal, roughness, metalness — with a full layer stack (visibility, opacity, blend modes), brush controls (size/hardness/opacity/eraser), and PNG export per channel
- **Heat Factor Analysis**: Electronics-aware design — temperature slider with color-coded safe/moderate/danger zones
- **Scene management**: Duplicate, delete, wireframe view, grid toggle, keyboard shortcuts

## 📁 Project Structure

```
/workspace
├── README.md              # This file
└── progen/                # Main application
    ├── public/            # Frontend (Electron renderer)
    │   └── paint/          # Layered PBR paint engine + UI
    ├── api/               # Backend API server (see Roadmap — not yet connected)
    ├── src/               # Reserved for future use (currently empty)
    ├── config/            # Reserved for future use (currently empty)
    └── docs/              # Documentation
```

## Documentation

- [Full README](./progen/README.md) - Complete feature overview
- [Quick Start Guide](./progen/docs/QUICKSTART.md) - Get started in minutes
- [API Documentation](./progen/docs/API.md) - For developers and plugin creators

## What Makes Pro-Gen Different?

Unlike Blender's steep learning curve, Pro-Gen focuses on:
1. **Simplicity**: Click-to-create primitives, intuitive property panels
2. **Texturing built in**: No separate app needed to paint PBR materials onto your model
3. **Electronics-Aware**: Heat analysis for builds involving electronics
4. **Small footprint**: No bloat, fast startup

## Roadmap (not yet connected / working)

These exist as early scaffolding (`api/server.js`) but aren't wired to the app yet — listed here instead of "Key Features" so this README stays honest about what you can actually use right now:

- **AI-Powered Generation** — describe a shape, get objects placed in-scene
- **Direct Manufacturing Export** — real STL/OBJ/STEP export and direct printer/CNC/laser send (current export functions are placeholders, not real geometry)
- **Plugin System** — register and execute external plugins via a local API

Perfect for makers, hobbyists, and engineers who want to go from idea to physical product without the complexity — once the manufacturing pipeline above catches up to the modeling and painting side.

---

**Made with ❤️ for anyone who finds traditional 3D tools overwhelming.**
