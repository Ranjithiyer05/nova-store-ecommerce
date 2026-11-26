import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

/**
 * Premium Photorealistic AUX Cable & 3.5mm TRS Audiophile Connector Animation
 *
 * When an "Add to Cart" button is clicked:
 * 1. A braided matte-black & champagne gold audio cable drops smoothly from above the viewport.
 * 2. A realistic 3.5mm TRS stereo plug (surgical chrome tip with retention groove,
 *    Delrin insulator bands, champagne gold collar, CNC gunmetal barrel with NOVA laser etching,
 *    and segmented rubber strain relief) drops along the cable's trajectory.
 * 3. On contact with the basket button, dual acoustic gold ripples and a subtle spark flare expand.
 * 4. After a brief hold to showcase the craftsmanship, the assembly smoothly recoils and vanishes.
 */
export default function CableAnimation() {
  const { lastAddedEvent } = useCart();
  const [anim, setAnim] = useState(null);

  useEffect(() => {
    if (!lastAddedEvent) return;

    const endX = lastAddedEvent.targetX ?? window.innerWidth * 0.85;
    const endY = lastAddedEvent.targetY ?? window.innerHeight * 0.6;

    // Cable drops from well above the viewport with a natural lateral curve
    const isRightHalf = endX > window.innerWidth * 0.5;
    const startX = isRightHalf
      ? endX - Math.min(endX * 0.28, 140)
      : endX + Math.min((window.innerWidth - endX) * 0.28, 140);
    const startY = -90;

    // The plug is 82px tall from tip (0,0) to cable entry (0,-82)
    // We compute the incoming approach vector and dock point
    const approxDy = endY - (startY + (endY - startY) * 0.5);
    const approxDx = endX - startX;
    const rawAngle = Math.atan2(approxDy, approxDx);
    // Clamp angle so plug always arrives pointing downwards within ~68deg to 112deg
    const angleRad = Math.max(Math.min(rawAngle, Math.PI * 0.62), Math.PI * 0.38);
    const angleDeg = (angleRad * 180) / Math.PI - 90; // offset so local -Y matches incoming trajectory

    const plugLength = 82;
    const dockX = endX - Math.cos(angleRad) * plugLength;
    const dockY = endY - Math.sin(angleRad) * plugLength;

    // Cubic bezier control points for realistic natural cable hang
    const cp1x = startX + (dockX - startX) * 0.25;
    const cp1y = startY + (dockY - startY) * 0.52;
    const cp2x = dockX - Math.cos(angleRad) * 45;
    const cp2y = dockY - Math.sin(angleRad) * 45;

    const cablePath = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${dockX} ${dockY}`;

    setAnim({
      id: lastAddedEvent.id,
      cablePath,
      endX,
      endY,
      angleDeg,
    });

    // Lifecycle: 0.48s entry -> 0.65s hold/inspection -> 0.55s smooth recoil
    const timer = setTimeout(() => setAnim(null), 1700);
    return () => clearTimeout(timer);
  }, [lastAddedEvent]);

  if (!anim) return null;

  return (
    <>
      <style>{`
        @keyframes nova-cable-draw {
          0%   { stroke-dashoffset: 2400; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes nova-plug-impact {
          0% {
            transform: translateY(-160px);
            opacity: 0;
          }
          60% {
            opacity: 1;
          }
          78% {
            transform: translateY(3.5px);
          }
          89% {
            transform: translateY(-1.2px);
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes nova-assembly-fade {
          0%   { opacity: 1; transform: translateY(0); }
          72%  { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-24px); }
        }
        @keyframes nova-flare-pop {
          0%   { transform: scale(0.15); opacity: 0; }
          40%  { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(2.0); opacity: 0; }
        }
        @keyframes nova-ripple-one {
          0%   { transform: scale(0.15); opacity: 1; }
          100% { transform: scale(1);    opacity: 0; }
        }
        @keyframes nova-ripple-two {
          0%   { transform: scale(0.15); opacity: 0.85; }
          100% { transform: scale(1);    opacity: 0; }
        }
      `}</style>

      <svg
        key={anim.id}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 9999,
          overflow: 'visible',
        }}
      >
        <defs>
          {/* Ambient drop shadow for true 3D spatial depth */}
          <filter id="nova-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.42" />
          </filter>

          {/* Surgical Chrome / Stainless Steel TRS Pin */}
          <linearGradient id="nova-chrome-pin" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#484852" />
            <stop offset="16%" stopColor="#9696a4" />
            <stop offset="36%" stopColor="#ededf5" />
            <stop offset="48%" stopColor="#ffffff" />
            <stop offset="62%" stopColor="#dcdce8" />
            <stop offset="82%" stopColor="#7a7a85" />
            <stop offset="100%" stopColor="#36363d" />
          </linearGradient>

          {/* Delrin Matte Obsidian Insulator Bands */}
          <linearGradient id="nova-delrin" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0c0c0e" />
            <stop offset="45%" stopColor="#28282e" />
            <stop offset="100%" stopColor="#08080a" />
          </linearGradient>

          {/* NovaStore Signature Champagne Gold Collar & Accents */}
          <linearGradient id="nova-gold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#785c34" />
            <stop offset="20%" stopColor="#C8A97E" />
            <stop offset="46%" stopColor="#FFF4DE" />
            <stop offset="62%" stopColor="#D6BE94" />
            <stop offset="82%" stopColor="#8C6D46" />
            <stop offset="100%" stopColor="#4e381c" />
          </linearGradient>

          {/* Anodized Gunmetal Aluminum Barrel */}
          <linearGradient id="nova-barrel" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#141416" />
            <stop offset="20%" stopColor="#2a2a32" />
            <stop offset="44%" stopColor="#4a4a56" />
            <stop offset="52%" stopColor="#565664" />
            <stop offset="72%" stopColor="#26262d" />
            <stop offset="100%" stopColor="#101012" />
          </linearGradient>

          {/* Molded Rubber Strain Relief Boot */}
          <linearGradient id="nova-rubber" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#141416" />
            <stop offset="45%" stopColor="#28282e" />
            <stop offset="100%" stopColor="#101012" />
          </linearGradient>

          {/* Impact Spark / Flare */}
          <radialGradient id="nova-spark-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF4D9" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#C8A97E" stopOpacity="0.65" />
            <stop offset="70%" stopColor="#8C6D46" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#8C6D46" stopOpacity="0" />
          </radialGradient>

          {/* Cable reveal mask */}
          <mask id="nova-cable-reveal">
            <path
              d={anim.cablePath}
              stroke="#ffffff"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
              style={{
                strokeDasharray: 2400,
                strokeDashoffset: 2400,
                animation: 'nova-cable-draw 0.48s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
            />
          </mask>
        </defs>

        {/* ── Main Animated Assembly (Retracts & fades after hold) ── */}
        <g style={{ animation: 'nova-assembly-fade 1.7s ease forwards' }}>

          {/* ── 1. Soft Ambient Cable Shadow ── */}
          <path
            d={anim.cablePath}
            stroke="#000000"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            opacity="0.32"
            filter="url(#nova-shadow)"
            style={{
              strokeDasharray: 2400,
              strokeDashoffset: 2400,
              animation: 'nova-cable-draw 0.48s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          />

          {/* ── 2. Braided Audiophile Cable (Masked reveal) ── */}
          <g mask="url(#nova-cable-reveal)" filter="url(#nova-shadow)">
            {/* Core black rubber base */}
            <path
              d={anim.cablePath}
              stroke="#131315"
              strokeWidth="4.6"
              strokeLinecap="round"
              fill="none"
            />
            {/* Braided Kevlar texture weave */}
            <path
              d={anim.cablePath}
              stroke="#2c2c34"
              strokeWidth="4.6"
              strokeDasharray="2.8 3.2"
              fill="none"
            />
            {/* Gold woven tracer thread (audiophile signature) */}
            <path
              d={anim.cablePath}
              stroke="#C8A97E"
              strokeWidth="1.1"
              strokeDasharray="1.4 5.2"
              strokeDashoffset="2.4"
              opacity="0.75"
              fill="none"
            />
            {/* Cylindrical specular top sheen */}
            <path
              d={anim.cablePath}
              stroke="#ffffff"
              strokeWidth="0.9"
              opacity="0.22"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* ── 3. High-Detail 3.5mm TRS Audiophile Connector ── */}
          <g
            transform={`translate(${anim.endX}, ${anim.endY}) rotate(${anim.angleDeg})`}
            filter="url(#nova-shadow)"
          >
            {/* Local descent & settling bounce along approach axis */}
            <g style={{ animation: 'nova-plug-impact 0.48s cubic-bezier(0.16, 1, 0.3, 1) both' }}>

              {/* ─ (A) Surgical Stainless Steel TRS Tip with retention notch ─ */}
              <path
                d="M -1.6 0 C -1.6 1.4, 1.6 1.4, 1.6 0 L 2.6 -3.4 C 2.6 -4.1, 1.9 -4.6, 1.9 -5.2 C 1.9 -5.8, 2.6 -6.3, 2.6 -7.4 L -2.6 -7.4 C -2.6 -6.3, -1.9 -5.8, -1.9 -5.2 C -1.9 -4.6, -2.6 -4.1, -2.6 -3.4 Z"
                fill="url(#nova-chrome-pin)"
              />

              {/* ─ (B) Insulator Band 1 (Delrin) ─ */}
              <rect x="-2.6" y="-9.2" width="5.2" height="1.8" fill="url(#nova-delrin)" />

              {/* ─ (C) Ring Contact (Right Channel - Polished Steel) ─ */}
              <rect x="-2.6" y="-17.0" width="5.2" height="7.8" fill="url(#nova-chrome-pin)" />

              {/* ─ (D) Insulator Band 2 (Delrin) ─ */}
              <rect x="-2.6" y="-18.8" width="5.2" height="1.8" fill="url(#nova-delrin)" />

              {/* ─ (E) Sleeve Contact (Ground - Polished Steel) ─ */}
              <rect x="-2.6" y="-29.6" width="5.2" height="10.8" fill="url(#nova-chrome-pin)" />

              {/* ─ (F) Steel Stop Shoulder ─ */}
              <rect x="-3.5" y="-31.8" width="7.0" height="2.2" rx="0.5" fill="url(#nova-chrome-pin)" />

              {/* ─ (G) Champagne Gold Beveled Accent Collar ─ */}
              <rect x="-4.4" y="-36.4" width="8.8" height="4.6" rx="1.0" fill="url(#nova-gold)" />

              {/* ─ (H) CNC Machined Anodized Gunmetal Aluminum Barrel ─ */}
              <rect x="-4.8" y="-65.0" width="9.6" height="28.6" rx="1.8" fill="url(#nova-barrel)" />

              {/* Lower Knurled Grip Micro-Ring */}
              <rect x="-4.8" y="-40.5" width="9.6" height="3.2" fill="#1b1b1e" />
              <line
                x1="-4.8"
                y1="-38.9"
                x2="4.8"
                y2="-38.9"
                stroke="#C8A97E"
                strokeWidth="0.65"
                strokeDasharray="1.1 1.1"
                opacity="0.85"
              />

              {/* Laser-Etched "NOVA" Signature Brand Wordmark */}
              <text
                x="0"
                y="-49.2"
                fontFamily="Cinzel, 'Times New Roman', serif"
                fontSize="3.6"
                fontWeight="700"
                letterSpacing="1.8"
                fill="#C8A97E"
                textAnchor="middle"
                opacity="0.92"
              >
                NOVA
              </text>

              {/* Upper Knurled Grip Micro-Ring */}
              <rect x="-4.8" y="-60.5" width="9.6" height="3.2" fill="#1b1b1e" />
              <line
                x1="-4.8"
                y1="-58.9"
                x2="4.8"
                y2="-58.9"
                stroke="#C8A97E"
                strokeWidth="0.65"
                strokeDasharray="1.1 1.1"
                opacity="0.85"
              />

              {/* ─ (I) Rear Champagne Gold Trim Ring ─ */}
              <rect x="-4.4" y="-67.5" width="8.8" height="2.5" rx="0.8" fill="url(#nova-gold)" />

              {/* ─ (J) Molded Rubber Strain Relief Boot (Segmented) ─ */}
              <polygon
                points="-3.8,-67.5 3.8,-67.5 2.3,-82 -2.3,-82"
                fill="url(#nova-rubber)"
              />
              {/* Flex Ribs */}
              <line x1="-3.4" y1="-71.0" x2="3.4" y2="-71.0" stroke="#0e0e10" strokeWidth="1.2" />
              <line x1="-3.0" y1="-74.5" x2="3.0" y2="-74.5" stroke="#0e0e10" strokeWidth="1.2" />
              <line x1="-2.7" y1="-78.0" x2="2.7" y2="-78.0" stroke="#0e0e10" strokeWidth="1.2" />
              <line x1="-2.3" y1="-81.0" x2="2.3" y2="-81.0" stroke="#0e0e10" strokeWidth="1.0" />

            </g>
          </g>

        </g>

        {/* ── 4. Tactile Contact Ripples & Spark Flare (Fires exactly on impact) ── */}
        <g transform={`translate(${anim.endX}, ${anim.endY})`}>
          {/* Central gold micro-flash */}
          <circle
            r="16"
            fill="url(#nova-spark-glow)"
            style={{ animation: 'nova-flare-pop 0.42s ease-out 0.46s both' }}
          />

          {/* Primary sharp gold acoustic wave */}
          <g style={{ animation: 'nova-ripple-one 0.58s cubic-bezier(0.16, 1, 0.3, 1) 0.46s both' }}>
            <circle r="38" fill="none" stroke="#C8A97E" strokeWidth="2.2" />
          </g>

          {/* Secondary ambient champagne shockwave */}
          <g style={{ animation: 'nova-ripple-two 0.72s cubic-bezier(0.16, 1, 0.3, 1) 0.50s both' }}>
            <circle r="56" fill="none" stroke="#E6D0AC" strokeWidth="1.3" opacity="0.8" />
          </g>
        </g>
      </svg>
    </>
  );
}
