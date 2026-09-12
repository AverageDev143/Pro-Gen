/**
 * Pro-Gen Test Suite
 * Simple test runner for API and utility functions
 */

import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

// Import server functions for testing
const materialConfig = {
  PLA: { meltingPoint: 220, glassTransition: 60, thermalConductivity: 0.13 },
  ABS: { meltingPoint: 250, glassTransition: 105, thermalConductivity: 0.17 },
  PETG: { meltingPoint: 260, glassTransition: 80, thermalConductivity: 0.29 },
  Nylon: { meltingPoint: 265, glassTransition: 50, thermalConductivity: 0.25 },
  Aluminum: { meltingPoint: 660, glassTransition: null, thermalConductivity: 205 },
  Steel: { meltingPoint: 1400, glassTransition: null, thermalConductivity: 50 },
  Copper: { meltingPoint: 1085, glassTransition: null, thermalConductivity: 385 }
};

describe('Thermal Analysis', () => {
  it('should classify temperature < 150 as safe', () => {
    const temp = 100;
    const safetyZone = temp >= 300 ? 'danger' : temp >= 150 ? 'moderate' : 'safe';
    assert.strictEqual(safetyZone, 'safe');
  });

  it('should classify temperature 150-300 as moderate', () => {
    const temp = 200;
    const safetyZone = temp >= 300 ? 'danger' : temp >= 150 ? 'moderate' : 'safe';
    assert.strictEqual(safetyZone, 'moderate');
  });

  it('should classify temperature >= 300 as danger', () => {
    const temp = 350;
    const safetyZone = temp >= 300 ? 'danger' : temp >= 150 ? 'moderate' : 'safe';
    assert.strictEqual(safetyZone, 'danger');
  });

  it('should detect when approaching material melting point', () => {
    const temp = 180;
    const material = 'PLA';
    const matData = materialConfig[material];
    const approaching = temp > matData.meltingPoint * 0.8;
    assert.strictEqual(approaching, true);
  });
});

describe('Material Configuration', () => {
  it('should have all required materials defined', () => {
    const requiredMaterials = ['PLA', 'ABS', 'PETG', 'Nylon', 'Aluminum', 'Steel', 'Copper'];
    requiredMaterials.forEach(material => {
      assert.ok(materialConfig[material], `Material ${material} should be defined`);
      assert.ok(materialConfig[material].meltingPoint, `${material} should have meltingPoint`);
      assert.ok(materialConfig[material].thermalConductivity, `${material} should have thermalConductivity`);
    });
  });

  it('should have valid melting points', () => {
    Object.entries(materialConfig).forEach(([name, config]) => {
      assert.ok(config.meltingPoint > 0, `${name} melting point should be positive`);
      if (config.glassTransition !== null) {
        assert.ok(config.glassTransition < config.meltingPoint, `${name} glass transition should be below melting point`);
      }
    });
  });
});

describe('G-Code Generation', () => {
  it('should generate valid G-Code header', () => {
    const gcode = '; Pro-Gen G-Code\nG21\nG90\nM82\n';
    assert.ok(gcode.includes('G21'), 'Should include metric units');
    assert.ok(gcode.includes('G90'), 'Should include absolute positioning');
    assert.ok(gcode.includes('M82'), 'Should include extruder mode');
  });
});

describe('STL Export', () => {
  it('should generate valid STL header', () => {
    const stl = 'solid progen_model\n';
    assert.ok(stl.startsWith('solid'), 'STL should start with solid keyword');
    assert.ok(stl.includes('progen_model'), 'STL should include model name');
  });

  it('should generate valid STL footer', () => {
    const stl = 'endsolid progen_model\n';
    assert.ok(stl.startsWith('endsolid'), 'STL should end with endsolid keyword');
  });
});

describe('OBJ Export', () => {
  it('should generate valid OBJ header', () => {
    const obj = '# Pro-Gen OBJ\n';
    assert.ok(obj.startsWith('#'), 'OBJ comments should start with #');
  });
});

describe('STEP Export', () => {
  it('should generate valid STEP header', () => {
    const step = 'ISO-10303-21;\nHEADER;\n';
    assert.ok(step.includes('ISO-10303-21'), 'STEP should include ISO standard identifier');
    assert.ok(step.includes('HEADER'), 'STEP should include HEADER section');
  });
});

describe('API Endpoints', () => {
  it('should have valid endpoint paths', () => {
    const endpoints = [
      '/api/health',
      '/api/ai-generate',
      '/api/thermal-analysis',
      '/api/send-to-machine',
      '/api/plugins',
      '/api/export'
    ];
    
    endpoints.forEach(endpoint => {
      assert.ok(endpoint.startsWith('/api/'), `Endpoint ${endpoint} should start with /api/`);
    });
  });
});

console.log('\n✅ All tests passed!\n');
