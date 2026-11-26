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

function HeadphoneStaticFallback({ className = '' }) {
  return (
    <svg
      viewBox="0 0 200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Stand */}
      <rect x="65" y="218" width="70" height="8" rx="4" fill="#18181B" />
      <rect x="97" y="42" width="6" height="178" fill="#C8A97E" />
      <path d="M80 42H120" stroke="#C8A97E" strokeWidth="6" strokeLinecap="round" />
      {/* Headphone */}
      <path
        d="M42 118C42 68 68 38 100 38C132 38 158 68 158 118"
        stroke="#18181B"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <rect x="26" y="114" width="26" height="54" rx="13" fill="#141416" stroke="#C8A97E" strokeWidth="2" />
      <rect x="148" y="114" width="26" height="54" rx="13" fill="#141416" stroke="#C8A97E" strokeWidth="2" />
      <circle cx="39" cy="172" r="4" fill="#C8A97E" />
    </svg>
  );
}

/**
 * Large, realistic 3D Matte-Black Over-Ear Headphone resting on an architectural
 * champagne-gold & matte-black hanger stand.
 */
export default function Headphone3D({ lastAddedEvent }) {
  const containerRef = useRef(null);
  const impulseRef = useRef(0);
  const [webGLSupported] = useState(() => isWebGLAvailable());

  useEffect(() => {
    const triggerImpulse = () => {
      impulseRef.current = 0.16;
    };
    if (lastAddedEvent) triggerImpulse();
    window.addEventListener('novastore:aux-action', triggerImpulse);
    return () => window.removeEventListener('novastore:aux-action', triggerImpulse);
  }, [lastAddedEvent]);

  useEffect(() => {
    if (!webGLSupported || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 420;
    const height = container.clientHeight || 480;

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice =
      window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0.15, 6.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xf5f3ee, 1.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff6e9, 2.6);
    keyLight.position.set(4, 5, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc8a97e, 1.7);
    rimLight.position.set(-4, 2.5, -3);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xffffff, 1.0, 14);
    fillLight.position.set(-2.5, -0.5, 4.5);
    scene.add(fillLight);

    // Materials
    const matteBlack = new THREE.MeshStandardMaterial({
      color: 0x161619,
      roughness: 0.65,
      metalness: 0.22,
    });

    const plushLeather = new THREE.MeshStandardMaterial({
      color: 0x0f0f12,
      roughness: 0.88,
      metalness: 0.06,
    });

    const champagneGold = new THREE.MeshStandardMaterial({
      color: 0xc8a97e,
      roughness: 0.26,
      metalness: 0.9,
    });

    const darkGunmetal = new THREE.MeshStandardMaterial({
      color: 0x26262b,
      roughness: 0.34,
      metalness: 0.8,
    });

    // Root Exhibition Group
    const rootGroup = new THREE.Group();
    rootGroup.position.set(0, -0.15, 0);
    scene.add(rootGroup);

    // --- 1. ARCHITECTURAL HEADPHONE STAND / HANGER ---
    const standGroup = new THREE.Group();
    rootGroup.add(standGroup);

    // Weighted matte-black base
    const baseGeo = new THREE.CylinderGeometry(0.85, 0.92, 0.1, 48);
    const baseMesh = new THREE.Mesh(baseGeo, matteBlack);
    baseMesh.position.y = -1.65;
    standGroup.add(baseMesh);

    // Champagne-gold base trim ring
    const baseTrimGeo = new THREE.TorusGeometry(0.86, 0.015, 12, 48);
    baseTrimGeo.rotateX(Math.PI / 2);
    const baseTrim = new THREE.Mesh(baseTrimGeo, champagneGold);
    baseTrim.position.y = -1.6;
    standGroup.add(baseTrim);

    // Vertical brushed champagne-gold stem
    const stemGeo = new THREE.CylinderGeometry(0.042, 0.048, 2.88, 20);
    const stemMesh = new THREE.Mesh(stemGeo, champagneGold);
    stemMesh.position.set(0, -0.2, -0.18);
    standGroup.add(stemMesh);

    // Curved top hanger cradle
    const hangerGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.42, 20);
    hangerGeo.rotateX(Math.PI / 2);
    const hangerMesh = new THREE.Mesh(hangerGeo, darkGunmetal);
    hangerMesh.position.set(0, 1.22, -0.02);
    standGroup.add(hangerMesh);

    // --- 2. LARGE MATTE-BLACK OVER-EAR HEADPHONE ---
    const pivotGroup = new THREE.Group();
    pivotGroup.position.set(0, 1.22, 0.02);
    rootGroup.add(pivotGroup);

    const headphone = new THREE.Group();
    headphone.position.set(0, -1.05, 0);
    headphone.scale.set(1.22, 1.22, 1.22);
    pivotGroup.add(headphone);

    // Headband Arc
    const bandGeo = new THREE.TorusGeometry(0.84, 0.082, 28, 72, Math.PI * 1.06);
    const bandMesh = new THREE.Mesh(bandGeo, matteBlack);
    bandMesh.rotation.z = -Math.PI * 0.03;
    bandMesh.position.y = 0.12;
    headphone.add(bandMesh);

    // Inner headband cushion
    const cushionGeo = new THREE.TorusGeometry(0.768, 0.046, 18, 48, Math.PI * 0.74);
    const cushionMesh = new THREE.Mesh(cushionGeo, plushLeather);
    cushionMesh.rotation.z = Math.PI * 0.13;
    cushionMesh.position.y = 0.12;
    headphone.add(cushionMesh);

    // Left & Right Sliders, Yokes & Earcups
    [-1, 1].forEach((side) => {
      const sideGroup = new THREE.Group();
      sideGroup.position.set(side * 0.84, 0.08, 0);

      // Champagne gold adjustment slider
      const sliderGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.3, 18);
      const slider = new THREE.Mesh(sliderGeo, champagneGold);
      slider.position.y = -0.15;
      sideGroup.add(slider);

      // Gunmetal hinge ring
      const hingeGeo = new THREE.CylinderGeometry(0.056, 0.056, 0.065, 18);
      const hinge = new THREE.Mesh(hingeGeo, darkGunmetal);
      hinge.position.y = -0.3;
      sideGroup.add(hinge);

      // Earcup
      const cupGroup = new THREE.Group();
      cupGroup.position.set(side * -0.05, -0.6, 0);
      cupGroup.rotation.z = side * 0.12;

      const shellGeo = new THREE.CylinderGeometry(0.35, 0.37, 0.2, 36);
      shellGeo.rotateZ(Math.PI / 2);
      const shell = new THREE.Mesh(shellGeo, matteBlack);
      cupGroup.add(shell);

      const ringGeo = new THREE.TorusGeometry(0.26, 0.014, 14, 36);
      ringGeo.rotateY(Math.PI / 2);
      const ring = new THREE.Mesh(ringGeo, champagneGold);
      ring.position.x = side * 0.102;
      cupGroup.add(ring);

      const padGeo = new THREE.TorusGeometry(0.28, 0.092, 22, 40);
      padGeo.rotateY(Math.PI / 2);
      const pad = new THREE.Mesh(padGeo, plushLeather);
      pad.position.x = -side * 0.105;
      cupGroup.add(pad);

      // 3.5mm AUX jack port on left earcup
      if (side === -1) {
        const jackGeo = new THREE.CylinderGeometry(0.026, 0.026, 0.14, 14);
        const jack = new THREE.Mesh(jackGeo, champagneGold);
        jack.position.set(0, -0.38, 0);
        cupGroup.add(jack);
      }

      sideGroup.add(cupGroup);
      headphone.add(sideGroup);
    });

    rootGroup.rotation.y = -0.22;

    // Mouse tracking for desktop
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e) => {
      if (isTouchDevice || prefersReducedMotion) return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      mouse.targetX = nx * 0.28;
      mouse.targetY = ny * 0.12;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 420;
      const h = container.clientHeight || 480;
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

        rootGroup.rotation.y = -0.22 + Math.sin(t * 0.65) * 0.08 + mouse.x;
        rootGroup.rotation.x = mouse.y * 0.45;
        pivotGroup.rotation.z = Math.sin(t * 1.1) * 0.025 + impulseRef.current * Math.sin(t * 10);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [webGLSupported]);

  if (!webGLSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <HeadphoneStaticFallback className="w-64 h-72 drop-shadow-2xl" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full pointer-events-none select-none"
      aria-label="3D Matte Black Headphone on Stand"
    />
  );
}
