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

function createLeatherTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(size, size);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const v = 108 + Math.floor(Math.random() * 40);
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

function HeadphoneStaticFallback() {
  return (
    <svg
      viewBox="0 0 120 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-40 h-48 mx-auto drop-shadow-xl"
      aria-hidden="true"
    >
      <path d="M24 66C24 36 40 16 60 16C80 16 96 36 96 66" stroke="#18181B" strokeWidth="9" strokeLinecap="round" />
      <rect x="14" y="64" width="17" height="36" rx="8.5" fill="#141416" stroke="#C8A97E" strokeWidth="1.4" />
      <rect x="89" y="64" width="17" height="36" rx="8.5" fill="#141416" stroke="#C8A97E" strokeWidth="1.4" />
      <path d="M22 100C20 118 26 130 22 142" stroke="#141416" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="22" cy="143" r="2.5" fill="#C8A97E" />
    </svg>
  );
}

/**
 * Full-viewport 3D Headphone & Verlet-Physics AUX Cable.
 * - Headphone is anchored to #hero-headphone-anchor in world space.
 * - Dangling 3D TubeGeometry AUX cable + 3.5mm gold/chrome connector hangs under gravity.
 * - On Add-to-Cart (lastAddedEvent), the 3D connector swings across the screen to
 *   physically tap #navbar-cart-icon, triggers a bounce/glow, and returns smoothly.
 */
export default function Headphone3D({ lastAddedEvent }) {
  const [webGLSupported] = useState(() => isWebGLAvailable());
  const actionRef = useRef({ active: false, startTime: 0, pulsed: false });

  useEffect(() => {
    if (!lastAddedEvent) return;
    actionRef.current = {
      active: true,
      startTime: performance.now(),
      pulsed: false,
    };
  }, [lastAddedEvent]);

  useEffect(() => {
    if (!webGLSupported) return;

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice =
      window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    // Orthographic-like perspective camera at z = 10
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.width = '100vw';
    renderer.domElement.style.height = '100vh';
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.zIndex = '55';
    document.body.appendChild(renderer.domElement);

    // Studio Softbox Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x1a1a1d);
    const sb1 = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.MeshBasicMaterial({ color: 0xfff5e6 }));
    sb1.position.set(4, 5, 4);
    sb1.lookAt(0, 0, 0);
    envScene.add(sb1);
    const sb2 = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), new THREE.MeshBasicMaterial({ color: 0xc8a97e }));
    sb2.position.set(-5, 2, -3);
    sb2.lookAt(0, 0, 0);
    envScene.add(sb2);
    scene.environment = pmremGenerator.fromScene(envScene, 0.04).texture;
    pmremGenerator.dispose();

    // Lighting
    scene.add(new THREE.AmbientLight(0xf5f3ee, 1.25));
    const keyLight = new THREE.DirectionalLight(0xfff6e9, 2.5);
    keyLight.position.set(3.5, 4.5, 5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xc8a97e, 1.8);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);

    // Materials
    const leatherTex = createLeatherTexture();
    const matteBlack = new THREE.MeshStandardMaterial({
      color: 0x161619,
      roughness: 0.56,
      metalness: 0.25,
      envMapIntensity: 1.15,
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
      roughness: 0.22,
      metalness: 0.92,
      envMapIntensity: 1.45,
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

    // Headphone Root
    const pivotGroup = new THREE.Group();
    scene.add(pivotGroup);

    const headphone = new THREE.Group();
    headphone.position.set(0, -0.92, 0);
    pivotGroup.add(headphone);

    // Headband
    const bandMesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.84, 0.078, 28, 72, Math.PI * 1.05),
      matteBlack
    );
    bandMesh.rotation.z = -Math.PI * 0.025;
    bandMesh.position.y = 0.12;
    headphone.add(bandMesh);

    const cushionMesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.77, 0.044, 18, 48, Math.PI * 0.72),
      plushLeather
    );
    cushionMesh.rotation.z = Math.PI * 0.14;
    cushionMesh.position.y = 0.12;
    headphone.add(cushionMesh);

    // Earcups & Sliders
    [-1, 1].forEach((side) => {
      const sideGroup = new THREE.Group();
      sideGroup.position.set(side * 0.84, 0.08, 0);

      const slider = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.28, 18), champagneGold);
      slider.position.y = -0.14;
      sideGroup.add(slider);

      const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.06, 18), darkGunmetal);
      hinge.position.y = -0.28;
      sideGroup.add(hinge);

      const cupGroup = new THREE.Group();
      cupGroup.position.set(side * -0.04, -0.56, 0);
      cupGroup.rotation.z = side * 0.12;

      const shellGeo = new THREE.CylinderGeometry(0.33, 0.35, 0.19, 36);
      shellGeo.rotateZ(Math.PI / 2);
      cupGroup.add(new THREE.Mesh(shellGeo, matteBlack));

      const ringGeo = new THREE.TorusGeometry(0.25, 0.013, 14, 36);
      ringGeo.rotateY(Math.PI / 2);
      const ring = new THREE.Mesh(ringGeo, champagneGold);
      ring.position.x = side * 0.096;
      cupGroup.add(ring);

      const padGeo = new THREE.TorusGeometry(0.27, 0.088, 24, 40);
      padGeo.rotateY(Math.PI / 2);
      const pad = new THREE.Mesh(padGeo, plushLeather);
      pad.position.x = -side * 0.098;
      cupGroup.add(pad);

      if (side === -1) {
        const jack = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.14, 14), champagneGold);
        jack.position.set(0, -0.35, 0);
        cupGroup.add(jack);
      }

      sideGroup.add(cupGroup);
      headphone.add(sideGroup);
    });

    headphone.rotation.y = 0.25;

    // 3D AUX Cable (world-space TubeGeometry) + 3.5mm Metal Connector
    const numNodes = 10;
    const cableNodes = Array.from({ length: numNodes }, (_, i) => new THREE.Vector3(0, -i * 0.15, 0));
    const cableCurve = new THREE.CatmullRomCurve3(cableNodes);
    const cableMesh = new THREE.Mesh(
      new THREE.TubeGeometry(cableCurve, 28, 0.022, 8, false),
      rubberCableMat
    );
    scene.add(cableMesh);

    const plugGroup = new THREE.Group();
    const plugBody = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.12, 14), matteBlack);
    const plugTip = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.012, 0.14, 14), champagneGold);
    plugTip.position.y = -0.13;
    plugGroup.add(plugBody, plugTip);
    scene.add(plugGroup);

    // Helper: Convert screen (px) to world (z = 0)
    const screenToWorld = (sx, sy) => {
      const ndcX = (sx / window.innerWidth) * 2 - 1;
      const ndcY = -(sy / window.innerHeight) * 2 + 1;
      const vec = new THREE.Vector3(ndcX, ndcY, 0.5);
      vec.unproject(camera);
      const dir = vec.sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      return camera.position.clone().add(dir.multiplyScalar(dist));
    };

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e) => {
      if (isTouchDevice || prefersReducedMotion) return;
      mouse.targetX = ((e.clientX / window.innerWidth) - 0.5) * 0.35;
      mouse.targetY = ((e.clientY / window.innerHeight) - 0.5) * 0.15;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (document.hidden) return;

      const t = clock.getElapsedTime();
      const anchorEl = document.getElementById('hero-headphone-anchor');

      if (!anchorEl) {
        pivotGroup.visible = false;
        cableMesh.visible = false;
        plugGroup.visible = false;
        return;
      }

      const rect = anchorEl.getBoundingClientRect();
      const isVisible = rect.bottom > -100 && rect.top < window.innerHeight + 100;
      pivotGroup.visible = isVisible;
      cableMesh.visible = isVisible;
      plugGroup.visible = isVisible;
      if (!isVisible) return;

      // Position headphone pivot at top-center of #hero-headphone-anchor
      const anchorWorld = screenToWorld(rect.left + rect.width / 2, rect.top + rect.height * 0.22);
      pivotGroup.position.copy(anchorWorld);
      const scaleFactor = Math.min(Math.max(rect.width / 260, 0.65), 1.15);
      pivotGroup.scale.setScalar(scaleFactor);

      if (!prefersReducedMotion) {
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;
        pivotGroup.rotation.z = Math.sin(t * 1.1) * 0.03;
        pivotGroup.rotation.y = mouse.x;
        pivotGroup.rotation.x = mouse.y * 0.4;
      }

      // Origin of AUX cable at left earcup bottom
      const cableOrigin = new THREE.Vector3(-0.78 * scaleFactor, -1.78 * scaleFactor, 0).add(anchorWorld);
      let cableEnd = cableOrigin.clone().add(new THREE.Vector3(Math.sin(t * 1.3) * 0.05, -1.15 * scaleFactor, 0));

      // Handle Add-to-Cart physical tap animation (~1.8s)
      const act = actionRef.current;
      if (act.active && !prefersReducedMotion) {
        const elapsed = performance.now() - act.startTime;
        const total = 1800;
        const cartEl = document.getElementById('navbar-cart-icon');

        if (elapsed < total && cartEl) {
          const cRect = cartEl.getBoundingClientRect();
          const cartWorld = screenToWorld(cRect.left + cRect.width / 2, cRect.top + cRect.height / 2);

          if (elapsed < 700) {
            const p = 1 - Math.pow(1 - elapsed / 700, 3);
            cableEnd.lerpVectors(cableEnd, cartWorld, p);
          } else if (elapsed < 1050) {
            cableEnd.copy(cartWorld);
            if (!act.pulsed) {
              act.pulsed = true;
              cartEl.style.transform = 'scale(1.26)';
              setTimeout(() => {
                if (cartEl) cartEl.style.transform = '';
              }, 280);
            }
          } else {
            const p = (elapsed - 1050) / (total - 1050);
            const eased = p * p;
            cableEnd.lerpVectors(cartWorld, cableEnd, eased);
          }
        } else {
          act.active = false;
        }
      }

      // Update cable nodes with natural gravity sag
      for (let i = 0; i < numNodes; i++) {
        const frac = i / (numNodes - 1);
        const sag = Math.sin(frac * Math.PI) * 0.42;
        cableNodes[i].lerpVectors(cableOrigin, cableEnd, frac);
        cableNodes[i].y -= sag;
      }

      const updatedCurve = new THREE.CatmullRomCurve3(cableNodes);
      cableMesh.geometry.dispose();
      cableMesh.geometry = new THREE.TubeGeometry(updatedCurve, 28, 0.022, 8, false);

      plugGroup.position.copy(cableEnd);
      const tangent = updatedCurve.getTangent(1).normalize();
      plugGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), tangent);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      leatherTex.dispose();
      cableMesh.geometry.dispose();
      if (renderer.domElement && document.body.contains(renderer.domElement)) {
        document.body.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [webGLSupported]);

  if (!webGLSupported) {
    return <HeadphoneStaticFallback />;
  }

  return null;
}
