import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Checks if WebGL is supported in the current browser.
 */
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
 * Static editorial SVG fallback for devices without WebGL or reduced motion.
 */
function HeadphoneStaticFallback({ className = '' }) {
  return (
    <svg
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M24 66C24 36 40 16 60 16C80 16 96 36 96 66"
        stroke="#18181B"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M24 66C24 38 40 20 60 20C80 20 96 38 96 66"
        stroke="#C8A97E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />
      <rect x="14" y="64" width="16" height="34" rx="8" fill="#141416" stroke="#C8A97E" strokeWidth="1.2" />
      <rect x="90" y="64" width="16" height="34" rx="8" fill="#141416" stroke="#C8A97E" strokeWidth="1.2" />
      <circle cx="22" cy="101" r="2.5" fill="#C8A97E" />
    </svg>
  );
}

/**
 * Interactive 3D Matte-Black Over-Ear Headphone suspended from the hero typography.
 * Pivots from the top center of the headband so it swings naturally like a pendulum.
 */
export default function Headphone3D({ lastAddedEvent }) {
  const containerRef = useRef(null);
  const impulseRef = useRef(0);
  const [webGLSupported] = useState(() => isWebGLAvailable());

  // Trigger subtle reactive swing when an item is added to cart
  useEffect(() => {
    if (lastAddedEvent) {
      impulseRef.current = 0.22;
    }
  }, [lastAddedEvent]);

  useEffect(() => {
    if (!webGLSupported || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 160;
    const height = container.clientHeight || 190;

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice =
      window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    camera.position.set(0, -0.35, 5.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xf5f3ee, 1.35);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff6e9, 2.4);
    keyLight.position.set(3.5, 4.5, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc8a97e, 1.5);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xffffff, 0.9, 12);
    fillLight.position.set(-2, -1, 4);
    scene.add(fillLight);

    // Materials
    const matteBlack = new THREE.MeshStandardMaterial({
      color: 0x161619,
      roughness: 0.68,
      metalness: 0.18,
    });

    const plushLeather = new THREE.MeshStandardMaterial({
      color: 0x101012,
      roughness: 0.88,
      metalness: 0.05,
    });

    const champagneGold = new THREE.MeshStandardMaterial({
      color: 0xc8a97e,
      roughness: 0.28,
      metalness: 0.88,
    });

    const darkGunmetal = new THREE.MeshStandardMaterial({
      color: 0x26262b,
      roughness: 0.35,
      metalness: 0.78,
    });

    // Pivot group at the top center of the headband (hanger point on 'b')
    const pivotGroup = new THREE.Group();
    pivotGroup.position.set(0, 0.92, 0);
    scene.add(pivotGroup);

    // Model group offset downward from pivot
    const headphone = new THREE.Group();
    headphone.position.set(0, -0.92, 0);
    pivotGroup.add(headphone);

    // 1. Headband Arc
    const bandGeo = new THREE.TorusGeometry(0.82, 0.075, 24, 64, Math.PI * 1.05);
    const bandMesh = new THREE.Mesh(bandGeo, matteBlack);
    bandMesh.rotation.z = -Math.PI * 0.025;
    bandMesh.position.y = 0.12;
    headphone.add(bandMesh);

    // Inner headband cushion
    const cushionGeo = new THREE.TorusGeometry(0.755, 0.042, 16, 48, Math.PI * 0.72);
    const cushionMesh = new THREE.Mesh(cushionGeo, plushLeather);
    cushionMesh.rotation.z = Math.PI * 0.14;
    cushionMesh.position.y = 0.12;
    headphone.add(cushionMesh);

    // 2. Left & Right Sliders, Yokes & Earcups
    [-1, 1].forEach((side) => {
      const sideGroup = new THREE.Group();
      sideGroup.position.set(side * 0.82, 0.08, 0);

      // Champagne gold adjustment slider
      const sliderGeo = new THREE.CylinderGeometry(0.038, 0.038, 0.28, 16);
      const slider = new THREE.Mesh(sliderGeo, champagneGold);
      slider.position.y = -0.14;
      sideGroup.add(slider);

      // Gunmetal hinge ring
      const hingeGeo = new THREE.CylinderGeometry(0.052, 0.052, 0.06, 16);
      const hinge = new THREE.Mesh(hingeGeo, darkGunmetal);
      hinge.position.y = -0.28;
      sideGroup.add(hinge);

      // Earcup outer shell
      const cupGroup = new THREE.Group();
      cupGroup.position.set(side * -0.04, -0.56, 0);
      cupGroup.rotation.z = side * 0.12;

      const shellGeo = new THREE.CylinderGeometry(0.32, 0.34, 0.18, 32);
      shellGeo.rotateZ(Math.PI / 2);
      const shell = new THREE.Mesh(shellGeo, matteBlack);
      cupGroup.add(shell);

      // Backplate accent ring
      const ringGeo = new THREE.TorusGeometry(0.24, 0.012, 12, 32);
      ringGeo.rotateY(Math.PI / 2);
      const ring = new THREE.Mesh(ringGeo, champagneGold);
      ring.position.x = side * 0.092;
      cupGroup.add(ring);

      // Plush earpad
      const padGeo = new THREE.TorusGeometry(0.26, 0.085, 20, 36);
      padGeo.rotateY(Math.PI / 2);
      const pad = new THREE.Mesh(padGeo, plushLeather);
      pad.position.x = -side * 0.095;
      cupGroup.add(pad);

      // Short 3.5mm cable jack on left earcup
      if (side === -1) {
        const jackGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.12, 12);
        const jack = new THREE.Mesh(jackGeo, champagneGold);
        jack.position.set(0, -0.34, 0);
        cupGroup.add(jack);
      }

      sideGroup.add(cupGroup);
      headphone.add(sideGroup);
    });

    // Slight natural angle so both earcups & depth are visible
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

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 160;
      const h = container.clientHeight || 190;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Smooth mouse interpolation
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        // Decay reactive add-to-cart impulse
        impulseRef.current *= 0.92;

        // Pendulum swing from 'b'
        const swingZ = Math.sin(t * 1.15) * 0.035 + impulseRef.current * Math.sin(t * 9);
        const gentleY = 0.28 + Math.sin(t * 0.7) * 0.08 + mouse.x;
        const gentleX = mouse.y * 0.5;

        pivotGroup.rotation.z = swingZ;
        pivotGroup.rotation.y = gentleY;
        pivotGroup.rotation.x = gentleX;
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
        <HeadphoneStaticFallback className="w-28 h-32 drop-shadow-xl" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full pointer-events-none select-none"
      aria-label="3D Matte Black Headphone"
    />
  );
}
