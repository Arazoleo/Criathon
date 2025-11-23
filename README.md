# Assembly Quest

Plataforma educacional web interativa para ensino de Arquitetura e Organização de Computadores através de simulações visuais e interativas.

## Links (Demo e Vídeo)

- Vídeo: https://drive.google.com/file/d/1XS3KZfgq3E8uE1DrQKgzLmmw2ThpIH4I/view?usp=sharing

- Demo: https://drive.google.com/file/d/15dFJ0uKgAF8L9moSnNAJB8gsfjISxa-t/view?usp=drive_link

- Deploy (temporário): https://assembly-quest-ysal.vercel.app/

## Desenvolvedores

- Ana Beatriz Ribeiro Garcia
- Bruno de Abreu Correia
- Leonardo Arazo de Oliveira Araújo

## Visão Geral

O Assembly Quest é uma aplicação web que integra múltiplos simuladores educacionais para facilitar o aprendizado de conceitos fundamentais de arquitetura de computadores. A plataforma combina visualizações 3D, execução de código Assembly, e sistema de gamificação através de fases progressivas.

## Simulador Principal: CPU e Assembly

O simulador principal permite aos estudantes escrever e executar código Assembly em uma CPU virtual, observando a execução de instruções em tempo real com visualização 3D dos componentes internos.

### Características Principais

**Conjunto de Instruções Assembly:**
- Operações aritméticas: MOV, ADD, SUB, MUL, DIV, MOD
- Operações de comparação: CMP
- Saltos condicionais: JMP, JE, JNE
- Operações de memória: LOAD, STORE
- Operações de entrada/saída: IN, OUT

**Componentes da CPU Simulada:**
- 8 registradores (R1-R8)
- Memória principal (M0-M255)
- Contador de programa (PC)
- Flags de comparação (equal, greater, less, zero)
- Contador de ciclos de clock

**Sistema de Fases Progressivas:**
- Fase 1: Primeiros Passos - Operações básicas com registradores
- Fase 2: Operações Básicas - Uso da ALU para operações aritméticas
- Fase 3: Multiplicação - Operações mais complexas
- Fase 4: Memória - Operações com memória principal
- Fase 5: Divisão - Operações de divisão
- Fase 6: Saltos Condicionais - Controle de fluxo
- Fase 7: Entrada e Saída - Comunicação com dispositivos externos

**Visualização 3D:**
- Modelos 3D dos componentes da CPU
- Animações mostrando fluxo de dados durante execução
- Visualização de registradores, ALU e barramentos
- Controles de câmera interativos (OrbitControls)

**Interface do Usuário:**
- Editor de código com numeração de linhas
- Painel de status mostrando PC, ciclos e estado atual
- Log de execução detalhado
- Sistema de pontuação baseado em eficiência
- Botões de ajuda e teoria integrados

**Assistente de IA:**
- Integração com Google Gemini 2.5 Flash
- Sistema RAG (Retrieval-Augmented Generation)
- Respostas contextuais baseadas na fase atual
- Interface de chat arrastável e minimizável

## Módulos Adicionais

**Simulador de Memória e Disco:**
Simula a hierarquia completa de memória incluindo registradores, cache L1, RAM e disco. Inclui operações de leitura/escrita em disco, gerenciamento de cache e visualização interativa de setores de disco.

**Simulador de I/O:**
Simula oito dispositivos de entrada e saída (teclado, monitor, impressora, disco, mouse, scanner, webcam e alto-falante) com modelos 3D animados, operações reais e visualização de fluxo de dados.

## Tecnologias Utilizadas

- HTML5, CSS3 e JavaScript ES6+
- Three.js r128 para visualização 3D
- Web Audio API para geração de som
- Canvas API para renderização de texto
- Google Gemini API para assistente de IA
- LocalStorage para persistência de dados

## Requisitos do Sistema

- Navegador moderno com suporte a WebGL (Chrome, Firefox, Safari, Edge)
- JavaScript ES6+ habilitado
- Conexão com internet para uso do assistente de IA (opcional)

## Como Usar

1. Abra o arquivo `index.html` em um navegador web
2. Selecione o simulador desejado no menu principal
3. No simulador de CPU, digite seu código Assembly no editor
4. Clique em "Assemble" para compilar e executar
5. Observe a execução em tempo real na visualização 3D
6. Complete os objetivos de cada fase para avançar

## Estrutura do Projeto

```
Assembly-Quest/
├── index.html              # Menu principal
├── game.html              # Simulador de CPU e Assembly
├── memory-simulator.html  # Simulador de Memória e Disco
├── io-simulator.html      # Simulador de I/O
├── css/
│   └── game.css           # Estilos compartilhados
├── js/
│   ├── game.js            # Lógica do simulador principal
│   ├── gameData.js        # Dados das fases e questões
│   ├── memory-simulator.js # Lógica do simulador de memória
│   ├── io-simulator.js    # Lógica do simulador de I/O
│   ├── ai-assistant.js    # Sistema de assistente de IA
│   ├── ai-chat-ui.js      # Interface do chat de IA
│   ├── scene3d.js         # Renderização 3D
│   └── animations.js      # Animações e efeitos
└── README.md              # Este arquivo
```

## Objetivos Educacionais

O Assembly Quest visa ensinar:
- Arquitetura básica de CPU e execução de instruções
- Linguagem Assembly e conjunto de instruções
- Hierarquia de memória e diferentes tipos de armazenamento
- Operações de entrada e saída
- Conceitos de cache e otimização
- Fluxo de dados em sistemas computacionais
- Ciclos de clock e latência

## Licença

Este projeto é desenvolvido para fins educacionais.
