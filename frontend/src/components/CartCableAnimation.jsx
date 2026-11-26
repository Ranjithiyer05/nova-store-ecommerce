import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';

/**
 * Signature Add-to-Cart Headphone Cable Animation.
 * Draws an animated SVG cubic Bézier cable from the hero headphone's earcup
 * to the shopping cart icon in the Navbar, performs a subtle plug/tap,
 * pulses the cart icon, and retracts naturally (~950ms).
 */
export default function CartCableAnimation() {
  const { lastAddedEvent } = useCart();
  const [cableState, setCableState] = useState(null);
  const rafRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    if (!lastAddedEvent) return;

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cartEl = document.getElementById('navbar-cart-icon');
    if (!cartEl) return;

    const cartRect = cartEl.getBoundingClientRect();
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;

    // Origin: bottom of the hero headphone's left earcup if visible, else top-left fallback
    const originEl = document.getElementById('hero-headphone-cable-origin');
    let startX = Math.min(window.innerWidth * 0.18, 220);
    let startY = 180;

    if (originEl) {
      const originRect = originEl.getBoundingClientRect();
      if (originRect.bottom > 0 && originRect.top < window.innerHeight) {
        startX = originRect.left + originRect.width / 2;
        startY = originRect.top + originRect.height / 2;
      }
    }

    // Natural catenary / gravity sag control points
    const dx = endX - startX;
    const dy = endY - startY;
    const sag = Math.min(Math.max(Math.abs(dx) * 0.25, 60), 160);

    const cp1X = startX + dx * 0.25;
    const cp1Y = startY + sag;
    const cp2X = startX + dx * 0.75;
    const cp2Y = endY + sag * 0.55;

    const d = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    const totalDuration = 950; // ms
    const extendEnd = 380;
    const tapEnd = 560;
    let pulsed = false;
    const startTime = performance.now();

    setCableState({
      d,
      endX,
      endY,
      progress: 0,
      phase: 'extend',
    });

    const tick = (now) => {
      const elapsed = now - startTime;

      if (elapsed < extendEnd) {
        // Phase 1: Extend cable toward cart
        const t = elapsed / extendEnd;
        const eased = 1 - Math.pow(1 - t, 3);
        setCableState({ d, endX, endY, progress: eased, phase: 'extend' });
      } else if (elapsed < tapEnd) {
        // Phase 2: Tap / plug into cart icon
        if (!pulsed) {
          pulsed = true;
          cartEl.style.transform = 'scale(1.22)';
          setTimeout(() => {
            if (cartEl) cartEl.style.transform = '';
          }, 260);
        }
        setCableState({ d, endX, endY, progress: 1, phase: 'tap' });
      } else if (elapsed < totalDuration) {
        // Phase 3: Retract naturally back to headphone
        const t = (elapsed - tapEnd) / (totalDuration - tapEnd);
        const eased = t * t;
        setCableState({ d, endX, endY, progress: 1 - eased, phase: 'retract' });
      } else {
        setCableState(null);
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [lastAddedEvent]);

  if (!cableState) return null;

  const pathLength = pathRef.current ? pathRef.current.getTotalLength() : 1000;
  const dashOffset = pathLength * (1 - cableState.progress);

  return (
    <svg
      className="fixed inset-0 w-screen h-screen pointer-events-none z-[60]"
      aria-hidden="true"
    >
      {/* Soft shadow beneath cable */}
      <path
        d={cableState.d}
        fill="none"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
        style={{ transform: 'translateY(3px)' }}
      />
      {/* Matte-black headphone cable */}
      <path
        ref={pathRef}
        d={cableState.d}
        fill="none"
        stroke="#141416"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
      />
      {/* Champagne-gold 3.5mm plug tip when tapping */}
      {cableState.phase === 'tap' && (
        <circle
          cx={cableState.endX}
          cy={cableState.endY}
          r="5"
          fill="#C8A97E"
          className="animate-ping"
          style={{ opacity: 0.75 }}
        />
      )}
    </svg>
  );
}
