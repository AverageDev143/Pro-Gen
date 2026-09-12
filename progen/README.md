# 🎨 Pro-Gen - Professional 3D Modeling Hub

**Pro-Gen** is a custom 3D modeling hub designed to make 3D modeling feel natural and intuitive, while providing professional-grade tools for production workflows. Whether you're designing electronics enclosures, mechanical parts, or artistic creations, Pro-Gen streamlines the path from concept to manufacturing.

![Pro-Gen Interface](https://via.placeholder.com/1200x600/1a1a2e/667eea?text=Pro-Gen+Interface)

## ✨ Key Features

### 🎯 Natural Modeling Interface
- **Click-based workflow** - No complex keyboard shortcuts to memorize
- **Visual tool palette** - All tools are one click away
- **Real-time properties** - Edit position, scale, rotation, and color instantly
- **Scene hierarchy** - Manage all objects in your scene with ease

### 🔥 Heat Analysis for Electronics (Unique!)
Built specifically for electronics designers who need to consider thermal factors:
- **Toggle heat analysis mode** with a single switch
- **Temperature slider** from 0°C to 500°C
- **Color-coded safety indicators**:
  - 🟢 **Safe** (< 150°C) - Perfect for sensitive electronics
  - 🟡 **Moderate** (150-300°C) - Use caution with nearby components
  - 🔴 **Danger** (> 300°C) - Requires active cooling or isolation
- **Visual feedback** - Objects change color based on temperature
- **Material recommendations** - Get advice based on thermal properties

### 🤖 AI-Powered Model Generation
Describe what you want in natural language, and AI will help create it:
- Enter your OpenAI API key (stored locally, never sent elsewhere)
- Type a description like "Create a phone stand with cable management"
- AI interprets your request and generates the basic shapes
- Refine and customize from there

### 📤 Export & Manufacturing
One-click export to industry-standard formats:
- **STL** - Optimized for 3D printing
- **OBJ** - Universal format for most 3D software
- **STEP** - Professional CAD format for CNC machining

Direct machine integration:
- Send models directly to networked 3D printers
- Generate G-code for CNC machines
- Export paths for laser cutters

### 🔌 Extensible Plugin System
Add custom functionality via local API:
- Register plugins programmatically
- Execute plugin commands through REST API
- Build custom tools for your specific workflow

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

```bash
cd progen
npm install
```

### Development Mode

Run two terminals:

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Opens at http://localhost:3000

**Terminal 2 - Backend API:**
```bash
npm run server
```
API runs at http://localhost:3001

### Production Build

```bash
npm run build    # Builds to dist/ folder
npm run server   # Serves everything on port 3001
```

Then open http://localhost:3001

## 📖 User Guide

### Creating Your First Model

1. **Add Shapes**: Click any shape button in the left toolbar (Cube, Sphere, Cylinder, etc.)
2. **Select Objects**: Click on objects in the viewport to select them
3. **Edit Properties**: Use the right panel to adjust position, scale, rotation, and color
4. **Duplicate/Delete**: Use the action buttons or keyboard shortcuts (Ctrl+D to duplicate, Delete key to remove)
5. **Navigate Viewport**: 
   - Left-click + drag to rotate
   - Right-click + drag to pan
   - Scroll to zoom

### Using Heat Analysis

1. Toggle the **🔥 Heat Analysis** switch in the header
2. Adjust the temperature slider to your operating temperature
3. Watch as objects change color based on heat levels
4. Read the safety recommendations in the overlay

### AI Model Generation

1. Click **✨ AI Assistant** in the header
2. Enter your OpenAI API key (saved locally in browser)
3. Describe what you want to create
4. Click "Generate Model"
5. AI will create basic shapes that you can refine

### Exporting for Manufacturing

1. Select your model objects
2. Choose export format (STL/OBJ/STEP)
3. Click "Export Model"
4. File downloads automatically

### Sending to Machines

1. Enter your machine's IP address or URL
2. Select machine type (3D Printer, CNC, Laser Cutter)
3. Click "Send to Machine"
4. Model data is converted to machine-specific code

## 🔌 API Reference

### Base URL
`http://localhost:3001/api`

### Endpoints

#### Health Check
```
GET /health
```

#### AI Model Generation
```
POST /ai-generate
Content-Type: application/json

{
  "prompt": "Create a simple house",
  "apiKey": "your-openai-api-key"
}
```

#### Thermal Analysis
```
POST /thermal-analysis
Content-Type: application/json

{
  "temperature": 200,
  "material": "PLA",
  "components": [
    { "name": "Arduino", "maxTemp": 85 }
  ]
}
```

#### Send to Machine
```
POST /send-to-machine
Content-Type: application/json

{
  "machineType": "printer",
  "machineUrl": "http://192.168.1.100",
  "objects": [...]
}
```

#### Plugin Registration
```
POST /plugins/register
Content-Type: application/json

{
  "name": "my-plugin",
  "version": "1.0.0",
  "endpoint": "http://localhost:4000/plugin",
  "description": "My custom plugin"
}
```

#### List Plugins
```
GET /plugins
```

#### Execute Plugin
```
POST /plugins/:name/execute
Content-Type: application/json

{ ...plugin data }
```

#### Export Model
```
POST /export
Content-Type: application/json

{
  "format": "stl",
  "objects": [...]
}
```

## 🛠️ Configuration

### Material Thermal Properties
Edit `config/default.js` to customize material properties:

```javascript
const materialConfig = {
    PLA: { meltingPoint: 220, glassTransition: 60 },
    ABS: { meltingPoint: 250, glassTransition: 105 },
    // Add custom materials
};
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Delete/Backspace | Delete selected object |
| Ctrl+D | Duplicate selected object |
| Escape | Deselect all objects |

## 🏗️ Architecture

```
progen/
├── public/              # Frontend source files
│   ├── index.html       # Main HTML structure
│   ├── style.css        # Modern dark theme styles
│   └── main.js          # Three.js 3D engine logic
├── api/
│   └── server.js        # Express backend with all APIs
├── dist/                # Production build output
├── config/
│   └── default.js       # Configuration settings
├── docs/                # Documentation
├── package.json         # Dependencies and scripts
└── vite.config.js       # Build configuration
```

## 🎨 Why Pro-Gen Instead of Blender?

| Feature | Blender | Pro-Gen |
|---------|---------|---------|
| Learning Curve | Steep (weeks) | Gentle (minutes) |
| Interface | Complex menus | Simple click buttons |
| Heat Analysis | Manual setup | Built-in toggle |
| Electronics Focus | General purpose | Purpose-built |
| API Extensibility | Python scripting | REST API plugins |
| File Size | ~300MB | ~5MB |
| Startup Time | 10+ seconds | Instant |

## 🔒 Privacy & Security

- **API Keys**: Stored locally in browser localStorage, never transmitted except to OpenAI
- **No Telemetry**: Pro-Gen doesn't collect any usage data
- **Local Processing**: All 3D rendering happens in your browser
- **Open Source**: Inspect all code yourself

## 🐛 Troubleshooting

### Frontend won't load
- Ensure `npm run dev` is running
- Check console for errors (F12)
- Clear browser cache

### API not responding
- Ensure `npm run server` is running
- Check if port 3001 is available
- Verify CORS settings if using custom domain

### AI generation fails
- Verify your OpenAI API key is valid
- Check internet connection
- Ensure you have API credits remaining

### Export doesn't work
- Make sure you have objects in the scene
- Try a different browser
- Check browser download permissions

## 📝 License

ISC License - Feel free to use, modify, and distribute.

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Better STL/OBJ export with proper triangulation
- More primitive shapes (torus knot, capsule, etc.)
- Boolean operations (union, difference, intersection)
- Sculpting tools
- Texture painting
- Animation support

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) - Amazing 3D library
- [Vite](https://vitejs.dev/) - Lightning-fast build tool
- [Express](https://expressjs.com/) - Simple backend framework

---

**Made with ❤️ for makers, engineers, and creators who find traditional 3D tools overwhelming.**

*Pro-Gen v1.0.0*
