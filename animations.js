class Animations {
  static animateRegister(reg, color = 0x00ffff, duration = 600) {
    const originalColor = reg.baseColor;
    const startTime = Date.now();
    const startScale = new THREE.Vector3(1, 1, 1);
    const targetScale = new THREE.Vector3(1.4, 1.4, 1.4);
    
    reg.mesh.material.color.setHex(color);
    reg.mesh.material.emissive.setHex(color);
    reg.mesh.material.emissiveIntensity = 1.5;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      
      if (progress < 0.5) {
        reg.group.scale.lerpVectors(startScale, targetScale, easeProgress * 2);
        reg.group.rotation.y += 0.08;
        reg.group.rotation.x = Math.sin(progress * Math.PI * 4) * 0.1;
      } else {
        reg.group.scale.lerpVectors(targetScale, startScale, (easeProgress - 0.5) * 2);
        reg.group.rotation.y += 0.08;
        reg.group.rotation.x = Math.sin(progress * Math.PI * 4) * 0.1;
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        reg.mesh.material.color.setHex(originalColor);
        reg.mesh.material.emissive.setHex(originalColor);
        reg.mesh.material.emissiveIntensity = 0.6;
        reg.group.scale.set(1, 1, 1);
        reg.group.rotation.x = 0;
      }
    };
    animate();
  }

  static animateMemory(mem, color = 0xff00ff, duration = 500) {
    const originalColor = mem.baseColor;
    const startTime = Date.now();
    
    mem.mesh.material.color.setHex(color);
    mem.mesh.material.emissive.setHex(color);
    mem.mesh.material.emissiveIntensity = 1.2;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      mem.group.position.y = -5 + Math.sin(progress * Math.PI) * 0.8;
      mem.group.rotation.y += 0.06;
      mem.group.scale.set(
        1 + Math.sin(progress * Math.PI) * 0.2,
        1 + Math.sin(progress * Math.PI) * 0.2,
        1 + Math.sin(progress * Math.PI) * 0.2
      );
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        mem.mesh.material.color.setHex(originalColor);
        mem.mesh.material.emissive.setHex(originalColor);
        mem.mesh.material.emissiveIntensity = 0.5;
        mem.group.position.y = -5;
        mem.group.rotation.y = 0;
        mem.group.scale.set(1, 1, 1);
      }
    };
    animate();
  }

  static animateIODevice(device, color = 0x00ffff, duration = 500) {
    const originalColor = device.baseColor;
    const startTime = Date.now();
    
    device.mesh.material.color.setHex(color);
    device.mesh.material.emissive.setHex(color);
    device.mesh.material.emissiveIntensity = 1.5;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      device.group.position.y = device.position.y + Math.sin(progress * Math.PI * 3) * 0.5;
      device.group.rotation.y += 0.08;
      device.group.scale.set(
        1 + Math.sin(progress * Math.PI * 2) * 0.15,
        1 + Math.sin(progress * Math.PI * 2) * 0.15,
        1 + Math.sin(progress * Math.PI * 2) * 0.15
      );
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        device.mesh.material.color.setHex(originalColor);
        device.mesh.material.emissive.setHex(originalColor);
        device.mesh.material.emissiveIntensity = 0.8;
        device.group.position.y = device.position.y;
        device.group.rotation.y = 0;
        device.group.scale.set(1, 1, 1);
      }
    };
    animate();
  }

  static animateBus(bus, duration = 600) {
    return new Promise(resolve => {
      bus.material.opacity = 0;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const pulseCount = 3;
        const pulse = Math.sin(progress * Math.PI * pulseCount);
        
        if (progress < 0.8) {
          bus.material.opacity = pulse * 0.8;
        } else {
          bus.material.opacity = pulse * 0.8 * (1 - (progress - 0.8) / 0.2);
        }
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          bus.material.opacity = 0;
          resolve();
        }
      };
      animate();
    });
  }

  static animateCPU(cpuMesh, cpuLight, intensity = 2.5, duration = 300) {
    const startTime = Date.now();
    const originalIntensity = cpuMesh.material.emissiveIntensity;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const pulse = Math.sin(progress * Math.PI * 2);
      cpuMesh.material.emissiveIntensity = originalIntensity + (intensity - originalIntensity) * pulse;
      cpuLight.intensity = 1.5 + intensity * pulse;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        cpuMesh.material.emissiveIntensity = originalIntensity;
        cpuLight.intensity = 1.5;
      }
    };
    animate();
  }

  static createParticleEffect(scene, position, color = 0x00ff41) {
    const particleCount = 30;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      const geometry = new THREE.SphereGeometry(0.15, 8, 8);
      const material = new THREE.MeshBasicMaterial({ 
        color: color,
        transparent: true,
        opacity: 1
      });
      const particle = new THREE.Mesh(geometry, material);
      
      particle.position.copy(position);
      
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 0.2 + Math.random() * 0.3;
      
      particle.velocity = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.cos(phi) * speed + 0.2,
        Math.sin(phi) * Math.sin(theta) * speed
      );
      
      particle.life = 1.0;
      particle.decay = 0.015 + Math.random() * 0.01;
      
      scene.add(particle);
      particles.push(particle);
    }
    
    const startTime = Date.now();
    const duration = 1500;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      particles.forEach(particle => {
        particle.position.add(particle.velocity);
        particle.velocity.y -= 0.015;
        particle.velocity.multiplyScalar(0.98);
        
        particle.life -= particle.decay;
        particle.material.opacity = Math.max(0, particle.life);
        particle.scale.set(particle.life, particle.life, particle.life);
        
        particle.rotation.x += 0.05;
        particle.rotation.y += 0.05;
      });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        particles.forEach(particle => scene.remove(particle));
      }
    };
    animate();
  }

  static createDataFlowEffect(scene, start, end, color = 0x00ffff, duration = 1000) {
    const particleCount = 20;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      const geometry = new THREE.SphereGeometry(0.1, 6, 6);
      const material = new THREE.MeshBasicMaterial({ 
        color: color,
        transparent: true,
        opacity: 0.8
      });
      const particle = new THREE.Mesh(geometry, material);
      
      particle.position.copy(start);
      particle.delay = (i / particleCount) * duration * 0.5;
      
      scene.add(particle);
      particles.push(particle);
    }
    
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      particles.forEach((particle, i) => {
        const particleProgress = Math.max(0, Math.min(1, (elapsed - particle.delay) / (duration * 0.8)));
        
        particle.position.lerpVectors(start, end, particleProgress);
        particle.material.opacity = 0.8 * Math.sin(particleProgress * Math.PI);
        
        const scale = 1 + Math.sin(particleProgress * Math.PI) * 0.5;
        particle.scale.set(scale, scale, scale);
      });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        particles.forEach(particle => scene.remove(particle));
      }
    };
    animate();
  }

  static createSuccessExplosion(scene, position) {
    const burstCount = 50;
    const particles = [];
    
    for (let i = 0; i < burstCount; i++) {
      const geometry = new THREE.SphereGeometry(0.2, 8, 8);
      const hue = Math.random();
      const color = new THREE.Color().setHSL(hue, 1, 0.6);
      const material = new THREE.MeshBasicMaterial({ 
        color: color,
        transparent: true,
        opacity: 1
      });
      const particle = new THREE.Mesh(geometry, material);
      
      particle.position.copy(position);
      
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 0.3 + Math.random() * 0.5;
      
      particle.velocity = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.cos(phi) * speed,
        Math.sin(phi) * Math.sin(theta) * speed
      );
      
      particle.angularVelocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2
      );
      
      scene.add(particle);
      particles.push(particle);
    }
    
    const startTime = Date.now();
    const duration = 2000;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      particles.forEach(particle => {
        particle.position.add(particle.velocity);
        particle.velocity.y -= 0.02;
        particle.velocity.multiplyScalar(0.97);
        
        particle.rotation.x += particle.angularVelocity.x;
        particle.rotation.y += particle.angularVelocity.y;
        particle.rotation.z += particle.angularVelocity.z;
        
        particle.material.opacity = 1 - progress;
        const scale = 1 - progress * 0.5;
        particle.scale.set(scale, scale, scale);
      });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        particles.forEach(particle => scene.remove(particle));
      }
    };
    animate();
  }
}
