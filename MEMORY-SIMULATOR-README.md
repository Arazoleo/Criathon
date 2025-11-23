# Simulador de Memória e Disco - Assembly Quest

## Visão Geral

O Simulador de Memória e Disco é uma extensão do Assembly Quest que foca especificamente no ensino de conceitos relacionados à hierarquia de memória, operações de disco e gerenciamento de cache. Este simulador oferece uma experiência interativa para aprender sobre os diferentes níveis de armazenamento em sistemas computacionais.

## Características Principais

### Hierarquia de Memória Visual
- **Registradores**: 32 bytes, 1ns de acesso
- **Cache L1**: 64 KB, 1ns de acesso  
- **RAM**: 8 GB, 100ns de acesso
- **Disco**: 1 TB, 10ms de acesso

### Visualização de Disco
- Grid interativo de 64 setores
- Animações para operações de leitura/escrita
- Indicadores visuais de setores ocupados
- Ferramentas de desfragmentação

### Estatísticas em Tempo Real
- Contador de operações de leitura/escrita
- Tempo total de acesso
- Taxa de cache hit
- Tempo médio de acesso

### Sistema de Fases Progressivas

#### Fase 1: Operações Básicas de Disco
- **Objetivo**: Leia o setor 5 do disco e armazene o valor em R1
- **Instrução**: `DISK_READ R1, 5`
- **Conceito**: Introdução às operações de disco

#### Fase 2: Escrita em Disco
- **Objetivo**: Escreva o valor 42 no setor 10 do disco
- **Instrução**: `MOV R1, 42` + `DISK_WRITE R1, 10`
- **Conceito**: Operações de escrita em disco

#### Fase 3: Operações de Cache
- **Objetivo**: Carregue dados do cache e depois do disco
- **Instrução**: `CACHE R1, 100` + `DISK_READ R2, 15`
- **Conceito**: Comparação de velocidade entre cache e disco

#### Fase 4: Busca no Disco
- **Objetivo**: Mova o cabeçote para o setor 20 e leia os dados
- **Instrução**: `DISK_SEEK 20` + `DISK_READ R1, 20`
- **Conceito**: Operações de busca e latência

#### Fase 5: Hierarquia Completa
- **Objetivo**: Use toda a hierarquia: registradores → cache → RAM → disco
- **Instrução**: Sequência completa de operações
- **Conceito**: Integração de todos os níveis de memória

## Instruções Específicas

### Instruções de Memória
- `LOAD Rx, endereço` - Carrega da RAM para registrador
- `STORE Rx, endereço` - Armazena registrador na RAM
- `CACHE Rx, endereço` - Carrega do cache para registrador

### Instruções de Disco
- `DISK_READ Rx, setor` - Lê dados de um setor do disco
- `DISK_WRITE Rx, setor` - Escreve dados em um setor do disco
- `DISK_SEEK setor` - Move o cabeçote para um setor específico
- `DISK_STATUS Rx` - Verifica o status do disco

### Instruções de Cache
- `CACHE_FLUSH` - Limpa o cache
- `CACHE_INVALIDATE endereço` - Invalida entrada específica do cache

## Conceitos Teóricos Ensinados

### Hierarquia de Memória
Explica como os diferentes níveis de memória são organizados por velocidade e capacidade, desde os registradores mais rápidos até o disco mais lento.

### Memória Cache
Demonstra como o cache funciona como uma memória intermediária que armazena cópias dos dados mais frequentemente acessados.

### Operações de Disco
Ensina sobre:
- Operações de leitura e escrita
- Tempo de busca (seek time)
- Fragmentação e desfragmentação
- Latência de acesso

### Memória Virtual
Introduz conceitos de como sistemas operacionais gerenciam memória virtual usando disco como extensão da RAM.

## Interface do Usuário

### Painel de Hierarquia de Memória
Visualização colorida dos diferentes níveis de memória com informações sobre capacidade, velocidade e custo.

### Visualização de Disco
Grid interativo mostrando os 64 setores do disco com:
- Setores vazios (cinza)
- Setores ocupados (vermelho)
- Operações de leitura (azul com animação)
- Operações de escrita (amarelo com animação)

### Log de Operações
Registro detalhado de todas as operações realizadas com timestamps e tipos de operação.

### Estatísticas
Painel com métricas importantes:
- Operações de leitura/escrita
- Tempo total de acesso
- Taxa de cache hit
- Setor atual do disco

## Funcionalidades Avançadas

### Desfragmentação
Simula o processo de desfragmentação movendo dados para setores contíguos, melhorando a eficiência de acesso.

### Estatísticas Detalhadas
Análise completa do desempenho com métricas como tempo médio de acesso e taxa de cache hit.

### Sistema de Pontuação
Sistema de pontuação baseado na eficiência das operações e tempo de execução.

## Arquivos do Projeto

- `memory-simulator.html` - Interface principal do simulador
- `js/memory-simulator.js` - Lógica principal do simulador
- `js/memory-simulator-data.js` - Dados e configurações
- `css/game.css` - Estilos compartilhados

## Como Usar

1. Acesse o simulador através do menu principal
2. Escolha uma fase para começar
3. Digite o código Assembly no editor
4. Clique em "Assemble" para compilar
5. Observe as operações na visualização do disco
6. Complete os objetivos para avançar para a próxima fase

## Objetivos Educacionais

Este simulador visa ensinar:
- Diferenças entre tipos de memória
- Importância da hierarquia de memória
- Operações de entrada/saída
- Conceitos de cache e otimização
- Latência e throughput em sistemas de armazenamento

## Tecnologias Utilizadas

- HTML5/CSS3 para interface
- JavaScript ES6+ para lógica
- Three.js para elementos visuais 3D
- CSS Grid e Flexbox para layout responsivo
- Animações CSS para feedback visual

## Contribuições

Contribuições são bem-vindas! Áreas de melhoria incluem:
- Novas instruções de memória
- Simulação de diferentes tipos de disco (SSD, NVMe)
- Algoritmos de cache mais sofisticados
- Visualizações 3D da hierarquia de memória
- Desafios mais avançados

## Licença

Este projeto faz parte do Assembly Quest e segue a mesma licença do projeto principal.
