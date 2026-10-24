import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Background3D({ scrollVelocityRef }) {
  const mountRef = useRef(null);
  const bgImageRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Setup Three.js Scene for 3D Atmospheric Particles over User's Forest Background
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 38;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create glowing circular particle texture dynamically
    const createSporeTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.35, 'rgba(167, 243, 208, 0.85)');
      grad.addColorStop(0.7, 'rgba(16, 185, 129, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    };

    const particleCount = 650;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color('#6ee7b7'), // Emerald spore
      new THREE.Color('#fde047'), // Sunlight firefly
      new THREE.Color('#38bdf8'), // Sky blue mote
      new THREE.Color('#bef264'), // Lime canopy glow
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 95;
      positions[i3 + 1] = (Math.random() - 0.5) * 95;
      positions[i3 + 2] = (Math.random() - 0.5) * 60;

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const sporeTexture = createSporeTexture();
    const material = new THREE.PointsMaterial({
      size: 0.85,
      map: sporeTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);

    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      const scrollVel = scrollVelocityRef?.current || 0;

      // Rotate & drift particles in response to mouse and scroll velocity
      points.rotation.y += 0.0009 + targetX * 0.004;
      points.rotation.x += 0.0004 - targetY * 0.003;

      const posAttr = geometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        posAttr.array[i3 + 1] += 0.018 + scrollVel * 0.0025;
        if (posAttr.array[i3 + 1] > 48) {
          posAttr.array[i3 + 1] = -48;
        } else if (posAttr.array[i3 + 1] < -48) {
          posAttr.array[i3 + 1] = 48;
        }
      }
      posAttr.needsUpdate = true;

      // Subtle parallax on the user's forest background image
      if (bgImageRef.current) {
        const bgShiftX = -targetX * 14;
        const bgShiftY = targetY * 10;
        bgImageRef.current.style.transform = `scale(1.06) translate3d(${bgShiftX.toFixed(1)}px, ${bgShiftY.toFixed(1)}px, 0)`;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      sporeTexture.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [scrollVelocityRef]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* User's Provided Forest Background Image */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-150 ease-out will-change-transform"
        style={{
          backgroundImage: `url('/forest-bg.jpg')`,
          transform: 'scale(1.06)',
        }}
      />

      {/* Atmospheric Depth Vignette & Color Contrast Layer so 3D figures & text stay crisp while keeping the forest vibrant */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 35%, rgba(4, 24, 14, 0.32) 0%, rgba(2, 14, 9, 0.68) 70%, rgba(2, 10, 6, 0.85) 100%)',
        }}
      />

      {/* Three.js 3D Particle Canvas Layer */}
      <div ref={mountRef} className="absolute inset-0" />
    </div>
  );
}
