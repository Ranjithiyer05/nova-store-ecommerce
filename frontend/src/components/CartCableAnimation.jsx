import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

/**
 * Signature AUX Cable Animation.
 * - Triggers on Add-to-Cart (travels to #navbar-cart-icon and pulses it).
 * - Triggers on any internal navigation link click (travels to the clicked
 *   button/link, taps it with the champagne-gold 3.5mm plug, then redirects).
 */
export default function CartCableAnimation() {
  const { lastAddedEvent } = useCart();
  const navigate = useNavigate();
  const [cableState, setCableState] = useState(null);
  const rafRef = useRef(null);
  const pathRef = useRef(null);
  const isNavigatingRef = useRef(false);

  const launchCable = useCallback((endX, endY, onTap, totalDuration = 850) => {
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (onTap) onTap();
      return;
    }

    // Notify 3D headphone to do a subtle reactive swing
    window.dispatchEvent(new CustomEvent('novastore:aux-action'));

    // Origin: bottom of the hero headphone's left earcup if visible, else right-center fallback
    const originEl = document.getElementById('hero-headphone-cable-origin');
    let startX = window.innerWidth * 0.68;
    let startY = 260;

    if (originEl) {
      const originRect = originEl.getBoundingClientRect();
      if (originRect.bottom > 0 && originRect.top < window.innerHeight) {
        startX = originRect.left + originRect.width / 2;
        startY = originRect.top + originRect.height / 2;
      }
    }

    const dx = endX - startX;
    const sag = Math.min(Math.max(Math.abs(dx) * 0.22, 50), 150);

    const cp1X = startX + dx * 0.25;
    const cp1Y = startY + sag;
    const cp2X = startX + dx * 0.75;
    const cp2Y = endY + sag * 0.55;

    const d = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    const extendEnd = totalDuration * 0.42;
    const tapEnd = totalDuration * 0.62;
    let tapped = false;
    const startTime = performance.now();

    setCableState({ d, endX, endY, progress: 0, phase: 'extend' });

    const tick = (now) => {
      const elapsed = now - startTime;

      if (elapsed < extendEnd) {
        const t = elapsed / extendEnd;
        const eased = 1 - Math.pow(1 - t, 3);
        setCableState({ d, endX, endY, progress: eased, phase: 'extend' });
      } else if (elapsed < tapEnd) {
        if (!tapped) {
          tapped = true;
          if (onTap) onTap();
        }
        setCableState({ d, endX, endY, progress: 1, phase: 'tap' });
      } else if (elapsed < totalDuration) {
        const t = (elapsed - tapEnd) / (totalDuration - tapEnd);
        const eased = t * t;
        setCableState({ d, endX, endY, progress: 1 - eased, phase: 'retract' });
      } else {
        setCableState(null);
        isNavigatingRef.current = false;
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // 1. Trigger on Add-to-Cart
  useEffect(() => {
    if (!lastAddedEvent) return;
    const cartEl = document.getElementById('navbar-cart-icon');
    if (!cartEl) return;

    const cartRect = cartEl.getBoundingClientRect();
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;

    launchCable(
      endX,
      endY,
      () => {
        cartEl.style.transform = 'scale(1.24)';
        setTimeout(() => {
          if (cartEl) cartEl.style.transform = '';
        }, 260);
      },
      920
    );
  }, [lastAddedEvent, launchCable]);

  // 2. Intercept internal navigation clicks so AUX cable touches the element first, then redirects
  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = e.target.closest('a[href]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) {
        return;
      }

      e.preventDefault();
      if (isNavigatingRef.current) return;
      isNavigatingRef.current = true;

      const rect = anchor.getBoundingClientRect();
      const endX = rect.left + rect.width / 2;
      const endY = rect.top + rect.height / 2;

      launchCable(
        endX,
        endY,
        () => {
          navigate(href);
        },
        560
      );
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [launchCable, navigate]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

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
        stroke="rgba(0,0,0,0.2)"
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
