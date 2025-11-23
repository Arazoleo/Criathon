

class Memory3DVisualizer {
  constructor(canvas) {
    try {
      this.canvas = canvas;
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.controls = null;
      this.memoryBlocks = {};
      this.diskPlatter = null;
      this.diskHead = null;
      this.animationId = null;
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();
      this.selectedBlock = null;
      
      this.init();
    } catch (error) {
      console.error('Erro ao criar Memory3DVisualizer:', error);
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
      this.camera.position.set(0, 4, 12);
      this.camera.lookAt(0, 2, 0);
      
      
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
        this.controls.maxDistance = 25;
        this.controls.maxPolarAngle = Math.PI / 1.5;
      }
      
      
      this.setupLighting();
      
      
      this.createMemoryBlocks();
      this.createDisk();
      this.createParticles();
      
      
      window.addEventListener('resize', () => this.onWindowResize());
      this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
      this.canvas.addEventListener('click', (e) => this.onCanvasClick(e));
      
      
      this.animate();
      
      console.log('Memory3DVisualizer inicializado com sucesso!');
    } catch (error) {
      console.error('Erro ao inicializar Memory3DVisualizer:', error);
      this.showFallbackMessage();
    }
  }

  showFallbackMessage() {
    try {
      
      const fallbackDiv = document.createElement('div');
      fallbackDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 107, 107, 0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        z-index: 1000;
        font-family: 'Segoe UI', sans-serif;
      `;
      fallbackDiv.innerHTML = `
        <h3>Problema com Visualização 3D</h3>
        <p>O simulador funcionará normalmente, mas sem a visualização 3D.</p>
        <p>Verifique se o Three.js foi carregado corretamente.</p>
      `;
      document.body.appendChild(fallbackDiv);
      
      
      setTimeout(() => {
        try {
          if (fallbackDiv.parentNode) {
            fallbackDiv.parentNode.removeChild(fallbackDiv);
          }
        } catch (error) {
          console.error('Erro ao remover mensagem de fallback:', error);
        }
      }, 5000);
    } catch (error) {
      console.error('Erro ao mostrar mensagem de fallback:', error);
    }
  }

  setupLighting() {
    try {
      
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      this.scene.add(ambientLight);
      
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
      directionalLight.position.set(10, 15, 10);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 50;
      this.scene.add(directionalLight);
      
      
      const pointLight1 = new THREE.PointLight(0x00d4aa, 1.2, 20);
      pointLight1.position.set(-6, 3, -1);
      this.scene.add(pointLight1);
      
      const pointLight2 = new THREE.PointLight(0xff6b6b, 1.2, 20);
      pointLight2.position.set(-2, 4, -0.5);
      this.scene.add(pointLight2);
      
      const pointLight3 = new THREE.PointLight(0x4ecdc4, 1.2, 20);
      pointLight3.position.set(2, 4, -0.5);
      this.scene.add(pointLight3);
      
      const pointLight4 = new THREE.PointLight(0xfeca57, 1.2, 20);
      pointLight4.position.set(6, 3, -1);
      this.scene.add(pointLight4);
      
      
      const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
      fillLight.position.set(-10, 5, -5);
      this.scene.add(fillLight);
    } catch (error) {
      console.error('Erro ao configurar iluminação:', error);
    }
  }

  createMemoryBlocks() {
    try {
      
      const blocks = [
        { name: 'Registradores', position: [-6, 1.5, -1], color: 0x00d4aa, size: [1.8, 1.8, 1.8], label: 'REG' },
        { name: 'Cache L1', position: [-2, 2.5, -0.5], color: 0xff6b6b, size: [2.0, 2.0, 2.0], label: 'CACHE' },
        { name: 'RAM', position: [2, 2.5, -0.5], color: 0x4ecdc4, size: [2.4, 2.4, 2.4], label: 'RAM' },
        { name: 'Disco', position: [6, 1.5, -1], color: 0xfeca57, size: [2.8, 2.8, 2.8], label: 'DISK' }
      ];

      blocks.forEach((block, index) => {
        
        const group = new THREE.Group();
        
        const geometry = new THREE.BoxGeometry(...block.size);
        const material = new THREE.MeshStandardMaterial({
          color: block.color,
          metalness: 0.7,
          roughness: 0.2,
          emissive: block.color,
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: 0.95
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = { 
          name: block.name, 
          isMemoryBlock: true,
          originalScale: 1,
          pulseSpeed: 0.02 + index * 0.01
        };
        
        
        const edges = new THREE.EdgesGeometry(geometry);
        const wireframe = new THREE.LineSegments(
          edges, 
          new THREE.LineBasicMaterial({ 
            color: block.color, 
            linewidth: 2,
            transparent: true,
            opacity: 0.8
          })
        );
        mesh.add(wireframe);
        
        
        const labelGeometry = new THREE.PlaneGeometry(1.5, 0.5);
        const labelMaterial = new THREE.MeshBasicMaterial({
          color: block.color,
          transparent: true,
          opacity: 0.9,
          side: THREE.DoubleSide
        });
        const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
        labelMesh.position.set(0, block.size[1] / 2 + 0.8, 0);
        
        group.add(mesh);
        group.add(labelMesh);
        group.position.set(...block.position);
        
        this.scene.add(group);
        this.memoryBlocks[block.name] = { mesh, group, label: block.label, labelMesh };
      });
    } catch (error) {
      console.error('Erro ao criar blocos de memória:', error);
    }
  }

  createDisk() {
    try {
      
      const platterGeometry = new THREE.CylinderGeometry(2.5, 2.5, 0.3, 64);
      const platterMaterial = new THREE.MeshStandardMaterial({
        color: 0x8d8dd1,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0xfeca57,
        emissiveIntensity: 0.2
      });
      
      this.diskPlatter = new THREE.Mesh(platterGeometry, platterMaterial);
      this.diskPlatter.position.set(6, -1.5, -1);
      this.diskPlatter.castShadow = true;
      this.diskPlatter.receiveShadow = true;
      this.scene.add(this.diskPlatter);
      
      
      const headGeometry = new THREE.BoxGeometry(0.3, 0.2, 1.5);
      const headMaterial = new THREE.MeshStandardMaterial({
        color: 0xff6b6b,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0xff6b6b,
        emissiveIntensity: 0.3
      });
      
      this.diskHead = new THREE.Mesh(headGeometry, headMaterial);
      this.diskHead.position.set(6, 0.5, -1);
      this.diskHead.castShadow = true;
      this.diskHead.receiveShadow = true;
      this.diskHead.userData = { name: 'Cabeçote do Disco', isDiskHead: true };
      this.scene.add(this.diskHead);
    } catch (error) {
      console.error('Erro ao criar disco:', error);
    }
  }

  createParticles() {
    try {
      const particleCount = 200;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 20;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 20;
        
        const colorChoice = Math.random();
        if (colorChoice < 0.33) {
          colors[i] = 0; colors[i + 1] = 0.83; colors[i + 2] = 0.67; 
        } else if (colorChoice < 0.66) {
          colors[i] = 1; colors[i + 1] = 0.42; colors[i + 2] = 0.42; 
        } else {
          colors[i] = 0.31; colors[i + 1] = 0.8; colors[i + 2] = 0.77; 
        }
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.3
      });
      
      const particles = new THREE.Points(geometry, material);
      this.scene.add(particles);
      this.particles = particles;
    } catch (error) {
      console.error('Erro ao criar partículas:', error);
    }
  }

  animate() {
    try {
      this.animationId = requestAnimationFrame(() => this.animate());
      
      const time = Date.now() * 0.001;
      
      
      Object.values(this.memoryBlocks).forEach((blockData, index) => {
        if (blockData && blockData.mesh) {
          const mesh = blockData.mesh;
          const userData = mesh.userData;
          
          
          const pulse = Math.sin(time * 2 + index) * 0.1 + 1;
          mesh.scale.set(pulse, pulse, pulse);
          
          
          mesh.rotation.y += 0.002;
          mesh.rotation.x = Math.sin(time * 0.5 + index) * 0.1;
          
          
          const intensity = 0.3 + Math.sin(time * 3 + index) * 0.2;
          mesh.material.emissiveIntensity = intensity;
          
          
          if (blockData.labelMesh && this.camera) {
            blockData.labelMesh.lookAt(this.camera.position);
          }
        }
      });
      
      
      if (this.diskPlatter) {
        this.diskPlatter.rotation.z += 0.02;
      }
      
      
      if (this.diskHead) {
        this.diskHead.position.x = 6 + Math.sin(time * 2) * 0.3;
        this.diskHead.rotation.z = Math.sin(time * 2) * 0.1;
      }
      
      
      if (this.particles) {
        this.particles.rotation.x += 0.0002;
        this.particles.rotation.y += 0.0003;
        this.particles.rotation.z += 0.0001;
      }
      
      
      if (this.controls) {
        this.controls.update();
      }
      
      this.renderer.render(this.scene, this.camera);
    } catch (error) {
      console.error('Erro na animação:', error);
    }
  }

  onMouseMove(event) {
    try {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      this.raycaster.setFromCamera(this.mouse, this.camera);
      
      
      const objects = [];
      Object.values(this.memoryBlocks).forEach(blockData => {
        if (blockData && blockData.mesh) {
          objects.push(blockData.mesh);
        }
      });
      if (this.diskHead) {
        objects.push(this.diskHead);
      }
      
      const intersects = this.raycaster.intersectObjects(objects);
      
      
      if (this.selectedBlock) {
        const blockData = Object.values(this.memoryBlocks).find(b => b && b.mesh === this.selectedBlock);
        if (blockData && blockData.mesh) {
          blockData.mesh.material.emissiveIntensity = 0.3;
        }
      }
      
      if (intersects.length > 0) {
        this.selectedBlock = intersects[0].object;
        const blockData = Object.values(this.memoryBlocks).find(b => b && b.mesh === this.selectedBlock);
        if (blockData && blockData.mesh) {
          blockData.mesh.material.emissiveIntensity = 0.9;
        }
      } else {
        this.selectedBlock = null;
      }
    } catch (error) {
      console.error('Erro ao processar movimento do mouse:', error);
    }
  }

  onCanvasClick(event) {
    try {
      if (this.selectedBlock && this.selectedBlock.userData) {
        const name = this.selectedBlock.userData.name;
        window.dispatchEvent(new CustomEvent('memoryBlockClicked', { detail: { name } }));
      }
    } catch (error) {
      console.error('Erro ao processar clique no canvas:', error);
    }
  }

  onWindowResize() {
    try {
      const width = this.canvas.clientWidth;
      const height = this.canvas.clientHeight;
      
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    } catch (error) {
      console.error('Erro ao redimensionar janela:', error);
    }
  }

  highlightBlock(blockName, duration = 2000) {
    try {
      const blockData = this.memoryBlocks[blockName];
      if (blockData && blockData.mesh) {
        const mesh = blockData.mesh;
        const originalIntensity = mesh.material.emissiveIntensity;
        const originalScale = mesh.scale.clone();
        
        
        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          
          const pulse = 1 + Math.sin(progress * Math.PI * 4) * 0.3 * (1 - progress);
          mesh.scale.copy(originalScale).multiplyScalar(pulse);
          
          
          mesh.material.emissiveIntensity = originalIntensity + (1 - originalIntensity) * (1 - progress);
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            mesh.material.emissiveIntensity = originalIntensity;
            mesh.scale.copy(originalScale);
          }
        };
        animate();
      }
    } catch (error) {
      console.error('Erro ao destacar bloco:', error);
    }
  }

  animateDataFlow(fromBlock, toBlock, duration = 500) {
    try {
      
      const geometry = new THREE.SphereGeometry(0.15, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: 0x00d4aa,
        emissive: 0x00d4aa,
        emissiveIntensity: 1
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      this.scene.add(sphere);
      
      const from = this.memoryBlocks[fromBlock];
      const to = this.memoryBlocks[toBlock];
      
      if (!from || !to) return;
      
      const startPos = from.position.clone();
      const endPos = to.position.clone();
      const startTime = Date.now();
      
      const animate = () => {
        try {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          sphere.position.lerpVectors(startPos, endPos, progress);
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            this.scene.remove(sphere);
          }
        } catch (error) {
          console.error('Erro na animação de fluxo de dados:', error);
          this.scene.remove(sphere);
        }
      };
      
      animate();
    } catch (error) {
      console.error('Erro ao criar animação de fluxo de dados:', error);
    }
  }

  moveDiskHead(targetAngle, duration = 500) {
    try {
      if (!this.diskHead) return;
      
      const startAngle = this.diskHead.rotation.z;
      const startTime = Date.now();
      
      const animate = () => {
        try {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          this.diskHead.rotation.z = startAngle + (targetAngle - startAngle) * progress;
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        } catch (error) {
          console.error('Erro na animação do cabeçote do disco:', error);
        }
      };
      
      animate();
    } catch (error) {
      console.error('Erro ao mover cabeçote do disco:', error);
    }
  }

  destroy() {
    try {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      if (this.renderer) {
        this.renderer.dispose();
      }
    } catch (error) {
      console.error('Erro ao destruir visualizador:', error);
    }
  }
}

class ImprovedMemorySimulator {
  constructor() {
    try {
      this.registers = new Array(8).fill(0);
      this.memory = new Array(1024).fill(0);
      this.cache = new Map();
      this.disk = new Array(64).fill(null);
      this.diskData = new Array(64).fill(0);
      
      this.pc = 0;
      this.cycles = 0;
      this.status = 'Pronto';
      this.currentSector = 0;
      
      
      this.readOps = 0;
      this.writeOps = 0;
      this.totalTime = 0;
      this.cacheHits = 0;
      
      this.flags = {
        equal: false,
        greater: false,
        less: false,
        zero: false
      };
      
      
      this.instructions = {
        'MOV': this.mov.bind(this),
        'ADD': this.add.bind(this),
        'SUB': this.sub.bind(this),
        'MUL': this.mul.bind(this),
        'DIV': this.div.bind(this),
        'MOD': this.mod.bind(this),
        'CMP': this.cmp.bind(this),
        'JMP': this.jmp.bind(this),
        'JE': this.je.bind(this),
        'JNE': this.jne.bind(this),
        'LOAD': this.load.bind(this),
        'STORE': this.store.bind(this),
        'CACHE': this.cacheLoad.bind(this),
        'DISK_READ': this.diskRead.bind(this),
        'DISK_WRITE': this.diskWrite.bind(this),
        'DISK_SEEK': this.diskSeek.bind(this),
        'DISK_STATUS': this.diskStatus.bind(this),
        'CACHE_FLUSH': this.cacheFlush.bind(this),
        'CACHE_INVALIDATE': this.cacheInvalidate.bind(this),
        'IN': this.in.bind(this),
        'OUT': this.out.bind(this)
      };
      
      this.program = [];
      this.score = 0;
      this.currentPhase = 1;
      this.phases = memorySimulatorData.phases;
      
      this.visualizer = null;
      
      this.initializeDisk();
      this.setupEventListeners();
      this.renderMemoryHierarchy();
      this.updateDisplay();
    } catch (error) {
      console.error('Erro ao inicializar simulador:', error);
    }
  }

  initializeDisk() {
    try {
      for (let i = 0; i < 64; i++) {
        this.diskData[i] = Math.floor(Math.random() * 100) + 1;
      }
      for (let i = 0; i < 20; i++) {
        this.disk[i] = true;
      }
    } catch (error) {
      console.error('Erro ao inicializar disco:', error);
    }
  }

  setupEventListeners() {
    try {
      
      const assembleBtn = document.getElementById('assembleBtn');
      if (assembleBtn) {
        assembleBtn.addEventListener('click', () => this.assemble());
      }
      
      const resetBtn = document.getElementById('resetBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => this.reset());
      }
      
      const nextPhaseBtn = document.getElementById('nextPhaseBtn');
      if (nextPhaseBtn) {
        nextPhaseBtn.addEventListener('click', () => this.nextPhase());
      }
      
      const programTextarea = document.getElementById('program');
      if (programTextarea) {
        programTextarea.addEventListener('input', () => this.updateLineNumbers());
      }
      
      
      const closeSuccessBtn = document.getElementById('closeSuccess');
      if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', () => {
          const modal = document.getElementById('successModal');
          if (modal) modal.style.display = 'none';
        });
      }
      
      const continueBtn = document.getElementById('continueBtn');
      if (continueBtn) {
        continueBtn.addEventListener('click', () => {
          const modal = document.getElementById('successModal');
          if (modal) modal.style.display = 'none';
        });
      }
      
      const closeInfoBtn = document.getElementById('closeInfo');
      if (closeInfoBtn) {
        closeInfoBtn.addEventListener('click', () => {
          const modal = document.getElementById('infoModal');
          if (modal) modal.style.display = 'none';
        });
      }
      
      const closeInfoBtn2 = document.getElementById('closeInfoBtn');
      if (closeInfoBtn2) {
        closeInfoBtn2.addEventListener('click', () => {
          const modal = document.getElementById('infoModal');
          if (modal) modal.style.display = 'none';
        });
      }

      
      const instructionsBtn = document.getElementById('instructionsBtn');
      const phaseInfoBtn = document.getElementById('phaseInfoBtn');
      const instructionsModal = document.getElementById('instructionsModal');
      const phaseModal = document.getElementById('phaseModal');
      const closeInstructions = document.getElementById('closeInstructions');
      const closePhase = document.getElementById('closePhase');
      const closePhaseBtn = document.getElementById('closePhaseBtn');

      if (instructionsBtn && instructionsModal) {
        instructionsBtn.addEventListener('click', () => {
          this.showInstructionsModal();
        });
      }

      if (closeInstructions) {
        closeInstructions.addEventListener('click', () => {
          instructionsModal.style.display = 'none';
        });
      }

      if (phaseInfoBtn && phaseModal) {
        phaseInfoBtn.addEventListener('click', () => {
          this.showPhaseInfoModal();
        });
      }

      if (closePhase) {
        closePhase.addEventListener('click', () => {
          phaseModal.style.display = 'none';
        });
      }

      if (closePhaseBtn) {
        closePhaseBtn.addEventListener('click', () => {
          phaseModal.style.display = 'none';
        });
      }
      
      
      window.addEventListener('memoryBlockClicked', (e) => this.onMemoryBlockClicked(e));
      
    } catch (error) {
      console.error('Erro ao configurar event listeners:', error);
    }
  }

  renderMemoryHierarchy() {
    try {
      const container = document.getElementById('memoryHierarchy');
      if (!container) {
        console.error('Container de hierarquia de memória não encontrado');
        return;
      }
      
      const levels = memorySimulatorData.memoryLevels;
      if (!levels) {
        console.error('Dados de níveis de memória não encontrados');
        return;
      }
      
      Object.entries(levels).forEach(([key, level]) => {
        const block = document.createElement('div');
        block.className = `memory-block ${key}`;
        block.innerHTML = `
          <h3>${level.name}</h3>
          <div class="info">
            <div>Capacidade: ${level.capacity}</div>
            <div>Velocidade: ${level.speed}</div>
            <div>Custo: ${level.cost}</div>
          </div>
        `;
        block.addEventListener('click', () => this.showMemoryInfo(level));
        container.appendChild(block);
      });
    } catch (error) {
      console.error('Erro ao renderizar hierarquia de memória:', error);
    }
  }

  showMemoryInfo(level) {
    try {
      const modal = document.getElementById('infoModal');
      const titleElement = document.getElementById('infoTitle');
      const contentElement = document.getElementById('infoContent');
      
      if (!modal || !titleElement || !contentElement) {
        console.error('Elementos do modal não encontrados');
        return;
      }
      
      titleElement.textContent = level.name;
      contentElement.innerHTML = `
        <strong>Capacidade:</strong> ${level.capacity}<br>
        <strong>Velocidade:</strong> ${level.speed}<br>
        <strong>Custo:</strong> ${level.cost}<br>
        <strong>Volatilidade:</strong> ${level.volatility}<br>
        <strong>Descrição:</strong> ${level.description}
      `;
      modal.style.display = 'block';
    } catch (error) {
      console.error('Erro ao mostrar informações da memória:', error);
    }
  }

  onMemoryBlockClicked(event) {
    try {
      const { name } = event.detail;
      if (!name) return;
      
      const memoryLevel = Object.keys(memorySimulatorData.memoryLevels).find(k => 
        memorySimulatorData.memoryLevels[k].name === name
      );
      
      if (memoryLevel) {
        this.showMemoryInfo(memorySimulatorData.memoryLevels[memoryLevel]);
      }
    } catch (error) {
      console.error('Erro ao processar clique no bloco de memória:', error);
    }
  }

  updateLineNumbers() {
    try {
      const textarea = document.getElementById('program');
      const lineNumbers = document.getElementById('lineNumbers');
      
      if (!textarea || !lineNumbers) return;
      
      const lines = textarea.value.split('\n').length;
      lineNumbers.textContent = Array.from({length: lines}, (_, i) => i + 1).join('\n');
      
      
      this.highlightCommands(textarea);
    } catch (error) {
      console.error('Erro ao atualizar números de linha:', error);
    }
  }

  highlightCommands(textarea) {
    try {
      
      const commands = [
        'MOV', 'ADD', 'SUB', 'MUL', 'DIV', 'CMP', 'JMP', 'JE', 'JNE', 
        'JG', 'JL', 'LOAD', 'STORE', 'PUSH', 'POP', 'CALL', 'RET', 
        'NOP', 'HLT', 'INC', 'DEC', 'AND', 'OR', 'XOR', 'NOT', 'SHL', 'SHR'
      ];
      
      
      
      const editorContainer = textarea.parentElement;
      if (!editorContainer) return;
      
      
      let indicator = editorContainer.querySelector('.command-indicator');
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'command-indicator';
        indicator.style.cssText = `
          position: absolute;
          top: 5px;
          right: 5px;
          background: rgba(0, 212, 170, 0.2);
          color: #00d4aa;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-family: 'Courier New', monospace;
          pointer-events: none;
          z-index: 10;
        `;
        editorContainer.style.position = 'relative';
        editorContainer.appendChild(indicator);
      }
      
      
      const text = textarea.value.toUpperCase();
      const foundCommands = commands.filter(cmd => text.includes(cmd));
      
      if (foundCommands.length > 0) {
        indicator.textContent = `Comandos: ${foundCommands.slice(0, 3).join(', ')}${foundCommands.length > 3 ? '...' : ''}`;
        indicator.style.display = 'block';
        
        
        textarea.style.borderColor = '#00d4aa';
        textarea.style.boxShadow = '0 0 10px rgba(0, 212, 170, 0.3)';
      } else {
        indicator.style.display = 'none';
        textarea.style.borderColor = '#0f3460';
        textarea.style.boxShadow = 'none';
      }
    } catch (error) {
      console.error('Erro ao destacar comandos:', error);
    }
  }

  assemble() {
    try {
      const programElement = document.getElementById('program');
      if (!programElement) {
        this.log('❌ Editor de código não encontrado!', 'error');
        return;
      }
      
      const code = programElement.value.trim();
      if (!code) {
        this.log('❌ Nenhum código fornecido!', 'error');
        return;
      }
      
      this.program = this.parseProgram(code);
      this.log('✅ Programa montado com sucesso!', 'success');
      this.log(`📝 ${this.program.length} instruções carregadas`, 'info');
      this.executeProgram();
    } catch (error) {
      this.log(`❌ Erro na montagem: ${error.message}`, 'error');
      console.error('Erro detalhado na montagem:', error);
    }
  }

  parseProgram(code) {
    try {
      const lines = code.split('\n').map(line => line.trim()).filter(line => line);
      const program = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const parts = line.split(/\s+/);
        const instruction = parts[0].toUpperCase();
        
        if (!this.instructions[instruction]) {
          throw new Error(`Instrução desconhecida: ${instruction}`);
        }
        
        program.push({
          instruction,
          args: parts.slice(1),
          line: i + 1
        });
      }
      
      return program;
    } catch (error) {
      console.error('Erro ao analisar programa:', error);
      throw error;
    }
  }

  executeProgram() {
    try {
      this.pc = 0;
      this.cycles = 0;
      this.status = 'Executando';
      this.executedInstructions = [];
      this.updateDisplay();
      
      const executeStep = () => {
        try {
          if (this.pc >= this.program.length) {
            this.status = 'Concluído';
            this.log('✅ Execução concluída!', 'success');
            this.updateDisplay();
            this.checkPhaseCompletion();
            return;
          }
          
          const instr = this.program[this.pc];
          const fn = this.instructions[instr.instruction];
          
          if (!fn) {
            throw new Error(`Instrução não encontrada: ${instr.instruction}`);
          }
          
          if (!this.executedInstructions.includes(instr.instruction)) {
            this.executedInstructions.push(instr.instruction);
          }
          
          fn(instr.args);
          this.pc++;
          this.cycles++;
          this.updateDisplay();
          
          setTimeout(executeStep, 100);
        } catch (error) {
          this.log(`❌ Erro na execução: ${error.message}`, 'error');
          console.error('Erro detalhado na execução:', error);
          this.status = 'Erro';
          this.updateDisplay();
        }
      };
      
      executeStep();
    } catch (error) {
      console.error('Erro ao iniciar execução do programa:', error);
      this.log(`❌ Erro ao iniciar execução: ${error.message}`, 'error');
    }
  }

  
  mov(args) {
    try {
      const [dest, src] = args;
      const destIndex = this.parseRegister(dest);
      const value = this.parseValue(src);
      this.registers[destIndex] = value;
      
      if (this.visualizer) {
        this.visualizer.highlightBlock('Registradores');
        setTimeout(() => {
          if (this.visualizer) {
            this.visualizer.highlightBlock('Registradores', 500);
          }
        }, 100);
      }
      
      this.log(`📌 MOV R${destIndex + 1}, ${value}`, 'info');
    } catch (error) {
      console.error('Erro ao mover valor:', error);
      throw error;
    }
  }

  add(args) {
    try {
      const [dest, src] = args;
      const destIndex = this.parseRegister(dest);
      const value = this.parseValue(src);
      this.registers[destIndex] += value;
      
      if (this.visualizer) {
        this.visualizer.highlightBlock('Registradores');
        setTimeout(() => {
          if (this.visualizer) {
            this.visualizer.highlightBlock('Registradores', 300);
          }
        }, 50);
      }
      
      this.log(`➕ ADD R${destIndex + 1}, ${value} = ${this.registers[destIndex]}`, 'info');
    } catch (error) {
      console.error('Erro ao somar valores:', error);
      throw error;
    }
  }

  sub(args) {
    try {
      const [dest, src] = args;
      const destIndex = this.parseRegister(dest);
      const value = this.parseValue(src);
      this.registers[destIndex] -= value;
      
      if (this.visualizer) {
        this.visualizer.highlightBlock('Registradores');
        setTimeout(() => {
          if (this.visualizer) {
            this.visualizer.highlightBlock('Registradores', 300);
          }
        }, 50);
      }
      
      this.log(`➖ SUB R${destIndex + 1}, ${value} = ${this.registers[destIndex]}`, 'info');
    } catch (error) {
      console.error('Erro ao subtrair valores:', error);
      throw error;
    }
  }

  mul(args) {
    try {
      const [dest, src] = args;
      const destIndex = this.parseRegister(dest);
      const value = this.parseValue(src);
      this.registers[destIndex] *= value;
      
      if (this.visualizer) {
        this.visualizer.highlightBlock('Registradores');
        setTimeout(() => {
          if (this.visualizer) {
            this.visualizer.highlightBlock('Registradores', 600);
          }
        }, 100);
        setTimeout(() => {
          if (this.visualizer) {
            this.visualizer.highlightBlock('Registradores', 400);
          }
        }, 400);
      }
      
      this.log(`MUL R${destIndex + 1}, ${value} = ${this.registers[destIndex]}`, 'info');
    } catch (error) {
      console.error('Erro ao multiplicar valores:', error);
      throw error;
    }
  }

  div(args) {
    try {
      const [dest, src] = args;
      const destIndex = this.parseRegister(dest);
      const value = this.parseValue(src);
      
      if (value === 0) {
        throw new Error('Divisão por zero');
      }
      
      this.registers[destIndex] = Math.floor(this.registers[destIndex] / value);
      
      if (this.visualizer) {
        
        this.visualizer.highlightBlock('Registradores');
        setTimeout(() => {
          if (this.visualizer) {
            this.visualizer.highlightBlock('Registradores', 800);
          }
        }, 100);
        setTimeout(() => {
          if (this.visualizer) {
            this.visualizer.highlightBlock('Registradores', 500);
          }
        }, 600);
      }
      
      this.log(`➗ DIV R${destIndex + 1}, ${value} = ${this.registers[destIndex]}`, 'info');
    } catch (error) {
      console.error('Erro ao dividir valores:', error);
      throw error;
    }
  }

  mod(args) {
    try {
      const [dest, src] = args;
      const destIndex = this.parseRegister(dest);
      const value = this.parseValue(src);
      
      if (value === 0) {
        throw new Error('Módulo por zero');
      }
      
      this.registers[destIndex] = this.registers[destIndex] % value;
      
      if (this.visualizer) {
        this.visualizer.highlightBlock('Registradores');
        setTimeout(() => {
          if (this.visualizer) {
            this.visualizer.highlightBlock('Registradores', 500);
          }
        }, 100);
      }
      
      this.log(`🔢 MOD R${destIndex + 1}, ${value} = ${this.registers[destIndex]}`, 'info');
    } catch (error) {
      console.error('Erro ao calcular módulo:', error);
      throw error;
    }
  }

  cmp(args) {
    try {
      const [reg1, reg2] = args;
      const val1 = this.parseValue(reg1);
      const val2 = this.parseValue(reg2);
      
      this.flags.equal = val1 === val2;
      this.flags.greater = val1 > val2;
      this.flags.less = val1 < val2;
      this.flags.zero = val1 === 0;
      
      if (this.visualizer) {
        
        this.visualizer.highlightBlock('Registradores');
        setTimeout(() => {
          if (this.visualizer) {
            this.visualizer.highlightBlock('Registradores', 200);
          }
        }, 50);
      }
      
      this.log(`🔍 CMP ${val1} vs ${val2}`, 'info');
    } catch (error) {
      console.error('Erro ao comparar valores:', error);
      throw error;
    }
  }

  jmp(args) {
    try {
      const [line] = args;
      const lineNum = parseInt(line);
      
      if (isNaN(lineNum) || lineNum < 1) {
        throw new Error(`Número de linha inválido: ${line}`);
      }
      
      this.pc = lineNum - 1;
      
      if (this.visualizer) {
        
        const blocks = ['Registradores', 'Cache L1', 'RAM', 'Disco'];
        blocks.forEach((block, index) => {
          setTimeout(() => {
            if (this.visualizer) {
              this.visualizer.highlightBlock(block, 150);
            }
          }, index * 50);
        });
      }
      
      this.log(`JMP para linha ${line}`, 'info');
    } catch (error) {
      console.error('Erro ao pular para linha:', error);
      throw error;
    }
  }

  je(args) {
    try {
      if (this.flags.equal) {
        if (this.visualizer) {
          this.visualizer.highlightBlock('Registradores', 200);
        }
        this.jmp(args);
      } else {
        if (this.visualizer) {
          
          this.visualizer.highlightBlock('Registradores', 100);
        }
      }
    } catch (error) {
      console.error('Erro ao pular se igual:', error);
      throw error;
    }
  }

  jne(args) {
    try {
      if (!this.flags.equal) {
        if (this.visualizer) {
          this.visualizer.highlightBlock('Registradores', 200);
        }
        this.jmp(args);
      } else {
        if (this.visualizer) {
          
          this.visualizer.highlightBlock('Registradores', 100);
        }
      }
    } catch (error) {
      console.error('Erro ao pular se diferente:', error);
      throw error;
    }
  }

  
  load(args) {
    try {
      const [reg, address] = args;
      const regIndex = this.parseRegister(reg);
      const addr = parseInt(address);
      
      if (isNaN(addr) || addr < 0 || addr >= this.memory.length) {
        throw new Error(`Endereço de memória inválido: ${addr}`);
      }
      
      this.registers[regIndex] = this.memory[addr];
      this.totalTime += 100;
      this.readOps++;
      
      if (this.visualizer) {
        this.visualizer.highlightBlock('RAM');
        this.visualizer.animateDataFlow('RAM', 'Registradores');
      }
      
      this.log(`📖 LOAD R${regIndex + 1}, [${addr}] = ${this.memory[addr]}`, 'info');
    } catch (error) {
      console.error('Erro ao carregar da memória:', error);
      throw error;
    }
  }

  store(args) {
    try {
      const [reg, address] = args;
      const regIndex = this.parseRegister(reg);
      const addr = parseInt(address);
      
      if (isNaN(addr) || addr < 0 || addr >= this.memory.length) {
        throw new Error(`Endereço de memória inválido: ${addr}`);
      }
      
      this.memory[addr] = this.registers[regIndex];
      this.totalTime += 100;
      this.writeOps++;
      
      if (this.visualizer) {
        this.visualizer.highlightBlock('RAM');
        this.visualizer.animateDataFlow('Registradores', 'RAM');
      }
      
      this.log(`💾 STORE R${regIndex + 1}, [${addr}] = ${this.registers[regIndex]}`, 'info');
    } catch (error) {
      console.error('Erro ao armazenar na memória:', error);
      throw error;
    }
  }

  cacheLoad(args) {
    try {
      const [reg, address] = args;
      const regIndex = this.parseRegister(reg);
      const addr = parseInt(address);
      
      if (isNaN(addr)) {
        throw new Error(`Endereço inválido: ${address}`);
      }
      
      if (this.cache.has(addr)) {
        this.registers[regIndex] = this.cache.get(addr);
        this.cacheHits++;
        this.totalTime += 1;
        
        if (this.visualizer) {
          this.visualizer.highlightBlock('Cache L1');
          this.visualizer.animateDataFlow('Cache L1', 'Registradores');
        }
        
        this.log(`⚡ CACHE HIT [${addr}] = ${this.registers[regIndex]}`, 'success');
      } else {
        this.registers[regIndex] = Math.floor(Math.random() * 100);
        this.cache.set(addr, this.registers[regIndex]);
        this.totalTime += 100;
        this.readOps++;
        
        if (this.visualizer) {
          this.visualizer.highlightBlock('RAM');
          this.visualizer.highlightBlock('Cache L1');
          this.visualizer.animateDataFlow('RAM', 'Cache L1');
          this.visualizer.animateDataFlow('Cache L1', 'Registradores');
        }
        
        this.log(`CACHE MISS [${addr}] = ${this.registers[regIndex]}`, 'warning');
      }
    } catch (error) {
      console.error('Erro ao carregar do cache:', error);
      throw error;
    }
  }

  diskRead(args) {
    try {
      const [reg, sector] = args;
      const regIndex = this.parseRegister(reg);
      const sectorNum = parseInt(sector);
      
      if (isNaN(sectorNum) || sectorNum < 0 || sectorNum >= this.disk.length) {
        throw new Error(`Setor de disco inválido: ${sectorNum}`);
      }
      
      this.registers[regIndex] = this.diskData[sectorNum];
      this.readOps++;
      this.totalTime += 10;
      
      if (this.visualizer) {
        this.visualizer.highlightBlock('Disco');
        this.visualizer.animateDataFlow('Disco', 'Registradores');
      }
      
      this.log(`💿 DISK_READ R${regIndex + 1}, [${sectorNum}] = ${this.diskData[sectorNum]}`, 'info');
    } catch (error) {
      console.error('Erro ao ler do disco:', error);
      throw error;
    }
  }

  diskWrite(args) {
    try {
      const [reg, sector] = args;
      const regIndex = this.parseRegister(reg);
      const sectorNum = parseInt(sector);
      
      if (isNaN(sectorNum) || sectorNum < 0 || sectorNum >= this.disk.length) {
        throw new Error(`Setor de disco inválido: ${sectorNum}`);
      }
      
      this.diskData[sectorNum] = this.registers[regIndex];
      this.disk[sectorNum] = true;
      this.writeOps++;
      this.totalTime += 10;
      
      if (this.visualizer) {
        this.visualizer.highlightBlock('Disco');
        this.visualizer.animateDataFlow('Registradores', 'Disco');
      }
      
      this.log(`💾 DISK_WRITE R${regIndex + 1}, [${sectorNum}] = ${this.registers[regIndex]}`, 'info');
    } catch (error) {
      console.error('Erro ao escrever no disco:', error);
      throw error;
    }
  }

  diskSeek(args) {
    try {
      const [sector] = args;
      const sectorNum = parseInt(sector);
      
      if (isNaN(sectorNum) || sectorNum < 0 || sectorNum >= this.disk.length) {
        throw new Error(`Setor de disco inválido: ${sectorNum}`);
      }
      
      const seekTime = Math.abs(sectorNum - this.currentSector) * 0.5;
      this.currentSector = sectorNum;
      this.totalTime += seekTime;
      
      if (this.visualizer) {
        const angle = (sectorNum / this.disk.length) * Math.PI * 2;
        this.visualizer.moveDiskHead(angle);
      }
      
      this.log(`🔍 DISK_SEEK [${sectorNum}] (${seekTime.toFixed(1)}ms)`, 'info');
    } catch (error) {
      console.error('Erro ao buscar no disco:', error);
      throw error;
    }
  }

  diskStatus(args) {
    try {
      const [reg] = args;
      const regIndex = this.parseRegister(reg);
      this.registers[regIndex] = Math.random() < 0.1 ? 1 : 0;
      this.log(`DISK_STATUS = ${this.registers[regIndex] === 0 ? 'Pronto' : 'Ocupado'}`, 'info');
    } catch (error) {
      console.error('Erro ao verificar status do disco:', error);
      throw error;
    }
  }

  cacheFlush() {
    try {
      this.cache.clear();
      
      if (this.visualizer) {
        
        this.visualizer.highlightBlock('Cache L1', 1000);
        setTimeout(() => {
          if (this.visualizer) {
            this.visualizer.highlightBlock('Cache L1', 500);
          }
        }, 200);
      }
      
      this.log(`🧹 CACHE_FLUSH`, 'info');
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
      throw error;
    }
  }

  cacheInvalidate(args) {
    try {
      const [address] = args;
      const addr = parseInt(address);
      
      if (isNaN(addr)) {
        throw new Error(`Endereço inválido: ${address}`);
      }
      
      if (this.cache.has(addr)) {
        this.cache.delete(addr);
        
        if (this.visualizer) {
          
          this.visualizer.highlightBlock('Cache L1', 600);
        }
        
        this.log(`CACHE_INVALIDATE [${addr}]`, 'info');
      }
    } catch (error) {
      console.error('Erro ao invalidar cache:', error);
      throw error;
    }
  }

  in(args) {
    try {
      const [reg, device] = args;
      const regIndex = this.parseRegister(reg);
      this.registers[regIndex] = Math.floor(Math.random() * 100);
      this.log(`📥 IN R${regIndex + 1}, ${device} = ${this.registers[regIndex]}`, 'info');
    } catch (error) {
      console.error('Erro ao ler entrada:', error);
      throw error;
    }
  }

  out(args) {
    try {
      const [reg, device] = args;
      const regIndex = this.parseRegister(reg);
      this.log(`📤 OUT R${regIndex + 1}, ${device} = ${this.registers[regIndex]}`, 'info');
    } catch (error) {
      console.error('Erro ao escrever saída:', error);
      throw error;
    }
  }

  
  parseRegister(reg) {
    try {
      if (!reg || !reg.startsWith('R')) {
        throw new Error(`Registrador inválido: ${reg}`);
      }
      const index = parseInt(reg.substring(1));
      if (isNaN(index) || index < 1 || index > 8) {
        throw new Error(`Registrador inválido: ${reg}`);
      }
      return index - 1;
    } catch (error) {
      console.error('Erro ao analisar registrador:', error);
      throw error;
    }
  }

  parseValue(value) {
    try {
      if (!value) {
        throw new Error('Valor não fornecido');
      }
      
      if (value.startsWith('R')) {
        return this.registers[this.parseRegister(value)];
      }
      
      const numValue = parseInt(value);
      if (isNaN(numValue)) {
        throw new Error(`Valor inválido: ${value}`);
      }
      
      return numValue;
    } catch (error) {
      console.error('Erro ao analisar valor:', error);
      throw error;
    }
  }

  log(message, type = 'info') {
    try {
      const logContainer = document.getElementById('logContainer');
      if (!logContainer) {
        console.log(`[${type.toUpperCase()}] ${message}`);
        return;
      }
      
      const entry = document.createElement('div');
      entry.className = `log-entry ${type}`;
      entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
      logContainer.appendChild(entry);
      logContainer.scrollTop = logContainer.scrollHeight;
    } catch (error) {
      console.error('Erro ao adicionar log:', error);
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }

  updateDisplay() {
    try {
      const elements = {
        phaseValue: this.currentPhase,
        scoreValue: this.score,
        cyclesValue: this.cycles,
        readOps: this.readOps,
        writeOps: this.writeOps,
        cacheHits: this.cacheHits,
        totalTime: this.totalTime.toFixed(1)
      };
      
      Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
          element.textContent = value;
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar display:', error);
    }
  }

  checkPhaseCompletion() {
    try {
      const phase = this.phases[this.currentPhase - 1];
      if (!phase) return;
      
      if (phase.requiredInstructions && phase.requiredInstructions.length > 0) {
        const missingInstructions = phase.requiredInstructions.filter(
          reqInst => !this.executedInstructions.includes(reqInst.toUpperCase())
        );
        
        if (missingInstructions.length > 0) {
          this.log(`Erro: Você deve usar as seguintes instruções: ${missingInstructions.join(', ')}`, 'error');
          return;
        }
      }
      
      let completed = false;
      
      switch (this.currentPhase) {
        case 1:
          completed = this.registers[0] === this.diskData[5];
          break;
        case 2:
          completed = this.diskData[10] === 42;
          break;
        case 3:
          completed = this.registers[0] !== 0 && this.registers[1] !== 0;
          break;
        case 4:
          completed = this.currentSector === 20 && this.registers[0] !== 0;
          break;
        case 5:
          completed = this.registers[0] === 100 && this.memory[200] === 100 && this.diskData[25] === 100;
          break;
        default:
          completed = false;
      }
      
      if (completed) {
        this.score += 100;
        this.showSuccessModal(phase);
      }
    } catch (error) {
      console.error('Erro ao verificar conclusão da fase:', error);
    }
  }

  showSuccessModal(phase) {
    try {
      const modal = document.getElementById('successModal');
      const messageElement = document.getElementById('successMessage');
      const continueBtn = document.getElementById('continueBtn');
      
      if (!modal || !messageElement || !continueBtn) {
        console.error('Elementos do modal de sucesso não encontrados');
        return;
      }
      
      messageElement.textContent = `Você completou: ${phase.title}`;
      modal.style.display = 'block';
      
      continueBtn.onclick = () => {
        modal.style.display = 'none';
        if (this.currentPhase < this.phases.length) {
          const nextPhaseBtn = document.getElementById('nextPhaseBtn');
          if (nextPhaseBtn) {
            nextPhaseBtn.style.display = 'block';
          }
        }
      };
    } catch (error) {
      console.error('Erro ao mostrar modal de sucesso:', error);
    }
  }

  nextPhase() {
    try {
      this.currentPhase++;
      const nextPhaseBtn = document.getElementById('nextPhaseBtn');
      if (nextPhaseBtn) {
        nextPhaseBtn.style.display = 'none';
      }
      
      this.reset();
      
      const phase = this.phases[this.currentPhase - 1];
      if (phase) {
        const programTextarea = document.getElementById('program');
        if (programTextarea) {
          programTextarea.value = '';
          this.updateLineNumbers();
        }
      }
    } catch (error) {
      console.error('Erro ao avançar para próxima fase:', error);
    }
  }

  reset() {
    try {
      this.registers.fill(0);
      this.memory.fill(0);
      this.cache.clear();
      this.pc = 0;
      this.cycles = 0;
      this.status = 'Pronto';
      this.currentSector = 0;
      this.readOps = 0;
      this.writeOps = 0;
      this.totalTime = 0;
      this.cacheHits = 0;
      this.executedInstructions = [];
      
      this.flags = {
        equal: false,
        greater: false,
        less: false,
        zero: false
      };
      
      const logContainer = document.getElementById('logContainer');
      if (logContainer) {
        logContainer.innerHTML = '';
      }
      
      this.updateDisplay();
    } catch (error) {
      console.error('Erro ao resetar simulador:', error);
    }
  }

  showInstructionsModal() {
    const instructionsModal = document.getElementById('instructionsModal');
    const instructionsContent = document.getElementById('instructionsContent');
    
    if (!instructionsModal || !instructionsContent) return;

    const instructions = memorySimulatorData.instructions;
    let html = '';

    
    const categories = {};
    Object.keys(instructions).forEach(key => {
      const inst = instructions[key];
      const category = inst.category || 'Outras';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push({ name: key, ...inst });
    });

    
    Object.keys(categories).forEach(category => {
      html += `<div class="instruction-category">
        <h3>${category}</h3>`;
      
      categories[category].forEach(inst => {
        html += `
          <div class="instruction-item">
            <div class="instruction-name">${inst.name}</div>
            <div class="instruction-syntax">${inst.syntax}</div>
            <div class="instruction-description">${inst.description}</div>
            <div class="instruction-example">Exemplo: ${inst.example}</div>
            <div class="instruction-timing">Tempo: ${inst.timing}</div>
          </div>
        `;
      });
      
      html += '</div>';
    });

    instructionsContent.innerHTML = html;
    instructionsModal.style.display = 'block';
  }

  showPhaseInfoModal() {
    const phaseModal = document.getElementById('phaseModal');
    const phaseModalTitle = document.getElementById('phaseModalTitle');
    const phaseModalContent = document.getElementById('phaseModalContent');
    
    if (!phaseModal || !phaseModalTitle || !phaseModalContent) return;

    const currentPhase = this.phases[this.currentPhase - 1];
    if (!currentPhase) return;

    phaseModalTitle.textContent = currentPhase.title;
    
    let html = `
      <div class="phase-info">
        <div class="phase-info-item">
          <div class="label">Objetivo</div>
          <div class="value">${currentPhase.objective}</div>
        </div>
        
        <div class="phase-info-item">
          <div class="label">Descrição</div>
          <div class="value">${currentPhase.description}</div>
        </div>
        
        <div class="phase-info-item">
          <div class="label">Dificuldade</div>
          <div class="value">${currentPhase.difficulty}</div>
        </div>
        
        <div class="phase-info-item">
          <div class="label">Resultado Esperado</div>
          <div class="value">${currentPhase.expectedResult}</div>
        </div>
        
        <div class="phase-info-item">
          <div class="label">Comando</div>
          <div class="value"><code>${currentPhase.code.split('\n')[0] || currentPhase.code}</code></div>
        </div>
    `;

    if (currentPhase.hints && currentPhase.hints.length > 0) {
      html += `
        <div class="phase-hints">
          <h4>Dicas</h4>
          <ul>`;
      currentPhase.hints.forEach(hint => {
        html += `<li>${hint}</li>`;
      });
      html += `</ul></div>`;
    }

    if (currentPhase.theory) {
      html += `
        <div class="phase-info-item" style="margin-top: 20px;">
          <div class="label">Conceito Teórico: ${currentPhase.theory.title}</div>
          <div class="value">${currentPhase.theory.content}</div>
        </div>
      `;
    }

    html += '</div>';
    phaseModalContent.innerHTML = html;
    phaseModal.style.display = 'block';
  }
}


document.addEventListener('DOMContentLoaded', () => {
  try {
    const canvas = document.getElementById('canvas3d');
    
    if (!canvas) {
      throw new Error('Canvas 3D não encontrado');
    }
    
    
    const visualizer = new Memory3DVisualizer(canvas);
    
    
    const simulator = new ImprovedMemorySimulator();
    simulator.visualizer = visualizer;
    
    
    const programTextarea = document.getElementById('program');
    if (programTextarea) {
      programTextarea.value = '';
      simulator.updateLineNumbers();
    }
    
    
    window.addEventListener('beforeunload', () => {
      if (visualizer && visualizer.destroy) {
        visualizer.destroy();
      }
    });
    
    console.log('Simulador de Memória inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar o simulador:', error);
    
    
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      right: 20px;
      background: rgba(255, 107, 107, 0.9);
      color: white;
      padding: 15px;
      border-radius: 5px;
      z-index: 1000;
      font-family: 'Segoe UI', sans-serif;
    `;
    errorDiv.innerHTML = `
      <strong>Erro ao inicializar o simulador:</strong><br>
      ${error.message}<br>
      <small>Verifique o console para mais detalhes.</small>
    `;
    document.body.appendChild(errorDiv);
  }
});

