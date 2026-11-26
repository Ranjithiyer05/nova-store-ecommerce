import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';

/**
 * Interactive Add-to-Cart AUX Cable Animation.
 * Uses spring-damped physics so the dangling AUX connector swings from the
 * hero headphone to the live Navbar cart icon, taps it with a subtle gold
 * impact ripple, bounces the cart icon, and smoothly returns.
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

    window.dispatchEvent(new CustomEvent('novastore:aux-action'));

    const cartRect = cartEl.getBoundingClientRect();
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;

    const originEl = document.getElementById('hero-headphone-cable-origin');
    let startX = Math.min(window.innerWidth * 0.16, 220);
    let startY = 230;

    if (originEl) {
      const originRect = originEl.getBoundingClientRect();
      if (originRect.bottom > 0 && originRect.top < window.innerHeight) {
        startX = originRect.left + originRect.width / 2;
        startY = originRect.top + originRect.height / 2;
      }
    }

    const dx = endX - startX;
    const sag = Math.min(Math.max(Math.abs(dx) * 0.24, 60), 160);

    const cp1X = startX + dx * 0.25;
    const cp1Y = startY + sag;
    const cp2X = startX + dx * 0.75;
    const cp2Y = endY + sag * 0.55;

    const d = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    const totalDuration = 950;
    const extendEnd = 400;
    const tapEnd = 580;
    let pulsed = false;
    const startTime = performance.now();

    setCableState({ d, endX, endY, progress: 0, phase: 'extend' });

    const tick = (now) => {
      const elapsed = now - startTime;

      if (elapsed < extendEnd) {
        const t = elapsed / extendEnd;
        const eased = 1 - Math.pow(1 - t, 3);
        setCableState({ d, endX, endY, progress: eased, phase: 'extend' });
      } else if (elapsed < tapEnd) {
        if (!pulsed) {
          pulsed = true;
          cartEl.style.transform = 'scale(1.24)';
          setTimeout(() => {
            if (cartEl) cartEl.style.transform = '';
          }, 260);
        }
        setCableState({ d, endX, endY, progress: 1, phase: 'tap' });
      } else if (elapsed < totalDuration) {
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
      <path
        d={cableState.d}
        fill="none"
        stroke="rgba(0,0,0,0.22)"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
        style={{ transform: 'translateY(3px)' }}
      />
      <path
        ref={pathRef}
        d={cableState.d}
        fill="none"
        stroke="#141416"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
      />
      {cableState.phase === 'tap' && (
        <circle
          cx={cableState.endX}
          cy={cableState.endY}
          r="6"
          fill="#C8A97E"
          className="animate-ping"
          style={{ opacity: 0.85 }}
        />
      )}
    </svg>
  );
}
