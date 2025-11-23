# Guia Rápido - Simulador de I/O

## Início Rápido em 5 Minutos

### 1. Acessar o Simulador
- Abra o menu principal do Assembly Quest
- Clique em "SIMULADOR DE I/O"
- Aguarde o carregamento (cerca de 2 segundos)

### 2. Interface Básica

```
┌─────────────────────────────────────────────────────────────┐
│  Simulador de Entrada e Saída (I/O) 3D                  │
│  Dispositivos: 0  │  Operações: 0  │  Taxa: 0 KB/s        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│     DISPOSITIVOS      │  [VISUALIZAÇÃO 3D]  │   STATS    │
│  ├─ KEYBOARD         │                      │  Latência: 0 │
│  ├─ MONITOR          │                      │  Erro: 0%    │
│  ├─ PRINTER          │                      │  Bytes: 0    │
│  └─ DISK             │                      │  Interr: 0   │
│                      │                      │              │
│   CONTROLES        │                      │   LOG      │
│  [Enviar] [Receber]  │                      │  [eventos]   │
│  [Limpar] [Resetar]  │                      │              │
└─────────────────────────────────────────────────────────────┘
```

### 3. Operações Básicas

#### Enviar Dados
1. Clique em um dispositivo na lista esquerda
2. Clique em "Enviar Dados"
3. Observe o buffer do dispositivo aumentar
4. Veja a animação 3D do dispositivo

#### Receber Dados
1. Clique em um dispositivo com dados no buffer
2. Clique em "Receber Dados"
3. Os dados são removidos do buffer
4. Estatísticas são atualizadas

#### Limpar Buffer
1. Selecione um dispositivo
2. Clique em "Limpar Buffer"
3. Todos os dados no buffer são removidos

#### Resetar Sistema
1. Clique em "Resetar"
2. Todos os dispositivos voltam ao estado inicial
3. Estatísticas são zeradas

### 4. Entender os Dispositivos

####  Teclado (KEYBOARD)
- **O que faz:** Simula entrada de dados
- **Como usar:** Envie dados para simular digitação
- **Visualização:** Teclas que mudam de cor

####  Monitor (MONITOR)
- **O que faz:** Simula saída de vídeo
- **Como usar:** Envie dados para "renderizar" na tela
- **Visualização:** Brilho que pisca quando há atividade

####  Impressora (PRINTER)
- **O que faz:** Simula impressão de documentos
- **Como usar:** Envie dados para "imprimir"
- **Visualização:** Papel na bandeja de saída

####  Disco (DISK)
- **O que faz:** Simula leitura/escrita em disco
- **Como usar:** Envie dados para simular transferência
- **Visualização:** Prato giratório e cabeça de leitura

### 5. Ler as Estatísticas

| Métrica | Significado |
|---------|------------|
| **Latência Média** | Tempo médio de resposta do dispositivo |
| **Taxa de Erro** | Percentual de operações com erro |
| **Bytes Transferidos** | Total de dados processados |
| **Interrupções** | Número de sinais de interrupção gerados |

### 6. Interpretar o Log

O log mostra todas as operações em ordem cronológica:

```
[10:30:45] Sistema inicializado
[10:30:46] Dispositivo selecionado: keyboard
[10:30:47] Dados enviados para keyboard: 128 bytes
[10:30:48] Dados recebidos de keyboard: 128 bytes
[10:30:49] Buffer de keyboard limpo (0 itens removidos)
```

## Exemplos de Cenários

### Cenário 1: Simular Digitação
1. Selecione "KEYBOARD"
2. Clique "Enviar Dados" 5 vezes
3. Observe o buffer aumentar
4. Clique "Receber Dados" 5 vezes
5. Observe o buffer diminuir

### Cenário 2: Simular Impressão
1. Selecione "PRINTER"
2. Clique "Enviar Dados" 3 vezes
3. Observe a impressora ficar ocupada
4. Aguarde alguns segundos
5. Observe o status mudar para "Pronto"

### Cenário 3: Simular Transferência de Disco
1. Selecione "DISK"
2. Clique "Enviar Dados" 10 vezes
3. Observe o prato girar
4. Observe a cabeça de leitura se mover
5. Clique "Receber Dados" para ler os dados

### Cenário 4: Monitorar Taxa de Transferência
1. Clique "Resetar"
2. Selecione cada dispositivo e envie dados
3. Observe a taxa de transferência aumentar
4. Clique "Resetar" para zerar

## Dicas e Truques

###  Dica 1: Clique nos Modelos 3D
Você pode clicar diretamente nos modelos 3D para selecionar dispositivos, não precisa usar a lista.

###  Dica 2: Observe as Animações
As animações 3D indicam quando há atividade. Preste atenção:
- Prato do disco girando
- Cabeça de leitura se movendo
- Brilho do monitor piscando

###  Dica 3: Use o Log para Entender
O log mostra exatamente o que está acontecendo. Leia-o para entender o fluxo de dados.

###  Dica 4: Experimente Diferentes Padrões
Tente diferentes sequências de operações para ver como o sistema responde.

###  Dica 5: Resetar Frequentemente
Use "Resetar" para começar um novo experimento do zero.

## Conceitos Importantes

### Buffer Circular
Um buffer que reutiliza espaço de memória. Quando cheio, os dados mais antigos são sobrescritos.

### Interrupção
Um sinal que indica que um dispositivo precisa de atenção. Veja o contador de "Interrupções" aumentar.

### DMA (Direct Memory Access)
Permite que dispositivos acessem memória sem envolver a CPU. O disco usa DMA para transferências rápidas.

### Memory-Mapped I/O
Endereços de memória mapeados para registros de dispositivos. O monitor usa isso.

## Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| Nada acontece | Selecione um dispositivo primeiro |
| Visualização 3D lenta | Feche outras abas do navegador |
| Botões não respondem | Recarregue a página (F5) |
| Estatísticas zeradas | Clique em "Resetar" |

## Próximos Passos

1. **Entenda os Conceitos:** Leia a documentação completa
2. **Experimente:** Tente diferentes combinações
3. **Observe:** Preste atenção nas animações e estatísticas
4. **Aprenda:** Conecte o que vê com a teoria de I/O

## Recursos Adicionais

-  [Documentação Completa](IO-SIMULATOR-README.md)
-  [Referências Educacionais](IO-SIMULATOR-README.md#referências-educacionais)
-  [Guia Técnico](IO-SIMULATOR-README.md#arquitetura-técnica)

---

**Divirta-se aprendendo sobre I/O!** 🚀
