import React, { useEffect, useRef, useState, memo } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const GlbModelViewer = memo(function GlbModelViewer({
  modelUrl,
  hoverRef,
  tiltRef,
  scrollPoseRef,
}) {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !modelUrl) return;

    const width = window.innerWidth || 1280;
    const height = window.innerHeight || 720;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.75, 6.0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.32;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Outdoor Sunlight + Soft Ambient Illumination for Kopdes 3D
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.45);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x14532d, 1.3);
    hemiLight.position.set(0, 12, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.5);
    sunLight.position.set(5, 9, 8);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xa7f3d0, 1.2);
    fillLight.position.set(-6, 4, 6);
    scene.add(fillLight);

    const pivotGroup = new THREE.Group();
    scene.add(pivotGroup);

    let isDisposed = false;
    const loader = new GLTFLoader();

    loader.load(
      modelUrl,
      (gltf) => {
        if (isDisposed) return;
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const targetSize = 4.4;
        const scaleFactor = targetSize / maxDim;

        model.scale.setScalar(scaleFactor);
        model.position.set(
          -center.x * scaleFactor,
          -center.y * scaleFactor,
          -center.z * scaleFactor
        );

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        pivotGroup.add(model);
        pivotGroup.rotation.set(0.06, 0, 0);

        setIsLoaded(true);
      },
      undefined,
      (err) => {
        console.error('Error loading GLB model:', err);
      }
    );

    const handleResize = () => {
      const w = window.innerWidth || 1280;
      const h = window.innerHeight || 720;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    let rafId;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      const hovered = hoverRef?.current || false;
      const currentTilt = tiltRef?.current || { rotateX: 0, rotateY: 0 };
      const pose = scrollPoseRef?.current || {
        worldX: 0,
        worldY: 0,
        worldZ: 0.15,
        modelScale: 1.0,
        rotX: 0.06,
        rotY: 0,
        rotZ: 0,
      };

      // Subtle floating levitation (reduced when zoomed in close on doors)
      const zoomFactor = Math.max(0.2, 1.0 - Math.max(0, (pose.worldZ - 0.5) / 3.0));
      const floatY = Math.sin(elapsed * 1.6) * 0.03 * zoomFactor;

      let targetRotY = pose.rotY ?? 0;
      let targetRotX = pose.rotX ?? 0.06;
      let targetRotZ = pose.rotZ ?? 0;

      if (hovered) {
        targetRotY += (currentTilt.rotateY / 16) * 0.22 * zoomFactor;
        targetRotX += -(currentTilt.rotateX / 16) * 0.15 * zoomFactor;
      }

      const targetS = pose.modelScale ?? 1.0;
      const stepSpd = pose.damping ? Math.min(0.26, pose.damping * 1.15) : 0.055;

      // Smoothly update 3D position, scale, and rotation in Three.js world space
      pivotGroup.position.x += ((pose.worldX ?? 0) - pivotGroup.position.x) * stepSpd;
      pivotGroup.position.y += ((pose.worldY ?? 0) + floatY - pivotGroup.position.y) * stepSpd;
      pivotGroup.position.z += ((pose.worldZ ?? 0.15) - pivotGroup.position.z) * stepSpd;
      pivotGroup.scale.setScalar(
        pivotGroup.scale.x + (targetS - pivotGroup.scale.x) * stepSpd
      );

      pivotGroup.rotation.y += (targetRotY - pivotGroup.rotation.y) * stepSpd;
      pivotGroup.rotation.x += (targetRotX - pivotGroup.rotation.x) * stepSpd;
      pivotGroup.rotation.z += (targetRotZ - pivotGroup.rotation.z) * stepSpd;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [modelUrl, hoverRef, tiltRef, scrollPoseRef]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center"
        style={{
          filter: 'drop-shadow(0 28px 28px rgba(0,0,0,0.75))',
        }}
      />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
        <