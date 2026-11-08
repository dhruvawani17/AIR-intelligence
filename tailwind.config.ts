import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: "#080D18", // Master background
          900: "#111B2A", // Secondary card surface
          850: "#132337", // Card hover
          800: "#142B3A", // Deep blue panels
          700: "#1E3A52", // Border muted
          600: "#2B5274",
        },
        cyanAccent: {
          light: "#67E8F9",
          DEFAULT: "#06B6D4",
          bright: "#38BDF8",
          glow: "rgba(6, 182, 212, 0.25)"
        },
        aqi: {
          good: "#10B981",       // 0-30 Emerald
          satisfactory: "#06B6D4",// 31-60 Cyan
          moderate: "#F59E0B",    // 61-90 Amber
          poor: "#F97316",        // 91-120 Orange
          verypoor: "#EF4444",    // 121-250 Red
          severe: "#7C3AED",      // 250+ Violet
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Menlo", "Courier New", "monospace"],
      },
      boxShadow: {
        terminal: "0 0 50px -10px rgba(6, 182, 212, 0.15)",
        cardGlow: "0 4px 20px -2px rgba(8, 13, 24, 0.8)",
      },
      animation: {
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
