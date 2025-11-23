

class AIChatUI {
  constructor(assistant, simulatorType = null) {
    this.assistant = assistant;
    this.simulatorType = simulatorType;
    this.isOpen = false;
    this.isMinimized = false;
    
    this.createUI();
    this.attachEventListeners();
    
    
    if (simulatorType) {
      this.assistant.updateContext(simulatorType);
    }
  }

  createUI() {
    
    const container = document.createElement('div');
    container.id = 'aiChatContainer';
    container.className = 'ai-chat-container';
    
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.width = '400px';
    container.style.height = '500px';
    container.style.background = 'rgba(15, 15, 35, 0.98)';
    container.style.border = '2px solid #ff6b9d';
    container.style.borderRadius = '10px';
    container.style.boxShadow = '0 10px 40px rgba(255, 107, 157, 0.3)';
    container.style.display = 'none';
    container.style.flexDirection = 'column';
    container.style.zIndex = '10000';
    container.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    container.style.pointerEvents = 'auto';
    container.style.visibility = 'visible';
    container.style.opacity = '1';
    
    
    container.style.setProperty('position', 'fixed', 'important');
    container.style.setProperty('z-index', '10000', 'important');
    container.style.setProperty('pointer-events', 'auto', 'important');

    
    const header = document.createElement('div');
    header.className = 'ai-chat-header';
    header.style.cssText = `
      background: linear-gradient(135deg, #ff6b9d, #ff8fab);
      padding: 15px;
      border-radius: 8px 8px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: move;
    `;

    const title = document.createElement('div');
    title.innerHTML = '🤖 Assistente de IA';
    title.style.cssText = `
      color: white;
      font-weight: bold;
      font-size: 16px;
    `;

    const controls = document.createElement('div');
    controls.style.cssText = `
      display: flex;
      gap: 10px;
    `;

    const minimizeBtn = document.createElement('button');
    minimizeBtn.innerHTML = '−';
    minimizeBtn.className = 'ai-chat-minimize';
    minimizeBtn.style.cssText = `
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 20px;
      line-height: 1;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.className = 'ai-chat-close';
    closeBtn.style.cssText = `
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 20px;
      line-height: 1;
    `;

    controls.appendChild(minimizeBtn);
    controls.appendChild(closeBtn);
    header.appendChild(title);
    header.appendChild(controls);
    container.appendChild(header);

    
    const messagesContainer = document.createElement('div');
    messagesContainer.id = 'aiChatMessages';
    messagesContainer.className = 'ai-chat-messages';
    messagesContainer.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 15px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;

    
    const welcomeMsg = document.createElement('div');
    welcomeMsg.className = 'ai-message assistant';
    welcomeMsg.innerHTML = `
      <div style="background: rgba(255, 107, 157, 0.2); padding: 10px; border-radius: 8px; color: #f8f8f8;">
        Olá! Sou seu assistente de IA. Como posso ajudar você no simulador?
      </div>
    `;
    messagesContainer.appendChild(welcomeMsg);
    container.appendChild(messagesContainer);

    
    const inputArea = document.createElement('div');
    inputArea.className = 'ai-chat-input-area';
    inputArea.style.cssText = `
      padding: 15px;
      border-top: 1px solid #444;
      display: flex;
      gap: 10px;
    `;

    const input = document.createElement('input');
    input.id = 'aiChatInput';
    input.type = 'text';
    input.placeholder = 'Digite sua pergunta...';
    input.style.cssText = `
      flex: 1;
      padding: 10px;
      background: rgba(26, 26, 46, 0.8);
      border: 1px solid #444;
      border-radius: 5px;
      color: #f8f8f8;
      font-size: 14px;
    `;

    const sendBtn = document.createElement('button');
    sendBtn.id = 'aiChatSend';
    sendBtn.innerHTML = 'Enviar';
    sendBtn.style.cssText = `
      padding: 10px 20px;
      background: linear-gradient(135deg, #ff6b9d, #ff8fab);
      border: none;
      border-radius: 5px;
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.2s;
    `;

    inputArea.appendChild(input);
    inputArea.appendChild(sendBtn);
    container.appendChild(inputArea);

    
    document.body.appendChild(container);
    console.log('Container do chat adicionado ao DOM:', document.body.contains(container));
    console.log('Container criado:', {
      id: container.id,
      className: container.className,
      children: container.children.length,
      style: container.style.cssText
    });
    
    this.container = container;
    this.messagesContainer = messagesContainer;
    this.input = input;
    this.sendBtn = sendBtn;
    this.minimizeBtn = minimizeBtn;
    this.closeBtn = closeBtn;
  }

  attachEventListeners() {
    
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });

    
    this.minimizeBtn.addEventListener('click', () => this.toggleMinimize());

    
    this.closeBtn.addEventListener('click', () => this.close());

    
    let isDragging = false;
    let currentX, currentY, initialX, initialY;
    const header = this.container.querySelector('.ai-chat-header');
    
    header.addEventListener('mousedown', (e) => {
      if (e.target === header || e.target.closest('.ai-chat-header')) {
        isDragging = true;
        initialX = e.clientX - this.container.offsetLeft;
        initialY = e.clientY - this.container.offsetTop;
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        this.container.style.left = currentX + 'px';
        this.container.style.right = 'auto';
        this.container.style.bottom = 'auto';
        this.container.style.top = currentY + 'px';
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  async sendMessage() {
    const message = this.input.value.trim();
    if (!message) return;

    
    this.addMessage(message, 'user');
    this.input.value = '';

    
    const loadingMsg = this.addMessage('Pensando...', 'assistant', true);

    try {
      const response = await this.assistant.sendMessage(message);
      this.removeMessage(loadingMsg);
      this.addMessage(response, 'assistant');
    } catch (error) {
      this.removeMessage(loadingMsg);
      this.addMessage(
        `❌ Erro: ${error.message}`,
        'assistant'
      );
    }
  }

  addMessage(content, role, isLoading = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${role}`;
    
    const isUser = role === 'user';
    messageDiv.style.cssText = `
      display: flex;
      justify-content: ${isUser ? 'flex-end' : 'flex-start'};
      margin-bottom: 10px;
    `;

    const messageContent = document.createElement('div');
    messageContent.style.cssText = `
      max-width: 80%;
      padding: 10px 15px;
      border-radius: 10px;
      background: ${isUser 
        ? 'linear-gradient(135deg, #667eea, #764ba2)' 
        : 'rgba(255, 107, 157, 0.2)'};
      color: #f8f8f8;
      font-size: 14px;
      line-height: 1.5;
      white-space: pre-wrap;
      word-wrap: break-word;
    `;

    if (isLoading) {
      messageContent.innerHTML = '<span class="loading-dots">●</span> <span class="loading-dots">●</span> <span class="loading-dots">●</span>';
      messageDiv.userData = { isLoading: true };
    } else {
      messageContent.textContent = content;
    }

    messageDiv.appendChild(messageContent);
    this.messagesContainer.appendChild(messageDiv);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

    return messageDiv;
  }

  removeMessage(messageDiv) {
    if (messageDiv && messageDiv.parentNode) {
      messageDiv.parentNode.removeChild(messageDiv);
    }
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    if (this.isMinimized) {
      this.container.style.height = '60px';
      this.messagesContainer.style.display = 'none';
      this.container.querySelector('.ai-chat-input-area').style.display = 'none';
    } else {
      this.container.style.height = '500px';
      this.messagesContainer.style.display = 'flex';
      this.container.querySelector('.ai-chat-input-area').style.display = 'flex';
    }
  }

  open() {
    console.log('Abrindo chat...');
    this.isOpen = true;
    if (this.container) {
      
      this.container.style.setProperty('display', 'flex', 'important');
      this.container.style.setProperty('visibility', 'visible', 'important');
      this.container.style.setProperty('opacity', '1', 'important');
      this.container.style.setProperty('z-index', '10000', 'important');
      this.container.style.setProperty('pointer-events', 'auto', 'important');
      
      
      if (!document.body.contains(this.container)) {
        console.warn('Container não está no DOM, adicionando...');
        document.body.appendChild(this.container);
      }
      
      
      setTimeout(() => {
        const computed = window.getComputedStyle(this.container);
        console.log('Chat aberto! Estado do container:', {
          display: computed.display,
          visibility: computed.visibility,
          zIndex: computed.zIndex,
          position: computed.position,
          bottom: computed.bottom,
          right: computed.right,
          width: computed.width,
          height: computed.height,
          opacity: computed.opacity,
          inDOM: document.body.contains(this.container),
          offsetTop: this.container.offsetTop,
          offsetLeft: this.container.offsetLeft,
          offsetWidth: this.container.offsetWidth,
          offsetHeight: this.container.offsetHeight,
          clientWidth: this.container.clientWidth,
          clientHeight: this.container.clientHeight
        });
        
        
        if (computed.display === 'none' || computed.visibility === 'hidden' || computed.opacity === '0') {
          console.warn('Container ainda não visível, forçando...');
          this.container.style.setProperty('display', 'flex', 'important');
          this.container.style.setProperty('visibility', 'visible', 'important');
          this.container.style.setProperty('opacity', '1', 'important');
        }
      }, 50);
      
      
      if (this.messagesContainer) {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
      }
    } else {
      console.error('Container do chat não encontrado!');
    }
  }

  close() {
    console.log('Fechando chat...');
    this.isOpen = false;
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  toggle() {
    console.log('Toggle chamado, isOpen:', this.isOpen);
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  updateContext(phase = null, device = null) {
    this.assistant.updateContext(this.simulatorType, phase, device);
  }
}


window.AIChatUI = AIChatUI;

