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

/**
 * Generates a fine procedural leather-grain bump map for the ear cushions.
 */
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

/**
 * Generates a soft radial contact shadow texture.
 */
function createContactShadowTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(size / 2, size / 2, 4, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(11, 11, 12, 0.38)');
  grad.addColorStop(0.55, 'rgba(11, 11, 12, 0.14)');
  grad.addColorStop(1, 'rgba(11, 11, 12, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
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
 * Triggers a subtle physical bounce + warm gold contact ripple on the Navbar cart button.
 */
function triggerCartImpact(cartEl) {
  if (!cartEl) return;
  cartEl.style.transition = 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 260ms ease';
  cartEl.style.transform = 'scale(1.18) translateY(2px)';
  cartEl.style.boxShadow = '0 0 0 6px rgba(200, 169, 126, 0.28)';

  setTimeout(() => {
    if (!cartEl) return;
    cartEl.style.transform = 'scale(0.96)';
    cartEl.style.boxShadow = '0 0 0 12px rgba(200, 169, 126, 0)';
  }, 160);

  setTimeout(() => {
    if (!cartEl) return;
    cartEl.style.transform = '';
    cartEl.style.boxShadow = '';
  }, 340);
}

/**
 * Photorealistic GLTF Over-Ear Headphone with Verlet Rope AUX Cable Physics.
 * - Loads /models/headphones.gltf (Blender-sculpted over-ear asset) with RoomEnvironment PBR reflections.
 * - Normalizes & hangs the headband directly over #hero-headphone-anchor ('O' in "Objects").
 * - Simulates a 16-node fixed-length Verlet rubber cable + 3.5mm TRS metal plug under gravity.
 * - On Add-to-Cart (lastAddedEvent), swings the 3.5mm connector cleanly to #navbar-cart-icon,
 *   taps it with contact feedback, and settles back under gravity.
 */
export default function Headphone3D() {
  const { lastAddedEvent } = useCart();
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

    // Photorealistic studio HDRI-style RoomEnvironment reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // Soft studio key + warm champagne rim lighting (makes matte-black pop on both dark & beige themes)
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
    const shadowTex = createContactShadowTexture();

    // Headphone anchor & pivot (pivots right where the headband rests on 'O')
    const pivotGroup = new THREE.Group();
    scene.add(pivotGroup);

    // Subtle contact shadow right behind the headband/earcups
    const contactShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 1.5),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.7 })
    );
    contactShadow.position.set(0.05, -0.55, -0.35);
    pivotGroup.add(contactShadow);

    // Local offset where the AUX cable attaches to the left earcup bottom
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

        // Upgrade GLTF materials to NovaStore luxury matte-black & champagne-gold PBR
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
            // Replace neon blue accent with brushed champagne gold
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

        // Normalize GLTF scale & pivot so top inner headband sits at (0, 0, 0)
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        const targetHeight = 1.38;
        const normScale = targetHeight / (size.y || 1);
        model.scale.setScalar(normScale);

        // Recompute bounds after scaling
        const scaledBox = new THREE.Box3().setFromObject(model);
        const scaledCenter = new THREE.Vector3();
        scaledBox.getCenter(scaledCenter);

        model.position.x -= scaledCenter.x;
        model.position.z -= scaledCenter.z;
        // Hang downward so the top headband arch rests at y = 0
        model.position.y -= scaledBox.max.y - 0.1;

        // Slight 3/4 editorial turn so earcups & gold ring show depth around 'O'
        const modelWrapper = new THREE.Group();
        modelWrapper.rotation.y = 0.36;
        modelWrapper.rotation.z = -0.03;
        modelWrapper.add(model);
        pivotGroup.add(modelWrapper);

        // Measure left earcup bottom in wrapper space for exact cable attachment
        const finalBox = new THREE.Box3().setFromObject(modelWrapper);
        localPortOffset.set(
          finalBox.min.x + (finalBox.max.x - finalBox.min.x) * 0.24,
          finalBox.min.y + 0.14,
          0.06
        );
        modelLoaded = true;
      },
      undefined,
      (err) => {
        console.error('Failed to load headphones.gltf', err);
      }
    );

    // --- VERLET ROPE PHYSICS AUX CABLE ---
    const numNodes = 16;
    const nodes = Array.from({ length: numNodes }, (_, i) => new THREE.Vector3(0, -i * 0.12, 0));
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
      new THREE.TubeGeometry(cableCurve, 36, 0.017, 10, false),
      rubberCableMat
    );
    scene.add(cableMesh);

    // Detailed 3.5mm TRS Metal Connector (aligned along local -Y)
    const plugGroup = new THREE.Group();
    const strainBoot = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.026, 0.055, 14), rubberCableMat);
    strainBoot.position.y = 0.02;
    const gripBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.027, 0.027, 0.095, 16), plugBodyMat);
    gripBarrel.position.y = -0.055;
    const goldCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.024, 0.022, 16), goldMat);
    goldCollar.position.y = -0.11;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.011, 0.11, 14), chromeMat);
    shaft.position.y = -0.175;
    // Two black TRS insulator rings
    const ring1 = new THREE.Mesh(new THREE.CylinderGeometry(0.0125, 0.0125, 0.008, 14), rubberCableMat);
    ring1.position.y = -0.155;
    const ring2 = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.008, 14), rubberCableMat);
    ring2.position.y = -0.19;
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.011, 12, 12), chromeMat);
    tip.position.y = -0.232;

    plugGroup.add(strainBoot, gripBarrel, goldCollar, shaft, ring1, ring2, tip);
    scene.add(plugGroup);

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
      mouse.targetX = ((e.clientX / window.innerWidth) - 0.5) * 0.22;
      mouse.targetY = ((e.clientY / window.innerHeight) - 0.5) * 0.08;
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
    let frameCount = 0;
    const startClock = performance.now();
    const downAxis = new THREE.Vector3(0, -1, 0);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (document.hidden || !modelLoaded) return;
      frameCount++;

      const t = (performance.now() - startClock) * 0.001;
      const anchorEl = document.getElementById('hero-headphone-anchor');
      const act = actionRef.current;

      // Keep cable active during an Add-to-Cart tap even if user scrolled down or is on /products
      if (!anchorEl) {
        pivotGroup.visible = false;
        if (!act.active || prefersReducedMotion) {
          cableMesh.visible = false;
          plugGroup.visible = false;
          return;
        }
      }

      const rect = anchorEl ? anchorEl.getBoundingClientRect() : null;
      const isHeroVisible = rect ? (rect.bottom > -80 && rect.top < window.innerHeight + 80) : false;
      pivotGroup.visible = isHeroVisible;

      if (!isHeroVisible && !act.active) {
        cableMesh.visible = false;
        plugGroup.visible = false;
        return;
      }

      cableMesh.visible = true;
      plugGroup.visible = true;

      let anchorWorldHeight = 1.42;
      let scaleFactor = 0.72;
      let portWorld;

      if (rect && isHeroVisible) {
        // Anchor top of headband right over the upper arch of 'O'
        const anchorWorld = screenToWorld(rect.left + rect.width * 0.5, rect.top + rect.height * 0.14);
        pivotGroup.position.copy(anchorWorld);

        const anchorTopWorld = screenToWorld(rect.left, rect.top);
        const anchorBottomWorld = screenToWorld(rect.left, rect.bottom);
        anchorWorldHeight = Math.abs(anchorTopWorld.y - anchorBottomWorld.y);
        scaleFactor = anchorWorldHeight / 1.42;
        pivotGroup.scale.setScalar(scaleFactor);

        let reactionTilt = 0;
        if (act.active && !prefersReducedMotion) {
          const elapsed = performance.now() - act.startTime;
          reactionTilt = Math.sin(Math.min(elapsed / 1900, 1) * Math.PI * 2) * 0.032;
        }

        if (!prefersReducedMotion) {
          mouse.x += (mouse.targetX - mouse.x) * 0.05;
          mouse.y += (mouse.targetY - mouse.y) * 0.05;
          pivotGroup.rotation.z = Math.sin(t * 1.05) * 0.015 + reactionTilt;
          pivotGroup.rotation.y = mouse.x;
          pivotGroup.rotation.x = mouse.y * 0.3;
        }

        pivotGroup.updateMatrixWorld(true);
        portWorld = localPortOffset.clone().applyMatrix4(pivotGroup.matrixWorld);
      } else {
        // Off-hero fallback origin: enters gracefully from above the viewport near left column
        const fallbackX = rect ? rect.left + rect.width * 0.25 : Math.min(window.innerWidth * 0.14, 180);
        portWorld = screenToWorld(fallbackX, -30);
      }

      // Natural resting cable length (~0.95x headphone height, hanging gently in left margin)
      const restTotalLen = Math.max(anchorWorldHeight * 0.95, 0.72);
      let segLen = restTotalLen / (numNodes - 1);

      if (!cableInitialized) {
        for (let i = 0; i < numNodes; i++) {
          nodes[i].set(portWorld.x, portWorld.y - i * segLen, portWorld.z);
          prevNodes[i].copy(nodes[i]);
        }
        cableInitialized = true;
      }

      // If the anchor moved (e.g. page scroll or font load), translate all rope nodes by delta
      // so scrolling/reflow never introduces artificial lateral velocity
      const delta = new THREE.Vector3().subVectors(portWorld, nodes[0]);
      if (delta.lengthSq() > 0.0001) {
        for (let i = 1; i < numNodes; i++) {
          nodes[i].add(delta);
          prevNodes[i].add(delta);
        }
      }

      // Pin node 0 to earcup AUX port
      nodes[0].copy(portWorld);
      prevNodes[0].copy(portWorld);

      // Check active Add-to-Cart tap interaction (~1.9s)
      let targetEnd = null;
      if (act.active && !prefersReducedMotion) {
        const elapsed = performance.now() - act.startTime;
        const total = 1900;
        const cartEl = document.getElementById('navbar-cart-icon');

        if (elapsed < total && cartEl) {
          const cRect = cartEl.getBoundingClientRect();
          const cartWorld = screenToWorld(cRect.left + cRect.width / 2, cRect.top + cRect.height / 2);
          const distToCart = portWorld.distanceTo(cartWorld);

          if (elapsed < 750) {
            const p = elapsed / 750;
            const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
            const restTip = new THREE.Vector3(portWorld.x, portWorld.y - restTotalLen, portWorld.z);
            targetEnd = new THREE.Vector3().lerpVectors(restTip, cartWorld, eased);
            const neededLen = Math.max(restTotalLen, portWorld.distanceTo(targetEnd) * 1.12);
            segLen = neededLen / (numNodes - 1);
          } else if (elapsed < 1080) {
            targetEnd = cartWorld;
            segLen = Math.max(restTotalLen, distToCart * 1.12) / (numNodes - 1);
            if (!act.pulsed) {
              act.pulsed = true;
              triggerCartImpact(cartEl);
            }
          } else {
            const p = (elapsed - 1080) / (total - 1080);
            const eased = 1 - Math.pow(1 - p, 2);
            const currentNeeded = Math.max(restTotalLen, distToCart * 1.12);
            segLen = THREE.MathUtils.lerp(currentNeeded, restTotalLen, eased) / (numNodes - 1);
          }
        } else {
          act.active = false;
        }
      }

      // Verlet integration step with gravity and gentle damping
      const damping = 0.88;
      const gravity = -0.012;
      for (let i = 1; i < numNodes; i++) {
        const vx = (nodes[i].x - prevNodes[i].x) * damping;
        const vy = (nodes[i].y - prevNodes[i].y) * damping;
        const vz = (nodes[i].z - prevNodes[i].z) * damping;
        prevNodes[i].copy(nodes[i]);
        // Gentle lateral restore when resting so cable hangs naturally downward
        const idlePullX = targetEnd ? 0 : (portWorld.x - nodes[i].x) * 0.06;
        nodes[i].x += vx + idlePullX;
        nodes[i].y += vy + gravity;
        nodes[i].z += vz;
      }

      if (targetEnd) {
        nodes[numNodes - 1].copy(targetEnd);
      }

      // Fixed-length distance constraint relaxation (prevents elastic stretching)
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

      // Update TubeGeometry & 3.5mm TRS Plug Orientation
      const updatedCurve = new THREE.CatmullRomCurve3(nodes);
      cableMesh.geometry.dispose();
      cableMesh.geometry = new THREE.TubeGeometry(updatedCurve, 36, 0.017 * scaleFactor, 10, false);

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
      shadowTex.dispose();
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
