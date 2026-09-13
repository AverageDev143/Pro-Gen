# Pro-Gen: Natural 3D Modeling Hub (BETA)

 **Have you ever wanted to model something or design a product but always found Blender and other free solutions hard?**

Well, introducing **Pro-Gen** - a new workspace-style app that makes it feel natural to model items and push them to things such as a 3D printer or CNC machine.

##  Quick Start

```bash
cd progen
npm install
npm run dev      # Terminal 1 - Frontend
npm run server   # Terminal 2 - Backend API
```

Then open http://localhost:3000 in your browser.

## Key Features

- **Natural 3D Modeling**: Simple tool-based interface, no complex shortcuts to memorize
- **Heat Factor Analysis**: Unique feature for electronics-aware design with temperature visualization
- **AI-Powered Generation**: Describe what you want, AI creates it
- **Direct Manufacturing**: Export to STL/OBJ/STEP or send directly to 3D printers/CNC machines
- **Plugin System**: Local API support to extend functionality

## 📁 Project Structure

```
/workspace
├── README.md              # This file
└── progen/                # Main application
    ├── public/            # Frontend files
    ├── api/               # Backend API server
    ├── src/               # Source code
    ├── config/            # Configuration
    ├── docs/              # Documentation
    └── dist/              # Production build
```

## Documentation

- [Full README](./progen/README.md) - Complete feature overview
- [Quick Start Guide](./progen/docs/QUICKSTART.md) - Get started in minutes
- [API Documentation](./progen/docs/API.md) - For developers and plugin creators

## What Makes Pro-Gen Different?

Unlike Blender which has a steep learning curve, Pro-Gen focuses on:
1. **Simplicity**: Click-to-create primitives, intuitive property panels
2. **Production-Ready**: Built-in export to manufacturing formats
3. **Electronics-Aware**: Heat analysis for builds involving electronics
4. **Extensible**: Plugin system for custom workflows

Perfect for makers, hobbyists, and engineers who want to go from idea to physical product without the complexity!

---

**Made with ❤️ for anyone who finds traditional 3D tools overwhelming.**
