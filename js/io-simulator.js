

class IO3DVisualizer {
  constructor(canvas) {
    try {
      this.canvas = canvas;
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.controls = null;
      this.devices = {};
      this.animationId = null;
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();
      this.selectedDevice = null;
      
      
      this.audioContext = null;
      this.audioOscillator = null;
      this.audioGainNode = null;
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API não suportada:', e);
      }
      
      
      this.stats = {
        operationCount: 0,
        bytesTransferred: 0,
        interruptCount: 0,
        avgLatency: 0,
        errorRate: 0,
        transferRate: 0,
        latencies: []
      };
      
      
      this.simConfig = {
        keyboardBufferSize: 256,
        monitorBufferSize: 1024,
        printerBufferSize: 512,
        diskBlockSize: 4096,
        dmaTransferRate: 1024 * 10 
      };
      
      this.init();
    } catch (error) {
      console.error('Erro ao criar IO3DVisualizer:', error);
    }
  }

  init() {
    try {
      if (typeof THREE === 'undefined') {
        throw new Error('Three.js não foi carregado corretamente');
      }
      
      
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x0f023f);
      
      
      this.camera = new THREE.PerspectiveCamera(
        75,
        this.canvas.clientWidth / this.canvas.clientHeight,
        0.1,
        1000
      );
      this.camera.position.set(0, 5, 12);
      this.camera.lookAt(0, 0, 0);
      
      
      this.renderer = new THREE.WebGLRenderer({ 
        canvas: this.canvas, 
        antialias: true, 
        alpha: true 
      });
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.shadowMap.enabled = true;
      
      
      if (typeof THREE.OrbitControls !== 'undefined') {
        this.controls = new THREE.OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 30;
        this.controls.maxPolarAngle = Math.PI / 1.5;
      }
      
      
      this.setupLighting();
      
      
      this.createCentralComponent();
      
      
      this.createDevices();
      
      
      this.createEnvironment();
      
      
      window.addEventListener('resize', () => this.onWindowResize());
      this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
      this.canvas.addEventListener('click', (e) => this.onCanvasClick(e));
      
      
      this.animate();
      
      
      this.initializeUI();
      
      console.log('IO3DVisualizer inicializado com sucesso!');
    } catch (error) {
      console.error('Erro ao inicializar IO3DVisualizer:', error);
    }
  }

  setupLighting() {
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);
    
    
    const pointLight = new THREE.PointLight(0xff6b9d, 0.5);
    pointLight.position.set(-5, 5, 5);
    this.scene.add(pointLight);
  }

  createCentralComponent() {
    
    const centralGroup = new THREE.Group();
    centralGroup.position.set(0, 0, 0);
    centralGroup.userData = {
      type: 'central',
      isAnimating: false
    };

    
    const baseGeometry = new THREE.CylinderGeometry(1, 1.2, 0.5, 16);
    const baseMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff6b9d,
      metalness: 0.7,
      roughness: 0.3,
      emissive: 0xff6b9d,
      emissiveIntensity: 0.3
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.25;
    base.castShadow = true;
    base.receiveShadow = true;
    base.userData.isCentralBase = true;
    centralGroup.add(base);

    
    const coreGeometry = new THREE.OctahedronGeometry(0.8);
    const coreMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x667eea,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x667eea,
      emissiveIntensity: 0.5
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.position.y = 0.8;
    core.castShadow = true;
    core.receiveShadow = true;
    core.userData.isCentralCore = true;
    centralGroup.add(core);

    
    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.TorusGeometry(1.1 + i * 0.2, 0.05, 8, 16);
      const ringMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xfeca57,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0xfeca57,
        emissiveIntensity: 0.2
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.y = 0.5 + i * 0.3;
      ring.rotation.x = Math.PI / 2;
      ring.castShadow = true;
      centralGroup.add(ring);
    }

    
    const pointLight = new THREE.PointLight(0xff6b9d, 1, 10);
    pointLight.position.set(0, 1, 0);
    pointLight.userData.isCentralLight = true;
    centralGroup.add(pointLight);

    
    const glowGeometry = new THREE.SphereGeometry(1.2, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff6b9d,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.y = 0.8;
    glow.userData.isCentralGlow = true;
    centralGroup.add(glow);

    centralGroup.castShadow = true;
    centralGroup.receiveShadow = true;
    this.scene.add(centralGroup);
    
    this.centralComponent = centralGroup;
  }

  createEnvironment() {
    
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a2e,
      metalness: 0.3,
      roughness: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);
    
    
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    gridHelper.position.y = 0.01;
    this.scene.add(gridHelper);
  }

  createDevices() {
    
    const positions = [
      { x: -5, z: 0, name: 'keyboard' },
      { x: 5, z: 0, name: 'monitor' },
      { x: 0, z: -5, name: 'printer' },
      { x: 0, z: 5, name: 'disk' },
      { x: -3.5, z: -3.5, name: 'mouse' },
      { x: 3.5, z: -3.5, name: 'scanner' },
      { x: 3.5, z: 3.5, name: 'webcam' },
      { x: -3.5, z: 3.5, name: 'speaker' }
    ];

    positions.forEach(pos => {
      const device = this.createDevice(pos.name, pos.x, pos.z);
      this.devices[pos.name] = device;
    });
  }

  createDevice(type, x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.userData = {
      type: type,
      active: false,
      buffer: [],
      bufferSize: this.simConfig[`${type}BufferSize`] || 256,
      status: 'Pronto',
      dataTransferred: 0,
      operationCount: 0,
      lastActivity: Date.now()
    };

    let mesh;

    switch(type) {
      case 'keyboard':
        mesh = this.createKeyboardModel();
        break;
      case 'monitor':
        mesh = this.createMonitorModel();
        break;
      case 'printer':
        mesh = this.createPrinterModel();
        break;
      case 'disk':
        mesh = this.createDiskModel();
        break;
      case 'mouse':
        mesh = this.createMouseModel();
        break;
      case 'scanner':
        mesh = this.createScannerModel();
        break;
      case 'webcam':
        mesh = this.createWebcamModel();
        break;
      case 'speaker':
        mesh = this.createSpeakerModel();
        break;
    }

    if (mesh) {
      group.add(mesh);
    }

    
    const baseGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      metalness: 0.6,
      roughness: 0.4
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -0.5;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    
    this.addDeviceLabel(group, type);

    group.castShadow = true;
    group.receiveShadow = true;
    this.scene.add(group);

    return group;
  }

  createKeyboardModel() {
    const group = new THREE.Group();

    
    const bodyGeometry = new THREE.BoxGeometry(2, 0.3, 1);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      metalness: 0.3,
      roughness: 0.7
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.2;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    
    const keyColors = [0x667eea, 0x764ba2, 0x667eea];
    const keys = [];
    for (let i = 0; i < 15; i++) {
      const keyGeometry = new THREE.BoxGeometry(0.12, 0.1, 0.12);
      const keyMaterial = new THREE.MeshStandardMaterial({ 
        color: keyColors[i % keyColors.length],
        metalness: 0.2,
        roughness: 0.5,
        emissive: keyColors[i % keyColors.length],
        emissiveIntensity: 0
      });
      const key = new THREE.Mesh(keyGeometry, keyMaterial);
      key.position.set(-0.9 + (i % 5) * 0.35, 0.4, -0.2 + Math.floor(i / 5) * 0.35);
      key.castShadow = true;
      key.receiveShadow = true;
      key.userData.isKey = true;
      key.userData.originalY = key.position.y;
      group.add(key);
      keys.push(key);
    }

    
    group.userData.keys = keys;

    return group;
  }

  createMonitorModel() {
    const group = new THREE.Group();

    
    const standGeometry = new THREE.BoxGeometry(0.3, 1, 0.3);
    const standMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      metalness: 0.5,
      roughness: 0.6
    });
    const stand = new THREE.Mesh(standGeometry, standMaterial);
    stand.position.y = 0.5;
    stand.castShadow = true;
    stand.receiveShadow = true;
    group.add(stand);

    
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f093fb';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('MONITOR', canvas.width / 2, canvas.height / 2);
    
    const screenTexture = new THREE.CanvasTexture(canvas);
    screenTexture.needsUpdate = true;
    
    
    const screenGeometry = new THREE.PlaneGeometry(1.4, 1.1);
    const screenMaterial = new THREE.MeshStandardMaterial({ 
      map: screenTexture,
      emissive: 0x1a1a2e,
      emissiveIntensity: 0.3,
      emissiveMap: screenTexture
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.y = 1.3;
    screen.position.z = 0.06;
    screen.userData.isScreen = true;
    screen.userData.canvas = canvas;
    screen.userData.ctx = ctx;
    screen.userData.texture = screenTexture;
    group.add(screen);

    
    const frameGeometry = new THREE.BoxGeometry(1.5, 1.2, 0.1);
    const frameMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      metalness: 0.8,
      roughness: 0.2
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.y = 1.3;
    frame.castShadow = true;
    frame.receiveShadow = true;
    group.add(frame);

    
    const glowGeometry = new THREE.BoxGeometry(1.4, 1.1, 0.05);
    const glowMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xf093fb,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0xf093fb,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.5
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.y = 1.3;
    glow.position.z = 0.08;
    glow.userData.isGlow = true;
    group.add(glow);

    group.userData.screen = screen;
    group.userData.displayText = '';

    return group;
  }

  createPrinterModel() {
    const group = new THREE.Group();

    
    const bodyGeometry = new THREE.BoxGeometry(1.2, 0.8, 1.5);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4facfe,
      metalness: 0.4,
      roughness: 0.6,
      emissive: 0x4facfe,
      emissiveIntensity: 0
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.4;
    body.castShadow = true;
    body.receiveShadow = true;
    body.userData.isPrinterBody = true;
    group.add(body);

    
    const trayGeometry = new THREE.BoxGeometry(1, 0.1, 0.8);
    const trayMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x00f2fe,
      metalness: 0.3,
      roughness: 0.5
    });
    const tray = new THREE.Mesh(trayGeometry, trayMaterial);
    tray.position.y = 0.9;
    tray.position.z = 0.5;
    tray.castShadow = true;
    tray.receiveShadow = true;
    group.add(tray);

    
    const paperCanvas = document.createElement('canvas');
    paperCanvas.width = 256;
    paperCanvas.height = 192;
    const paperCtx = paperCanvas.getContext('2d');
    paperCtx.fillStyle = '#ffffff';
    paperCtx.fillRect(0, 0, paperCanvas.width, paperCanvas.height);
    
    const paperTexture = new THREE.CanvasTexture(paperCanvas);
    paperTexture.needsUpdate = true;
    
    
    const paperGeometry = new THREE.PlaneGeometry(0.9, 0.7);
    const paperMaterial = new THREE.MeshStandardMaterial({ 
      map: paperTexture,
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.9
    });
    const paper = new THREE.Mesh(paperGeometry, paperMaterial);
    paper.position.y = 0.95;
    paper.position.z = 0.5;
    paper.rotation.x = Math.PI / 2;
    paper.castShadow = true;
    paper.receiveShadow = true;
    paper.userData.isPaper = true;
    paper.userData.originalZ = 0.5;
    paper.userData.canvas = paperCanvas;
    paper.userData.ctx = paperCtx;
    paper.userData.texture = paperTexture;
    group.add(paper);

    group.userData.paper = paper;
    group.userData.printedText = '';

    return group;
  }

  createDiskModel() {
    const group = new THREE.Group();

    
    const caseGeometry = new THREE.BoxGeometry(1.5, 0.6, 1.8);
    const caseMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      metalness: 0.6,
      roughness: 0.5
    });
    const diskCase = new THREE.Mesh(caseGeometry, caseMaterial);
    diskCase.position.y = 0.3;
    diskCase.castShadow = true;
    diskCase.receiveShadow = true;
    group.add(diskCase);

    
    const platterGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.05, 32);
    const platterMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      metalness: 0.9,
      roughness: 0.2
    });
    const platter = new THREE.Mesh(platterGeometry, platterMaterial);
    platter.position.y = 0.35;
    platter.castShadow = true;
    platter.receiveShadow = true;
    platter.userData.isPlatter = true;
    group.add(platter);

    
    const headGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.3);
    const headMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff6b9d,
      metalness: 0.7,
      roughness: 0.3
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0.5, 0.4, 0);
    head.castShadow = true;
    head.receiveShadow = true;
    head.userData.isHead = true;
    group.add(head);

    return group;
  }

  createMouseModel() {
    const group = new THREE.Group();

    
    const bodyGeometry = new THREE.BoxGeometry(0.6, 0.3, 0.9);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2c3e50,
      metalness: 0.3,
      roughness: 0.7,
      emissive: 0x2c3e50,
      emissiveIntensity: 0
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.15;
    body.castShadow = true;
    body.receiveShadow = true;
    body.userData.isMouseBody = true;
    group.add(body);

    
    const leftButtonGeometry = new THREE.BoxGeometry(0.25, 0.05, 0.4);
    const buttonMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x34495e,
      metalness: 0.2,
      roughness: 0.6
    });
    const leftButton = new THREE.Mesh(leftButtonGeometry, buttonMaterial);
    leftButton.position.set(-0.15, 0.32, -0.15);
    leftButton.castShadow = true;
    leftButton.userData.isMouseButton = true;
    group.add(leftButton);

    
    const rightButton = new THREE.Mesh(leftButtonGeometry, buttonMaterial);
    rightButton.position.set(0.15, 0.32, -0.15);
    rightButton.castShadow = true;
    rightButton.userData.isMouseButton = true;
    group.add(rightButton);

    
    const wheelGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.15, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x95a5a6,
      metalness: 0.5,
      roughness: 0.4
    });
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(0, 0.32, -0.15);
    wheel.castShadow = true;
    wheel.userData.isWheel = true;
    group.add(wheel);

    
    const ledGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16);
    const ledMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 0.5
    });
    const led = new THREE.Mesh(ledGeometry, ledMaterial);
    led.rotation.x = Math.PI / 2;
    led.position.set(0, 0.05, 0.4);
    led.userData.isLED = true;
    group.add(led);

    group.userData.buttons = [leftButton, rightButton];
    group.userData.wheel = wheel;
    group.userData.led = led;

    return group;
  }

  createScannerModel() {
    const group = new THREE.Group();

    
    const baseGeometry = new THREE.BoxGeometry(1.2, 0.2, 1.8);
    const baseMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x34495e,
      metalness: 0.5,
      roughness: 0.6
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.1;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    
    const scanCanvas = document.createElement('canvas');
    scanCanvas.width = 256;
    scanCanvas.height = 384;
    const scanCtx = scanCanvas.getContext('2d');
    scanCtx.fillStyle = '#ffffff';
    scanCtx.fillRect(0, 0, scanCanvas.width, scanCanvas.height);
    
    const scanTexture = new THREE.CanvasTexture(scanCanvas);
    scanTexture.needsUpdate = true;
    
    
    const glassGeometry = new THREE.PlaneGeometry(1.1, 1.7);
    const glassMaterial = new THREE.MeshStandardMaterial({ 
      map: scanTexture,
      color: 0xecf0f1,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.8
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.y = 0.25;
    glass.rotation.x = Math.PI / 2;
    glass.receiveShadow = true;
    glass.userData.canvas = scanCanvas;
    glass.userData.ctx = scanCtx;
    glass.userData.texture = scanTexture;
    group.add(glass);

    
    const scanHeadGeometry = new THREE.BoxGeometry(1.0, 0.15, 0.1);
    const scanHeadMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x3498db,
      metalness: 0.7,
      roughness: 0.3,
      emissive: 0x3498db,
      emissiveIntensity: 0.3
    });
    const scanHead = new THREE.Mesh(scanHeadGeometry, scanHeadMaterial);
    scanHead.position.set(0, 0.25, 0);
    scanHead.castShadow = true;
    scanHead.userData.isScanHead = true;
    scanHead.userData.originalZ = 0;
    group.add(scanHead);
    
    
    group.userData.scanHeadOriginalZ = 0;

    
    const scanLightGeometry = new THREE.BoxGeometry(1.0, 0.05, 0.05);
    const scanLightMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 1
    });
    const scanLight = new THREE.Mesh(scanLightGeometry, scanLightMaterial);
    scanLight.position.set(0, 0.3, 0);
    scanLight.userData.isScanLight = true;
    group.add(scanLight);

    group.userData.scanHead = scanHead;
    group.userData.scanLight = scanLight;
    group.userData.glass = glass;
    group.userData.scanProgress = 0;

    return group;
  }

  createWebcamModel() {
    const group = new THREE.Group();

    
    const baseGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
    const baseMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2c3e50,
      metalness: 0.6,
      roughness: 0.4
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.1;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    
    const stemGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.8, 16);
    const stemMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x34495e,
      metalness: 0.5,
      roughness: 0.5
    });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 0.6;
    stem.castShadow = true;
    group.add(stem);

    
    const cameraBodyGeometry = new THREE.BoxGeometry(0.5, 0.4, 0.3);
    const cameraBodyMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      metalness: 0.7,
      roughness: 0.3
    });
    const cameraBody = new THREE.Mesh(cameraBodyGeometry, cameraBodyMaterial);
    cameraBody.position.y = 1.2;
    cameraBody.castShadow = true;
    cameraBody.receiveShadow = true;
    group.add(cameraBody);

    
    const lensGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 32);
    const lensMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x000000,
      metalness: 0.9,
      roughness: 0.1
    });
    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0, 1.2, 0.2);
    lens.castShadow = true;
    group.add(lens);

    
    const ledGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const ledMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 0.3
    });
    const led = new THREE.Mesh(ledGeometry, ledMaterial);
    led.position.set(0.2, 1.3, 0.1);
    led.userData.isLED = true;
    group.add(led);

    
    const flashGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const flashMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0,
      transparent: true,
      opacity: 0
    });
    const flash = new THREE.Mesh(flashGeometry, flashMaterial);
    flash.position.set(0, 1.2, 0.25);
    flash.userData.isFlash = true;
    group.add(flash);

    group.userData.led = led;
    group.userData.lens = lens;
    group.userData.flash = flash;

    return group;
  }

  createSpeakerModel() {
    const group = new THREE.Group();

    
    const boxGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.6);
    const boxMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2c3e50,
      metalness: 0.4,
      roughness: 0.6
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.y = 0.6;
    box.castShadow = true;
    box.receiveShadow = true;
    group.add(box);

    
    const grillGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32);
    const grillMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x34495e,
      metalness: 0.3,
      roughness: 0.7,
      transparent: true,
      opacity: 0.8
    });
    const grill = new THREE.Mesh(grillGeometry, grillMaterial);
    grill.rotation.x = Math.PI / 2;
    grill.position.set(0, 0.6, 0.35);
    group.add(grill);

    
    const coneGeometry = new THREE.ConeGeometry(0.25, 0.15, 32);
    const coneMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xecf0f1,
      metalness: 0.2,
      roughness: 0.8
    });
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.rotation.x = Math.PI;
    cone.position.set(0, 0.6, 0.4);
    cone.userData.isCone = true;
    group.add(cone);

    
    const waveRings = [];
    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.RingGeometry(0.3 + i * 0.1, 0.35 + i * 0.1, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x3498db,
        transparent: true,
        opacity: 0.3 - i * 0.1,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0, 0.6, 0.4);
      ring.userData.isWaveRing = true;
      ring.userData.ringIndex = i;
      ring.userData.originalScale = 1;
      group.add(ring);
      waveRings.push(ring);
    }

    group.userData.cone = cone;
    group.userData.waveRings = waveRings;

    return group;
  }

  addDeviceLabel(group, type) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#ff6b9d';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(type.toUpperCase(), 128, 50);
    
    ctx.font = '16px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('I/O Device', 128, 90);
    
    const texture = new THREE.CanvasTexture(canvas);
    const labelGeometry = new THREE.PlaneGeometry(2, 1);
    const labelMaterial = new THREE.MeshBasicMaterial({ map: texture });
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.y = 1.8;
    label.scale.set(0.5, 0.5, 1);
    group.add(label);
  }

  onMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  onCanvasClick(event) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    const deviceMeshes = Object.values(this.devices).map(d => d.children[0]);
    const intersects = this.raycaster.intersectObjects(deviceMeshes, true);
    
    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      let parent = clickedObject;
      
      while (parent && !parent.userData.type) {
        parent = parent.parent;
      }
      
      if (parent && parent.userData.type) {
        this.selectDevice(parent.userData.type);
      }
    }
  }

  selectDevice(deviceType) {
    this.selectedDevice = deviceType;
    this.updateDeviceDetails(deviceType);
    this.addLog(`Dispositivo selecionado: ${deviceType}`, 'info');
  }

  updateDeviceDetails(deviceType) {
    const device = this.devices[deviceType];
    if (!device) return;

    const userData = device.userData;
    const detailsDiv = document.getElementById('deviceDetails');
    
    let detailsHTML = `<h3>${deviceType.toUpperCase()}</h3>`;
    detailsHTML += `<div class="detail-item">
      <span class="label">Status:</span>
      <span class="value">${userData.status}</span>
    </div>`;
    detailsHTML += `<div class="detail-item">
      <span class="label">Buffer:</span>
      <span class="value">${userData.buffer.length}/${userData.bufferSize}</span>
    </div>`;
    detailsHTML += `<div class="detail-item">
      <span class="label">Dados Transferidos:</span>
      <span class="value">${userData.dataTransferred} bytes</span>
    </div>`;
    detailsHTML += `<div class="detail-item">
      <span class="label">Operações:</span>
      <span class="value">${userData.operationCount}</span>
    </div>`;
    
    
    detailsHTML += this.getDeviceSpecificControls(deviceType);
    
    detailsDiv.innerHTML = detailsHTML;
    
    
    this.attachDeviceSpecificListeners(deviceType);
  }

  getDeviceSpecificControls(deviceType) {
    let controls = '';
    
    switch(deviceType) {
      case 'keyboard':
        controls = `
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #444;">
            <h4 style="color: #ff6b9d; margin-bottom: 10px;">Controles Especiais</h4>
            <input type="text" id="keyboardInput" placeholder="Digite texto..." 
              style="width: 100%; padding: 8px; background: #1a1a2e; border: 1px solid #444; color: #fff; border-radius: 4px; margin-bottom: 10px;">
            <button onclick="visualizer.sendKeyboardData()" 
              style="width: 100%; padding: 8px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Enviar Texto
            </button>
          </div>
        `;
        break;
        
      case 'monitor':
        controls = `
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #444;">
            <h4 style="color: #ff6b9d; margin-bottom: 10px;">Controles Especiais</h4>
            <input type="text" id="monitorText" placeholder="Texto para exibir..." 
              style="width: 100%; padding: 8px; background: #1a1a2e; border: 1px solid #444; color: #fff; border-radius: 4px; margin-bottom: 10px;">
            <button onclick="visualizer.displayOnMonitor()" 
              style="width: 100%; padding: 8px; background: #f093fb; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Exibir no Monitor
            </button>
            <button onclick="visualizer.clearMonitor()" 
              style="width: 100%; padding: 8px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 5px;">
              Limpar Tela
            </button>
          </div>
        `;
        break;
        
      case 'printer':
        controls = `
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #444;">
            <h4 style="color: #ff6b9d; margin-bottom: 10px;">Controles Especiais</h4>
            <textarea id="printerText" placeholder="Texto para imprimir..." 
              style="width: 100%; padding: 8px; background: #1a1a2e; border: 1px solid #444; color: #fff; border-radius: 4px; margin-bottom: 10px; min-height: 60px; resize: vertical;"></textarea>
            <button onclick="visualizer.printDocument()" 
              style="width: 100%; padding: 8px; background: #4facfe; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Imprimir Documento
            </button>
          </div>
        `;
        break;
        
      case 'mouse':
        controls = `
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #444;">
            <h4 style="color: #ff6b9d; margin-bottom: 10px;">Controles Especiais</h4>
            <button onclick="visualizer.simulateMouseClick('left')" 
              style="width: 48%; padding: 8px; background: #2c3e50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 4%;">
              Clique Esquerdo
            </button>
            <button onclick="visualizer.simulateMouseClick('right')" 
              style="width: 48%; padding: 8px; background: #2c3e50; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Clique Direito
            </button>
            <button onclick="visualizer.simulateMouseScroll()" 
              style="width: 100%; padding: 8px; background: #34495e; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 5px;">
              Scroll
            </button>
          </div>
        `;
        break;
        
      case 'scanner':
        controls = `
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #444;">
            <h4 style="color: #ff6b9d; margin-bottom: 10px;">Controles Especiais</h4>
            <select id="scanResolution" 
              style="width: 100%; padding: 8px; background: #1a1a2e; border: 1px solid #444; color: #fff; border-radius: 4px; margin-bottom: 10px;">
              <option value="300">300 DPI (Rápido)</option>
              <option value="600" selected>600 DPI (Padrão)</option>
              <option value="1200">1200 DPI (Alta Qualidade)</option>
            </select>
            <button onclick="visualizer.startScan()" 
              style="width: 100%; padding: 8px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Iniciar Digitalização
            </button>
          </div>
        `;
        break;
        
      case 'webcam':
        controls = `
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #444;">
            <h4 style="color: #ff6b9d; margin-bottom: 10px;">Controles Especiais</h4>
            <button onclick="visualizer.startWebcam()" 
              style="width: 48%; padding: 8px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 4%;">
              Iniciar
            </button>
            <button onclick="visualizer.stopWebcam()" 
              style="width: 48%; padding: 8px; background: #c0392b; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Parar
            </button>
            <button onclick="visualizer.capturePhoto()" 
              style="width: 100%; padding: 8px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 5px;">
              Capturar Foto
            </button>
          </div>
        `;
        break;
        
      case 'speaker':
        controls = `
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #444;">
            <h4 style="color: #ff6b9d; margin-bottom: 10px;">Controles Especiais</h4>
            <input type="range" id="speakerVolume" min="0" max="100" value="50" 
              style="width: 100%; margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #888; font-size: 11px;">Volume: <span id="volumeValue">50</span>%</span>
            </div>
            <button onclick="visualizer.playSound()" 
              style="width: 48%; padding: 8px; background: #9b59b6; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 4%;">
              Reproduzir
            </button>
            <button onclick="visualizer.stopSound()" 
              style="width: 48%; padding: 8px; background: #8e44ad; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Parar
            </button>
          </div>
        `;
        break;
        
      case 'disk':
        controls = `
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #444;">
            <h4 style="color: #ff6b9d; margin-bottom: 10px;">Controles Especiais</h4>
            <input type="number" id="diskSector" placeholder="Setor (0-63)" min="0" max="63" 
              style="width: 100%; padding: 8px; background: #1a1a2e; border: 1px solid #444; color: #fff; border-radius: 4px; margin-bottom: 10px;">
            <button onclick="visualizer.readDiskSector()" 
              style="width: 48%; padding: 8px; background: #43e97b; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 4%;">
              Ler Setor
            </button>
            <button onclick="visualizer.writeDiskSector()" 
              style="width: 48%; padding: 8px; background: #38f9d7; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Escrever Setor
            </button>
          </div>
        `;
        break;
    }
    
    return controls;
  }

  attachDeviceSpecificListeners(deviceType) {
    
    if (deviceType === 'speaker') {
      const volumeSlider = document.getElementById('speakerVolume');
      const volumeValue = document.getElementById('volumeValue');
      if (volumeSlider && volumeValue) {
        volumeSlider.addEventListener('input', (e) => {
          volumeValue.textContent = e.target.value;
          const device = this.devices['speaker'];
          if (device) {
            device.userData.volume = parseInt(e.target.value);
          }
        });
      }
    }
  }

  sendData() {
    if (!this.selectedDevice) {
      this.addLog('Selecione um dispositivo primeiro', 'warning');
      return;
    }

    const device = this.devices[this.selectedDevice];
    const dataSize = Math.floor(Math.random() * 256) + 64;
    
    device.userData.buffer.push({
      data: new Array(dataSize).fill(0).map(() => Math.floor(Math.random() * 256)),
      timestamp: Date.now(),
      type: 'output'
    });

    device.userData.dataTransferred += dataSize;
    device.userData.operationCount++;
    device.userData.status = 'Transmitindo';
    device.userData.animationStartTime = Date.now();
    device.userData.isAnimating = true;
    
    
    this.animateCentralComponent('send');
    
    
    this.createDataFlowAnimation('send');
    
    
    this.triggerDeviceAnimation(this.selectedDevice, 'send');
    
    this.stats.operationCount++;
    this.stats.bytesTransferred += dataSize;
    this.stats.interruptCount++;
    
    this.addLog(`Dados enviados para ${this.selectedDevice}: ${dataSize} bytes`, 'success');
    this.updateStats();
    this.updateDeviceDetails(this.selectedDevice);
  }

  receiveData() {
    if (!this.selectedDevice) {
      this.addLog('Selecione um dispositivo primeiro', 'warning');
      return;
    }

    const device = this.devices[this.selectedDevice];
    
    if (device.userData.buffer.length > 0) {
      const data = device.userData.buffer.shift();
      const dataSize = data.data.length;
      
      device.userData.status = 'Recebendo';
      device.userData.animationStartTime = Date.now();
      device.userData.isAnimating = true;
      
      
      this.animateCentralComponent('receive');
      
      
      this.createDataFlowAnimation('receive');
      
      
      this.triggerDeviceAnimation(this.selectedDevice, 'receive');
      
      this.stats.operationCount++;
      this.stats.bytesTransferred += dataSize;
      this.stats.interruptCount++;
      
      this.addLog(`Dados recebidos de ${this.selectedDevice}: ${dataSize} bytes`, 'success');
    } else {
      this.addLog(`Buffer vazio em ${this.selectedDevice}`, 'warning');
    }

    this.updateStats();
    this.updateDeviceDetails(this.selectedDevice);
  }

  clearBuffer() {
    if (!this.selectedDevice) {
      this.addLog('Selecione um dispositivo primeiro', 'warning');
      return;
    }

    const device = this.devices[this.selectedDevice];
    const bufferSize = device.userData.buffer.length;
    device.userData.buffer = [];
    device.userData.status = 'Pronto';
    
    this.addLog(`Buffer de ${this.selectedDevice} limpo (${bufferSize} itens removidos)`, 'info');
    this.updateDeviceDetails(this.selectedDevice);
  }

  reset() {
    Object.values(this.devices).forEach(device => {
      device.userData.buffer = [];
      device.userData.status = 'Pronto';
      device.userData.dataTransferred = 0;
      device.userData.operationCount = 0;
    });

    this.stats = {
      operationCount: 0,
      bytesTransferred: 0,
      interruptCount: 0,
      avgLatency: 0,
      errorRate: 0,
      transferRate: 0,
      latencies: []
    };

    this.addLog('Sistema resetado', 'info');
    this.updateStats();
  }

  updateStats() {
    document.getElementById('activeDevices').textContent = 
      Object.values(this.devices).filter(d => d.userData.buffer.length > 0).length;
    document.getElementById('operationCount').textContent = this.stats.operationCount;
    document.getElementById('avgLatency').textContent = 
      (this.stats.avgLatency || 0).toFixed(2) + ' ms';
    document.getElementById('errorRate').textContent = 
      (this.stats.errorRate || 0).toFixed(2) + '%';
    document.getElementById('bytesTransferred').textContent = this.stats.bytesTransferred;
    document.getElementById('interruptCount').textContent = this.stats.interruptCount;
    
    
    const transferRate = (this.stats.bytesTransferred / 1024).toFixed(2);
    document.getElementById('transferRate').textContent = transferRate + ' KB/s';
  }

  addLog(message, type = 'info') {
    const logContainer = document.getElementById('logContainer');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logContainer.appendChild(entry);
    logContainer.scrollTop = logContainer.scrollHeight;
  }

  initializeUI() {
    
    const deviceList = document.getElementById('deviceList');
    Object.keys(this.devices).forEach(deviceType => {
      const deviceItem = document.createElement('div');
      deviceItem.className = `device-item ${deviceType}`;
      deviceItem.innerHTML = `
        <h3>${deviceType.toUpperCase()}</h3>
        <div class="info">Dispositivo de I/O</div>
        <div class="status">Pronto</div>
      `;
      deviceItem.addEventListener('click', () => this.selectDevice(deviceType));
      deviceList.appendChild(deviceItem);
    });

    
    document.getElementById('btnSendData').addEventListener('click', () => this.sendData());
    document.getElementById('btnReceiveData').addEventListener('click', () => this.receiveData());
    document.getElementById('btnClearBuffer').addEventListener('click', () => this.clearBuffer());
    document.getElementById('btnReset').addEventListener('click', () => this.reset());

    
    this.updateStats();
  }

  triggerDeviceAnimation(deviceType, operation) {
    const device = this.devices[deviceType];
    if (!device) return;

    const duration = 800; 
    const startTime = Date.now();
    device.userData.animationStartTime = startTime;
    device.userData.animationDuration = duration;
    device.userData.animationOperation = operation;
  }

  animateKeyboard(device, progress) {
    
    const keyboardModel = device.children.find(child => 
      child.userData.keys !== undefined
    );
    
    if (!keyboardModel || !keyboardModel.userData.keys) return;

    const keys = keyboardModel.userData.keys;
    const operation = device.userData.animationOperation || 'send';
    const isActive = progress < 1 && device.userData.isAnimating;

    keys.forEach((key, index) => {
      if (isActive) {
        
        const keyProgress = Math.max(0, Math.min(1, (progress * keys.length - index) * 2));
        
        if (keyProgress > 0 && keyProgress < 1) {
          
          const pulse = Math.sin(keyProgress * Math.PI);
          key.material.emissiveIntensity = pulse * 1.5;
          key.position.y = key.userData.originalY + Math.sin(keyProgress * Math.PI) * 0.05;
          
          if (operation === 'receive') {
            key.material.color.setHex(0x00ff41); 
            key.material.emissive.setHex(0x00ff41);
          } else {
            key.material.color.setHex(0xff6b9d); 
            key.material.emissive.setHex(0xff6b9d);
          }
        } else {
          
          key.material.emissiveIntensity = 0;
          key.position.y = key.userData.originalY;
          const keyColors = [0x667eea, 0x764ba2, 0x667eea];
          key.material.color.setHex(keyColors[index % keyColors.length]);
          key.material.emissive.setHex(keyColors[index % keyColors.length]);
        }
      } else {
        
        key.material.emissiveIntensity = 0;
        key.position.y = key.userData.originalY;
        const keyColors = [0x667eea, 0x764ba2, 0x667eea];
        key.material.color.setHex(keyColors[index % keyColors.length]);
        key.material.emissive.setHex(keyColors[index % keyColors.length]);
      }
    });
  }

  animatePrinter(device, progress) {
    
    const printerModel = device.children.find(child => 
      child.children && child.children.some(c => c.userData.isPrinterBody)
    );
    
    if (!printerModel) return;
    
    const printerBody = printerModel.children.find(child => child.userData.isPrinterBody);
    const paper = printerModel.children.find(child => child.userData.isPaper);
    
    if (!printerBody || !paper) return;

    const operation = device.userData.animationOperation || 'send';
    const isActive = progress < 1 && device.userData.isAnimating;

    if (isActive) {
      
      const pulse = Math.sin(progress * Math.PI * 3);
      printerBody.material.emissiveIntensity = 0.3 + pulse * 0.5;
      
      if (operation === 'receive' || operation === 'send') {
        printerBody.material.color.setHex(0x00f2fe); 
        printerBody.material.emissive.setHex(0x00f2fe);
        
        
        const paperProgress = Math.min(progress * 1.5, 1);
        const paperOffset = Math.sin(paperProgress * Math.PI) * 0.3;
        paper.position.z = paper.userData.originalZ + paperOffset;
        paper.position.y = 0.95 + Math.sin(paperProgress * Math.PI) * 0.1;
      }
    } else {
      
      printerBody.material.emissiveIntensity = 0;
      printerBody.material.color.setHex(0x4facfe);
      printerBody.material.emissive.setHex(0x4facfe);
      paper.position.z = paper.userData.originalZ;
      paper.position.y = 0.95;
    }
  }

  animateMouse(device, progress) {
    const mouseModel = device.children.find(child => 
      child.userData.buttons !== undefined
    );
    
    if (!mouseModel || !mouseModel.userData.buttons) return;

    const operation = device.userData.animationOperation || 'send';
    const isActive = progress < 1 && device.userData.isAnimating;
    const buttons = mouseModel.userData.buttons;
    const wheel = mouseModel.userData.wheel;
    const led = mouseModel.userData.led;
    const body = mouseModel.children.find(c => c.userData.isMouseBody);

    if (isActive) {
      const pulse = Math.sin(progress * Math.PI * 4);
      
      
      if (led) {
        led.material.emissiveIntensity = 0.5 + pulse * 0.5;
      }
      
      
      buttons.forEach((button, index) => {
        const buttonProgress = Math.sin((progress + index * 0.2) * Math.PI * 2);
        button.position.y = 0.32 - Math.abs(buttonProgress) * 0.02;
      });
      
      
      if (wheel) {
        wheel.rotation.z += 0.1;
        if (operation === 'send') {
          wheel.material.emissiveIntensity = pulse * 0.5;
        }
      }
      
      
      if (body) {
        body.material.emissiveIntensity = pulse * 0.3;
        if (operation === 'send') {
          body.material.color.setHex(0x3498db);
          body.material.emissive.setHex(0x3498db);
        } else {
          body.material.color.setHex(0x2ecc71);
          body.material.emissive.setHex(0x2ecc71);
        }
      }
    } else {
      
      if (led) led.material.emissiveIntensity = 0.5;
      buttons.forEach(button => button.position.y = 0.32);
      if (wheel) {
        wheel.material.emissiveIntensity = 0;
      }
      if (body) {
        body.material.emissiveIntensity = 0;
        body.material.color.setHex(0x2c3e50);
        body.material.emissive.setHex(0x2c3e50);
      }
    }
  }

  animateScanner(device, progress) {
    const scannerModel = device.children.find(child => 
      child.userData.scanHead !== undefined
    );
    
    if (!scannerModel) return;

    const scanHead = scannerModel.userData.scanHead;
    const scanLight = scannerModel.userData.scanLight;
    const operation = device.userData.animationOperation || 'send';
    const isActive = progress < 1 && device.userData.isAnimating;

    if (isActive) {
      
      const scanProgress = progress * 2; 
      const zPosition = Math.sin(scanProgress * Math.PI) * 0.8;
      const originalZ = scannerModel.userData.scanHeadOriginalZ || 0;
      scanHead.position.z = originalZ + zPosition;
      
      
      if (scanLight) {
        scanLight.position.z = scanHead.position.z;
        const pulse = Math.sin(progress * Math.PI * 6);
        scanLight.material.emissiveIntensity = 0.5 + pulse * 0.5;
      }
      
      
      const pulse = Math.sin(progress * Math.PI * 4);
      scanHead.material.emissiveIntensity = 0.3 + pulse * 0.4;
      
      if (operation === 'send') {
        scanHead.material.color.setHex(0x00ffff);
        scanHead.material.emissive.setHex(0x00ffff);
      }
    } else {
      
      const originalZ = scannerModel.userData.scanHeadOriginalZ || 0;
      scanHead.position.z = originalZ;
      if (scanLight) {
        scanLight.position.z = originalZ;
        scanLight.material.emissiveIntensity = 1;
      }
      scanHead.material.emissiveIntensity = 0.3;
      scanHead.material.color.setHex(0x3498db);
      scanHead.material.emissive.setHex(0x3498db);
    }
  }

  animateWebcam(device, progress) {
    const webcamModel = device.children.find(child => 
      child.userData.led !== undefined
    );
    
    if (!webcamModel) return;

    const led = webcamModel.userData.led;
    const lens = webcamModel.userData.lens;
    const flash = webcamModel.userData.flash;
    const operation = device.userData.animationOperation || 'send';
    const isActive = progress < 1 && device.userData.isAnimating;

    if (isActive) {
      const pulse = Math.sin(progress * Math.PI * 4);
      
      
      if (led) {
        led.material.emissiveIntensity = 0.3 + pulse * 0.7;
        if (operation === 'send') {
          led.material.color.setHex(0xff0000);
          led.material.emissive.setHex(0xff0000);
        } else {
          led.material.color.setHex(0x00ff00);
          led.material.emissive.setHex(0x00ff00);
        }
      }
      
      
      if (lens) {
        const zoom = 1 + Math.sin(progress * Math.PI * 2) * 0.1;
        lens.scale.set(zoom, zoom, zoom);
        lens.material.emissiveIntensity = pulse * 0.2;
      }
      
      
      if (flash && flash.material.emissiveIntensity > 0) {
        
        flash.material.emissiveIntensity = Math.max(flash.material.emissiveIntensity * 0.95, 0);
        flash.material.opacity = Math.max(flash.material.opacity * 0.95, 0);
      }
    } else {
      
      if (led) {
        led.material.emissiveIntensity = 0.3;
        led.material.color.setHex(0xff0000);
        led.material.emissive.setHex(0xff0000);
      }
      if (lens) {
        lens.scale.set(1, 1, 1);
        lens.material.emissiveIntensity = 0;
      }
      if (flash) {
        flash.material.emissiveIntensity = 0;
        flash.material.opacity = 0;
      }
    }
  }

  animateSpeaker(device, progress) {
    const speakerModel = device.children.find(child => 
      child.userData.waveRings !== undefined
    );
    
    if (!speakerModel) return;

    const cone = speakerModel.userData.cone;
    const waveRings = speakerModel.userData.waveRings;
    const operation = device.userData.animationOperation || 'send';
    const isActive = progress < 1 && device.userData.isAnimating;

    if (isActive) {
      
      if (cone) {
        const vibration = Math.sin(progress * Math.PI * 8) * 0.05;
        cone.position.z = 0.4 + vibration;
        const pulse = Math.sin(progress * Math.PI * 4);
        cone.material.emissiveIntensity = pulse * 0.3;
      }
      
      
      waveRings.forEach((ring, index) => {
        const ringProgress = (progress + index * 0.2) % 1;
        const scale = 1 + ringProgress * 2;
        ring.scale.set(scale, scale, 1);
        ring.material.opacity = (0.3 - index * 0.1) * (1 - ringProgress);
        
        if (operation === 'send') {
          ring.material.color.setHex(0x3498db);
        } else {
          ring.material.color.setHex(0x2ecc71);
        }
      });
    } else {
      
      if (cone) {
        cone.position.z = 0.4;
        cone.material.emissiveIntensity = 0;
      }
      waveRings.forEach(ring => {
        ring.scale.set(1, 1, 1);
        ring.material.opacity = 0.3 - ring.userData.ringIndex * 0.1;
        ring.material.color.setHex(0x3498db);
      });
    }
  }

  animateCentralComponent(operation) {
    if (!this.centralComponent) return;

    const duration = 1000; 
    const startTime = Date.now();
    
    this.centralComponent.userData.animationStartTime = startTime;
    this.centralComponent.userData.animationDuration = duration;
    this.centralComponent.userData.animationOperation = operation;
    this.centralComponent.userData.isAnimating = true;
  }

  updateCentralComponentAnimation() {
    if (!this.centralComponent || !this.centralComponent.userData.isAnimating) {
      
      if (this.centralComponent) {
        this.centralComponent.scale.set(1, 1, 1);
      }
      return;
    }

    const elapsed = Date.now() - this.centralComponent.userData.animationStartTime;
    const duration = this.centralComponent.userData.animationDuration || 1000;
    const progress = Math.min(elapsed / duration, 1);

    if (progress >= 1) {
      this.centralComponent.userData.isAnimating = false;
      this.centralComponent.scale.set(1, 1, 1);
      return;
    }

    const operation = this.centralComponent.userData.animationOperation || 'send';
    const core = this.centralComponent.children.find(child => child.userData.isCentralCore);
    const base = this.centralComponent.children.find(child => child.userData.isCentralBase);
    const glow = this.centralComponent.children.find(child => child.userData.isCentralGlow);
    const light = this.centralComponent.children.find(child => child.userData.isCentralLight);

    if (core && base && glow && light) {
      
      const pulse = Math.sin(progress * Math.PI * 4);
      
      
      core.material.emissiveIntensity = 0.5 + pulse * 0.8;
      core.rotation.y += 0.05;
      core.rotation.x = Math.sin(progress * Math.PI * 2) * 0.2;
      
      
      base.material.emissiveIntensity = 0.3 + pulse * 0.5;
      
      
      glow.material.opacity = 0.2 + pulse * 0.3;
      
      
      if (operation === 'send') {
        light.color.setHex(0xff6b9d); 
        light.intensity = 1 + pulse * 0.5;
      } else {
        light.color.setHex(0x00ff41); 
        light.intensity = 1 + pulse * 0.5;
      }
      
      
      const scale = 1 + pulse * 0.1;
      this.centralComponent.scale.set(scale, scale, scale);
    }
  }

  createDataFlowAnimation(operation) {
    if (!this.selectedDevice || !this.centralComponent) return;

    const device = this.devices[this.selectedDevice];
    if (!device) return;

    
    const centralPos = new THREE.Vector3(0, 1, 0); 
    const devicePos = new THREE.Vector3(
      device.position.x,
      device.position.y + 1,
      device.position.z
    );

    let startPos, endPos, color;
    
    if (operation === 'send') {
      
      startPos = centralPos;
      endPos = devicePos;
      color = 0xff6b9d; 
    } else {
      
      startPos = devicePos;
      endPos = centralPos;
      color = 0x00ff41; 
    }

    
    const particleCount = 25;
    const duration = 1200;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const geometry = new THREE.SphereGeometry(0.15, 8, 8);
      const material = new THREE.MeshStandardMaterial({ 
        color: color,
        emissive: color,
        emissiveIntensity: 1.5,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9
      });
      const particle = new THREE.Mesh(geometry, material);

      particle.position.copy(startPos);
      particle.delay = (i / particleCount) * duration * 0.6;
      particle.startTime = Date.now() + particle.delay;

      this.scene.add(particle);
      particles.push(particle);
    }

    
    const startTime = Date.now();
    let animationId = null;
    let allParticlesFinished = false;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      let activeParticles = 0;

      particles.forEach((particle, index) => {
        const particleElapsed = currentTime - particle.startTime;
        
        if (particleElapsed >= 0) {
          const particleProgress = Math.max(0, Math.min(1, particleElapsed / (duration * 0.8)));
          
          if (particleProgress > 0 && particleProgress < 1) {
            activeParticles++;
            
            
            const smoothProgress = particleProgress * particleProgress * (3 - 2 * particleProgress);
            
            
            const currentPos = new THREE.Vector3();
            currentPos.lerpVectors(startPos, endPos, smoothProgress);
            particle.position.copy(currentPos);
            
            
            const pulse = Math.sin(particleProgress * Math.PI * 3);
            particle.scale.set(
              0.8 + pulse * 0.4,
              0.8 + pulse * 0.4,
              0.8 + pulse * 0.4
            );
            
            
            particle.rotation.x += 0.1;
            particle.rotation.y += 0.1;
            
            
            particle.material.opacity = 0.9 * Math.sin(particleProgress * Math.PI);
          } else if (particleProgress >= 1) {
            
            particle.material.opacity = 0;
          }
        }
      });

      
      if (activeParticles > 0 || progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        
        particles.forEach(particle => {
          if (particle.parent === this.scene) {
            this.scene.remove(particle);
          }
          particle.geometry.dispose();
          particle.material.dispose();
        });
        allParticlesFinished = true;
      }
    };

    animate();
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    
    this.updateCentralComponentAnimation();

    
    Object.values(this.devices).forEach(device => {
      const deviceType = device.userData.type;
      
      
      if (device.userData.isAnimating && device.userData.animationStartTime) {
        const elapsed = Date.now() - device.userData.animationStartTime;
        const duration = device.userData.animationDuration || 800;
        const progress = Math.min(elapsed / duration, 1);
        
        if (progress >= 1) {
          device.userData.isAnimating = false;
        }
        
        
        if (deviceType === 'keyboard') {
          this.animateKeyboard(device, progress);
        } else if (deviceType === 'printer') {
          this.animatePrinter(device, progress);
        } else if (deviceType === 'mouse') {
          this.animateMouse(device, progress);
        } else if (deviceType === 'scanner') {
          this.animateScanner(device, progress);
        } else if (deviceType === 'webcam') {
          this.animateWebcam(device, progress);
        } else if (deviceType === 'speaker') {
          this.animateSpeaker(device, progress);
        }
      }
      
      
      if (deviceType === 'disk') {
        const deviceModel = device.children.find(child => 
          child.children && child.children.some(c => c.userData.isPlatter)
        );
        if (deviceModel) {
          const platter = deviceModel.children.find(child => child.userData.isPlatter);
          if (platter && device.userData.buffer.length > 0) {
            platter.rotation.z += 0.05;
          }

          const head = deviceModel.children.find(child => child.userData.isHead);
          if (head && device.userData.buffer.length > 0) {
            head.position.x = 0.5 + Math.sin(Date.now() * 0.003) * 0.3;
          }
        }
      }

      if (deviceType === 'monitor') {
        const deviceModel = device.children.find(child => 
          child.children && child.children.some(c => c.userData.isGlow)
        );
        if (deviceModel) {
          const glow = deviceModel.children.find(child => child.userData.isGlow);
          if (glow && device.userData.buffer.length > 0) {
            glow.material.emissiveIntensity = 0.3 + Math.sin(Date.now() * 0.005) * 0.2;
          }
        }
      }

      
      if (deviceType === 'speaker' && device.userData.isPlaying) {
        const speakerModel = device.children.find(child => 
          child.userData.waveRings !== undefined
        );
        if (speakerModel && speakerModel.userData.waveRings) {
          const time = Date.now() * 0.001;
          speakerModel.userData.waveRings.forEach((ring, index) => {
            const ringProgress = (time * 0.5 + index * 0.2) % 1;
            const scale = 1 + ringProgress * 2;
            ring.scale.set(scale, scale, 1);
            ring.material.opacity = (0.3 - index * 0.1) * (1 - ringProgress);
          });
        }
      }

      
      if (deviceType === 'webcam' && device.userData.isActive) {
        const webcamModel = device.children.find(child => 
          child.userData.led !== undefined
        );
        if (webcamModel && webcamModel.userData.led) {
          const time = Date.now() * 0.001;
          const pulse = Math.sin(time * 4) * 0.3 + 0.7;
          webcamModel.userData.led.material.emissiveIntensity = pulse * 0.5;
        }
      }
    });

    
    if (this.controls) {
      this.controls.update();
    } else {
      
      const time = Date.now() * 0.0001;
      this.camera.position.x = Math.sin(time) * 15;
      this.camera.position.z = Math.cos(time) * 15;
      this.camera.lookAt(0, 2, 0);
    }

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  
  sendKeyboardData() {
    const input = document.getElementById('keyboardInput');
    if (!input || !input.value) {
      this.addLog('Digite algum texto primeiro', 'warning');
      return;
    }

    const text = input.value;
    const device = this.devices['keyboard'];
    if (!device) return;

    const dataSize = text.length;
    device.userData.buffer.push({
      data: Array.from(text).map(c => c.charCodeAt(0)),
      timestamp: Date.now(),
      type: 'keyboard_input',
      text: text
    });

    device.userData.dataTransferred += dataSize;
    device.userData.operationCount++;
    device.userData.status = 'Enviando';
    device.userData.animationStartTime = Date.now();
    device.userData.isAnimating = true;

    this.triggerDeviceAnimation('keyboard', 'send');
    this.animateCentralComponent('send');
    this.createDataFlowAnimation('send');

    this.stats.operationCount++;
    this.stats.bytesTransferred += dataSize;
    this.addLog(`Teclado: "${text}" enviado (${dataSize} bytes)`, 'success');
    this.updateStats();
    this.updateDeviceDetails('keyboard');
    input.value = '';
  }

  displayOnMonitor() {
    const input = document.getElementById('monitorText');
    if (!input || !input.value) {
      this.addLog('Digite algum texto para exibir', 'warning');
      return;
    }

    const text = input.value;
    const device = this.devices['monitor'];
    if (!device) return;

    
    const monitorModel = device.children.find(child => 
      child.userData.screen !== undefined
    );
    
    if (monitorModel && monitorModel.userData.screen) {
      const screen = monitorModel.userData.screen;
      const canvas = screen.userData.canvas;
      const ctx = screen.userData.ctx;
      const texture = screen.userData.texture;
      
      
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      
      ctx.fillStyle = '#f093fb';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      
      const words = text.split(' ');
      const lines = [];
      let currentLine = '';
      const maxWidth = canvas.width - 40;
      
      words.forEach(word => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) lines.push(currentLine);
      
      
      const lineHeight = 30;
      const startY = (canvas.height - (lines.length * lineHeight)) / 2;
      lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
      });
      
      texture.needsUpdate = true;
      monitorModel.userData.displayText = text;
    }

    device.userData.buffer.push({
      data: Array.from(text).map(c => c.charCodeAt(0)),
      timestamp: Date.now(),
      type: 'display',
      text: text
    });

    device.userData.dataTransferred += text.length;
    device.userData.operationCount++;
    device.userData.status = 'Exibindo';
    device.userData.animationStartTime = Date.now();
    device.userData.isAnimating = true;

    this.triggerDeviceAnimation('monitor', 'receive');
    this.animateCentralComponent('send');
    this.createDataFlowAnimation('send');

    this.stats.operationCount++;
    this.stats.bytesTransferred += text.length;
    this.addLog(`Monitor: Exibindo "${text}"`, 'success');
    this.updateStats();
    this.updateDeviceDetails('monitor');
  }

  clearMonitor() {
    const device = this.devices['monitor'];
    if (!device) return;

    
    const monitorModel = device.children.find(child => 
      child.userData.screen !== undefined
    );
    
    if (monitorModel && monitorModel.userData.screen) {
      const screen = monitorModel.userData.screen;
      const canvas = screen.userData.canvas;
      const ctx = screen.userData.ctx;
      const texture = screen.userData.texture;
      
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f093fb';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('MONITOR', canvas.width / 2, canvas.height / 2);
      
      texture.needsUpdate = true;
      monitorModel.userData.displayText = '';
    }

    device.userData.buffer = [];
    device.userData.status = 'Pronto';
    this.addLog('Monitor: Tela limpa', 'info');
    this.updateDeviceDetails('monitor');
  }

  printDocument() {
    const textarea = document.getElementById('printerText');
    if (!textarea || !textarea.value) {
      this.addLog('Digite algum texto para imprimir', 'warning');
      return;
    }

    const text = textarea.value;
    const device = this.devices['printer'];
    if (!device) return;

    const dataSize = text.length;
    device.userData.buffer.push({
      data: Array.from(text).map(c => c.charCodeAt(0)),
      timestamp: Date.now(),
      type: 'print',
      text: text
    });

    device.userData.dataTransferred += dataSize;
    device.userData.operationCount++;
    device.userData.status = 'Imprimindo';
    device.userData.animationStartTime = Date.now();
    device.userData.isAnimating = true;

    this.triggerDeviceAnimation('printer', 'receive');
    this.animateCentralComponent('send');
    this.createDataFlowAnimation('send');

    this.stats.operationCount++;
    this.stats.bytesTransferred += dataSize;
    this.addLog(`Impressora: Imprimindo documento (${dataSize} caracteres)`, 'success');
    this.updateStats();
    this.updateDeviceDetails('printer');
    
    
    const printerModel = device.children.find(child => 
      child.userData.paper !== undefined
    );
    
    if (printerModel && printerModel.userData.paper) {
      const paper = printerModel.userData.paper;
      const canvas = paper.userData.canvas;
      const ctx = paper.userData.ctx;
      const texture = paper.userData.texture;
      
      
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      
      
      const words = text.split(' ');
      const lines = [];
      let currentLine = '';
      const maxWidth = canvas.width - 20;
      const lineHeight = 16;
      
      words.forEach(word => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) lines.push(currentLine);
      
      
      lines.forEach((line, index) => {
        if (index * lineHeight < canvas.height - 20) {
          ctx.fillText(line, 10, 10 + index * lineHeight);
        }
      });
      
      texture.needsUpdate = true;
      printerModel.userData.printedText = text;
    }
    
    
    setTimeout(() => {
      device.userData.status = 'Pronto';
      this.addLog('Impressora: Documento impresso com sucesso', 'success');
      this.updateDeviceDetails('printer');
    }, 2000);
  }

  simulateMouseClick(button) {
    const device = this.devices['mouse'];
    if (!device) return;

    device.userData.operationCount++;
    device.userData.status = `Clique ${button === 'left' ? 'Esquerdo' : 'Direito'}`;
    device.userData.animationStartTime = Date.now();
    device.userData.isAnimating = true;

    this.triggerDeviceAnimation('mouse', 'send');
    this.animateCentralComponent('send');
    this.createDataFlowAnimation('send');

    this.stats.operationCount++;
    this.stats.interruptCount++;
    this.addLog(`Mouse: Clique ${button === 'left' ? 'esquerdo' : 'direito'} detectado`, 'success');
    this.updateStats();
    this.updateDeviceDetails('mouse');

    setTimeout(() => {
      device.userData.status = 'Pronto';
      this.updateDeviceDetails('mouse');
    }, 500);
  }

  simulateMouseScroll() {
    const device = this.devices['mouse'];
    if (!device) return;

    device.userData.operationCount++;
    device.userData.status = 'Scroll';
    device.userData.animationStartTime = Date.now();
    device.userData.isAnimating = true;

    this.triggerDeviceAnimation('mouse', 'send');
    this.animateCentralComponent('send');
    this.createDataFlowAnimation('send');

    this.stats.operationCount++;
    this.addLog('Mouse: Scroll detectado', 'success');
    this.updateStats();
    this.updateDeviceDetails('mouse');

    setTimeout(() => {
      device.userData.status = 'Pronto';
      this.updateDeviceDetails('mouse');
    }, 500);
  }

  startScan() {
    const select = document.getElementById('scanResolution');
    const resolution = select ? parseInt(select.value) : 600;
    const device = this.devices['scanner'];
    if (!device) return;

    device.userData.operationCount++;
    device.userData.status = `Digitalizando (${resolution} DPI)`;
    device.userData.animationStartTime = Date.now();
    device.userData.isAnimating = true;
    device.userData.scanResolution = resolution;
    device.userData.scanProgress = 0;

    
    const scannerModel = device.children.find(child => 
      child.userData.glass !== undefined
    );
    
    if (scannerModel && scannerModel.userData.glass) {
      const glass = scannerModel.userData.glass;
      const canvas = glass.userData.canvas;
      const ctx = glass.userData.ctx;
      const texture = glass.userData.texture;
      
      
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      texture.needsUpdate = true;
    }

    this.triggerDeviceAnimation('scanner', 'send');
    this.animateCentralComponent('send');
    this.createDataFlowAnimation('send');

    this.stats.operationCount++;
    this.addLog(`Scanner: Iniciando digitalização em ${resolution} DPI`, 'success');
    this.updateStats();
    this.updateDeviceDetails('scanner');

    
    const scanTime = resolution === 300 ? 2000 : resolution === 600 ? 3000 : 5000;
    const startTime = Date.now();
    
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / scanTime, 1);
      device.userData.scanProgress = progress;
      
      if (scannerModel && scannerModel.userData.glass) {
        const glass = scannerModel.userData.glass;
        const canvas = glass.userData.canvas;
        const ctx = glass.userData.ctx;
        const texture = glass.userData.texture;
        
        
        const scanY = Math.floor(progress * canvas.height);
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(0, 0, canvas.width, scanY);
        
        
        for (let y = 0; y < scanY; y += 5) {
          ctx.strokeStyle = `rgba(100, 100, 100, ${0.3 + Math.random() * 0.3})`;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
        
        texture.needsUpdate = true;
      }
      
      if (progress >= 1) {
        clearInterval(progressInterval);
      }
    }, 50);
    
    setTimeout(() => {
      clearInterval(progressInterval);
      const dataSize = Math.floor(resolution / 10);
      device.userData.buffer.push({
        data: new Array(dataSize).fill(0).map(() => Math.floor(Math.random() * 256)),
        timestamp: Date.now(),
        type: 'scan',
        resolution: resolution
      });
      device.userData.dataTransferred += dataSize;
      device.userData.status = 'Pronto';
      device.userData.scanProgress = 1;
      this.addLog(`Scanner: Digitalização completa (${dataSize} bytes)`, 'success');
      this.updateDeviceDetails('scanner');
      this.updateStats();
    }, scanTime);
  }

  startWebcam() {
    const device = this.devices['webcam'];
    if (!device) return;

    device.userData.status = 'Transmitindo';
    device.userData.isActive = true;
    device.userData.animationStartTime = Date.now();
    device.userData.isAnimating = true;

    this.triggerDeviceAnimation('webcam', 'send');
    this.animateCentralComponent('send');

    this.stats.operationCount++;
    this.addLog('Webcam: Transmissão iniciada', 'success');
    this.updateDeviceDetails('webcam');
    this.updateStats();
  }

  stopWebcam() {
    const device = this.devices['webcam'];
    if (!device) return;

    device.userData.status = 'Pronto';
    device.userData.isActive = false;
    device.userData.isAnimating = false;

    this.addLog('Webcam: Transmissão parada', 'info');
    this.updateDeviceDetails('webcam');
  }

  capturePhoto() {
    const device = this.devices['webcam'];
    if (!device) return;

    if (!device.userData.isActive) {
      this.addLog('Inicie a webcam primeiro', 'warning');
      return;
    }

    device.userData.operationCount++;
    device.userData.status = 'Capturando';
    device.userData.animationStartTime = Date.now();
    device.userData.isAnimating = true;

    
    const webcamModel = device.children.find(child => 
      child.userData.flash !== undefined
    );
    
    if (webcamModel && webcamModel.userData.flash) {
      const flash = webcamModel.userData.flash;
      
      
      flash.material.emissiveIntensity = 5;
      flash.material.opacity = 0.9;
      
      
      setTimeout(() => {
        flash.material.emissiveIntensity = 0;
        flash.material.opacity = 0;
      }, 100);
    }

    this.triggerDeviceAnimation('webcam', 'send');
    this.animateCentralComponent('send');
    this.createDataFlowAnimation('send');

    const photoSize = 1024 * 50; 
    device.userData.buffer.push({
      data: new Array(photoSize).fill(0).map(() => Math.floor(Math.random() * 256)),
      timestamp: Date.now(),
      type: 'photo'
    });

    device.userData.dataTransferred += photoSize;
    this.stats.operationCount++;
    this.stats.bytesTransferred += photoSize;
    this.addLog(`Webcam: Foto capturada com flash (${photoSize} bytes)`, 'success');
    this.updateDeviceDetails('webcam');
    this.updateStats();

    setTimeout(() => {
      device.userData.status = 'Transmitindo';
      this.updateDeviceDetails('webcam');
    }, 500);
  }

  playSound() {
    const device = this.devices['speaker'];
    if (!device) return;

    const volume = device.userData.volume || 50;
    device.userData.status = `Reproduzindo (${volume}%)`;
    device.userData.isPlaying = true;
    device.userData.animationStartTime = Date.now();
    device.userData.isAnimating = true;

    
    if (this.audioContext && !this.audioOscillator) {
      try {
        
        this.audioOscillator = this.audioContext.createOscillator();
        this.audioGainNode = this.audioContext.createGain();
        
        
        this.audioOscillator.type = 'sine';
        this.audioOscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); 
        
        
        const volumeValue = volume / 100;
        this.audioGainNode.gain.setValueAtTime(volumeValue * 0.3, this.audioContext.currentTime);
        
        
        this.audioOscillator.connect(this.audioGainNode);
        this.audioGainNode.connect(this.audioContext.destination);
        
        
        this.audioOscillator.start();
        
        
        const startTime = this.audioContext.currentTime;
        this.audioOscillator.frequency.setValueAtTime(440, startTime);
        this.audioOscillator.frequency.exponentialRampToValueAtTime(523.25, startTime + 0.5); 
        this.audioOscillator.frequency.exponentialRampToValueAtTime(659.25, startTime + 1.0); 
        this.audioOscillator.frequency.exponentialRampToValueAtTime(783.99, startTime + 1.5); 
        
      } catch (e) {
        console.warn('Erro ao criar som:', e);
      }
    }

    this.triggerDeviceAnimation('speaker', 'receive');
    this.animateCentralComponent('send');
    this.createDataFlowAnimation('send');

    device.userData.operationCount++;
    this.stats.operationCount++;
    this.addLog(`Alto-falante: Reproduzindo áudio (volume: ${volume}%)`, 'success');
    this.updateDeviceDetails('speaker');
    this.updateStats();
  }

  stopSound() {
    const device = this.devices['speaker'];
    if (!device) return;

    
    if (this.audioOscillator) {
      try {
        this.audioOscillator.stop();
        this.audioOscillator.disconnect();
        this.audioOscillator = null;
        this.audioGainNode = null;
      } catch (e) {
        console.warn('Erro ao parar som:', e);
      }
    }

    device.userData.status = 'Pronto';
    device.userData.isPlaying = false;
    device.userData.isAnimating = false;

    this.addLog('Alto-falante: Reprodução parada', 'info');
    this.updateDeviceDetails('speaker');
  }

  readDiskSector() {
    const input = document.getElementById('diskSector');
    if (!input || input.value === '') {
      this.addLog('Digite o número do setor', 'warning');
      return;
    }

    const sector = parseInt(input.value);
    if (isNaN(sector) || sector < 0 || sector > 63) {
      this.addLog('Setor inválido (0-63)', 'error');
      return;
    }

    const device = this.devices['disk'];
    if (!device) return;

    device.userData.operationCount++;
    device.userData.status = `Lendo setor ${sector}`;
    device.userData.animationStartTime = Date.now();
    device.userData.isAnimating = true;

    this.triggerDeviceAnimation('disk', 'receive');
    this.animateCentralComponent('send');
    this.createDataFlowAnimation('send');

    const dataSize = 512;
    device.userData.buffer.push({
      data: new Array(dataSize).fill(0).map(() => Math.floor(Math.random() * 256)),
      timestamp: Date.now(),
      type: 'read',
      sector: sector
    });

    device.userData.dataTransferred += dataSize;
    this.stats.operationCount++;
    this.stats.bytesTransferred += dataSize;
    this.addLog(`Disco: Setor ${sector} lido (${dataSize} bytes)`, 'success');
    this.updateDeviceDetails('disk');
    this.updateStats();

    setTimeout(() => {
      device.userData.status = 'Pronto';
      this.updateDeviceDetails('disk');
    }, 1000);
  }

  writeDiskSector() {
    const input = document.getElementById('diskSector');
    if (!input || input.value === '') {
      this.addLog('Digite o número do setor', 'warning');
      return;
    }

    const sector = parseInt(input.value);
    if (isNaN(sector) || sector < 0 || sector > 63) {
      this.addLog('Setor inválido (0-63)', 'error');
      return;
    }

    const device = this.devices['disk'];
    if (!device) return;

    device.userData.operationCount++;
    device.userData.status = `Escrevendo setor ${sector}`;
    device.userData.animationStartTime = Date.now();
    device.userData.isAnimating = true;

    this.triggerDeviceAnimation('disk', 'send');
    this.animateCentralComponent('send');
    this.createDataFlowAnimation('send');

    const dataSize = 512;
    device.userData.dataTransferred += dataSize;
    this.stats.operationCount++;
    this.stats.bytesTransferred += dataSize;
    this.addLog(`Disco: Setor ${sector} escrito (${dataSize} bytes)`, 'success');
    this.updateDeviceDetails('disk');
    this.updateStats();

    setTimeout(() => {
      device.userData.status = 'Pronto';
      this.updateDeviceDetails('disk');
    }, 1000);
  }
}


window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas3d');
  window.visualizer = new IO3DVisualizer(canvas);
  
  
  window.closeModal = function() {
    document.getElementById('helpModal').style.display = 'none';
  };
});
