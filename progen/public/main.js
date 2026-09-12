import * as THREE from 'three';
import { OrbitControls } from './vendors/three/addons/controls/OrbitControls.js';

/**
 * Pro-Gen - Lightweight 3D Modeling Desktop App
 * Main Application Logic
 * @version 2.0.0
 */
class ProGen {
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
        
        this.init();
        this.setupEventListeners();
        this.animate();
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
        
        // Renderer - optimized for performance
        const viewport = document.getElementById('viewport');
        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        this.renderer.setSize(viewport.clientWidth, viewport.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        viewport.appendChild(this.renderer.domElement);
        
        // Controls - smoothed
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 100;
        this.controls.autoRotate = false;
        this.controls.autoRotateSpeed = 2.0;
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
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
        // Tool buttons with smooth feedback
        document.querySelectorAll('[data-tool]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tool = e.currentTarget.dataset.tool;
                this.addObject(tool);
                this.animateButton(e.currentTarget);
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
            const heatOverlay = document.getElementById('heatOverlay');
            if (!heatOverlay) return;
            
            heatOverlay.classList.toggle('hidden', !this.heatAnalysisEnabled);
            
            if (this.heatAnalysisEnabled) {
                this.updateHeatVisualization();
            } else {
                this.restoreObjectColors();
            }
        });
        
        // Temperature slider with smooth updates
        let tempUpdateTimeout;
        document.getElementById('tempSlider').addEventListener('input', (e) => {
            clearTimeout(tempUpdateTimeout);
            this.currentTemperature = parseInt(e.target.value);
            document.getElementById('tempValue').textContent = this.currentTemperature;
            tempUpdateTimeout = setTimeout(() => {
                this.updateHeatDisplay();
                this.updateHeatVisualization();
            }, 16);
        });
        
        // Property inputs with validation
        document.getElementById('objName').addEventListener('input', (e) => {
            if (this.selectedObject) {
                this.selectedObject.userData.name = e.target.value;
                this.updateSceneList();
            }
        });
        
        ['posX', 'posY', 'posZ'].forEach((id, index) => {
            document.getElementById(id).addEventListener('input', (e) => {
                if (this.selectedObject) {
                    this.selectedObject.position.setComponent(index, parseFloat(e.target.value) || 0);
                }
            });
        });
        
        ['scaleX', 'scaleY', 'scaleZ'].forEach((id, index) => {
            document.getElementById(id).addEventListener('input', (e) => {
                if (this.selectedObject) {
                    const val = parseFloat(e.target.value) || 1;
                    this.selectedObject.scale.setComponent(index, Math.max(0.1, val));
                }
            });
        });
        
        ['rotX', 'rotY', 'rotZ'].forEach((id, index) => {
            document.getElementById(id).addEventListener('input', (e) => {
                if (this.selectedObject) {
                    this.selectedObject.rotation.setComponent(index, (parseFloat(e.target.value) || 0) * Math.PI / 180);
                }
            });
        });
        
        document.getElementById('objColor').addEventListener('input', (e) => {
            if (this.selectedObject && this.selectedObject.material) {
                this.selectedObject.material.color.set(e.target.value);
                this.selectedObject.userData.baseColor = new THREE.Color(e.target.value).getHex();
            }
        });
        
        // Viewport click for selection
        this.renderer.domElement.addEventListener('click', (e) => this.onViewportClick(e));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
    }
    
    animateButton(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 100);
    }
    
    addObject(type, params = {}) {
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
            case 'torusKnot':
                geometry = new THREE.TorusKnotGeometry(0.4, 0.15, 64, 8);
                break;
            case 'dodecahedron':
                geometry = new THREE.DodecahedronGeometry(0.5);
                break;
            case 'icosahedron':
                geometry = new THREE.IcosahedronGeometry(0.5);
                break;
            case 'octahedron':
                geometry = new THREE.OctahedronGeometry(0.5);
                break;
            case 'tetrahedron':
                geometry = new THREE.TetrahedronGeometry(0.5);
                break;
            case 'capsule':
                geometry = new THREE.CapsuleGeometry(0.3, 0.6, 16, 32);
                break;
            case 'tube':
                const path = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(-1, 0, 0),
                    new THREE.Vector3(-0.5, 0.5, 0),
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(0.5, -0.5, 0),
                    new THREE.Vector3(1, 0, 0)
                ]);
                geometry = new THREE.TubeGeometry(path, 20, 0.15, 8, false);
                break;
            case 'spiral':
                const spiralPath = new THREE.CatmullRomCurve3(this.generateSpiraclePoints());
                geometry = new THREE.TubeGeometry(spiralPath, 50, 0.1, 8, false);
                break;
            case 'spring':
                const springPath = new THREE.CatmullRomCurve3(this.generateSpringPoints());
                geometry = new THREE.TubeGeometry(springPath, 64, 0.12, 8, false);
                break;
            case 'gear':
                geometry = this.createGearGeometry(0.5, 0.3, 0.15, 8);
                break;
            case 'star':
                geometry = this.createStarGeometry(0.5, 0.25, 5);
                break;
            case 'pyramid':
                geometry = new THREE.ConeGeometry(0.5, 0.8, 4);
                break;
            case 'ring':
                geometry = new THREE.RingGeometry(0.3, 0.5, 32);
                const ringMesh = new THREE.Mesh(geometry, material);
                ringMesh.rotation.x = -Math.PI / 2;
                mesh = ringMesh;
                break;
            default:
                return;
        }
        
        if (!geometry && type !== 'ring') return;
        
        if (type !== 'ring') {
            mesh.position.y = 0.5;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
        }
        
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
            this.showToast('Please select an object to duplicate');
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
            this.showToast('Please select an object to delete');
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
        if (this.objects.length === 0) {
            this.showToast('Scene is already empty');
            return;
        }
        
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
    
    showToast(message, duration = 2000) {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(22, 33, 62, 0.95);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            border: 1px solid #2d3748;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.5);
            z-index: 10000;
            font-size: 0.875rem;
            animation: fadeIn 0.2s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.2s ease-out';
            setTimeout(() => toast.remove(), 200);
        }, duration);
    }
    
    resetView() {
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
        this.showToast('View reset', 1200);
    }
    
    toggleGrid() {
        if (this.gridHelper) {
            this.gridHelper.visible = !this.gridHelper.visible;
            this.showToast(this.gridHelper.visible ? 'Grid shown' : 'Grid hidden', 1500);
        }
    }
    
    toggleWireframe() {
        this.isWireframe = !this.isWireframe;
        this.objects.forEach(obj => {
            if (obj.material) {
                obj.material.wireframe = this.isWireframe;
            }
        });
        this.showToast(this.isWireframe ? 'Wireframe enabled' : 'Wireframe disabled', 1500);
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
    
    restoreObjectColors() {
        // Restore original colors when heat analysis is disabled
        const objects = this.objects.filter(obj => obj.userData.type !== 'grid');
        
        objects.forEach(obj => {
            if (obj.material && obj.userData.baseColor) {
                obj.material.color.setHex(obj.userData.baseColor);
            }
        });
    }
    
    generateSpiraclePoints() {
        const points = [];
        for (let i = 0; i < 50; i++) {
            const angle = i * 0.3;
            const radius = 1 + i * 0.04;
            points.push(new THREE.Vector3(
                Math.cos(angle) * radius,
                i * 0.1,
                Math.sin(angle) * radius
            ));
        }
        return points;
    }
    
    generateSpringPoints() {
        const points = [];
        const coils = 5;
        const totalPoints = 64;
        for (let i = 0; i <= totalPoints; i++) {
            const angle = (i / totalPoints) * Math.PI * 2 * coils;
            const height = (i / totalPoints) * 2 - 1;
            points.push(new THREE.Vector3(
                Math.cos(angle) * 0.4,
                height,
                Math.sin(angle) * 0.4
            ));
        }
        return points;
    }
    
    createGearGeometry(outerRadius, innerRadius, thickness, teeth) {
        const shape = new THREE.Shape();
        const toothHeight = outerRadius - innerRadius;
        const toothAngle = (Math.PI * 2) / (teeth * 2);
        
        for (let i = 0; i < teeth * 2; i++) {
            const angle = i * toothAngle;
            const radius = (i % 2 === 0) ? innerRadius : outerRadius;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
                shape.moveTo(x, y);
            } else {
                shape.lineTo(x, y);
            }
        }
        shape.closePath();
        
        const extrudeSettings = {
            steps: 1,
            depth: thickness,
            bevelEnabled: false
        };
        
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }
    
    createStarGeometry(outerRadius, innerRadius, points) {
        const shape = new THREE.Shape();
        const step = Math.PI / points;
        
        for (let i = 0; i < points * 2; i++) {
            const radius = (i % 2 === 0) ? outerRadius : innerRadius;
            const angle = i * step - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
                shape.moveTo(x, y);
            } else {
                shape.lineTo(x, y);
            }
        }
        shape.closePath();
        
        const extrudeSettings = {
            steps: 1,
            depth: 0.15,
            bevelEnabled: false
        };
        
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }
    
    onWindowResize() {
        const viewport = document.getElementById('viewport');
        if (!viewport) return;
        
        this.camera.aspect = viewport.clientWidth / viewport.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(viewport.clientWidth, viewport.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        
        // Update selected object properties if it exists
        if (this.selectedObject) {
            const posX = document.getElementById('posX');
            const posY = document.getElementById('posY');
            const posZ = document.getElementById('posZ');
            
            // Only update if inputs are not focused to avoid cursor jumping
            if (posX && !document.activeElement.contains(posX)) {
                posX.value = this.selectedObject.position.x.toFixed(2);
            }
            if (posY && !document.activeElement.contains(posY)) {
                posY.value = this.selectedObject.position.y.toFixed(2);
            }
            if (posZ && !document.activeElement.contains(posZ)) {
                posZ.value = this.selectedObject.position.z.toFixed(2);
            }
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    window.progen = new ProGen();
});
