import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * Generates a subtle procedural leather grain bump/roughness texture.
 */
function createLeatherTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(size, size);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const v = 110 + Math.floor(Math.random() * 38);
    imgData.data[i] = v;
    imgData.data[i + 1] = v;
    imgData.data[i + 2] = v;
    imgData.data[i + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  return tex;
}

function HeadphoneStaticFallback({ className = '' }) {
  return (
    <svg
      viewBox="0 0 120 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M24 66C24 36 40 16 60 16C80 16 96 36 96 66"
        stroke="#18181B"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <rect x="14" y="64" width="17" height="36" rx="8.5" fill="#141416" stroke="#C8A97E" strokeWidth="1.4" />
      <rect x="89" y="64" width="17" height="36" rx="8.5" fill="#141416" stroke="#C8A97E" strokeWidth="1.4" />
      <path d="M22 100C20 118 26 130 22 142" stroke="#141416" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="22" cy="143" r="2.5" fill="#C8A97E" />
    </svg>
  );
}

/**
 * Photorealistic 3D Matte-Black Over-Ear Headphone with leather grain textures,
 * studio softbox reflections, weighted pendulum physics, and a spring-physics
 * dangling 3D AUX cable.
 */
export default function Headphone3D({ lastAddedEvent }) {
  const containerRef = useRef(null);
  const impulseRef = useRef(0);
  const [webGLSupported] = useState(() => isWebGLAvailable());

  useEffect(() => {
    const triggerImpulse = () => {
      impulseRef.current = 0.24;
    };
    if (lastAddedEvent) triggerImpulse();
    window.addEventListener('novastore:aux-action', triggerImpulse);
    return () => window.removeEventListener('novastore:aux-action', triggerImpulse);
  }, [lastAddedEvent]);

  useEffect(() => {
    if (!webGLSupported || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 280;
    const height = container.clientHeight || 320;

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice =
      window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    camera.position.set(0, -0.45, 5.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Studio Softbox Environment Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x1a1a1d);
    const softbox1 = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.MeshBasicMaterial({ color: 0xfff5e6 })
    );
    softbox1.position.set(4, 5, 4);
    softbox1.lookAt(0, 0, 0);
    envScene.add(softbox1);
    const softbox2 = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.MeshBasicMaterial({ color: 0xc8a97e })
    );
    softbox2.position.set(-5, 2, -3);
    softbox2.lookAt(0, 0, 0);
    envScene.add(softbox2);
    scene.environment = pmremGenerator.fromScene(envScene, 0.04).texture;
    pmremGenerator.dispose();

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xf5f3ee, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff6e9, 2.5);
    keyLight.position.set(3.5, 4.5, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc8a97e, 1.8);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xffffff, 0.85, 12);
    fillLight.position.set(-2, -1, 4);
    scene.add(fillLight);

    // Materials
    const leatherTex = createLeatherTexture();

    const matteBlack = new THREE.MeshStandardMaterial({
      color: 0x161619,
      roughness: 0.58,
      metalness: 0.25,
      envMapIntensity: 1.1,
    });

    const plushLeather = new THREE.MeshStandardMaterial({
      color: 0x101013,
      roughness: 0.84,
      metalness: 0.05,
      bumpMap: leatherTex,
      bumpScale: 0.012,
    });

    const champagneGold = new THREE.MeshStandardMaterial({
      color: 0xc8a97e,
      roughness: 0.24,
      metalness: 0.92,
      envMapIntensity: 1.4,
    });

    const darkGunmetal = new THREE.MeshStandardMaterial({
      color: 0x26262b,
      roughness: 0.32,
      metalness: 0.82,
    });

    const rubberCableMat = new THREE.MeshStandardMaterial({
      color: 0x121215,
      roughness: 0.78,
      metalness: 0.08,
    });

    // Pivot at top center of headband
    const pivotGroup = new THREE.Group();
    pivotGroup.position.set(0, 0.92, 0);
    scene.add(pivotGroup);

    const headphone = new THREE.Group();
    headphone.position.set(0, -0.92, 0);
    pivotGroup.add(headphone);

    // 1. Headband Arc + Leather Cushion
    const bandGeo = new THREE.TorusGeometry(0.84, 0.078, 28, 72, Math.PI * 1.05);
    const bandMesh = new THREE.Mesh(bandGeo, matteBlack);
    bandMesh.rotation.z = -Math.PI * 0.025;
    bandMesh.position.y = 0.12;
    headphone.add(bandMesh);

    const cushionGeo = new THREE.TorusGeometry(0.77, 0.044, 18, 48, Math.PI * 0.72);
    const cushionMesh = new THREE.Mesh(cushionGeo, plushLeather);
    cushionMesh.rotation.z = Math.PI * 0.14;
    cushionMesh.position.y = 0.12;
    headphone.add(cushionMesh);

    // 2. Earcups, Sliders & Yokes
    [-1, 1].forEach((side) => {
      const sideGroup = new THREE.Group();
      sideGroup.position.set(side * 0.84, 0.08, 0);

      const slider = new THREE.Mesh(
        new THREE.CylinderGeometry(0.038, 0.038, 0.28, 18),
        champagneGold
      );
      slider.position.y = -0.14;
      sideGroup.add(slider);

      const hinge = new THREE.Mesh(
        new THREE.CylinderGeometry(0.052, 0.052, 0.06, 18),
        darkGunmetal
      );
      hinge.position.y = -0.28;
      sideGroup.add(hinge);

      const cupGroup = new THREE.Group();
      cupGroup.position.set(side * -0.04, -0.56, 0);
      cupGroup.rotation.z = side * 0.12;

      const shellGeo = new THREE.CylinderGeometry(0.33, 0.35, 0.19, 36);
      shellGeo.rotateZ(Math.PI / 2);
      cupGroup.add(new THREE.Mesh(shellGeo, matteBlack));

      // Champagne gold accent ring
      const ringGeo = new THREE.TorusGeometry(0.25, 0.013, 14, 36);
      ringGeo.rotateY(Math.PI / 2);
      const ring = new THREE.Mesh(ringGeo, champagneGold);
      ring.position.x = side * 0.096;
      cupGroup.add(ring);

      // Plush leather earpad
      const padGeo = new THREE.TorusGeometry(0.27, 0.088, 24, 40);
      padGeo.rotateY(Math.PI / 2);
      const pad = new THREE.Mesh(padGeo, plushLeather);
      pad.position.x = -side * 0.098;
      cupGroup.add(pad);

      // 3.5mm jack port on left earcup
      if (side === -1) {
        const jack = new THREE.Mesh(
          new THREE.CylinderGeometry(0.024, 0.024, 0.14, 14),
          champagneGold
        );
        jack.position.set(0, -0.35, 0);
        cupGroup.add(jack);
      }

      sideGroup.add(cupGroup);
      headphone.add(sideGroup);
    });

    // 3. Spring-Physics Dangling 3D AUX Cable (attached to left earcup)
    const cableNodes = [
      new THREE.Vector3(-0.78, -0.84, 0),
      new THREE.Vector3(-0.81, -1.12, 0.05),
      new THREE.Vector3(-0.76, -1.42, 0.02),
      new THREE.Vector3(-0.79, -1.72, 0),
    ];
    const cableVels = cableNodes.map(() => new THREE.Vector3());

    let cableCurve = new THREE.CatmullRomCurve3(cableNodes);
    let cableMesh = new THREE.Mesh(
      new THREE.TubeGeometry(cableCurve, 20, 0.017, 8, false),
      rubberCableMat
    );
    headphone.add(cableMesh);

    const plugMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.019, 0.014, 0.12, 12),
      champagneGold
    );
    plugMesh.position.copy(cableNodes[3]);
    headphone.add(plugMesh);

    headphone.rotation.y = 0.28;

    // Mouse tracking for desktop
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e) => {
      if (isTouchDevice || prefersReducedMotion) return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      mouse.targetX = nx * 0.22;
      mouse.targetY = ny * 0.1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 280;
      const h = container.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;
        impulseRef.current *= 0.91;

        const swingZ = Math.sin(t * 1.1) * 0.032 + impulseRef.current * Math.sin(t * 9);
        pivotGroup.rotation.z = swingZ;
        pivotGroup.rotation.y = 0.28 + Math.sin(t * 0.65) * 0.07 + mouse.x;
        pivotGroup.rotation.x = mouse.y * 0.45;

        // Secondary spring physics on dangling AUX cable nodes
        for (let i = 1; i < cableNodes.length; i++) {
          const restX = -0.78 + Math.sin(t * 1.4 + i) * 0.025 + impulseRef.current * 0.35 * i;
          const restY = -0.84 - i * 0.29;
          const forceX = (restX - cableNodes[i].x) * 0.12;
          const forceY = (restY - cableNodes[i].y) * 0.14;
          cableVels[i].x = (cableVels[i].x + forceX) * 0.84;
          cableVels[i].y = (cableVels[i].y + forceY) * 0.84;
          cableNodes[i].x += cableVels[i].x;
          cableNodes[i].y += cableVels[i].y;
        }

        cableCurve = new THREE.CatmullRomCurve3(cableNodes);
        cableMesh.geometry.dispose();
        cableMesh.geometry = new THREE.TubeGeometry(cableCurve, 20, 0.017, 8, false);
        plugMesh.position.copy(cableNodes[3]);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      leatherTex.dispose();
      cableMesh.geometry.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [webGLSupported]);

  if (!webGLSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <HeadphoneStaticFallback className="w-40 h-48 drop-shadow-xl" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full pointer-events-none select-none"
      aria-label="Photorealistic 3D Matte Black Headphone"
    />
  );
}
