class AssemblyGame {
  constructor() {
    this.scene3D = new Scene3D();
    this.programCounter = 0;
    this.cycleCount = 0;
    this.isRunning = false;
    this.programLines = [];
    this.currentPhase = 0;
    this.totalScore = 0;
    this.compareFlag = null;
    this.inputBuffer = [];
    this.outputBuffer = [];
    this.executedInstructions = [];
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.updatePhaseInfo();
    this.updateLineNumbers();
    this.log('Assembly Quest 3D iniciado!', '#00aaff');
    this.log('Digite seu código Assembly e clique em Assemble', '#00aaff');
    this.log('Clique em "Ajuda" para ver as instruções disponíveis', '#00aaff');
    this.log('Clique em "Teoria" para aprender conceitos de memória e E/S', '#ff00ff');
    
    this.animate();
  }
  
  setupEventListeners() {
    const programTextarea = document.getElementById('program');
    const lineNumbers = document.getElementById('lineNumbers');

    programTextarea.addEventListener('input', () => this.updateLineNumbers());
    programTextarea.addEventListener('scroll', () => this.syncScroll());

    document.getElementById('assembleBtn').addEventListener('click', () => {
      if (!this.isRunning) {
        this.resetSimulator();
        this.executeProgram();
      }
    });

    document.getElementById('resetBtn').addEventListener('click', () => this.resetSimulator());
    document.getElementById('continueBtn').addEventListener('click', () => {
      document.getElementById('successModal').classList.remove('show');
    });

    document.getElementById('nextPhaseBtn').addEventListener('click', () => this.nextPhase());
    document.getElementById('helpBtn').addEventListener('click', () => {
      document.getElementById('helpPanel').classList.add('show');
    });

    document.getElementById('helpClose').addEventListener('click', () => {
      document.getElementById('helpPanel').classList.remove('show');
    });

    document.getElementById('theoryBtn').addEventListener('click', () => {
      document.getElementById('theoryPanel').classList.add('show');
    });

    document.getElementById('theoryClose').addEventListener('click', () => {
      document.getElementById('theoryPanel').classList.remove('show');
    });

    document.getElementById('theoryNextBtn').addEventListener('click', () => {
      document.getElementById('theoryQuestionModal').classList.remove('show');
      if (this.currentPhase < phases.length - 1) {
        document.getElementById('nextPhaseBtn').style.display = 'block';
      } else {
        alert('Parabéns! Você completou todas as fases!\n\nPontuação Final: ' + this.totalScore);
      }
    });

    document.getElementById('backBtn').addEventListener('click', () => {
      if (confirm('Tem certeza que deseja voltar ao menu? Seu progresso será perdido.')) {
        window.location.href = 'index.html';
      }
    });

    window.addEventListener('resize', () => this.scene3D.onWindowResize());
  }
  
  updateLineNumbers() {
    const programTextarea = document.getElementById('program');
    const lineNumbers = document.getElementById('lineNumbers');
    const lines = programTextarea.value.split('\n').length;
    let lineNumbersText = '';
    for (let i = 1; i <= lines; i++) {
      lineNumbersText += i + '\n';
    }
    lineNumbers.textContent = lineNumbersText;
  }

  syncScroll() {
    const programTextarea = document.getElementById('program');
    const lineNumbers = document.getElementById('lineNumbers');
    lineNumbers.scrollTop = programTextarea.scrollTop;
  }
  
  updatePhaseInfo() {
    const phase = phases[this.currentPhase];
    document.getElementById('phaseInfo').innerHTML = `
      <div class="phase-title">${phase.title}</div>
      <div class="phase-objective">${phase.objective}</div>
      <div style="margin-top: 8px; color: #ffd700;">Recompensa: ${phase.reward} pontos</div>
    `;
  }
  
  log(message, color = '#00ff41') {
    const logContent = document.getElementById('logContent');
    if (logContent) {
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      entry.style.color = color;
      entry.textContent = `[${this.cycleCount}] ${message}`;
      logContent.appendChild(entry);
      logContent.scrollTop = logContent.scrollHeight;
      
      while (logContent.children.length > 30) {
        logContent.removeChild(logContent.firstChild);
      }
    }
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async executeProgram() {
    this.programLines = document.getElementById('program').value.trim().split('\n').filter(line => line.trim() !== '');
    this.programCounter = 0;
    this.cycleCount = 0;
    this.isRunning = true;
    this.compareFlag = null;
    this.inputBuffer = [];
    this.outputBuffer = [];
    this.executedInstructions = [];
    this.log('Iniciando execução...', '#00aaff');

    while (this.programCounter < this.programLines.length && this.isRunning) {
      const line = this.programLines[this.programCounter].trim();
      document.getElementById('pcValue').textContent = this.programCounter + 1;

      if (line && !line.startsWith(';')) {
        const parts = line.split(/[\s,]+/);
        const inst = parts[0].toUpperCase();
        const arg1 = parts[1];
        const arg2 = parts[2];
        const arg3 = parts[3];

        if (!this.executedInstructions.includes(inst)) {
          this.executedInstructions.push(inst);
        }
        await this.executeInstruction(inst, arg1, arg2, arg3);
      }

      this.programCounter++;
    }

    this.isRunning = false;
    document.getElementById('statusValue').textContent = 'Concluído';
    this.log('Programa finalizado', '#00ff41');
    this.checkPhaseCompletion();
  }
  
  async executeInstruction(inst, arg1, arg2, arg3) {
    this.cycleCount++;
    document.getElementById('cyclesValue').textContent = this.cycleCount;
    document.getElementById('statusValue').textContent = 'Executando...';

    Animations.animateCPU(this.scene3D.cpuMesh, this.scene3D.cpuLight, 2, 300);
    
    await this.sleep(250);

    const upperInst = inst.toUpperCase();
    const registers = this.scene3D.registers;
    const memory = this.scene3D.memory;
    const ioDevices = this.scene3D.ioDevices;
    const buses = this.scene3D.buses;
    
    switch (upperInst) {
      case 'MOV':
        await this.handleMOV(arg1, arg2, registers, buses);
        break;
      case 'ADD':
        await this.handleADD(arg1, arg2, arg3, registers, buses);
        break;
      case 'SUB':
        await this.handleSUB(arg1, arg2, arg3, registers, buses);
        break;
      case 'MUL':
        await this.handleMUL(arg1, arg2, arg3, registers, buses);
        break;
      case 'DIV':
        await this.handleDIV(arg1, arg2, arg3, registers, buses);
        break;
      case 'MOD':
        await this.handleMOD(arg1, arg2, arg3, registers, buses);
        break;
      case 'CMP':
        await this.handleCMP(arg1, arg2, registers);
        break;
      case 'STORE':
        await this.handleSTORE(arg1, arg2, registers, memory, buses);
        break;
      case 'LOAD':
        await this.handleLOAD(arg1, arg2, registers, memory, buses);
        break;
      case 'IN':
        await this.handleIN(arg1, arg2, registers, ioDevices, buses);
        break;
      case 'OUT':
        await this.handleOUT(arg1, arg2, registers, ioDevices, buses);
        break;
      case 'JMP':
        this.handleJMP(arg1);
        break;
      case 'JE':
        this.handleJE(arg1);
        break;
      case 'JNE':
        this.handleJNE(arg1);
        break;
      default:
        this.log(`Instrução desconhecida: ${inst}`, '#ff0000');
    }
    
    await this.sleep(500);
  }
  
  async handleMOV(arg1, arg2, registers, buses) {
    const reg = registers[arg1];
    if (!reg) {
      this.log(`Registrador ${arg1} não existe`, '#ff0000');
      return;
    }
    reg.value = parseInt(arg2);
    Animations.animateRegister(reg, 0x00ffff);
    await Animations.animateBus(buses[arg1]);
    this.log(`MOV ${arg1}, ${arg2} → ${arg1} = ${reg.value}`);
  }
  
  async handleADD(arg1, arg2, arg3, registers, buses) {
    const regDest = registers[arg1];
    const regSrc1 = registers[arg2];
    const regSrc2 = registers[arg3];
    if (!regDest || !regSrc1 || !regSrc2) {
      this.log(`Registrador inválido`, '#ff0000');
      return;
    }
    regDest.value = regSrc1.value + regSrc2.value;
    Animations.animateRegister(regDest, 0xffff00);
    Animations.animateRegister(regSrc1, 0xffff00);
    Animations.animateRegister(regSrc2, 0xffff00);
    Animations.createParticleEffect(this.scene3D.scene, regDest.position, 0xffff00);
    await Promise.all([
      Animations.animateBus(buses[arg1]),
      Animations.animateBus(buses[arg2]),
      Animations.animateBus(buses[arg3])
    ]);
    this.log(`ADD ${arg1}, ${arg2}, ${arg3} → ${arg1} = ${regDest.value}`);
  }
  
  async handleSUB(arg1, arg2, arg3, registers, buses) {
    const regDest = registers[arg1];
    const regSrc1 = registers[arg2];
    const regSrc2 = registers[arg3];
    if (!regDest || !regSrc1 || !regSrc2) {
      this.log(`Registrador inválido`, '#ff0000');
      return;
    }
    regDest.value = regSrc1.value - regSrc2.value;
    Animations.animateRegister(regDest, 0xff0000);
    Animations.animateRegister(regSrc1, 0xff0000);
    Animations.animateRegister(regSrc2, 0xff0000);
    await Promise.all([
      Animations.animateBus(buses[arg1]),
      Animations.animateBus(buses[arg2]),
      Animations.animateBus(buses[arg3])
    ]);
    this.log(`SUB ${arg1}, ${arg2}, ${arg3} → ${arg1} = ${regDest.value}`);
  }
  
  async handleMUL(arg1, arg2, arg3, registers, buses) {
    const regDest = registers[arg1];
    const regSrc1 = registers[arg2];
    const regSrc2 = registers[arg3];
    if (!regDest || !regSrc1 || !regSrc2) {
      this.log(`Registrador inválido`, '#ff0000');
      return;
    }
    regDest.value = regSrc1.value * regSrc2.value;
    Animations.animateRegister(regDest, 0xff00ff);
    Animations.animateRegister(regSrc1, 0xff00ff);
    Animations.animateRegister(regSrc2, 0xff00ff);
    Animations.createParticleEffect(this.scene3D.scene, regDest.position, 0xff00ff);
    await Promise.all([
      Animations.animateBus(buses[arg1]),
      Animations.animateBus(buses[arg2]),
      Animations.animateBus(buses[arg3])
    ]);
    this.log(`MUL ${arg1}, ${arg2}, ${arg3} → ${arg1} = ${regDest.value}`);
  }
  
  async handleDIV(arg1, arg2, arg3, registers, buses) {
    const regDest = registers[arg1];
    const regSrc1 = registers[arg2];
    const regSrc2 = registers[arg3];
    if (!regDest || !regSrc1 || !regSrc2) {
      this.log(`Registrador inválido`, '#ff0000');
      return;
    }
    if (regSrc2.value === 0) {
      this.log(`Divisão por zero!`, '#ff0000');
      return;
    }
    regDest.value = Math.floor(regSrc1.value / regSrc2.value);
    Animations.animateRegister(regDest, 0x00ffff);
    Animations.animateRegister(regSrc1, 0x00ffff);
    Animations.animateRegister(regSrc2, 0x00ffff);
    Animations.createParticleEffect(this.scene3D.scene, regDest.position, 0x00ffff);
    await Promise.all([
      Animations.animateBus(buses[arg1]),
      Animations.animateBus(buses[arg2]),
      Animations.animateBus(buses[arg3])
    ]);
    this.log(`DIV ${arg1}, ${arg2}, ${arg3} → ${arg1} = ${regDest.value}`);
  }
  
  async handleMOD(arg1, arg2, arg3, registers, buses) {
    const regDest = registers[arg1];
    const regSrc1 = registers[arg2];
    const regSrc2 = registers[arg3];
    if (!regDest || !regSrc1 || !regSrc2) {
      this.log(`Registrador inválido`, '#ff0000');
      return;
    }
    if (regSrc2.value === 0) {
      this.log(`Módulo por zero!`, '#ff0000');
      return;
    }
    regDest.value = regSrc1.value % regSrc2.value;
    Animations.animateRegister(regDest, 0xffaa00);
    Animations.animateRegister(regSrc1, 0xffaa00);
    Animations.animateRegister(regSrc2, 0xffaa00);
    await Promise.all([
      Animations.animateBus(buses[arg1]),
      Animations.animateBus(buses[arg2]),
      Animations.animateBus(buses[arg3])
    ]);
    this.log(`MOD ${arg1}, ${arg2}, ${arg3} → ${arg1} = ${regDest.value}`);
  }
  
  async handleCMP(arg1, arg2, registers) {
    const regC1 = registers[arg1];
    const regC2 = registers[arg2];
    if (!regC1 || !regC2) {
      this.log(`Registrador inválido`, '#ff0000');
      return;
    }
    if (regC1.value === regC2.value) {
      this.compareFlag = 'equal';
      this.log(`CMP ${arg1}, ${arg2} → IGUAL`, '#ffff00');
    } else if (regC1.value > regC2.value) {
      this.compareFlag = 'greater';
      this.log(`CMP ${arg1}, ${arg2} → MAIOR`, '#ffff00');
    } else {
      this.compareFlag = 'less';
      this.log(`CMP ${arg1}, ${arg2} → MENOR`, '#ffff00');
    }
    Animations.animateRegister(regC1, 0xffff00);
    Animations.animateRegister(regC2, 0xffff00);
  }
  
  async handleSTORE(arg1, arg2, registers, memory, buses) {
    const regStore = registers[arg1];
    const addr = parseInt(arg2);
    if (!regStore || addr < 0 || addr >= memory.length) {
      this.log(`Operação inválida`, '#ff0000');
      return;
    }
    memory[addr].value = regStore.value;
    Animations.animateMemory(memory[addr], 0xff00ff);
    await Animations.animateBus(buses.memory[addr]);
    this.log(`STORE ${arg1}, ${addr} → M${addr} = ${memory[addr].value}`);
  }
  
  async handleLOAD(arg1, arg2, registers, memory, buses) {
    const regLoad = registers[arg1];
    const addrLoad = parseInt(arg2);
    if (!regLoad || addrLoad < 0 || addrLoad >= memory.length) {
      this.log(`Operação inválida`, '#ff0000');
      return;
    }
    regLoad.value = memory[addrLoad].value;
    Animations.animateRegister(regLoad, 0x00ffff);
    Animations.animateMemory(memory[addrLoad], 0x00ffff);
    await Animations.animateBus(buses.memory[addrLoad]);
    this.log(`LOAD ${arg1}, ${addrLoad} → ${arg1} = ${memory[addrLoad].value}`);
  }
  
  async handleIN(arg1, arg2, registers, ioDevices, buses) {
    const regIn = registers[arg1];
    const deviceIn = ioDevices[arg2];
    if (!regIn || !deviceIn) {
      this.log(`Dispositivo ou registrador inválido`, '#ff0000');
      return;
    }
    if (deviceIn.type !== 'input') {
      this.log(`Dispositivo ${arg2} não é de entrada`, '#ff0000');
      return;
    }
    
    if (this.inputBuffer.length === 0) {
      const inputValue = prompt(`Digite um valor para o dispositivo ${arg2}:`);
      if (inputValue !== null) {
        this.inputBuffer.push(parseInt(inputValue) || 0);
      } else {
        this.inputBuffer.push(0);
      }
    }
    
    regIn.value = this.inputBuffer[0];
    Animations.animateIODevice(deviceIn, 0x00ff00);
    Animations.animateRegister(regIn, 0x00ff00);
    await Animations.animateBus(buses.input);
    this.log(`IN ${arg1}, ${arg2} → ${arg1} = ${regIn.value}`);
  }
  
  async handleOUT(arg1, arg2, registers, ioDevices, buses) {
    const regOut = registers[arg1];
    const deviceOut = ioDevices[arg2];
    if (!regOut || !deviceOut) {
      this.log(`Dispositivo ou registrador inválido`, '#ff0000');
      return;
    }
    if (deviceOut.type !== 'output') {
      this.log(`Dispositivo ${arg2} não é de saída`, '#ff0000');
      return;
    }
    
    this.outputBuffer.push(regOut.value);
    deviceOut.value = regOut.value;
    Animations.animateIODevice(deviceOut, 0xff0000);
    Animations.animateRegister(regOut, 0xff0000);
    await Animations.animateBus(buses.output);
    this.log(`OUT ${arg1}, ${arg2} → ${arg2} = ${regOut.value}`, '#ff00ff');
  }
  
  handleJMP(arg1) {
    const line = parseInt(arg1) - 1;
    if (line >= 0 && line < this.programLines.length) {
      this.programCounter = line - 1;
      this.log(`JMP ${arg1} → PC = ${line}`, '#ffff00');
    } else {
      this.log(`Linha ${arg1} inválida`, '#ff0000');
    }
  }
  
  handleJE(arg1) {
    if (this.compareFlag === 'equal') {
      const lineJE = parseInt(arg1) - 1;
      if (lineJE >= 0 && lineJE < this.programLines.length) {
        this.programCounter = lineJE - 1;
        this.log(`JE ${arg1} → Saltou para linha ${arg1}`, '#00ff00');
      } else {
        this.log(`Linha ${arg1} inválida`, '#ff0000');
      }
    } else {
      this.log(`JE ${arg1} → Não saltou (flag != equal)`, '#ffaa00');
    }
  }
  
  handleJNE(arg1) {
    if (this.compareFlag !== 'equal' && this.compareFlag !== null) {
      const lineJNE = parseInt(arg1) - 1;
      if (lineJNE >= 0 && lineJNE < this.programLines.length) {
        this.programCounter = lineJNE - 1;
        this.log(`JNE ${arg1} → Saltou para linha ${arg1}`, '#00ff00');
      } else {
        this.log(`Linha ${arg1} inválida`, '#ff0000');
      }
    } else {
      this.log(`JNE ${arg1} → Não saltou (flag == equal)`, '#ffaa00');
    }
  }
  
  checkPhaseCompletion() {
    const phase = phases[this.currentPhase];
    
    if (phase.requiredInstructions && phase.requiredInstructions.length > 0) {
      const missingInstructions = phase.requiredInstructions.filter(
        reqInst => !this.executedInstructions.includes(reqInst.toUpperCase())
      );
      
      if (missingInstructions.length > 0) {
        this.log(`Erro: Você deve usar as seguintes instruções: ${missingInstructions.join(', ')}`, '#ff0000');
        return;
      }
    }
    
    if (phase.check(this.scene3D.registers, this.scene3D.memory, this.inputBuffer, this.outputBuffer)) {
      this.totalScore += phase.reward;
      
      const efficiencyBonus = Math.max(0, 100 - this.cycleCount * 5);
      this.totalScore += efficiencyBonus;
      
      document.getElementById('scoreValue').textContent = this.totalScore;
      document.getElementById('successMessage').innerHTML = `
        Você completou: <strong>${phase.title}</strong><br>
        Ciclos usados: ${this.cycleCount}<br>
        Recompensa: ${phase.reward} pontos<br>
        Bônus de eficiência: ${efficiencyBonus} pontos<br>
        <strong style="color: #ffd700;">Pontuação Total: ${this.totalScore}</strong>
        <br><br>
        <em>${phase.theory}</em>
      `;
      document.getElementById('successModal').classList.add('show');
      
      Animations.createSuccessExplosion(this.scene3D.scene, this.scene3D.cpuGroup.position);
      Animations.createParticleEffect(this.scene3D.scene, this.scene3D.registers.R1.position, 0xffd700);
      Animations.createParticleEffect(this.scene3D.scene, this.scene3D.registers.R2.position, 0xffd700);
      Animations.createParticleEffect(this.scene3D.scene, this.scene3D.registers.R3.position, 0x00ffff);
      Animations.createParticleEffect(this.scene3D.scene, this.scene3D.registers.R4.position, 0xff00ff);
      
      setTimeout(() => {
        document.getElementById('successModal').classList.remove('show');
        if (this.currentPhase < theoryQuestions.length) {
          this.showTheoryQuestion(this.currentPhase);
        } else {
          document.getElementById('nextPhaseBtn').style.display = 'block';
        }
      }, 3000);
    }
  }
  
  showTheoryQuestion(questionIndex) {
    const question = theoryQuestions[questionIndex];
    const modal = document.getElementById('theoryQuestionModal');
    const questionText = document.getElementById('theoryQuestionText');
    const optionsContainer = document.getElementById('theoryOptionsContainer');
    const explanation = document.getElementById('theoryExplanation');
    const nextBtn = document.getElementById('theoryNextBtn');
    
    questionText.textContent = question.question;
    optionsContainer.innerHTML = '';
    explanation.classList.remove('show');
    nextBtn.style.display = 'none';
    
    const shuffledOptions = [...question.options];
    const correctAnswer = shuffledOptions[question.correct];
    
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }
    
    const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);
    
    shuffledOptions.forEach((option, index) => {
      const optionBtn = document.createElement('button');
      optionBtn.className = 'option-btn';
      optionBtn.textContent = option;
      optionBtn.addEventListener('click', () => {
        document.querySelectorAll('.option-btn').forEach(btn => {
          btn.disabled = true;
        });
        
        if (index === newCorrectIndex) {
          optionBtn.classList.add('correct');
          explanation.textContent = `✅ Correto! ${question.explanation}`;
          this.totalScore += 50;
          document.getElementById('scoreValue').textContent = this.totalScore;
          this.log(`Pergunta teórica acertada! +50 pontos`, '#ff00ff');
        } else {
          optionBtn.classList.add('incorrect');
          document.querySelectorAll('.option-btn')[newCorrectIndex].classList.add('correct');
          explanation.textContent = `❌ Incorreto. ${question.explanation}`;
          this.log(`Pergunta teórica incorreta`, '#ff0000');
        }
        
        explanation.classList.add('show');
        nextBtn.style.display = 'block';
      });
      
      optionsContainer.appendChild(optionBtn);
    });
    
    modal.classList.add('show');
  }
  
  resetSimulator() {
    this.programCounter = 0;
    this.cycleCount = 0;
    this.isRunning = false;
    this.compareFlag = null;
    this.inputBuffer = [];
    this.outputBuffer = [];
    this.executedInstructions = [];
    
    Object.values(this.scene3D.registers).forEach(reg => {
      reg.value = 0;
      reg.mesh.material.color.setHex(reg.baseColor);
      reg.group.scale.set(1, 1, 1);
      reg.group.rotation.set(0, 0, 0);
    });
    
    this.scene3D.memory.forEach(mem => {
      mem.value = 0;
      mem.mesh.material.color.setHex(mem.baseColor);
      mem.group.position.y = -5;
    });
    
    Object.values(this.scene3D.ioDevices).forEach(device => {
      device.value = 0;
      device.mesh.material.color.setHex(device.baseColor);
      device.group.position.y = device.position.y;
    });
    
    document.getElementById('pcValue').textContent = '0';
    document.getElementById('cyclesValue').textContent = '0';
    document.getElementById('statusValue').textContent = 'Pronto';
    const logContent = document.getElementById('logContent');
    if (logContent) {
      logContent.innerHTML = '';
    }
    
    this.log('Sistema resetado', '#00aaff');
  }
  
  nextPhase() {
    if (this.currentPhase < phases.length - 1) {
      this.currentPhase++;
      this.updatePhaseInfo();
      this.resetSimulator();
      document.getElementById('program').value = '';
      document.getElementById('nextPhaseBtn').style.display = 'none';
    } else {
      alert('Parabéns! Você completou todas as fases!\n\nPontuação Final: ' + this.totalScore);
    }
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    this.scene3D.animate();
  }
}


window.addEventListener('load', () => {
  console.log('Assembly Quest 3D - Inicializando...');
  try {
    window.game = new AssemblyGame();
    console.log('Assembly Quest 3D - Carregado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar o jogo:', error);
  }
});

