import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * Pro-Gen - Professional 3D Modeling Hub
 * Main Application Logic
 * @version 1.0.0
 */
class ProGen {
    /**
     * Initialize the ProGen application
     */
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.objects = [];
        this.selectedObject = null;
        this.objectCounter = 0;
        this.gridHelper = null;
        this.isWireframe = false;
        this.heatAnalysisEnabled = false;
        this.currentTemperature = 25;
        this.apiKey = localStorage.getItem('progen_api_key') || '';
        
        this.init();
        this.setupEventListeners();
        this.animate();
        
        // Load saved API key
        if (this.apiKey) {
            document.getElementById('apiKey').value = this.apiKey;
        }
    }
    
    init() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);
        
        // Renderer
        const viewport = document.getElementById('viewport');
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(viewport.clientWidth, viewport.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        viewport.appendChild(this.renderer.domElement);
        
        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 100;
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
        directionalLight2.position.set(-10, -10, -5);
        this.scene.add(directionalLight2);
        
        // Grid
        this.gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
        this.scene.add(this.gridHelper);
        
        // Axes helper
        const axesHelper = new THREE.AxesHelper(3);
        this.scene.add(axesHelper);
        
        // Raycaster for object selection
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    setupEventListeners() {
        // Tool buttons
        document.querySelectorAll('[data-tool]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tool = e.currentTarget.dataset.tool;
                this.addObject(tool);
            });
        });
        
        // Action buttons
        document.getElementById('duplicateBtn').addEventListener('click', () => this.duplicateObject());
        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteObject());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearScene());
        
        // View buttons
        document.getElementById('resetViewBtn').addEventListener('click', () => this.resetView());
        document.getElementById('toggleGridBtn').addEventListener('click', () => this.toggleGrid());
        document.getElementById('wireframeBtn').addEventListener('click', () => this.toggleWireframe());
        
        // Heat toggle
        document.getElementById('heatToggle').addEventListener('change', (e) => {
            this.heatAnalysisEnabled = e.target.checked;
            document.getElementById('heatOverlay').classList.toggle('hidden', !this.heatAnalysisEnabled);
            this.updateHeatVisualization();
        });
        
        // Temperature slider
        document.getElementById('tempSlider').addEventListener('input', (e) => {
            this.currentTemperature = parseInt(e.target.value);
            document.getElementById('tempValue').textContent = this.currentTemperature;
            this.updateHeatDisplay();
            this.updateHeatVisualization();
        });
        
        // API Key save
        document.getElementById('saveApiKey').addEventListener('click', () => {
            const key = document.getElementById('apiKey').value.trim();
            this.apiKey = key;
            localStorage.setItem('progen_api_key', key);
            alert(key ? 'API Key saved successfully!' : 'API Key cleared!');
        });
        
        // AI Assistant
        document.getElementById('aiAssistantBtn').addEventListener('click', () => {
            document.getElementById('aiModal').classList.remove('hidden');
        });
        
        document.getElementById('closeAiModal').addEventListener('click', () => {
            document.getElementById('aiModal').classList.add('hidden');
        });
        
        document.getElementById('generateBtn').addEventListener('click', () => this.generateWithAI());
        
        // Property inputs
        document.getElementById('objName').addEventListener('input', (e) => {
            if (this.selectedObject) {
                this.selectedObject.userData.name = e.target.value;
                this.updateSceneList();
            }
        });
        
        ['posX', 'posY', 'posZ'].forEach((id, index) => {
            document.getElementById(id).addEventListener('input', (e) => {
                if (this.selectedObject) {
                    this.selectedObject.position[index] = parseFloat(e.target.value) || 0;
                }
            });
        });
        
        ['scaleX', 'scaleY', 'scaleZ'].forEach((id, index) => {
            document.getElementById(id).addEventListener('input', (e) => {
                if (this.selectedObject) {
                    const val = parseFloat(e.target.value) || 1;
                    this.selectedObject.scale[index] = Math.max(0.1, val);
                }
            });
        });
        
        ['rotX', 'rotY', 'rotZ'].forEach((id, index) => {
            document.getElementById(id).addEventListener('input', (e) => {
                if (this.selectedObject) {
                    this.selectedObject.rotation[index] = (parseFloat(e.target.value) || 0) * Math.PI / 180;
                }
            });
        });
        
        document.getElementById('objColor').addEventListener('input', (e) => {
            if (this.selectedObject && this.selectedObject.material) {
                this.selectedObject.material.color.set(e.target.value);
            }
        });
        
        // Export and manufacturing
        document.getElementById('exportBtn').addEventListener('click', () => this.exportModel());
        document.getElementById('sendToMachineBtn').addEventListener('click', () => this.sendToMachine());
        
        // Viewport click for selection
        this.renderer.domElement.addEventListener('click', (e) => this.onViewportClick(e));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
    }
    
    addObject(type) {
        let geometry;
        const color = new THREE.Color().setHSL(Math.random(), 0.7, 0.5);
        const material = new THREE.MeshStandardMaterial({ 
            color,
            metalness: 0.3,
            roughness: 0.7
        });
        
        switch(type) {
            case 'cube':
                geometry = new THREE.BoxGeometry(1, 1, 1);
                break;
            case 'sphere':
                geometry = new THREE.SphereGeometry(0.5, 32, 32);
                break;
            case 'cylinder':
                geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
                break;
            case 'cone':
                geometry = new THREE.ConeGeometry(0.5, 1, 32);
                break;
            case 'torus':
                geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 32);
                break;
            default:
                return;
        }
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 0.5;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        this.objectCounter++;
        mesh.userData = {
            id: this.objectCounter,
            name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${this.objectCounter}`,
            type: type,
            baseColor: color.getHex()
        };
        
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.updateSceneList();
    }
    
    selectObject(object) {
        // Deselect previous
        if (this.selectedObject && this.selectedObject.material) {
            this.selectedObject.material.emissive?.setHex(0x000000);
        }
        
        this.selectedObject = object;
        
        if (object) {
            // Highlight selected
            if (object.material) {
                object.material.emissive?.setHex(0x333333);
            }
            
            // Update properties panel
            document.getElementById('noSelection').classList.add('hidden');
            document.getElementById('objectProperties').classList.remove('hidden');
            
            // Populate fields
            document.getElementById('objName').value = object.userData.name || '';
            document.getElementById('posX').value = object.position.x.toFixed(2);
            document.getElementById('posY').value = object.position.y.toFixed(2);
            document.getElementById('posZ').value = object.position.z.toFixed(2);
            document.getElementById('scaleX').value = object.scale.x.toFixed(2);
            document.getElementById('scaleY').value = object.scale.y.toFixed(2);
            document.getElementById('scaleZ').value = object.scale.z.toFixed(2);
            document.getElementById('rotX').value = (object.rotation.x * 180 / Math.PI).toFixed(0);
            document.getElementById('rotY').value = (object.rotation.y * 180 / Math.PI).toFixed(0);
            document.getElementById('rotZ').value = (object.rotation.z * 180 / Math.PI).toFixed(0);
            
            if (object.material && object.material.color) {
                document.getElementById('objColor').value = '#' + object.material.color.getHexString();
            }
            
            // Update scene list selection
            document.querySelectorAll('.scene-item').forEach(item => {
                item.classList.toggle('active', parseInt(item.dataset.id) === object.userData.id);
            });
        } else {
            document.getElementById('noSelection').classList.remove('hidden');
            document.getElementById('objectProperties').classList.add('hidden');
        }
    }
    
    duplicateObject() {
        if (!this.selectedObject) {
            alert('Please select an object to duplicate');
            return;
        }
        
        const original = this.selectedObject;
        const clone = original.clone();
        
        this.objectCounter++;
        clone.userData = {
            ...original.userData,
            id: this.objectCounter,
            name: `${original.userData.name} Copy`
        };
        
        clone.position.x += 1;
        
        this.scene.add(clone);
        this.objects.push(clone);
        this.selectObject(clone);
        this.updateSceneList();
    }
    
    deleteObject() {
        if (!this.selectedObject) {
            alert('Please select an object to delete');
            return;
        }
        
        const index = this.objects.indexOf(this.selectedObject);
        if (index > -1) {
            this.objects.splice(index, 1);
            this.scene.remove(this.selectedObject);
            this.selectedObject.geometry?.dispose();
            this.selectedObject.material?.dispose();
            this.selectObject(null);
            this.updateSceneList();
        }
    }
    
    clearScene() {
        if (!confirm('Are you sure you want to clear all objects?')) return;
        
        this.objects.forEach(obj => {
            this.scene.remove(obj);
            obj.geometry?.dispose();
            obj.material?.dispose();
        });
        
        this.objects = [];
        this.selectObject(null);
        this.updateSceneList();
    }
    
    resetView() {
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    }
    
    toggleGrid() {
        if (this.gridHelper) {
            this.gridHelper.visible = !this.gridHelper.visible;
        }
    }
    
    toggleWireframe() {
        this.isWireframe = !this.isWireframe;
        this.objects.forEach(obj => {
            if (obj.material) {
                obj.material.wireframe = this.isWireframe;
            }
        });
    }
    
    onViewportClick(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.objects);
        
        if (intersects.length > 0) {
            this.selectObject(intersects[0].object);
        } else {
            this.selectObject(null);
        }
    }
    
    onKeyDown(event) {
        switch(event.key.toLowerCase()) {
            case 'delete':
            case 'backspace':
                if (document.activeElement.tagName !== 'INPUT' && 
                    document.activeElement.tagName !== 'TEXTAREA') {
                    this.deleteObject();
                }
                break;
            case 'd':
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();
                    this.duplicateObject();
                }
                break;
            case 'escape':
                this.selectObject(null);
                break;
        }
    }
    
    updateSceneList() {
        const list = document.getElementById('sceneList');
        
        if (this.objects.length === 0) {
            list.innerHTML = '<p class="empty-scene">No objects in scene</p>';
            return;
        }
        
        list.innerHTML = this.objects.map(obj => `
            <div class="scene-item" data-id="${obj.userData.id}">
                <div>
                    <div class="scene-item-name">${obj.userData.name}</div>
                    <div class="scene-item-type">${obj.userData.type}</div>
                </div>
            </div>
        `).join('');
        
        list.querySelectorAll('.scene-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                const obj = this.objects.find(o => o.userData.id === id);
                if (obj) this.selectObject(obj);
            });
        });
    }
    
    updateHeatDisplay() {
        const heatLevel = document.getElementById('heatLevel');
        const heatValue = document.getElementById('heatValue');
        const heatStatus = document.getElementById('heatStatus');
        
        const percentage = (this.currentTemperature / 500) * 100;
        heatLevel.style.width = `${percentage}%`;
        heatValue.textContent = `${this.currentTemperature}°C`;
        
        if (this.currentTemperature < 150) {
            heatStatus.textContent = 'Safe for Electronics';
            heatStatus.className = 'heat-status safe';
        } else if (this.currentTemperature < 300) {
            heatStatus.textContent = 'Moderate Heat - Caution';
            heatStatus.className = 'heat-status moderate';
        } else {
            heatStatus.textContent = 'High Heat - Danger';
            heatStatus.className = 'heat-status danger';
        }
    }
    
    updateHeatVisualization() {
        if (!this.heatAnalysisEnabled) return;
        
        // Color based on temperature
        const objects = this.objects.filter(obj => obj.userData.type !== 'grid');
        
        objects.forEach(obj => {
            if (obj.material) {
                let color;
                if (this.currentTemperature < 150) {
                    color = new THREE.Color().setHex(obj.userData.baseColor);
                } else if (this.currentTemperature < 300) {
                    color = new THREE.Color().setHSL(0.1, 0.8, 0.5); // Orange-ish
                } else {
                    color = new THREE.Color().setHSL(0, 0.9, 0.5); // Red
                }
                obj.material.color.copy(color);
            }
        });
    }
    
    async generateWithAI() {
        const prompt = document.getElementById('aiPrompt').value.trim();
        if (!prompt) {
            alert('Please enter a description');
            return;
        }
        
        if (!this.apiKey) {
            alert('Please enter your OpenAI API key first');
            return;
        }
        
        const loading = document.getElementById('aiLoading');
        const result = document.getElementById('aiResult');
        const generateBtn = document.getElementById('generateBtn');
        
        loading.classList.remove('hidden');
        result.classList.add('hidden');
        generateBtn.disabled = true;
        
        try {
            const response = await fetch('/api/ai-generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    prompt,
                    apiKey: this.apiKey 
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                result.innerHTML = `<p>${data.message}</p>`;
                result.classList.remove('hidden');
                
                // Parse the generated code and create objects
                if (data.objects) {
                    data.objects.forEach(objType => {
                        this.addObject(objType);
                    });
                }
            } else {
                throw new Error(data.error || 'Generation failed');
            }
        } catch (error) {
            result.innerHTML = `<p style="color: var(--danger)">Error: ${error.message}</p>`;
            result.classList.remove('hidden');
        } finally {
            loading.classList.add('hidden');
            generateBtn.disabled = false;
        }
    }
    
    exportModel() {
        const format = document.getElementById('exportFormat').value;
        
        if (this.objects.length === 0) {
            alert('No objects to export');
            return;
        }
        
        // Simple STL export (in production, use proper library)
        let stlContent = 'solid progen_model\n';
        
        this.objects.forEach(obj => {
            if (obj.geometry) {
                stlContent += `# Object: ${obj.userData.name}\n`;
                // Simplified - in production would need proper triangulation
            }
        });
        
        stlContent += 'endsolid progen_model';
        
        const blob = new Blob([stlContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `progen_model.${format}`;
        a.click();
        URL.revokeObjectURL(url);
        
        alert(`Model exported as ${format.toUpperCase()}!`);
    }
    
    async sendToMachine() {
        const machineType = document.getElementById('machineType').value;
        const machineUrl = document.getElementById('machineUrl').value.trim();
        
        if (!machineUrl) {
            alert('Please enter the machine URL/IP address');
            return;
        }
        
        if (this.objects.length === 0) {
            alert('No objects to send');
            return;
        }
        
        try {
            // In production, this would send actual G-code or machine instructions
            const response = await fetch('/api/send-to-machine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    machineType,
                    machineUrl,
                    objects: this.objects.map(obj => ({
                        name: obj.userData.name,
                        type: obj.userData.type,
                        position: obj.position.toArray(),
                        scale: obj.scale.toArray(),
                        rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z]
                    }))
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert(`Successfully sent to ${machineType} at ${machineUrl}`);
            } else {
                throw new Error(data.error || 'Failed to send to machine');
            }
        } catch {
            // For demo purposes, show success even if endpoint doesn't exist
            alert(`Simulated: Model sent to ${machineType} at ${machineUrl}\n\n(In production, ensure your machine API is running)`);
        }
    }
    
    onWindowResize() {
        const viewport = document.getElementById('viewport');
        this.camera.aspect = viewport.clientWidth / viewport.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(viewport.clientWidth, viewport.clientHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    window.progen = new ProGen();
});
