import React from 'react';
import { Link } from 'react-router-dom';

/**
 * NovaStore Logo Component
 * Hand-crafted SVG with:
 *  - 3D extruded badge (layered rects + gradient faces simulate depth)
 *  - Gloss shine overlay on top face
 *  - Soft drop shadow
 *  - Bold "N" lettermark (Nova) with star accent
 */
function Logo({ className = '' }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 flex-shrink-0 group ${className}`}>
      <svg
        width="40"
        height="42"
        viewBox="0 0 40 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="NovaStore"
      >
        <defs>
          {/* Main face gradient: top-left bright → bottom-right deep */}
          <linearGradient id="faceGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5EAEFF" />
            <stop offset="55%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1A3FA0" />
          </linearGradient>

          {/* Right-side extrusion face: darker for shadow depth */}
          <linearGradient id="rightFaceGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#12317A" />
          </linearGradient>

          {/* Bottom extrusion face */}
          <linearGradient id="bottomFaceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E40AF" />
            <stop offset="100%" stopColor="#0F2960" />
          </linearGradient>

          {/* Gloss shine on top of main face */}
          <linearGradient id="shineGrad" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.38" />
            <stop offset="100%" stopColor="white" stopOpacity="0.0" />
          </linearGradient>

          {/* Clip gloss to top 45% of face */}
          <clipPath id="shineClip">
            <rect x="3" y="1" width="34" height="17" rx="7.5" />
          </clipPath>

          {/* Drop shadow under the whole badge */}
          <filter id="shadow" x="-15%" y="-5%" width="140%" height="150%">
            <feDropShadow dx="0" dy="4" stdDeviation="3.5"
              floodColor="#1E3A8A" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* === 3D EXTRUSION LAYERS === */}

        {/* Right side face of 3D box — creates right-edge depth */}
        <rect x="6" y="4" width="34" height="34" rx="9" fill="url(#rightFaceGrad)" />

        {/* Bottom face of 3D box — creates bottom-edge depth */}
        <rect x="3" y="6" width="34" height="34" rx="9" fill="url(#bottomFaceGrad)" />

        {/* === MAIN FRONT FACE === */}
        <rect
          x="3" y="1"
          width="34" height="34"
          rx="8.5"
          fill="url(#faceGrad)"
          filter="url(#shadow)"
        />

        {/* === GLOSS SHINE (top half catch-light) === */}
        <rect
          x="3" y="1"
          width="34" height="34"
          rx="8.5"
          fill="url(#shineGrad)"
          clipPath="url(#shineClip)"
        />

        {/* Top-left corner highlight dot — simulates light source */}
        <ellipse cx="11" cy="7" rx="5" ry="3.5" fill="white" opacity="0.12" />

        {/* === N LETTERMARK === */}
        {/* Bold, clean N — slightly heavier stroke so it reads at small sizes */}
        <path
          d="M13.5 27 L13.5 11 L26.5 25 L26.5 11"
          stroke="white"
          strokeWidth="2.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Nova star accent — tiny 4-point star above and right of N */}
        <path
          d="M31 8 L31.9 10.1 L34 11 L31.9 11.9 L31 14 L30.1 11.9 L28 11 L30.1 10.1 Z"
          fill="white"
          opacity="0.9"
        />
      </svg>

      {/* Wordmark */}
      <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-blue-400 transition leading-none">
        Nova<span className="gradient-text">Store</span>
      </span>
    </Link>
  );
}

export default Logo;
