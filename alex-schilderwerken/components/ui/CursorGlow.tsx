"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorGlow() {
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  // Dot: volgt muis direct, geen vertraging
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // Ring: vloeiende follow met spring (lerp ~0.12)
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const ringX = useSpring(rawX, { stiffness: 100, damping: 22, mass: 0.5 });
  const ringY = useSpring(rawY, { stiffness: 100, damping: 22, mass: 0.5 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovering(!!t.closest("a, button, [data-hover]"));
    };

    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    window.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseleave", leave);
    };
  }, [dotX, dotY, rawX, rawY, visible]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] hidden lg:block"
      aria-hidden
    >
      {/* Grote ring — vertraagd */}
      <motion.div
        style={{
          position: "fixed",
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          top: 0,
          left: 0,
        }}
        animate={{
          scale: hovering ? 2.5 : 1,
          opacity: visible ? 1 : 0,
          backgroundColor: hovering ? "rgba(61,111,212,0.08)" : "transparent",
        }}
        transition={{ scale: { type: "spring", stiffness: 200, damping: 20 }, opacity: { duration: 0.2 } }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "1px solid rgba(61,111,212,0.65)",
          }}
        />
      </motion.div>

      {/* Kleine stip — direct */}
      <motion.div
        style={{
          position: "fixed",
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          top: 0,
          left: 0,
        }}
        animate={{
          scale: hovering ? 0 : 1,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#3D6FD4",
          }}
        />
      </motion.div>
    </div>
  );
}
