

class IOSimulationEngine {
  constructor() {
    this.devices = {};
    this.interruptQueue = [];
    this.dmaController = new DMAController();
    this.memoryMappedIO = new MemoryMappedIO();
    this.simulationTime = 0;
    this.isRunning = false;
    this.callbacks = {
      onInterrupt: null,
      onDataTransfer: null,
      onDeviceStateChange: null,
      onDMATransfer: null
    };
  }

  registerDevice(deviceName, config) {
    this.devices[deviceName] = new IODevice(deviceName, config);
    return this.devices[deviceName];
  }

  simulateKeyboardInput(data) {
    const device = this.devices['keyboard'];
    if (!device) return;

    const interrupt = {
      type: 'keyboard',
      data: data,
      timestamp: this.simulationTime,
      priority: 3
    };

    this.interruptQueue.push(interrupt);
    this.processInterrupts();
  }

  simulateMonitorOutput(data) {
    const device = this.devices['monitor'];
    if (!device) return;

    
    this.memoryMappedIO.writeToMonitor(data);
    
    if (this.callbacks.onDataTransfer) {
      this.callbacks.onDataTransfer({
        device: 'monitor',
        dataSize: data.length,
        timestamp: this.simulationTime
      });
    }
  }

  simulatePrinterOutput(data) {
    const device = this.devices['printer'];
    if (!device) return;

    device.addToBuffer(data);
    device.status = 'PRINTING';

    
    setTimeout(() => {
      device.status = 'READY';
      if (this.callbacks.onDeviceStateChange) {
        this.callbacks.onDeviceStateChange({
          device: 'printer',
          status: 'READY'
        });
      }
    }, Math.random() * 2000 + 1000);
  }

  simulateDiskRead(blockNumber, blockCount) {
    const device = this.devices['disk'];
    if (!device) return;

    const dmaRequest = {
      device: 'disk',
      operation: 'READ',
      blockNumber: blockNumber,
      blockCount: blockCount,
      dataSize: blockCount * 4096,
      timestamp: this.simulationTime
    };

    this.dmaController.queueTransfer(dmaRequest);
    
    if (this.callbacks.onDMATransfer) {
      this.callbacks.onDMATransfer(dmaRequest);
    }
  }

  simulateDiskWrite(blockNumber, blockCount, data) {
    const device = this.devices['disk'];
    if (!device) return;

    const dmaRequest = {
      device: 'disk',
      operation: 'WRITE',
      blockNumber: blockNumber,
      blockCount: blockCount,
      data: data,
      dataSize: data.length,
      timestamp: this.simulationTime
    };

    this.dmaController.queueTransfer(dmaRequest);
    
    if (this.callbacks.onDMATransfer) {
      this.callbacks.onDMATransfer(dmaRequest);
    }
  }

  processInterrupts() {
    
    this.interruptQueue.sort((a, b) => b.priority - a.priority);

    while (this.interruptQueue.length > 0) {
      const interrupt = this.interruptQueue.shift();
      
      if (this.callbacks.onInterrupt) {
        this.callbacks.onInterrupt(interrupt);
      }

      this.handleInterrupt(interrupt);
    }
  }

  handleInterrupt(interrupt) {
    switch(interrupt.type) {
      case 'keyboard':
        this.handleKeyboardInterrupt(interrupt);
        break;
      case 'disk':
        this.handleDiskInterrupt(interrupt);
        break;
      case 'printer':
        this.handlePrinterInterrupt(interrupt);
        break;
      case 'dma':
        this.handleDMAInterrupt(interrupt);
        break;
    }
  }

  handleKeyboardInterrupt(interrupt) {
    const device = this.devices['keyboard'];
    if (device) {
      device.addToBuffer(interrupt.data);
      device.status = 'DATA_AVAILABLE';
    }
  }

  handleDiskInterrupt(interrupt) {
    const device = this.devices['disk'];
    if (device) {
      device.status = 'BUSY';
    }
  }

  handlePrinterInterrupt(interrupt) {
    const device = this.devices['printer'];
    if (device) {
      device.status = 'PRINTING';
    }
  }

  handleDMAInterrupt(interrupt) {
    
    const transfer = interrupt.transfer;
    if (this.callbacks.onDMATransfer) {
      this.callbacks.onDMATransfer({
        ...transfer,
        status: 'COMPLETED'
      });
    }
  }

  update(deltaTime) {
    this.simulationTime += deltaTime;

    
    this.dmaController.update(deltaTime);

    
    const completedTransfers = this.dmaController.getCompletedTransfers();
    completedTransfers.forEach(transfer => {
      const interrupt = {
        type: 'dma',
        transfer: transfer,
        timestamp: this.simulationTime,
        priority: 5
      };
      this.interruptQueue.push(interrupt);
    });

    
    if (this.interruptQueue.length > 0) {
      this.processInterrupts();
    }
  }

  getDeviceStats(deviceName) {
    const device = this.devices[deviceName];
    if (!device) return null;

    return {
      name: deviceName,
      status: device.status,
      bufferUsage: device.getBufferUsage(),
      totalBytesTransferred: device.totalBytesTransferred,
      operationCount: device.operationCount,
      averageLatency: device.getAverageLatency()
    };
  }

  getAllStats() {
    const stats = {};
    Object.keys(this.devices).forEach(deviceName => {
      stats[deviceName] = this.getDeviceStats(deviceName);
    });
    return stats;
  }
}

class IODevice {
  constructor(name, config) {
    this.name = name;
    this.config = config;
    this.buffer = new CircularBuffer(config.bufferSize || 256);
    this.status = 'READY';
    this.totalBytesTransferred = 0;
    this.operationCount = 0;
    this.latencies = [];
    this.lastOperationTime = 0;
  }

  addToBuffer(data) {
    const startTime = Date.now();
    
    if (Array.isArray(data)) {
      data.forEach(byte => this.buffer.push(byte));
    } else {
      this.buffer.push(data);
    }

    this.totalBytesTransferred += Array.isArray(data) ? data.length : 1;
    this.operationCount++;
    
    const latency = Date.now() - startTime;
    this.latencies.push(latency);
    if (this.latencies.length > 100) {
      this.latencies.shift();
    }

    this.lastOperationTime = Date.now();
  }

  readFromBuffer(count = 1) {
    const data = [];
    for (let i = 0; i < count && !this.buffer.isEmpty(); i++) {
      data.push(this.buffer.pop());
    }
    return data;
  }

  getBufferUsage() {
    return {
      used: this.buffer.size(),
      total: this.buffer.capacity,
      percentage: (this.buffer.size() / this.buffer.capacity) * 100
    };
  }

  getAverageLatency() {
    if (this.latencies.length === 0) return 0;
    const sum = this.latencies.reduce((a, b) => a + b, 0);
    return sum / this.latencies.length;
  }

  isBufferFull() {
    return this.buffer.isFull();
  }

  isBufferEmpty() {
    return this.buffer.isEmpty();
  }
}

class CircularBuffer {
  constructor(capacity) {
    this.capacity = capacity;
    this.buffer = new Array(capacity);
    this.head = 0;
    this.tail = 0;
    this.count = 0;
  }

  push(element) {
    if (this.count === this.capacity) {
      
      this.tail = (this.tail + 1) % this.capacity;
    } else {
      this.count++;
    }

    this.buffer[this.head] = element;
    this.head = (this.head + 1) % this.capacity;
  }

  pop() {
    if (this.count === 0) {
      return undefined;
    }

    const element = this.buffer[this.tail];
    this.tail = (this.tail + 1) % this.capacity;
    this.count--;
    return element;
  }

  peek() {
    if (this.count === 0) {
      return undefined;
    }
    return this.buffer[this.tail];
  }

  size() {
    return this.count;
  }

  isEmpty() {
    return this.count === 0;
  }

  isFull() {
    return this.count === this.capacity;
  }

  clear() {
    this.head = 0;
    this.tail = 0;
    this.count = 0;
  }
}

class DMAController {
  constructor() {
    this.transferQueue = [];
    this.activeTransfers = new Map();
    this.completedTransfers = [];
    this.transferId = 0;
  }

  queueTransfer(request) {
    const transfer = {
      id: this.transferId++,
      ...request,
      status: 'QUEUED',
      startTime: Date.now(),
      completionTime: null,
      progress: 0
    };

    this.transferQueue.push(transfer);
    this.startNextTransfer();
  }

  startNextTransfer() {
    if (this.transferQueue.length === 0 || this.activeTransfers.size >= 2) {
      return;
    }

    const transfer = this.transferQueue.shift();
    transfer.status = 'IN_PROGRESS';
    
    
    const transferTime = (transfer.dataSize / 1024) * 100; 
    transfer.estimatedTime = transferTime;

    this.activeTransfers.set(transfer.id, transfer);

    setTimeout(() => {
      this.completeTransfer(transfer.id);
    }, transferTime);
  }

  completeTransfer(transferId) {
    const transfer = this.activeTransfers.get(transferId);
    if (!transfer) return;

    transfer.status = 'COMPLETED';
    transfer.completionTime = Date.now();
    transfer.progress = 100;

    this.activeTransfers.delete(transferId);
    this.completedTransfers.push(transfer);

    
    if (this.completedTransfers.length > 100) {
      this.completedTransfers.shift();
    }

    this.startNextTransfer();
  }

  update(deltaTime) {
    this.activeTransfers.forEach((transfer, id) => {
      const elapsed = Date.now() - transfer.startTime;
      transfer.progress = Math.min(100, (elapsed / transfer.estimatedTime) * 100);
    });
  }

  getCompletedTransfers() {
    const completed = [...this.completedTransfers];
    this.completedTransfers = [];
    return completed;
  }

  getActiveTransfers() {
    return Array.from(this.activeTransfers.values());
  }

  getTransferStats() {
    const totalCompleted = this.completedTransfers.length;
    const totalDataTransferred = this.completedTransfers.reduce((sum, t) => sum + t.dataSize, 0);
    const averageTime = totalCompleted > 0 
      ? this.completedTransfers.reduce((sum, t) => sum + (t.completionTime - t.startTime), 0) / totalCompleted
      : 0;

    return {
      totalCompleted,
      totalDataTransferred,
      averageTime,
      activeTransfers: this.activeTransfers.size
    };
  }
}

class MemoryMappedIO {
  constructor() {
    this.memoryMap = new Map();
    this.monitorBuffer = new Uint8Array(1024 * 768 * 4); 
    this.baseAddress = 0xA0000; 
  }

  writeToMonitor(data, offset = 0) {
    const startAddress = this.baseAddress + offset;
    
    if (Array.isArray(data)) {
      data.forEach((byte, index) => {
        this.monitorBuffer[offset + index] = byte & 0xFF;
      });
    } else {
      this.monitorBuffer[offset] = data & 0xFF;
    }

    this.memoryMap.set(startAddress, {
      data: data,
      timestamp: Date.now(),
      size: Array.isArray(data) ? data.length : 1
    });
  }

  readFromMonitor(offset = 0, length = 1) {
    const data = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      data[i] = this.monitorBuffer[offset + i];
    }
    return data;
  }

  getMonitorBuffer() {
    return this.monitorBuffer;
  }

  clearMonitor() {
    this.monitorBuffer.fill(0);
  }
}


window.IOSimulationEngine = IOSimulationEngine;
window.IODevice = IODevice;
window.DMAController = DMAController;
window.MemoryMappedIO = MemoryMappedIO;
