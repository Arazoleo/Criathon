
const memorySimulatorData = {
  phases: [
    {
      id: 1,
      title: "Fase 1: Operações Básicas de Disco",
      objective: "Leia o setor 5 do disco e armazene o valor em R1",
      description: "Aprenda a ler dados do disco usando DISK_READ",
      code: "DISK_READ R1, 5",
      expectedResult: "R1 deve conter o valor do setor 5",
      requiredInstructions: ["DISK_READ"],
      difficulty: "Iniciante",
      hints: [
        "Use DISK_READ para ler dados do disco",
        "O primeiro parâmetro é o registrador de destino",
        "O segundo parâmetro é o número do setor"
      ],
      theory: {
        title: "Operações de Disco",
        content: "O disco é um dispositivo de armazenamento não-volátil que usa magnetismo para armazenar dados. As operações de disco são muito mais lentas que a memória RAM, mas oferecem grande capacidade de armazenamento."
      }
    },
    {
      id: 2,
      title: "Fase 2: Escrita em Disco",
      objective: "Escreva o valor 42 no setor 10 do disco",
      description: "Aprenda a escrever dados no disco usando DISK_WRITE",
      code: "MOV R1, 42\nDISK_WRITE R1, 10",
      expectedResult: "O setor 10 deve conter o valor 42",
      requiredInstructions: ["DISK_WRITE"],
      difficulty: "Iniciante",
      hints: [
        "Primeiro mova o valor para um registrador",
        "Use DISK_WRITE para escrever no disco",
        "O primeiro parâmetro é o registrador fonte",
        "O segundo parâmetro é o número do setor"
      ],
      theory: {
        title: "Escrita em Disco",
        content: "A escrita em disco envolve magnetizar pequenas áreas do disco para representar dados. Esta operação é mais lenta que a leitura devido ao processo de magnetização."
      }
    },
    {
      id: 3,
      title: "Fase 3: Operações de Cache",
      objective: "Carregue dados do cache e depois do disco",
      description: "Compare a velocidade entre cache e disco",
      code: "CACHE R1, 100\nDISK_READ R2, 15",
      expectedResult: "R1 e R2 devem conter valores diferentes",
      requiredInstructions: ["CACHE", "DISK_READ"],
      difficulty: "Intermediário",
      hints: [
        "CACHE é muito mais rápido que DISK_READ",
        "Cache armazena cópias dos dados mais acessados",
        "Disco é usado para armazenamento persistente"
      ],
      theory: {
        title: "Hierarquia de Memória",
        content: "A hierarquia de memória organiza diferentes tipos de armazenamento por velocidade e capacidade. Cache é mais rápido que RAM, que é mais rápida que disco."
      }
    },
    {
      id: 4,
      title: "Fase 4: Busca no Disco",
      objective: "Mova o cabeçote para o setor 20 e leia os dados",
      description: "Aprenda sobre operações de busca no disco",
      code: "DISK_SEEK 20\nDISK_READ R1, 20",
      expectedResult: "O cabeçote deve estar no setor 20 e R1 deve conter os dados",
      requiredInstructions: ["DISK_SEEK", "DISK_READ"],
      difficulty: "Intermediário",
      hints: [
        "DISK_SEEK move o cabeçote para um setor específico",
        "A busca consome tempo proporcional à distância",
        "Sempre leia do setor após a busca"
      ],
      theory: {
        title: "Operações de Busca",
        content: "A busca (seek) é o movimento do cabeçote do disco para uma posição específica. O tempo de busca depende da distância percorrida e é uma das principais causas de latência em operações de disco."
      }
    },
    {
      id: 5,
      title: "Fase 5: Hierarquia Completa",
      objective: "Use toda a hierarquia: registradores → cache → RAM → disco",
      description: "Integre todas as camadas da hierarquia de memória",
      code: "MOV R1, 100\nSTORE R1, 200\nCACHE R2, 200\nDISK_WRITE R2, 25",
      expectedResult: "Todos os níveis devem conter o valor 100",
      requiredInstructions: ["STORE", "CACHE", "DISK_WRITE"],
      difficulty: "Avançado",
      hints: [
        "MOV armazena em registradores (mais rápido)",
        "STORE armazena na RAM",
        "CACHE carrega do cache",
        "DISK_WRITE armazena no disco (mais lento)"
      ],
      theory: {
        title: "Integração da Hierarquia",
        content: "Um sistema eficiente usa toda a hierarquia de memória. Dados frequentemente acessados ficam no cache, dados ativos na RAM, e dados persistentes no disco."
      }
    },
    {
      id: 6,
      title: "Fase 6: Operações Aritméticas",
      objective: "Realize cálculos com múltiplas operações",
      description: "Pratique operações aritméticas básicas",
      code: "MOV R1, 10\nMOV R2, 5\nADD R1, R2\nMUL R1, 2",
      expectedResult: "R1 deve conter 30 (10 + 5 = 15, 15 * 2 = 30)",
      difficulty: "Iniciante",
      hints: [
        "ADD soma dois valores",
        "MUL multiplica dois valores",
        "SUB subtrai dois valores",
        "DIV divide dois valores"
      ],
      theory: {
        title: "Operações Aritméticas",
        content: "As operações aritméticas são executadas diretamente nos registradores da CPU, tornando-as extremamente rápidas. São a base de qualquer computação."
      }
    }
  ],
  
  instructions: {
    
    'MOV': {
      syntax: 'MOV Rx, valor',
      description: 'Move um valor para o registrador Rx',
      example: 'MOV R1, 100',
      timing: '1 ciclo',
      category: 'Movimento'
    },
    
    
    'ADD': {
      syntax: 'ADD Rx, Ry',
      description: 'Adiciona o valor de Ry a Rx',
      example: 'ADD R1, R2',
      timing: '1 ciclo',
      category: 'Aritmética'
    },
    'SUB': {
      syntax: 'SUB Rx, Ry',
      description: 'Subtrai o valor de Ry de Rx',
      example: 'SUB R1, R2',
      timing: '1 ciclo',
      category: 'Aritmética'
    },
    'MUL': {
      syntax: 'MUL Rx, Ry',
      description: 'Multiplica Rx por Ry',
      example: 'MUL R1, R2',
      timing: '3 ciclos',
      category: 'Aritmética'
    },
    'DIV': {
      syntax: 'DIV Rx, Ry',
      description: 'Divide Rx por Ry',
      example: 'DIV R1, R2',
      timing: '5 ciclos',
      category: 'Aritmética'
    },
    'MOD': {
      syntax: 'MOD Rx, Ry',
      description: 'Calcula o resto da divisão de Rx por Ry',
      example: 'MOD R1, R2',
      timing: '5 ciclos',
      category: 'Aritmética'
    },
    
    
    'CMP': {
      syntax: 'CMP Rx, Ry',
      description: 'Compara Rx com Ry e define as flags',
      example: 'CMP R1, R2',
      timing: '1 ciclo',
      category: 'Comparação'
    },
    
    
    'JMP': {
      syntax: 'JMP linha',
      description: 'Salta incondicionalmente para a linha especificada',
      example: 'JMP 5',
      timing: '2 ciclos',
      category: 'Salto'
    },
    'JE': {
      syntax: 'JE linha',
      description: 'Salta se os valores comparados forem iguais',
      example: 'JE 5',
      timing: '2 ciclos',
      category: 'Salto'
    },
    'JNE': {
      syntax: 'JNE linha',
      description: 'Salta se os valores comparados forem diferentes',
      example: 'JNE 5',
      timing: '2 ciclos',
      category: 'Salto'
    },
    
    
    'LOAD': {
      syntax: 'LOAD Rx, endereço',
      description: 'Carrega um valor da memória RAM para o registrador Rx',
      example: 'LOAD R1, 100',
      timing: '100ns',
      category: 'Memória'
    },
    'STORE': {
      syntax: 'STORE Rx, endereço',
      description: 'Armazena o valor do registrador Rx na memória RAM',
      example: 'STORE R1, 200',
      timing: '100ns',
      category: 'Memória'
    },
    'CACHE': {
      syntax: 'CACHE Rx, endereço',
      description: 'Carrega dados do cache para o registrador Rx',
      example: 'CACHE R1, 50',
      timing: '1ns',
      category: 'Cache'
    },
    
    
    'DISK_READ': {
      syntax: 'DISK_READ Rx, setor',
      description: 'Lê dados de um setor específico do disco',
      example: 'DISK_READ R1, 5',
      timing: '10ms',
      category: 'Disco'
    },
    'DISK_WRITE': {
      syntax: 'DISK_WRITE Rx, setor',
      description: 'Escreve dados do registrador Rx em um setor do disco',
      example: 'DISK_WRITE R1, 10',
      timing: '10ms',
      category: 'Disco'
    },
    'DISK_SEEK': {
      syntax: 'DISK_SEEK setor',
      description: 'Move o cabeçote do disco para um setor específico',
      example: 'DISK_SEEK 15',
      timing: '0.5ms por setor',
      category: 'Disco'
    },
    'DISK_STATUS': {
      syntax: 'DISK_STATUS Rx',
      description: 'Verifica o status do disco (0=pronto, 1=ocupado)',
      example: 'DISK_STATUS R1',
      timing: '1μs',
      category: 'Disco'
    },
    
    
    'CACHE_FLUSH': {
      syntax: 'CACHE_FLUSH',
      description: 'Limpa o cache, forçando escrita de dados modificados',
      example: 'CACHE_FLUSH',
      timing: '1ms',
      category: 'Cache'
    },
    'CACHE_INVALIDATE': {
      syntax: 'CACHE_INVALIDATE endereço',
      description: 'Invalida uma entrada específica do cache',
      example: 'CACHE_INVALIDATE 100',
      timing: '1ns',
      category: 'Cache'
    },
    
    
    'IN': {
      syntax: 'IN Rx, dispositivo',
      description: 'Lê dados de um dispositivo de entrada',
      example: 'IN R1, 0',
      timing: 'Variável',
      category: 'E/S'
    },
    'OUT': {
      syntax: 'OUT Rx, dispositivo',
      description: 'Escreve dados em um dispositivo de saída',
      example: 'OUT R1, 1',
      timing: 'Variável',
      category: 'E/S'
    }
  },
  
  memoryLevels: {
    registers: {
      name: 'Registradores',
      capacity: '32 bytes',
      speed: '1ns',
      cost: 'Muito Alto',
      volatility: 'Volátil',
      description: 'Unidades de memória mais rápidas, localizadas dentro da CPU. Armazenam dados que estão sendo processados no momento.'
    },
    cache: {
      name: 'Cache L1',
      capacity: '64 KB',
      speed: '1ns',
      cost: 'Alto',
      volatility: 'Volátil',
      description: 'Memória pequena e rápida que armazena cópias dos dados mais acessados da RAM. Reduz o tempo de acesso à memória principal.'
    },
    ram: {
      name: 'RAM',
      capacity: '8 GB',
      speed: '100ns',
      cost: 'Médio',
      volatility: 'Volátil',
      description: 'Memória principal que armazena dados e programas em execução. Mais lenta que cache mas muito mais rápida que disco.'
    },
    disk: {
      name: 'Disco',
      capacity: '1 TB',
      speed: '10ms',
      cost: 'Baixo',
      volatility: 'Não-volátil',
      description: 'Armazenamento persistente usando magnetismo. Muito mais lento que RAM mas oferece grande capacidade e persistência de dados.'
    }
  },
  
  diskInfo: {
    sectors: 64,
    sectorSize: '512 bytes',
    rotationSpeed: '7200 RPM',
    seekTime: '8.5ms',
    transferRate: '150 MB/s',
    description: 'Disco rígido mecânico com cabeçote móvel e pratos magnéticos. O tempo de acesso depende da posição do cabeçote.'
  },
  
  challenges: [
    {
      id: 1,
      title: "Otimização de Cache",
      description: "Implemente um algoritmo que maximize o uso do cache",
      difficulty: "Avançado",
      points: 200,
      objective: "Alcance uma taxa de cache hit superior a 80%"
    },
    {
      id: 2,
      title: "Desfragmentação",
      description: "Crie um algoritmo para desfragmentar dados no disco",
      difficulty: "Intermediário",
      points: 150,
      objective: "Organize os dados do disco em setores contíguos"
    },
    {
      id: 3,
      title: "Sistema de Arquivos",
      description: "Implemente operações básicas de sistema de arquivos",
      difficulty: "Avançado",
      points: 300,
      objective: "Crie, leia e delete arquivos virtuais"
    },
    {
      id: 4,
      title: "Otimização de Acesso",
      description: "Minimize o tempo total de acesso à memória",
      difficulty: "Avançado",
      points: 250,
      objective: "Reduza o tempo total de execução em 50%"
    },
    {
      id: 5,
      title: "Busca Eficiente",
      description: "Implemente uma busca binária no disco",
      difficulty: "Intermediário",
      points: 180,
      objective: "Encontre um valor em menos de 10 buscas"
    }
  ],
  
  concepts: [
    {
      id: 1,
      title: "Hierarquia de Memória",
      description: "Organização de diferentes tipos de memória por velocidade e capacidade",
      level: "Iniciante",
      content: "A hierarquia de memória é fundamental na arquitetura de computadores. Ela organiza a memória em níveis, desde os registradores (mais rápidos e menores) até o disco (mais lento e maior). O objetivo é oferecer a ilusão de uma memória que é simultaneamente rápida e grande."
    },
    {
      id: 2,
      title: "Cache",
      description: "Memória rápida que armazena cópias de dados frequentemente acessados",
      level: "Iniciante",
      content: "O cache funciona armazenando cópias dos dados mais recentemente acessados da RAM. Quando a CPU precisa de um dado, primeiro verifica o cache (muito rápido). Se não encontrar (cache miss), busca na RAM e copia para o cache."
    },
    {
      id: 3,
      title: "Operações de Disco",
      description: "Leitura, escrita e busca em dispositivos de armazenamento",
      level: "Intermediário",
      content: "As operações de disco envolvem movimentação mecânica do cabeçote. O tempo total de acesso é a soma do tempo de busca (seek time), tempo de rotação (rotational latency) e tempo de transferência (transfer time)."
    },
    {
      id: 4,
      title: "Localidade de Referência",
      description: "Princípio que explica por que o cache é eficaz",
      level: "Intermediário",
      content: "A localidade de referência descreve a tendência dos programas acessarem dados próximos (espacialmente) e em sequência (temporalmente). Isso permite que o cache seja eficaz, pois dados próximos são carregados juntos."
    },
    {
      id: 5,
      title: "Desfragmentação",
      description: "Reorganização de dados no disco para melhorar o desempenho",
      level: "Avançado",
      content: "A desfragmentação reorganiza os dados no disco para que estejam em setores contíguos. Isso reduz o tempo de busca necessário para acessar um arquivo, melhorando o desempenho geral do sistema."
    }
  ]
};

