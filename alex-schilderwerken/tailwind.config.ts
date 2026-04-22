import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080C14",
        surface: "#0F1624",
        card: "#0F1624",
        primary: "#1B3A6B",
        accent: "#3D6FD4",
        glow: "#5B8FFF",
        foreground: "#F0F4FF",
        muted: "#8A9BB5",
        border: "#1E2D47",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-sm": "0 0 20px rgba(61,111,212,0.15)",
        "glow-md": "0 0 40px rgba(61,111,212,0.2)",
        "glow-lg": "0 0 80px rgba(61,111,212,0.25)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-badge": "spin 20s linear infinite",
        "marquee": "marquee 35s linear infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
