import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useCart } from '../context/CartContext';

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

function createLeatherBumpTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(size, size);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const n = 115 + Math.floor(Math.random() * 32);
    imgData.data[i] = n;
    imgData.data[i + 1] = n;
    imgData.data[i + 2] = n;
    imgData.data[i + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  return tex;
}

/** Gold ripple impact on a DOM element at screen coords */
function triggerButtonImpact(sx, sy) {
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position: fixed;
    left: ${sx - 24}px;
    top: ${sy - 24}px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2.5px solid #C8A97E;
    pointer-events: none;
    z-index: 9999;
    animation: novaRipple 0.55s ease-out forwards;
  `;
  if (!document.getElementById('nova-ripple-style')) {
    const style = document.createElement('style');
    style.id = 'nova-ripple-style';
    style.textContent = `
      @keyframes novaRipple {
        0%   { transform: scale(0.5); opacity: 1; }
        100% { transform: scale(2.6); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

/**
 * Builds a 3D headphone stand: vertical pole + horizontal arm + hook curve.
 * Returns a THREE.Group centred so the hook tip sits at (0,0,0).
 */
function buildStand() {
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xc8a97e,
    roughness: 0.22,
    metalness: 0.92,
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.5,
    metalness: 0.3,
  });

  const standGroup = new THREE.Group();

  // Vertical pole  (runs from bottom-base up)
  const poleH = 2.4;
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.034, poleH, 20), darkMat);
  pole.position.y = -poleH / 2 - 0.08;
  standGroup.add(pole);

  // Circular base plate
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.055, 32), darkMat);
  base.position.y = -poleH - 0.11;
  standGroup.add(base);

  // Horizontal arm at the top (extends right from pole top)
  const armLen = 0.55;
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, armLen, 16), goldMat);
  arm.rotation.z = Math.PI / 2;
  arm.position.set(armLen / 2, -0.04, 0);
  standGroup.add(arm);

  // Hook curve at arm tip (a torus arc facing downward)
  // We approximate with a half-torus: 8 segments of a torus
  const hookR = 0.09;   // radius of the hook loop
  const hookT = 0.016;  // tube thickness
  const hookSegs = 12;
  const hookArc = Math.PI * 1.1; // slightly more than half circle
  const hookGeom = new THREE.TorusGeometry(hookR, hookT, 10, hookSegs, hookArc);
  const hook = new THREE.Mesh(hookGeom, goldMat);
  hook.rotation.z = Math.PI; // open end faces downward so headband sits inside
  hook.position.set(armLen + hookR * 0.5, -0.065, 0);
  standGroup.add(hook);

  // Gold collar ring where arm meets pole
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.05, 20), goldMat);
  collar.position.y = -0.04;
  standGroup.add(collar);

  return standGroup;
}

function HeadphoneStaticFallback() {
  return (
    <svg
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-lg"
      aria-hidden="true"
    >
      <path d="M24 66C24 36 40 16 60 16C80 16 96 36 96 66" stroke="#18181B" strokeWidth="8" strokeLinecap="round" />
      <rect x="14" y="64" width="16" height="34" rx="8" fill="#141416" stroke="#C8A97E" strokeWidth="1.2" />
      <rect x="90" y="64" width="16" height="34" rx="8" fill="#141416" stroke="#C8A97E" strokeWidth="1.2" />
    </svg>
  );
}

/**
 * Photorealistic GLTF Over-Ear Headphone on a 3D stand next to the hero headline.
 *
 * Stand position: anchored to #hero-headphone-anchor element in Hero.jsx.
 * AUX cable hangs from left earcup, extends DOWN to whichever product card's
 * basket button was last clicked (position carried in lastAddedEvent.targetX/Y).
 */
export default function Headphone3D() {
  const { lastAddedEvent } = useCart();
  const [webGLSupported] = useState(() => isWebGLAvailable());
  const actionRef = useRef({ active: false, startTime: 0, pulsed: false, targetX: 0, targetY: 0 });

  useEffect(() => {
    if (!lastAddedEvent) return;
    actionRef.current = {
      active: true,
      startTime: performance.now(),
      pulsed: false,
      targetX: lastAddedEvent.targetX ?? window.innerWidth / 2,
      targetY: lastAddedEvent.targetY ?? window.innerHeight * 0.72,
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
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.width = '100vw';
    renderer.domElement.style.height = '100vh';
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.zIndex = '55';
    document.body.appendChild(renderer.domElement);

    // PBR environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // Studio lighting
    scene.add(new THREE.AmbientLight(0xf5f3ee, 1.05));
    const keyLight = new THREE.DirectionalLight(0xfff7ec, 2.6);
    keyLight.position.set(4, 6, 6);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xc8a97e, 2.4);
    rimLight.position.set(-5, 3, -3);
    scene.add(rimLight);
    const backRim = new THREE.DirectionalLight(0xf5f3ee, 1.5);
    backRim.position.set(2, -2, -5);
    scene.add(backRim);

    const leatherBump = createLeatherBumpTexture();

    // ── 3D STAND ──────────────────────────────────────────────
    const standGroup = buildStand();
    scene.add(standGroup);

    // ── HEADPHONE (pivot group hangs on the stand hook tip) ───
    // The pivot's (0,0,0) == hook tip. The model's headband top is offset from that.
    const pivotGroup = new THREE.Group();
    standGroup.add(pivotGroup);  // child of stand so it moves with it

    const localPortOffset = new THREE.Vector3(-0.46, -1.06, 0.08);
    let modelLoaded = false;

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load(
      '/models/headphones.gltf',
      (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
          if (!child.isMesh) return;
          const matName = child.material?.name || '';
          if (matName === 'Cushion') {
            child.material = new THREE.MeshPhysicalMaterial({
              color: 0x161618,
              roughness: 0.82,
              metalness: 0.04,
              bumpMap: leatherBump,
              bumpScale: 0.008,
              sheen: 0.35,
              sheenRoughness: 0.7,
              sheenColor: new THREE.Color(0x2f2b25),
            });
          } else if (matName === 'GlowBlue') {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xc8a97e,
              roughness: 0.24,
              metalness: 0.92,
              envMapIntensity: 1.5,
            });
          } else if (matName === 'Connector') {
            child.material = new THREE.MeshStandardMaterial({
              color: 0x8c6d46,
              roughness: 0.28,
              metalness: 0.88,
            });
          } else if (matName === 'Black-1') {
            child.material = new THREE.MeshPhysicalMaterial({
              color: 0x18181b,
              roughness: 0.44,
              metalness: 0.22,
              clearcoat: 0.14,
              clearcoatRoughness: 0.42,
            });
          } else {
            child.material = new THREE.MeshStandardMaterial({
              color: 0x121215,
              roughness: 0.6,
              metalness: 0.16,
            });
          }
        });

        // Normalize to targetHeight world units
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const targetHeight = 1.4;
        const normScale = targetHeight / (size.y || 1);
        model.scale.setScalar(normScale);

        const scaledBox = new THREE.Box3().setFromObject(model);
        const scaledCenter = new THREE.Vector3();
        scaledBox.getCenter(scaledCenter);

        model.position.x -= scaledCenter.x;
        model.position.z -= scaledCenter.z;
        // Hang so top headband arch sits at y = 0 (the hook tip)
        model.position.y -= scaledBox.max.y - 0.05;

        const modelWrapper = new THREE.Group();
        // Slight 3/4 turn to show depth + gold details
        modelWrapper.rotation.y = 0.3;
        modelWrapper.rotation.z = -0.02;
        modelWrapper.add(model);
        pivotGroup.add(modelWrapper);

        // Measure AUX cable port on left earcup
        const finalBox = new THREE.Box3().setFromObject(modelWrapper);
        localPortOffset.set(
          finalBox.min.x + (finalBox.max.x - finalBox.min.x) * 0.22,
          finalBox.min.y + 0.12,
          0.05
        );
        modelLoaded = true;
      },
      undefined,
      (err) => console.error('Failed to load headphones.gltf', err)
    );

    // ── VERLET ROPE AUX CABLE ─────────────────────────────────
    const numNodes = 20;
    const nodes = Array.from({ length: numNodes }, (_, i) => new THREE.Vector3(0, -i * 0.1, 0));
    const prevNodes = nodes.map((n) => n.clone());
    let cableInitialized = false;

    const rubberCableMat = new THREE.MeshStandardMaterial({
      color: 0x141416,
      roughness: 0.76,
      metalness: 0.08,
    });
    const plugBodyMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.35,
      metalness: 0.55,
    });
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xd8d8dc,
      roughness: 0.18,
      metalness: 0.96,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xc8a97e,
      roughness: 0.22,
      metalness: 0.92,
    });

    const cableCurve = new THREE.CatmullRomCurve3(nodes);
    const cableMesh = new THREE.Mesh(
      new THREE.TubeGeometry(cableCurve, 40, 0.016, 10, false),
      rubberCableMat
    );
    scene.add(cableMesh);

    // 3.5 mm TRS plug
    const plugGroup = new THREE.Group();
    const strainBoot = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.025, 0.05, 14), rubberCableMat);
    strainBoot.position.y = 0.02;
    const gripBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.09, 16), plugBodyMat);
    gripBarrel.position.y = -0.052;
    const goldCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.022, 0.02, 16), goldMat);
    goldCollar.position.y = -0.105;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.01, 0.1, 14), chromeMat);
    shaft.position.y = -0.168;
    const ring1 = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.007, 14), rubberCableMat);
    ring1.position.y = -0.148;
    const ring2 = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.007, 14), rubberCableMat);
    ring2.position.y = -0.182;
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.01, 12, 12), chromeMat);
    tip.position.y = -0.22;
    plugGroup.add(strainBoot, gripBarrel, goldCollar, shaft, ring1, ring2, tip);
    scene.add(plugGroup);

    // Screen → world coordinate helper
    const screenToWorld = (sx, sy) => {
      const ndcX = (sx / window.innerWidth) * 2 - 1;
      const ndcY = -(sy / window.innerHeight) * 2 + 1;
      const vec = new THREE.Vector3(ndcX, ndcY, 0.5);
      vec.unproject(camera);
      const dir = vec.sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      return camera.position.clone().add(dir.multiplyScalar(dist));
    };

    // Mouse parallax
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e) => {
      if (isTouchDevice || prefersReducedMotion) return;
      mouse.targetX = ((e.clientX / window.innerWidth) - 0.5) * 0.18;
      mouse.targetY = ((e.clientY / window.innerHeight) - 0.5) * 0.06;
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
    const startClock = performance.now();
    const downAxis = new THREE.Vector3(0, -1, 0);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (document.hidden || !modelLoaded) return;

      const t = (performance.now() - startClock) * 0.001;
      const anchorEl = document.getElementById('hero-headphone-anchor');
      const act = actionRef.current;

      if (!anchorEl) {
        standGroup.visible = false;
        cableMesh.visible = false;
        plugGroup.visible = false;
        return;
      }

      const rect = anchorEl.getBoundingClientRect();
      const isHeroVisible = rect.bottom > -120 && rect.top < window.innerHeight + 120;
      standGroup.visible = isHeroVisible;

      if (!isHeroVisible && !act.active) {
        cableMesh.visible = false;
        plugGroup.visible = false;
        return;
      }

      cableMesh.visible = true;
      plugGroup.visible = true;

      // ── Position the stand so its hook tip aligns with top-centre of anchor ──
      // The anchor is a small invisible span sitting to the right of the hero headline.
      // We place the stand's origin (hook-tip at y=0) at that world point.
      const anchorCenterX = rect.left + rect.width * 0.5;
      const anchorCenterY = rect.top + rect.height * 0.08;
      const standWorld = screenToWorld(anchorCenterX, anchorCenterY);

      // Scale stand proportionally to anchor element size
      const anchorTopW = screenToWorld(rect.left, rect.top);
      const anchorBotW = screenToWorld(rect.left, rect.bottom);
      const anchorWorldH = Math.abs(anchorTopW.y - anchorBotW.y);
      const scaleFactor = Math.max(anchorWorldH / 1.1, 0.4);

      standGroup.position.copy(standWorld);
      standGroup.scale.setScalar(scaleFactor);

      // Subtle idle sway
      let reactionTilt = 0;
      if (act.active && !prefersReducedMotion) {
        const elapsed = performance.now() - act.startTime;
        reactionTilt = Math.sin(Math.min(elapsed / 1800, 1) * Math.PI * 2) * 0.03;
      }
      if (!prefersReducedMotion) {
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;
        standGroup.rotation.z = Math.sin(t * 0.9) * 0.012 + reactionTilt;
        standGroup.rotation.y = mouse.x;
        standGroup.rotation.x = mouse.y * 0.25;
      }

      standGroup.updateMatrixWorld(true);

      // AUX cable port in world space
      const portWorld = localPortOffset.clone().applyMatrix4(pivotGroup.matrixWorld);

      // Cable resting total length (hang down naturally from earcup)
      const restTotalLen = anchorWorldH * 1.6;
      let segLen = restTotalLen / (numNodes - 1);

      if (!cableInitialized) {
        for (let i = 0; i < numNodes; i++) {
          nodes[i].set(portWorld.x, portWorld.y - i * segLen, portWorld.z);
          prevNodes[i].copy(nodes[i]);
        }
        cableInitialized = true;
      }

      // Translate all rope nodes when anchor moves (scroll/reflow)
      const delta = new THREE.Vector3().subVectors(portWorld, nodes[0]);
      if (delta.lengthSq() > 0.0001) {
        for (let i = 1; i < numNodes; i++) {
          nodes[i].add(delta);
          prevNodes[i].add(delta);
        }
      }

      nodes[0].copy(portWorld);
      prevNodes[0].copy(portWorld);

      // ── Add-to-Cart: cable swings DOWN to product card button ──
      let targetEnd = null;
      if (act.active && !prefersReducedMotion) {
        const elapsed = performance.now() - act.startTime;
        const total = 2000;

        if (elapsed < total) {
          // The button's screen position stored in actionRef
          const btnWorld = screenToWorld(act.targetX, act.targetY);

          if (elapsed < 800) {
            // Extend cable toward button (ease in-out)
            const p = elapsed / 800;
            const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
            const restTip = new THREE.Vector3(portWorld.x, portWorld.y - restTotalLen, portWorld.z);
            targetEnd = new THREE.Vector3().lerpVectors(restTip, btnWorld, eased);
            const neededLen = Math.max(restTotalLen, portWorld.distanceTo(targetEnd) * 1.1);
            segLen = neededLen / (numNodes - 1);
          } else if (elapsed < 1150) {
            // Hold at button — trigger ripple once
            targetEnd = btnWorld;
            segLen = Math.max(restTotalLen, portWorld.distanceTo(btnWorld) * 1.1) / (numNodes - 1);
            if (!act.pulsed) {
              act.pulsed = true;
              triggerButtonImpact(act.targetX, act.targetY);
            }
          } else {
            // Retract back
            const p = (elapsed - 1150) / (total - 1150);
            const eased = 1 - Math.pow(1 - p, 2);
            const distToBtn = portWorld.distanceTo(btnWorld);
            const currentNeeded = Math.max(restTotalLen, distToBtn * 1.1);
            segLen = THREE.MathUtils.lerp(currentNeeded, restTotalLen, eased) / (numNodes - 1);
          }
        } else {
          act.active = false;
        }
      }

      // Verlet physics
      const damping = 0.87;
      const gravity = -0.014;
      for (let i = 1; i < numNodes; i++) {
        const vx = (nodes[i].x - prevNodes[i].x) * damping;
        const vy = (nodes[i].y - prevNodes[i].y) * damping;
        const vz = (nodes[i].z - prevNodes[i].z) * damping;
        prevNodes[i].copy(nodes[i]);
        const idlePullX = targetEnd ? 0 : (portWorld.x - nodes[i].x) * 0.05;
        nodes[i].x += vx + idlePullX;
        nodes[i].y += vy + gravity;
        nodes[i].z += vz;
      }

      if (targetEnd) nodes[numNodes - 1].copy(targetEnd);

      // Distance constraint relaxation
      for (let iter = 0; iter < 8; iter++) {
        nodes[0].copy(portWorld);
        if (targetEnd) nodes[numNodes - 1].copy(targetEnd);
        for (let i = 0; i < numNodes - 1; i++) {
          const a = nodes[i];
          const b = nodes[i + 1];
          const diff = new THREE.Vector3().subVectors(b, a);
          const dist = diff.length() || 0.0001;
          const error = (dist - segLen) / dist;
          if (i === 0) {
            b.sub(diff.multiplyScalar(error));
          } else if (i + 1 === numNodes - 1 && targetEnd) {
            a.add(diff.multiplyScalar(error));
          } else {
            const half = diff.multiplyScalar(error * 0.5);
            a.add(half);
            b.sub(half);
          }
        }
      }

      // Update cable geometry & plug orientation
      const updatedCurve = new THREE.CatmullRomCurve3(nodes);
      cableMesh.geometry.dispose();
      cableMesh.geometry = new THREE.TubeGeometry(updatedCurve, 40, 0.016 * scaleFactor, 10, false);

      const tipNode = nodes[numNodes - 1];
      const prevTipNode = nodes[numNodes - 2];
      const tangent = new THREE.Vector3().subVectors(tipNode, prevTipNode).normalize();
      plugGroup.position.copy(tipNode);
      plugGroup.scale.setScalar(scaleFactor);
      if (tangent.lengthSq() > 0.001) {
        plugGroup.quaternion.setFromUnitVectors(downAxis, tangent);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      leatherBump.dispose();
      envRT.dispose();
      dracoLoader.dispose();
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
