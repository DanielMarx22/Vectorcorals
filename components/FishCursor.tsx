"use client";

import { useEffect, useRef } from "react";
import { motion, useSpring } from "framer-motion";

export default function FishCursor() {
  const fishX = useSpring(-100, { stiffness: 500, damping: 35 });
  const fishY = useSpring(-100, { stiffness: 500, damping: 35 });
  const fishRotation = useSpring(0, { stiffness: 200, damping: 30 });
  const fishScaleY = useSpring(1, { stiffness: 400, damping: 30 });

  const lastMousePos = useRef({ x: 0, y: 0 });
  // We store the radian angle to continuously calculate the nose offset
  const lastAngleRad = useRef(0);

  useEffect(() => {
    const moveFish = (e: MouseEvent) => {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;

      let currentAngleRad = lastAngleRad.current;

      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        currentAngleRad = Math.atan2(dy, dx);
        lastAngleRad.current = currentAngleRad;

        const angleDeg = currentAngleRad * (180 / Math.PI);

        let currentRotation = fishRotation.get();
        let targetRotation = angleDeg;

        // Shortest path logic for smooth spinning
        while (targetRotation - currentRotation > 180) targetRotation -= 360;
        while (targetRotation - currentRotation < -180) targetRotation += 360;

        fishRotation.set(targetRotation);

        // Flip vertically if moving left to stay upright
        if (dx < 0) {
          fishScaleY.set(-1);
        } else if (dx > 0) {
          fishScaleY.set(1);
        }
      }

      // TRIGONOMETRY FIX:
      // The container is 56px wide (center is 28px). The nose is at ~52.5px.
      // The distance from the center belly to the nose is 24.5px.
      // We push the entire container backward by 24.5px along whatever angle it is currently facing.
      const noseRadius = 24.5;
      const targetX = e.clientX - 28 - noseRadius * Math.cos(currentAngleRad);
      const targetY = e.clientY - 28 - noseRadius * Math.sin(currentAngleRad);

      fishX.set(targetX);
      fishY.set(targetY);

      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", moveFish, { passive: true });
    return () => window.removeEventListener("mousemove", moveFish);
  }, [fishX, fishY, fishRotation, fishScaleY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-14 h-14 pointer-events-none z-[100] drop-shadow-[0_8px_12px_rgba(0,0,0,0.6)]"
      style={{
        x: fishX,
        y: fishY,
        rotate: fishRotation,
        // originX and originY are removed so it correctly defaults to rotating around its center (50% 50%)
      }}
    >
      <motion.div style={{ scaleY: fishScaleY }} className="w-full h-full">
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="realFishGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF7A00" />
              <stop offset="100%" stopColor="#B33000" />
            </linearGradient>
          </defs>
          <path
            d="M 22 22 C 30 10 42 12 46 24"
            fill="url(#realFishGrad)"
            stroke="black"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M 24 42 C 30 54 44 50 46 40"
            fill="url(#realFishGrad)"
            stroke="black"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M 16 32 L 2 18 C 6 32 6 32 2 46 L 16 32 Z"
            fill="url(#realFishGrad)"
            stroke="black"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M 60 32 C 60 16 38 10 16 24 C 12 28 10 30 10 32 C 10 34 12 36 16 40 C 38 54 60 48 60 32 Z"
            fill="url(#realFishGrad)"
            stroke="black"
            strokeWidth="1.5"
          />
          <path
            d="M 46 20 C 52 24 52 40 46 44 C 43 38 43 26 46 20 Z"
            fill="white"
            stroke="black"
            strokeWidth="1.5"
          />
          <path
            d="M 32 16 C 36 20 36 44 32 48 C 28 40 28 24 32 16 Z"
            fill="white"
            stroke="black"
            strokeWidth="1.5"
          />
          <path
            d="M 16 25 C 19 28 19 36 16 39 C 14 35 14 29 16 25 Z"
            fill="white"
            stroke="black"
            strokeWidth="1.5"
          />
          <circle
            cx="52"
            cy="27"
            r="2.5"
            fill="white"
            stroke="black"
            strokeWidth="0.5"
          />
          <circle cx="52.5" cy="26.5" r="1.5" fill="black" />
          <circle cx="53" cy="26" r="0.5" fill="white" />
          <path
            d="M 36 32 C 44 34 42 42 34 38 Z"
            fill="url(#realFishGrad)"
            stroke="black"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
