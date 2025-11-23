class Scene3D {
  constructor() {
    console.log('Scene3D - Inicializando cena 3D...');
    this.canvas = document.getElementById('canvas');
    if (!this.canvas) {
      console.error('Canvas não encontrado!');
      return;
    }
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x0a0a0a, 15, 60);
    
    this.setupCamera();
    this.setupRenderer();
    console.log('Scene3D - Renderer configurado');
    this.setupControls();
    this.setupLights();
    this.createStars();
    this.createGrid();
    this.createCPU();
    this.createRegisters();
    this.createMemory();
    this.createIODevices();
    this.createBuses();
    this.createAmbientParticles();
    
    this.cameraAngle = 0;
    this.time = 0;
    
    console.log('Scene3D - Cena 3D criada com sucesso!');
  }
  
  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 10, 20);
    this.camera.lookAt(0, 0, 0);
  }
  
  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: this.canvas, 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
  }
  
  setupControls() {
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.canvas);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.minDistance = 8;
      this.controls.maxDistance = 40;
      this.controls.maxPolarAngle = Math.PI / 1.8;
    }
  }
  
  setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);

    this.mainLight = new THREE.PointLight(0x00ff41, 2, 60);
    this.mainLight.position.set(0, 15, 0);
    this.mainLight.castShadow = true;
    this.mainLight.shadow.mapSize.width = 2048;
    this.mainLight.shadow.mapSize.height = 2048;
    this.mainLight.shadow.camera.near = 0.5;
    this.mainLight.shadow.camera.far = 50;
    this.scene.add(this.mainLight);

    this.cpuLight = new THREE.PointLight(0x00aaff, 1.5, 15);
    this.cpuLight.position.set(0, 0, 0);
    this.scene.add(this.cpuLight);

    const accentLight1 = new THREE.PointLight(0xff00ff, 0.8, 20);
    accentLight1.position.set(-10, 5, 5);
    this.scene.add(accentLight1);

    const accentLight2 = new THREE.PointLight(0x00ffff, 0.8, 20);
    accentLight2.position.set(10, 5, 5);
    this.scene.add(accentLight2);
    
    const rimLight = new THREE.SpotLight(0x00ffff, 1);
    rimLight.position.set(0, 20, -10);
    rimLight.angle = Math.PI / 4;
    rimLight.penumbra = 0.3;
    rimLight.decay = 2;
    rimLight.distance = 50;
    this.scene.add(rimLight);
  }
  
  createStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    const starColors = [];
    
    for (let i = 0; i < 2000; i++) {
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 200;
      const z = (Math.random() - 0.5) * 200;
      starVertices.push(x, y, z);
      
      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.3 + 0.5, 0.8, 0.8);
      starColors.push(color.r, color.g, color.b);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
    
    const starMaterial = new THREE.PointsMaterial({ 
      size: 0.5, 
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    this.stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(this.stars);
  }
  
  createGrid() {
    const gridHelper = new THREE.GridHelper(40, 40, 0x00ff41, 0x003311);
    gridHelper.position.y = -6;
    gridHelper.material.opacity = 0.5;
    gridHelper.material.transparent = true;
    this.scene.add(gridHelper);
  }
  
  createCPU() {
    this.cpuGroup = new THREE.Group();
    
    const cpuGeometry = new THREE.BoxGeometry(3, 3, 3);
    const cpuMaterial = new THREE.MeshPhysicalMaterial({ 
      color: 0x0088ff, 
      emissive: 0x0044aa,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0
    });
    this.cpuMesh = new THREE.Mesh(cpuGeometry, cpuMaterial);
    this.cpuMesh.castShadow = true;
    this.cpuMesh.receiveShadow = true;
    this.cpuGroup.add(this.cpuMesh);

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = Math.cos(angle) * 1.6;
      const z = Math.sin(angle) * 1.6;
      
      const detailGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
      const detailMaterial = new THREE.MeshPhysicalMaterial({ 
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        metalness: 1.0,
        roughness: 0.0
      });
      const detail = new THREE.Mesh(detailGeometry, detailMaterial);
      detail.position.set(x, 0, z);
      this.cpuGroup.add(detail);
    }

    this.cpuGroup.position.set(0, 0, 0);
    this.scene.add(this.cpuGroup);
  }
  
  createRegister(name, position, color = 0x00ff41) {
    const regGroup = new THREE.Group();
    
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: color, 
      linewidth: 2,
      transparent: true,
      opacity: 0.8
    });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    
    const material = new THREE.MeshPhysicalMaterial({ 
      color: color,
      emissive: color,
      emissiveIntensity: 0.6,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.95,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    regGroup.add(mesh);
    regGroup.add(wireframe);
    regGroup.position.copy(position);
    this.scene.add(regGroup);

    const label = document.createElement('div');
    label.className = 'label-3d';
    label.textContent = `${name}: 0`;
    document.body.appendChild(label);

    return { 
      name, 
      mesh, 
      wireframe,
      group: regGroup,
      value: 0, 
      label, 
      baseColor: color,
      position: position.clone()
    };
  }
  
  createRegisters() {
    this.registers = {
      R1: this.createRegister('R1', new THREE.Vector3(-6, 0, 0), 0x00ff41),
      R2: this.createRegister('R2', new THREE.Vector3(6, 0, 0), 0x00ff41),
      R3: this.createRegister('R3', new THREE.Vector3(-6, 0, 5), 0xffaa00),
      R4: this.createRegister('R4', new THREE.Vector3(6, 0, 5), 0xffaa00)
    };
  }
  
  createMemory() {
    this.memory = [];
    for (let i = 0; i < 8; i++) {
      const memGroup = new THREE.Group();
      
      const memGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
      const memMaterial = new THREE.MeshPhysicalMaterial({ 
        color: 0xff6600,
        emissive: 0xff3300,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 0.3,
        clearcoatRoughness: 0.3
      });
      const memMesh = new THREE.Mesh(memGeometry, memMaterial);
      memMesh.castShadow = true;
      memMesh.receiveShadow = true;
      
      const edges = new THREE.EdgesGeometry(memGeometry);
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0xff6600,
        transparent: true,
        opacity: 0.6
      });
      const wireframe = new THREE.LineSegments(edges, lineMaterial);
      
      memGroup.add(memMesh);
      memGroup.add(wireframe);
      memGroup.position.set(-7 + i * 2, -5, 0);
      this.scene.add(memGroup);

      const label = document.createElement('div');
      label.className = 'label-3d';
      label.textContent = `M${i}: 0`;
      document.body.appendChild(label);

      this.memory.push({ 
        mesh: memMesh, 
        wireframe,
        group: memGroup,
        value: 0, 
        index: i, 
        label,
        baseColor: 0xff6600
      });
    }
  }
  
  createIODevice(name, position, type, color = 0x00ffff) {
    const ioGroup = new THREE.Group();
    
    let geometry;
    if (type === 'input') {
      geometry = new THREE.CylinderGeometry(1, 1, 0.5, 16);
    } else {
      geometry = new THREE.CylinderGeometry(1.2, 1, 0.8, 16);
    }
    
    const material = new THREE.MeshPhysicalMaterial({ 
      color: color,
      emissive: color,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: color,
      transparent: true,
      opacity: 0.7
    });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    
    ioGroup.add(mesh);
    ioGroup.add(wireframe);
    ioGroup.position.copy(position);
    this.scene.add(ioGroup);

    const label = document.createElement('div');
    label.className = 'label-3d';
    label.textContent = `${name}: 0`;
    document.body.appendChild(label);

    return { 
      name, 
      mesh, 
      wireframe,
      group: ioGroup,
      value: 0, 
      label, 
      baseColor: color,
      type,
      position: position.clone()
    };
  }
  
  createIODevices() {
    this.ioDevices = {
      IN0: this.createIODevice('IN0', new THREE.Vector3(-8, 0, 8), 'input', 0x00ff00),
      OUT0: this.createIODevice('OUT0', new THREE.Vector3(8, 0, 8), 'output', 0xff0000)
    };
  }
  
  createBus(start, end, color = 0x00ff41) {
    const points = [start, end];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
      color: color, 
      transparent: true, 
      opacity: 0,
      linewidth: 3
    });
    const line = new THREE.Line(geometry, material);
    this.scene.add(line);
    return line;
  }
  
  createBuses() {
    this.buses = {
      R1: this.createBus(this.cpuGroup.position, this.registers.R1.position, 0x00ffff),
      R2: this.createBus(this.cpuGroup.position, this.registers.R2.position, 0x00ffff),
      R3: this.createBus(this.cpuGroup.position, this.registers.R3.position, 0xffaa00),
      R4: this.createBus(this.cpuGroup.position, this.registers.R4.position, 0xffaa00),
      memory: this.memory.map(mem => this.createBus(this.cpuGroup.position, mem.group.position, 0xff00ff)),
      input: this.createBus(this.cpuGroup.position, this.ioDevices.IN0.position, 0x00ff00),
      output: this.createBus(this.cpuGroup.position, this.ioDevices.OUT0.position, 0xff0000)
    };
  }
  
  createAmbientParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCnt = 500;
    const posArray = new Float32Array(particlesCnt * 3);
    
    for(let i = 0; i < particlesCnt * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 50;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x00ffff,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });
    
    this.particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(this.particlesMesh);
  }
  
  updateLabels() {
    Object.values(this.registers).forEach(reg => {
      const vector = reg.position.clone().project(this.camera);
      const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
      reg.label.style.left = `${x}px`;
      reg.label.style.top = `${y - 35}px`;
      reg.label.textContent = `${reg.name}: ${reg.value}`;
    });

    this.memory.forEach(mem => {
      const vector = mem.group.position.clone().project(this.camera);
      const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
      mem.label.style.left = `${x}px`;
      mem.label.style.top = `${y - 25}px`;
      mem.label.textContent = `M${mem.index}: ${mem.value}`;
    });

    Object.values(this.ioDevices).forEach(device => {
      const vector = device.position.clone().project(this.camera);
      const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
      device.label.style.left = `${x}px`;
      device.label.style.top = `${y - 25}px`;
      device.label.textContent = `${device.name}: ${device.value}`;
    });
  }
  
  animate() {
    this.time += 0.01;
    
    this.cpuGroup.rotation.y += 0.003;
    this.stars.rotation.y += 0.0002;
    this.stars.rotation.x += 0.0001;
    
    if (this.particlesMesh) {
      this.particlesMesh.rotation.y += 0.0005;
      this.particlesMesh.rotation.x = Math.sin(this.time * 0.2) * 0.1;
    }
    
    this.mainLight.intensity = 2 + Math.sin(this.time * 2) * 0.3;
    this.cpuLight.intensity = 1.5 + Math.sin(this.time * 3) * 0.2;
    
    
    if (this.controls) {
      this.controls.update();
    } else {
      
      this.cameraAngle += 0.001;
      this.camera.position.x = Math.sin(this.cameraAngle) * 2;
      this.camera.position.y = 10 + Math.sin(this.cameraAngle * 0.5) * 0.5;
      this.camera.lookAt(0, 0, 0);
    }
    
    Object.values(this.registers).forEach(reg => {
      reg.mesh.material.emissiveIntensity = 0.6 + Math.sin(this.time * 2 + reg.position.x) * 0.2;
    });
    
    this.memory.forEach((mem, i) => {
      mem.mesh.material.emissiveIntensity = 0.5 + Math.sin(this.time * 1.5 + i) * 0.15;
    });
    
    this.updateLabels();
    this.renderer.render(this.scene, this.camera);
  }
  
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
