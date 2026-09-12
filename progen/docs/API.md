# Pro-Gen API Documentation

This document describes the backend API server for Pro-Gen, including endpoints for AI generation, file exports, thermal analysis, and plugin support.

## Overview

The API server runs on `http://localhost:3001` and provides REST endpoints for:

- AI-powered 3D model generation
- File format exports (STL, OBJ, STEP, G-Code, CNC)
- Thermal/heat analysis
- Machine communication (3D printers, CNC machines)
- Plugin system extension

## Starting the Server

```bash
cd progen
npm run server
```

The server will start on port 3001.

## API Endpoints

### Health Check

**GET** `/api/health`

Check if the API server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "Pro-Gen API server is running"
}
```

---

### AI-Powered Generation

**POST** `/api/ai-generate`

Generate a 3D model from a text description using AI.

**Request Body:**
```json
{
  "prompt": "A simple cube with rounded edges",
  "openaiKey": "sk-..."  // Optional: your OpenAI API key
}
```

**Response:**
```json
{
  "success": true,
  "model": {
    "type": "box",
    "dimensions": [10, 10, 10],
    "position": [0, 0, 0]
  }
}
```

**Notes:**
- Currently requires client to provide OpenAI key (for local-only use)
- Returns a basic shape definition that can be instantiated in Three.js

---

### Thermal Analysis

**POST** `/api/thermal-analysis`

Analyze thermal properties of materials and get safety recommendations.

**Request Body:**
```json
{
  "material": "PLA",
  "temperature": 200
}
```

**Response:**
```json
{
  "material": "PLA",
  "meltingPoint": 220,
  "safeTemperature": 150,
  "status": "moderate",
  "color": "#FFFF00",
  "warning": "Approaching softening temperature"
}
```

**Supported Materials:**
- PLA (melting point: 220°C)
- ABS (melting point: 250°C)
- PETG (melting point: 260°C)
- Nylon (melting point: 280°C)
- Aluminum (melting point: 660°C)

**Safety Thresholds:**
- 🟢 Safe: < 150°C
- 🟡 Moderate: 150-300°C
- 🔴 Danger: > 300°C

---

### File Exports

#### Export to STL

**POST** `/api/export/stl`

Export the current scene to STL format for 3D printing.

**Request Body:**
```json
{
  "objects": [
    {
      "name": "Cube",
      "geometry": { "vertices": [...] },
      "position": [0, 0, 0],
      "rotation": [0, 0, 0],
      "scale": [1, 1, 1]
    }
  ]
}
```

**Response:**
- Content-Type: `application/sla`
- File download or base64-encoded STL data

---

#### Export to OBJ

**POST** `/api/export/obj`

Export to OBJ format with MTL material file.

**Request Body:** Same as STL export

**Response:**
- Content-Type: `application/octet-stream`
- OBJ file data

---

#### Export to STEP

**POST** `/api/export/step`

Export to STEP format for CAD interoperability.

**Request Body:** Same as STL export

**Response:**
- Content-Type: `application/step`
- STEP file data

**Note:** STEP export requires geometry kernel (currently placeholder implementation)

---

### Manufacturing Output

#### Generate G-Code

**POST** `/api/generate/gcode`

Convert 3D model to G-Code for 3D printers.

**Request Body:**
```json
{
  "objects": [...],
  "settings": {
    "layerHeight": 0.2,
    "infill": 20,
    "nozzleTemp": 210,
    "bedTemp": 60
  }
}
```

**Response:**
- G-Code text file content

---

#### Generate CNC Code

**POST** `/api/generate/cnc`

Convert 3D model to CNC machining paths.

**Request Body:**
```json
{
  "objects": [...],
  "settings": {
    "toolDiameter": 3.175,
    "feedRate": 500,
    "spindleSpeed": 12000
  }
}
```

**Response:**
- G-Code suitable for CNC machines

---

### Machine Communication

#### Send to 3D Printer

**POST** `/api/send-to-machine/printer`

Send G-Code directly to a connected 3D printer.

**Request Body:**
```json
{
  "gcode": "G1 X10 Y10 Z0.2 F3000\n...",
  "printerAddress": "192.168.1.100",
  "port": 8080
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sent to printer successfully"
}
```

---

#### Send to CNC Machine

**POST** `/api/send-to-machine/cnc`

Send G-Code to a CNC machine.

**Request Body:**
```json
{
  "gcode": "...",
  "machineAddress": "192.168.1.101"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sent to CNC machine successfully"
}
```

---

### Plugin System

**POST** `/api/plugin/:pluginName`

Execute a registered plugin with custom parameters.

**Request Body:**
```json
{
  "action": "generate",
  "parameters": {
    "shape": "torus",
    "radius": 5
  }
}
```

**Response:**
Plugin-specific response

**Registering Plugins:**

Plugins are JavaScript modules placed in the `plugins/` directory. Each plugin must export:

```javascript
module.exports = {
  name: 'my-plugin',
  version: '1.0.0',
  execute: async (action, params) => {
    // Plugin logic
    return { success: true, data: {} };
  }
};
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad request (invalid parameters)
- `404` - Endpoint not found
- `500` - Server error

---

## CORS Configuration

The API server enables CORS for all origins (development mode). For production, restrict to specific origins:

```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000']
}));
```

---

## Security Notes

⚠️ **Important:** 

1. **OpenAI Keys**: Currently, the AI endpoint expects clients to send API keys. For production use, store keys server-side in environment variables (`.env` file).

2. **Local-Only**: This API is designed for localhost use only. Do not expose to public networks without proper authentication.

3. **File System Access**: Export endpoints currently return data in-memory. For actual file writes, implement proper path validation.

---

## Example Usage

### Using curl

```bash
# Health check
curl http://localhost:3001/api/health

# Thermal analysis
curl -X POST http://localhost:3001/api/thermal-analysis \
  -H "Content-Type: application/json" \
  -d '{"material": "PLA", "temperature": 200}'

# AI generation (with your key)
curl -X POST http://localhost:3001/api/ai-generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A sphere", "openaiKey": "sk-your-key"}'
```

### Using fetch (from frontend)

```javascript
// Thermal analysis
const response = await fetch('http://localhost:3001/api/thermal-analysis', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ material: 'PLA', temperature: 200 })
});

const result = await response.json();
console.log(result); // { material: 'PLA', status: 'moderate', ... }
```

---

## Future Enhancements

Planned API improvements:

- [ ] WebSocket support for real-time updates
- [ ] Authentication middleware
- [ ] Rate limiting
- [ ] Actual STEP file generation (requires CAD kernel)
- [ ] Direct USB/serial communication for machines
- [ ] Plugin marketplace integration
- [ ] Batch processing endpoints

---

For questions or plugin development help, see [CONTRIBUTING.md](../CONTRIBUTING.md).
