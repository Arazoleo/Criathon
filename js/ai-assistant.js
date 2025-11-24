

class AIAssistant {
  constructor() {
    this.conversationHistory = [];
    this.context = {
      simulator: null, 
      currentPhase: null,
      device: null,
      userActions: []
    };
    
    
    this.knowledgeBase = {
      memory: {
        concepts: [
          "Hierarquia de memória: Registradores → Cache → RAM → Disco",
          "MOV armazena dados em registradores (mais rápido)",
          "STORE armazena dados na RAM",
          "CACHE carrega dados do cache",
          "DISK_READ lê dados do disco",
          "DISK_WRITE escreve dados no disco",
          "DISK_SEEK move o cabeçote para um setor específico",
          "Registradores são a memória mais rápida e menor",
          "Cache L1 é rápido mas limitado",
          "RAM tem mais capacidade mas é mais lenta",
          "Disco é o mais lento mas tem maior capacidade"
        ],
        phases: [
          {
            id: 1,
            title: "Fase 1: Movimentação Básica",
            commands: ["MOV R1, 100"],
            description: "Aprenda a mover dados para registradores"
          },
          {
            id: 2,
            title: "Fase 2: Armazenamento na RAM",
            commands: ["MOV R1, 100", "STORE R1, 200"],
            description: "Armazene dados na memória RAM"
          },
          {
            id: 3,
            title: "Fase 3: Cache",
            commands: ["MOV R1, 100", "STORE R1, 200", "CACHE R1, 200"],
            description: "Use o cache para acesso rápido"
          },
          {
            id: 4,
            title: "Fase 4: Busca no Disco",
            commands: ["DISK_SEEK 20", "DISK_READ R1, 20"],
            description: "Mova o cabeçote e leia dados do disco"
          },
          {
            id: 5,
            title: "Fase 5: Hierarquia Completa",
            commands: ["MOV R1, 100", "STORE R1, 200", "CACHE R1, 200", "DISK_WRITE R1, 25"],
            description: "Use toda a hierarquia de memória"
          }
        ]
      },
      io: {
        devices: [
          {
            name: "keyboard",
            description: "Dispositivo de entrada. Use o campo de texto para digitar e enviar dados.",
            operations: ["Enviar texto", "Receber dados"]
          },
          {
            name: "monitor",
            description: "Dispositivo de saída. Exibe texto na tela em tempo real.",
            operations: ["Exibir texto", "Limpar tela"]
          },
          {
            name: "printer",
            description: "Dispositivo de saída. Imprime documentos com texto real no papel.",
            operations: ["Imprimir documento"]
          },
          {
            name: "disk",
            description: "Controlador de disco com DMA. Acessa setores específicos.",
            operations: ["Ler setor", "Escrever setor"]
          },
          {
            name: "mouse",
            description: "Dispositivo de entrada. Simula cliques e scroll.",
            operations: ["Clique esquerdo", "Clique direito", "Scroll"]
          },
          {
            name: "scanner",
            description: "Dispositivo de entrada. Digitaliza documentos com diferentes resoluções.",
            operations: ["Digitalizar (300/600/1200 DPI)"]
          },
          {
            name: "webcam",
            description: "Dispositivo de entrada. Captura vídeo e fotos com flash.",
            operations: ["Iniciar transmissão", "Parar transmissão", "Capturar foto"]
          },
          {
            name: "speaker",
            description: "Dispositivo de saída. Reproduz áudio real com controle de volume.",
            operations: ["Reproduzir som", "Parar som", "Ajustar volume"]
          }
        ],
        concepts: [
          "I/O usa interrupções para comunicação",
          "DMA (Direct Memory Access) permite transferência direta",
          "Buffers armazenam dados temporariamente",
          "Cada dispositivo tem seu próprio buffer",
          "Operações de I/O podem ser síncronas ou assíncronas"
        ]
      },
      assembly: {
        concepts: [
          "Assembly é uma linguagem de baixo nível",
          "MOV Rx, valor - Move um valor para o registrador",
          "ADD Rx, Ry, Rz - Soma Ry e Rz, armazena em Rx",
          "SUB Rx, Ry, Rz - Subtrai Rz de Ry, armazena em Rx",
          "MUL Rx, Ry, Rz - Multiplica Ry por Rz, armazena em Rx",
          "DIV Rx, Ry, Rz - Divide Ry por Rz, armazena em Rx",
          "CMP Rx, Ry - Compara Rx com Ry",
          "JE label - Salta para label se igual",
          "JMP label - Salta incondicionalmente para label",
          "Registradores (R1, R2, etc.) armazenam valores temporários",
          "Memória (M0, M1, etc.) armazena dados persistentes",
          "IN0 e OUT0 são portas de entrada e saída",
          "Labels marcam posições no código",
          "Loops usam JMP e comparações"
        ],
        phases: [
          {
            id: 1,
            title: "Fase 1: Primeiros Passos",
            objective: "Faça R1 = 8",
            commands: ["MOV R1, 8"],
            description: "Aprenda a usar o comando MOV para mover valores para registradores"
          },
          {
            id: 2,
            title: "Fase 2: Operações Básicas",
            objective: "Faça R1 = 15 usando ADD",
            commands: ["MOV R2, 10", "MOV R3, 5", "ADD R1, R2, R3"],
            description: "Use a instrução ADD para realizar adição"
          },
          {
            id: 3,
            title: "Fase 3: Multiplicação",
            objective: "Faça R1 = 20 usando MUL",
            commands: ["MOV R2, 4", "MOV R3, 5", "MUL R1, R2, R3"],
            description: "Use a instrução MUL para multiplicação"
          },
          {
            id: 4,
            title: "Fase 4: Memória",
            objective: "Armazene 42 em M0",
            commands: ["MOV R1, 42", "STORE R1, M0"],
            description: "Armazene dados na memória principal"
          },
          {
            id: 5,
            title: "Fase 5: Divisão",
            objective: "Faça R1 = 5 usando DIV (20 / 4)",
            commands: ["MOV R2, 20", "MOV R3, 4", "DIV R1, R2, R3"],
            description: "Use a instrução DIV para divisão"
          },
          {
            id: 6,
            title: "Fase 6: Saltos Condicionais",
            objective: "Use CMP e JE para fazer R1 = 100",
            commands: ["MOV R1, 50", "CMP R1, 50", "JE set_100", "JMP end", "set_100:", "MOV R1, 100", "end:"],
            description: "Use comparações e saltos condicionais"
          },
          {
            id: 7,
            title: "Fase 7: Entrada e Saída (E/S)",
            objective: "Leia de IN0, some 10 e envie para OUT0",
            commands: ["IN R1, IN0", "MOV R2, 10", "ADD R1, R1, R2", "OUT R1, OUT0"],
            description: "Use portas de entrada e saída"
          }
        ]
      }
    };
  }

  
  updateContext(simulator, phase = null, device = null) {
    this.context.simulator = simulator;
    this.context.currentPhase = phase;
    this.context.device = device;
  }

  
  addUserAction(action) {
    this.context.userActions.push({
      action: action,
      timestamp: Date.now()
    });
    
    if (this.context.userActions.length > 10) {
      this.context.userActions.shift();
    }
  }

  
  retrieveRelevantInfo(query) {
    // Validação: garantir que query não é undefined ou null
    if (!query || typeof query !== 'string') {
      console.warn('Query inválida no retrieveRelevantInfo:', query);
      return [];
    }
    
    const queryLower = query.toLowerCase();
    const relevantInfo = [];
    
    if (this.context.simulator) {
      const kb = this.knowledgeBase[this.context.simulator];
      if (kb) {
        
        if (kb.concepts) {
          kb.concepts.forEach(concept => {
            if (concept && typeof concept === 'string') {
              if (concept.toLowerCase().includes(queryLower) || 
                  queryLower.split(' ').some(word => concept.toLowerCase().includes(word))) {
                relevantInfo.push(concept);
              }
            }
          });
        }
        
        
        if (kb.devices) {
          kb.devices.forEach(device => {
            if (device && device.name && device.description) {
              if (device.name.toLowerCase().includes(queryLower) ||
                  device.description.toLowerCase().includes(queryLower)) {
                relevantInfo.push(`${device.name}: ${device.description}`);
                if (device.operations) {
                  relevantInfo.push(`Operações: ${device.operations.join(', ')}`);
                }
              }
            }
          });
        }
        
        
        if (kb.phases) {
          if (this.context.currentPhase) {
            const phase = kb.phases.find(p => p.id === this.context.currentPhase);
            if (phase) {
              if (phase.title) relevantInfo.push(`Fase atual: ${phase.title}`);
              if (phase.objective) relevantInfo.push(`Objetivo: ${phase.objective}`);
              if (phase.description) relevantInfo.push(`Descrição: ${phase.description}`);
              if (phase.commands) {
                relevantInfo.push(`Comandos sugeridos: ${phase.commands.join(', ')}`);
              }
            }
          }
          
          kb.phases.forEach(phase => {
            if (phase) {
              const titleMatch = phase.title && phase.title.toLowerCase().includes(queryLower);
              const objectiveMatch = phase.objective && phase.objective.toLowerCase().includes(queryLower);
              const descriptionMatch = phase.description && phase.description.toLowerCase().includes(queryLower);
              
              if (titleMatch || objectiveMatch || descriptionMatch) {
                relevantInfo.push(`Fase relacionada: ${phase.title || 'Sem título'} - ${phase.objective || 'Sem objetivo'}`);
              }
            }
          });
        }
      }
    }
    
    return relevantInfo;
  }

  
  buildPrompt(userQuery) {
    const relevantInfo = this.retrieveRelevantInfo(userQuery);
    
    let prompt = `Você é um assistente especializado em Assembly e arquitetura de computadores, ajudando estudantes a usar simuladores educacionais.

CONTEXTO ATUAL:
- Simulador: ${this.context.simulator || 'Nenhum'}
- Fase: ${this.context.currentPhase || 'N/A'}
- Dispositivo selecionado: ${this.context.device || 'Nenhum'}

INFORMAÇÕES RELEVANTES DO RAG:
${relevantInfo.length > 0 ? relevantInfo.map((info, i) => `${i + 1}. ${info}`).join('\n') : 'Nenhuma informação específica encontrada.'}

HISTÓRICO DE AÇÕES RECENTES:
${this.context.userActions.slice(-5).map(a => `- ${a.action}`).join('\n') || 'Nenhuma ação recente'}

INSTRUÇÕES:
- Responda em português brasileiro
- Seja claro, didático e encorajador
- Use exemplos práticos quando possível
- Se o usuário estiver em uma fase específica, ajude com os comandos necessários
- Se estiver usando um dispositivo I/O, explique como usá-lo
- Se não souber algo específico, seja honesto mas ofereça ajuda geral

PERGUNTA DO USUÁRIO:
${userQuery}

RESPOSTA:`;

    return prompt;
  }

  
  async sendMessage(userQuery) {
    const prompt = this.buildPrompt(userQuery);
    
    this.conversationHistory.push({
      role: 'user',
      content: userQuery,
      timestamp: Date.now()
    });

    try {
      const response = await fetch('/api/gemini-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erro ao comunicar com a API do Gemini');
      }

      const data = await response.json();
      const aiResponse = data.candidates[0]?.content?.parts[0]?.text || 
                        'Desculpe, não consegui gerar uma resposta.';

      this.conversationHistory.push({
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now()
      });

      this.addUserAction(`Perguntou: ${userQuery.substring(0, 50)}...`);

      return aiResponse;
    } catch (error) {
      console.error('Erro ao comunicar com Gemini:', error);
      throw error;
    }
  }

  
  clearHistory() {
    this.conversationHistory = [];
  }

  
  getHistory() {
    return this.conversationHistory;
  }
}


window.AIAssistant = AIAssistant;

