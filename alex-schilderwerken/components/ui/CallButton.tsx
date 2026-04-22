"use client";

import { motion } from "framer-motion";

export default function CallButton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: "fixed", right: 24, bottom: 96, zIndex: 9990 }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          backgroundColor: "#3D6FD4",
          animation: "call-ping 2s ease-out infinite",
          opacity: 0,
        }}
      />

      <style>{`
        @keyframes call-ping {
          0%   { transform: scale(1);   opacity: 0.55; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes call-shake {
          0%, 100% { transform: rotate(0deg); }
          15%      { transform: rotate(-12deg); }
          30%      { transform: rotate(12deg); }
          45%      { transform: rotate(-8deg); }
          60%      { transform: rotate(8deg); }
          75%      { transform: rotate(-4deg); }
        }
        .call-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 0 0 4px rgba(61,111,212,0.25), 0 8px 32px rgba(61,111,212,0.45);
        }
        .call-btn:hover svg {
          animation: call-shake 0.8s ease-in-out;
        }
      `}</style>

      <a
        href="tel:0618269798"
        aria-label="Bel Alex Schilderwerken direct op 06 18 26 97 98"
        className="call-btn"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 56,
          height: 56,
          borderRadius: "50%",
          backgroundColor: "#3D6FD4",
          boxShadow: "0 4px 20px rgba(61,111,212,0.35)",
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
        </svg>
      </a>
    </motion.div>
  );
}
