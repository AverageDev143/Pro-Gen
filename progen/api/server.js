const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory plugin registry
const plugins = new Map();

// Configuration for materials and thermal properties
const materialConfig = {
    PLA: { meltingPoint: 220, glassTransition: 60, thermalConductivity: 0.13 },
    ABS: { meltingPoint: 250, glassTransition: 105, thermalConductivity: 0.17 },
    PETG: { meltingPoint: 260, glassTransition: 80, thermalConductivity: 0.29 },
    Nylon: { meltingPoint: 265, glassTransition: 50, thermalConductivity: 0.25 },
    Aluminum: { meltingPoint: 660, glassTransition: null, thermalConductivity: 205 },
    Steel: { meltingPoint: 1400, glassTransition: null, thermalConductivity: 50 },
    Copper: { meltingPoint: 1085, glassTransition: null, thermalConductivity: 385 }
};

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// AI Model Generation
app.post('/api/ai-generate', async (req, res) => {
    try {
        const { prompt, apiKey } = req.body;
        if (!prompt) return res.status(400).json({ success: false, error: 'Prompt required' });
        if (!apiKey) return res.status(400).json({ success: false, error: 'API key required' });

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a 3D modeling assistant. Return JSON with "objects" array containing shapes: cube, sphere, cylinder, cone, torus.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 500
            })
        });

        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0].message.content;
        
        let result;
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            result = jsonMatch ? JSON.parse(jsonMatch[0]) : { objects: ['cube'], message: content };
        } catch {
            result = { objects: ['cube'], message: content };
        }

        res.json({ success: true, message: result.message, objects: result.objects || ['cube'] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Thermal Analysis
app.post('/api/thermal-analysis', (req, res) => {
    try {
        const { temperature, material } = req.body;
        if (temperature === undefined) return res.status(400).json({ success: false, error: 'Temperature required' });

        const temp = parseFloat(temperature);
        const matData = material ? materialConfig[material] : null;
        let safetyZone = 'safe';
        const recommendations = [];

        if (temp >= 300) {
            safetyZone = 'danger';
            recommendations.push('Temperature exceeds safe limits for electronics');
            recommendations.push('Consider active cooling or heat sinks');
        } else if (temp >= 150) {
            safetyZone = 'moderate';
            recommendations.push('Moderate heat - use thermal insulation');
        } else {
            recommendations.push('Safe temperature for most electronics');
        }

        if (matData && temp > matData.meltingPoint * 0.8) {
            recommendations.push(`Warning: Approaching ${material} melting point`);
        }

        res.json({ success: true, analysis: { temperature: temp, safetyZone, recommendations, material: matData } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Send to Machine
app.post('/api/send-to-machine', async (req, res) => {
    try {
        const { machineType, machineUrl, objects } = req.body;
        if (!machineType || !machineUrl || !objects) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        let code = '';
        if (machineType === 'printer') code = generateGCode(objects);
        else if (machineType === 'cnc') code = generateCNCCode(objects);
        else if (machineType === 'laser') code = generateLaserCode(objects);
        else return res.status(400).json({ success: false, error: 'Unsupported machine type' });

        console.log(`Sending to ${machineType} at ${machineUrl}`);
        res.json({ success: true, message: `Sent to ${machineType}`, code: code.substring(0, 500) });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Plugin Registration
app.post('/api/plugins/register', (req, res) => {
    const { name, version, endpoint, description } = req.body;
    if (!name || !endpoint) return res.status(400).json({ success: false, error: 'Name and endpoint required' });
    
    plugins.set(name, { name, version: version || '1.0.0', endpoint, description: description || '', registeredAt: new Date().toISOString() });
    res.json({ success: true, message: `Plugin "${name}" registered`, plugin: plugins.get(name) });
});

// List Plugins
app.get('/api/plugins', (req, res) => {
    res.json({ success: true, plugins: Array.from(plugins.values()) });
});

// Execute Plugin
app.post('/api/plugins/:name/execute', async (req, res) => {
    const plugin = plugins.get(req.params.name);
    if (!plugin) return res.status(404).json({ success: false, error: 'Plugin not found' });

    try {
        const response = await fetch(plugin.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const result = await response.json();
        res.json({ success: true, plugin: req.params.name, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Export Model
app.post('/api/export', (req, res) => {
    try {
        const { format, objects } = req.body;
        if (!format || !objects) return res.status(400).json({ success: false, error: 'Format and objects required' });

        let data = '', mimeType = 'text/plain';
        switch (format.toLowerCase()) {
            case 'stl': data = generateSTL(objects); mimeType = 'model/stl'; break;
            case 'obj': data = generateOBJ(objects); mimeType = 'model/obj'; break;
            case 'step': data = generateSTEP(objects); mimeType = 'application/step'; break;
            default: return res.status(400).json({ success: false, error: 'Unsupported format' });
        }
        res.json({ success: true, format, data, mimeType });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Helper functions
function generateGCode(objects) {
    let g = '; Pro-Gen G-Code\nG21\nG90\nM82\n';
    objects.forEach((o, i) => { g += `; ${o.name}\nG1 X${o.position[0]} Y${o.position[1]} Z${o.position[2]}\n`; });
    return g + 'G28\nM84\n';
}

function generateCNCCode(objects) {
    let c = '(Pro-Gen CNC)\n%\nO1000\nG17 G20 G40 G49 G80 G90\n';
    objects.forEach((o, i) => { c += `(${o.name})\nG0 X${o.position[0]} Y${o.position[1]}\nM3 S10000\n`; });
    return c + 'G0 Z1.0\nM5\nM30\n%\n';
}

function generateLaserCode(objects) {
    let l = '; Pro-Gen Laser\n';
    objects.forEach((o, i) => { l += `; ${o.name}\nG0 X${o.position[0]*10} Y${o.position[1]*10}\nM3 S1000\n`; });
    return l + 'M5\n';
}

function generateSTL(objects) {
    let s = 'solid progen_model\n';
    objects.forEach(o => { s += `# ${o.name}\n  facet normal 0 0 1\n    outer loop\n      vertex 0 0 0\n      vertex 1 0 0\n      vertex 0 1 0\n    endloop\n  endfacet\n`; });
    return s + 'endsolid progen_model\n';
}

function generateOBJ(objects) {
    let o = '# Pro-Gen OBJ\n';
    objects.forEach((obj, i) => {
        o += `o ${obj.name}\nv ${obj.position[0]} ${obj.position[1]} ${obj.position[2]}\nv ${obj.position[0]+1} ${obj.position[1]} ${obj.position[2]}\nv ${obj.position[0]} ${obj.position[1]+1} ${obj.position[2]}\nf 1 2 3\n\n`;
    });
    return o;
}

function generateSTEP(objects) {
    let s = 'ISO-10303-21;\nHEADER;\n';
    s += "FILE_DESCRIPTION(('Pro-Gen STEP'), '2;1');\n";
    s += "FILE_NAME('progen.step', '" + new Date().toISOString() + "', (), (), 'Pro-Gen', '', '');\n";
    s += 'ENDSEC;\nDATA;\n';
    objects.forEach((o, i) => {
        s += '#' + (i+1) + " = PRODUCT('" + o.name + "', '', ());\n";
    });
    return s + 'ENDSEC;\nEND-ISO-10303-21;\n';
}

// Static file serving for dist folder - must be BEFORE wildcard route
app.use(express.static(path.join(__dirname, '../dist'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
        if (path.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
    }
}));

// Serve frontend for non-API routes
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ success: false, error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`\n╔═══════════════════════════════════════╗
║  🎨 Pro-Gen Server Running
║  Port: ${PORT}
║  http://localhost:${PORT}
╚═══════════════════════════════════════╝\n`);
});
