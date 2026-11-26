import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

/**
 * CableAnimation — the ONLY thing this component does:
 *
 * When any product's basket button is clicked, a black AUX cable drops from the
 * top of the screen, curves down to that exact button, makes a gold ripple on
 * contact, then fades away.  That's it.
 */
export default function CableAnimation() {
  const { lastAddedEvent } = useCart();
  const [anim, setAnim] = useState(null);

  useEffect(() => {
    if (!lastAddedEvent) return;

    const endX = lastAddedEvent.targetX ?? window.innerWidth * 0.85;
    const endY = lastAddedEvent.targetY ?? window.innerHeight * 0.6;

    // Cable starts from the very top of the screen, same horizontal area as the button
    const startX = endX;
    const startY = -10;

    // Natural draping bezier control points
    const cp1x = startX - 50;
    const cp1y = startY + (endY - startY) * 0.35;
    const cp2x = endX + 30;
    const cp2y = endY - (endY - startY) * 0.2;

    const path = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;

    setAnim({ path, endX, endY, id: lastAddedEvent.id });

    // Auto-clear after full animation (draw 0.6s + hold 0.4s + fade 0.5s)
    const t = setTimeout(() => setAnim(null), 1600);
    return () => clearTimeout(t);
  }, [lastAddedEvent]);

  if (!anim) return null;

  return (
    <>
      <style>{`
        @keyframes nova-cable-draw {
          from { stroke-dashoffset: 2000; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes nova-cable-fade {
          0%   { opacity: 1; }
          70%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes nova-plug-pop {
          0%   { opacity: 0; }
          40%  { opacity: 1; }
          100% { opacity: 1; }
        }
        @keyframes nova-ripple {
          0%   { r: 8;  opacity: 1; }
          100% { r: 32; opacity: 0; }
        }
        @keyframes nova-ripple2 {
          0%   { r: 8;  opacity: 0.6; }
          100% { r: 48; opacity: 0; }
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
          zIndex: 9998,
          overflow: 'visible',
        }}
      >
        {/* ── Main cable ── */}
        <path
          d={anim.path}
          stroke="#1a1a1c"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          style={{
            strokeDasharray: 2000,
            strokeDashoffset: 2000,
            animation: 'nova-cable-draw 0.55s cubic-bezier(0.4,0,0.2,1) forwards, nova-cable-fade 1.5s ease forwards',
          }}
        />

        {/* ── Thin gold highlight on cable ── */}
        <path
          d={anim.path}
          stroke="#C8A97E"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          strokeOpacity="0.4"
          style={{
            strokeDasharray: 2000,
            strokeDashoffset: 2000,
            animation: 'nova-cable-draw 0.55s cubic-bezier(0.4,0,0.2,1) forwards, nova-cable-fade 1.5s ease forwards',
          }}
        />

        {/* ── 3.5mm TRS steel plug tip ── */}
        {/* Shaft (steel chrome cylinder look) */}
        <rect
          x={anim.endX - 3}
          y={anim.endY - 18}
          width="6"
          height="22"
          rx="3"
          fill="#c8c8d0"
          stroke="#888"
          strokeWidth="0.6"
          style={{ animation: 'nova-plug-pop 0.35s ease-out 0.52s both' }}
        />
        {/* Gold insulator ring */}
        <rect
          x={anim.endX - 3.5}
          y={anim.endY - 7}
          width="7"
          height="4"
          rx="2"
          fill="#C8A97E"
          style={{ animation: 'nova-plug-pop 0.35s ease-out 0.52s both' }}
        />
        {/* Black insulator ring */}
        <rect
          x={anim.endX - 3}
          y={anim.endY - 2}
          width="6"
          height="3"
          rx="1.5"
          fill="#222"
          style={{ animation: 'nova-plug-pop 0.35s ease-out 0.52s both' }}
        />
        {/* Rounded steel tip */}
        <circle
          cx={anim.endX}
          cy={anim.endY + 4}
          r="3"
          fill="#b0b0bc"
          stroke="#777"
          strokeWidth="0.5"
          style={{ animation: 'nova-plug-pop 0.35s ease-out 0.52s both' }}
        />

        {/* ── Contact ripple 1 (sharp inner) ── */}
        <circle
          cx={anim.endX}
          cy={anim.endY}
          r="8"
          fill="none"
          stroke="#C8A97E"
          strokeWidth="2"
          style={{ animation: 'nova-ripple 0.5s ease-out 0.56s both' }}
        />

        {/* ── Contact ripple 2 (wider outer) ── */}
        <circle
          cx={anim.endX}
          cy={anim.endY}
          r="8"
          fill="none"
          stroke="#C8A97E"
          strokeWidth="1.5"
          style={{ animation: 'nova-ripple2 0.65s ease-out 0.65s both' }}
        />
      </svg>
    </>
  );
}
