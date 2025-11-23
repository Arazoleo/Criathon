const phases = [
  {
    title: 'Fase 1: Primeiros Passos',
    objective: 'Faça R1 = 8',
    check: (registers) => registers.R1.value === 8,
    requiredInstructions: [],
    reward: 100,
    theory: 'Nesta fase, você aprenderá sobre registradores - as unidades de memória mais rápidas dentro da CPU.'
  },
  {
    title: 'Fase 2: Operações Básicas',
    objective: 'Faça R1 = 15 usando ADD',
    check: (registers) => registers.R1.value === 15,
    requiredInstructions: ['ADD'],
    reward: 150,
    theory: 'Aqui você usará a ALU (Unidade Lógica Aritmética) para realizar operações matemáticas.'
  },
  {
    title: 'Fase 3: Multiplicação',
    objective: 'Faça R1 = 20 usando MUL',
    check: (registers) => registers.R1.value === 20,
    requiredInstructions: ['MUL'],
    reward: 200,
    theory: 'Multiplicação é uma operação mais complexa que pode exigir múltiplos ciclos de clock.'
  },
  {
    title: 'Fase 4: Memória',
    objective: 'Armazene 42 em M0',
    check: (registers, memory) => memory[0].value === 42,
    requiredInstructions: ['STORE'],
    reward: 250,
    theory: 'A memória principal (RAM) armazena dados e programas. É mais lenta que registradores, mas com maior capacidade.'
  },
  {
    title: 'Fase 5: Divisão',
    objective: 'Faça R1 = 5 usando DIV (20 / 4)',
    check: (registers) => registers.R1.value === 5,
    requiredInstructions: ['DIV'],
    reward: 300,
    theory: 'Divisão é uma das operações mais complexas para uma CPU, especialmente com números grandes.'
  },
  {
    title: 'Fase 6: Saltos Condicionais',
    objective: 'Use CMP e JE para fazer R1 = 100',
    check: (registers) => registers.R1.value === 100,
    requiredInstructions: ['CMP', 'JE'],
    reward: 400,
    theory: 'Saltos condicionais permitem que programas tomem decisões baseadas em comparações.'
  },
  {
    title: 'Fase 7: Entrada e Saída (E/S)',
    objective: 'Leia de IN0, some 10 e envie para OUT0',
    check: (registers, memory, inputBuffer, outputBuffer) => {
      if (inputBuffer.length === 0) return false;
      const expected = inputBuffer[0] + 10;
      return outputBuffer.includes(expected);
    },
    requiredInstructions: ['IN', 'OUT'],
    reward: 500,
    theory: 'Dispositivos de E/S permitem comunicação com o mundo externo. Podem usar portas mapeadas ou acesso direto à memória (DMA).'
  }
];

const theoryQuestions = [
  {
    question: "Qual é a função dos registradores em uma CPU?",
    options: [
      "Armazenar dados temporariamente para operações rápidas",
      "Substituir a memória RAM",
      "Controlar dispositivos de E/S",
      "Executar operações de rede"
    ],
    correct: 0,
    explanation: "Os registradores são memórias muito rápidas localizadas dentro da CPU, usadas para armazenar dados temporariamente durante operações."
  },
  {
    question: "O que é a memória cache?",
    options: [
      "Uma memória pequena e rápida que armazena dados frequentemente acessados",
      "Um tipo de memória ROM",
      "Memória usada apenas para armazenar programas",
      "Memória volátil de grande capacidade"
    ],
    correct: 0,
    explanation: "A memória cache é uma memória pequena e muito rápida que armazena dados frequentemente acessados para reduzir o tempo de acesso à memória principal."
  },
  {
    question: "Qual a diferença entre memória RAM e ROM?",
    options: [
      "RAM é volátil e de leitura/escrita, ROM é não volátil e somente leitura",
      "RAM é mais lenta que ROM",
      "ROM é usada para memória principal, RAM para firmware",
      "RAM é não volátil, ROM é volátil"
    ],
    correct: 0,
    explanation: "A RAM (Random Access Memory) é volátil (perde dados sem energia) e permite leitura e escrita. A ROM (Read-Only Memory) é não volátil e geralmente somente leitura."
  },
  {
    question: "O que é um barramento de sistema?",
    options: [
      "Conjunto de linhas de comunicação que conecta CPU, memória e E/S",
      "Um tipo de memória cache",
      "Um dispositivo de entrada e saída",
      "Um protocolo de rede"
    ],
    correct: 0,
    explanation: "O barramento do sistema é um conjunto de linhas de comunicação (dados, endereços e controle) que interconecta a CPU, memória e dispositivos de E/S."
  },
  {
    question: "Qual a função do barramento de endereços?",
    options: [
      "Identificar a localização na memória ou dispositivo de E/S",
      "Transportar dados entre componentes",
      "Controlar o timing das operações",
      "Fornecer energia aos componentes"
    ],
    correct: 0,
    explanation: "O barramento de endereços é usado para identificar a localização (endereço) na memória ou em um dispositivo de E/S que será acessado."
  },
  {
    question: "O que são dispositivos de E/S mapeados em memória?",
    options: [
      "Dispositivos que usam endereços de memória para comunicação",
      "Dispositivos que não usam barramento",
      "Dispositivos que só funcionam com cache",
      "Dispositivos que usam apenas portas seriais"
    ],
    correct: 0,
    explanation: "Dispositivos de E/S mapeados em memória usam o mesmo espaço de endereçamento da memória, permitindo que instruções de acesso à memória sejam usadas para E/S."
  },
  {
    question: "Qual a vantagem do acesso direto à memória (DMA)?",
    options: [
      "Permite que dispositivos acessem memória sem envolver a CPU",
      "Torna a CPU mais rápida",
      "Aumenta o tamanho da memória RAM",
      "Substitui a necessidade de barramento"
    ],
    correct: 0,
    explanation: "O DMA (Direct Memory Access) permite que dispositivos de E/S acessem a memória diretamente, sem a intervenção da CPU, liberando-a para outras tarefas."
  }
];

