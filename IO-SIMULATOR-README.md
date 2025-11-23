#  Simulador de Entrada e Saída (I/O) 3D - Assembly Quest

## Visão Geral

O **Simulador de Entrada e Saída (I/O) 3D** é um módulo educacional interativo que permite aos alunos compreender como os dispositivos de entrada e saída funcionam em um sistema de computação moderno. Utilizando visualização 3D com **Three.js**, o simulador oferece uma experiência imersiva e intuitiva para aprender conceitos fundamentais de I/O.

## Características Principais

###  Dispositivos Simulados

#### 1. **Teclado (Keyboard)**
- **Tipo:** Dispositivo de Entrada
- **Conceitos:** Interrupções, Buffers de Entrada, Polling
- **Simulação:** 
  - Entrada de dados com geração de interrupções
  - Buffer circular para armazenar caracteres
  - Visualização 3D de teclas sendo pressionadas

#### 2. **Monitor (Display)**
- **Tipo:** Dispositivo de Saída
- **Conceitos:** Memory-Mapped I/O, Buffer de Vídeo, Refresh Rate
- **Simulação:**
  - Mapeamento de memória para escrita de dados
  - Animação de brilho indicando atividade
  - Visualização de dados sendo renderizados

#### 3. **Impressora (Printer)**
- **Tipo:** Dispositivo de Saída
- **Conceitos:** Spooling, Estado do Dispositivo, Transferência de Dados
- **Simulação:**
  - Fila de impressão (spool)
  - Estados: Pronto, Imprimindo, Ocupado
  - Simulação de tempo de impressão

#### 4. **Controlador de Disco (Disk Controller)**
- **Tipo:** Dispositivo de I/O (Armazenamento)
- **Conceitos:** DMA (Direct Memory Access), Latência, Transferência de Blocos
- **Simulação:**
  - Acesso direto à memória (DMA)
  - Rotação do prato do disco
  - Movimento da cabeça de leitura/escrita
  - Transferência de blocos de dados

## Interface do Usuário

### Painel Superior
- **Título:** Exibe o nome do simulador
- **Estatísticas em Tempo Real:**
  - Dispositivos Ativos
  - Número de Operações
  - Taxa de Transferência (KB/s)

### Painel Esquerdo
- **Lista de Dispositivos:** Clique para selecionar um dispositivo
- **Controles:**
  - Enviar Dados
  - Receber Dados
  - Limpar Buffer
  - Resetar Sistema

### Painel Direito
- **Estatísticas:**
  - Latência Média (ms)
  - Taxa de Erro (%)
  - Bytes Transferidos
  - Contagem de Interrupções
- **Detalhes do Dispositivo:** Informações do dispositivo selecionado
- **Log de Eventos:** Histórico de operações do sistema

## Conceitos Educacionais

### 1. **Interrupções (Interrupts)**
As interrupções são sinais que indicam que um dispositivo de I/O necessita atenção da CPU. O simulador demonstra como as interrupções são geradas e processadas.

**Exemplo:** Quando você clica em "Enviar Dados", uma interrupção é gerada e adicionada à fila de interrupções.

### 2. **Buffers Circulares (Circular Buffers)**
Estrutura de dados que permite armazenar dados de forma eficiente, reutilizando espaço de memória.

**Implementação:** Cada dispositivo possui um buffer circular que armazena dados temporariamente.

### 3. **DMA (Direct Memory Access)**
Técnica que permite que dispositivos de I/O acessem a memória diretamente, sem envolver a CPU.

**Simulação:** O Controlador de Disco utiliza DMA para transferências de dados de alta velocidade.

### 4. **Memory-Mapped I/O**
Técnica onde endereços de memória são mapeados para registros de dispositivos de I/O.

**Simulação:** O Monitor utiliza memory-mapped I/O para escrita de dados de vídeo.

### 5. **Polling vs. Interrupt-Driven I/O**
- **Polling:** CPU verifica periodicamente o status do dispositivo
- **Interrupt-Driven:** Dispositivo notifica a CPU quando está pronto

**Simulação:** O simulador demonstra ambas as abordagens.

## Como Usar

### Passo 1: Selecionar um Dispositivo
Clique em um dos dispositivos no painel esquerdo ou diretamente no modelo 3D para selecioná-lo.

### Passo 2: Enviar Dados
Clique em "Enviar Dados" para enviar dados para o dispositivo selecionado. O tamanho dos dados é aleatório entre 64 e 320 bytes.

### Passo 3: Receber Dados
Clique em "Receber Dados" para ler dados do buffer do dispositivo.

### Passo 4: Monitorar Estatísticas
Observe as estatísticas em tempo real no painel direito e no painel superior.

### Passo 5: Resetar
Clique em "Resetar" para limpar todos os buffers e reiniciar o sistema.

## Arquitetura Técnica

### Arquivos Principais

#### `io-simulator.html`
Arquivo HTML principal que define a estrutura da página, incluindo:
- Canvas 3D para visualização
- Painéis de UI (superior, esquerdo, direito)
- Elementos de controle

#### `js/io-simulator.js`
Classe principal `IO3DVisualizer` que gerencia:
- Inicialização do Three.js
- Criação dos modelos 3D
- Interação com o usuário
- Atualização da UI

#### `js/io-simulator-advanced.js`
Lógica avançada de simulação:
- `IOSimulationEngine`: Motor de simulação principal
- `IODevice`: Classe base para dispositivos
- `CircularBuffer`: Implementação de buffer circular
- `DMAController`: Controlador de DMA
- `MemoryMappedIO`: Simulação de memory-mapped I/O

### Fluxo de Dados

```
Usuário
  ↓
Interface (HTML/CSS)
  ↓
IO3DVisualizer (Visualização 3D)
  ↓
IOSimulationEngine (Lógica de Simulação)
  ↓
Dispositivos (IODevice)
  ↓
Buffers (CircularBuffer)
  ↓
Controladores (DMA, Memory-Mapped I/O)
```

## Estrutura de Dados

### IODevice
```javascript
{
  name: string,
  status: 'READY' | 'BUSY' | 'PRINTING' | 'DATA_AVAILABLE',
  buffer: CircularBuffer,
  bufferSize: number,
  totalBytesTransferred: number,
  operationCount: number,
  latencies: number[],
  lastOperationTime: number
}
```

### CircularBuffer
```javascript
{
  capacity: number,
  buffer: Array,
  head: number,
  tail: number,
  count: number
}
```

### DMA Transfer Request
```javascript
{
  id: number,
  device: string,
  operation: 'READ' | 'WRITE',
  blockNumber: number,
  blockCount: number,
  dataSize: number,
  status: 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED',
  startTime: number,
  completionTime: number,
  progress: number
}
```

## Estatísticas e Métricas

### Estatísticas Globais
- **Operações Totais:** Número total de operações de I/O
- **Bytes Transferidos:** Total de dados transferidos
- **Contagem de Interrupções:** Número de interrupções processadas
- **Latência Média:** Tempo médio de latência
- **Taxa de Erro:** Percentual de erros (simulado)
- **Taxa de Transferência:** Velocidade em KB/s

### Estatísticas por Dispositivo
- **Status:** Estado atual do dispositivo
- **Uso de Buffer:** Quantidade de dados no buffer
- **Dados Transferidos:** Total de bytes transferidos
- **Operações:** Número de operações realizadas

## Configurações

As configurações padrão podem ser ajustadas no construtor de `IO3DVisualizer`:

```javascript
this.simConfig = {
  keyboardBufferSize: 256,      
  monitorBufferSize: 1024,      
  printerBufferSize: 512,       
  diskBlockSize: 4096,       
  dmaTransferRate: 1024 * 10    
}
```

## Exemplos de Uso

### Exemplo 1: Simular Entrada de Teclado
```javascript
io3dVisualizer.selectDevice('keyboard');

io3dVisualizer.sendData();
```

### Exemplo 2: Simular Saída de Monitor
```javascript
io3dVisualizer.selectDevice('monitor');

io3dVisualizer.sendData();
```

### Exemplo 3: Simular Leitura de Disco com DMA
```javascript
io3dVisualizer.selectDevice('disk');

simulationEngine.simulateDiskRead(0, 4);
```

## Recursos Visuais 3D

### Modelos 3D
- **Teclado:** Corpo com teclas individuais
- **Monitor:** Suporte com tela e efeito de brilho
- **Impressora:** Carcaça com bandeja de saída
- **Disco:** Prato rotativo com cabeça de leitura

### Iluminação
- Luz ambiente para iluminação geral
- Luz direcional com sombras
- Luz de ponto para efeito visual

### Animações
- Rotação do prato do disco durante operações
- Movimento da cabeça de leitura
- Brilho do monitor indicando atividade
- Rotação da câmera ao redor dos dispositivos

## Integração com Assembly Quest

O Simulador de I/O está totalmente integrado ao projeto Assembly Quest:

1. **Menu Principal:** Novo botão "SIMULADOR DE I/O" no menu
2. **Navegação:** Botão "Voltar" para retornar ao menu
3. **Consistência Visual:** Mesmo tema de cores e estilo
4. **Compatibilidade:** Funciona com as mesmas dependências (Three.js, Chart.js)

## Requisitos do Sistema

- **Navegador:** Chrome, Firefox, Safari, Edge (versões recentes)
- **JavaScript:** ES6+
- **WebGL:** Suporte obrigatório
- **Bibliotecas:**
  - Three.js r128
  - Chart.js 3.9.1

## Performance

- **FPS:** 60 FPS em máquinas modernas
- **Memória:** ~50-100 MB de RAM
- **GPU:** Requer suporte a WebGL

## Troubleshooting

### Problema: Visualização 3D não aparece
**Solução:** Verifique se o Three.js foi carregado corretamente. Abra o console (F12) e procure por erros.

### Problema: Dispositivos não respondem
**Solução:** Certifique-se de selecionar um dispositivo antes de usar os controles.

### Problema: Baixa performance
**Solução:** Reduza a qualidade gráfica ou feche outras abas do navegador.

## Futuras Melhorias

- [ ] Suporte a múltiplos dispositivos simultâneos
- [ ] Simulação de rede (NIC)
- [ ] Modo de tempo real vs. simulado
- [ ] Gravação e reprodução de operações
- [ ] Modo multiplayer
- [ ] Integração com código Assembly real
- [ ] Mais tipos de dispositivos (USB, Bluetooth, etc.)

## Referências Educacionais

1. **Tanenbaum, A. S.** - "Structured Computer Organization"
2. **Patterson, D. A., & Hennessy, J. L.** - "Computer Organization and Design"
3. **Stallings, W.** - "Computer Organization and Architecture"

## Licença

Este projeto faz parte do Assembly Quest e segue a mesma licença.

## Contato e Suporte

Para dúvidas ou sugestões sobre o Simulador de I/O, entre em contato com a equipe de desenvolvimento do Assembly Quest.

---

**Versão:** 1.0  
**Data de Criação:** 2025  
**Última Atualização:** Outubro 2025
