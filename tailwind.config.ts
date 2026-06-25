import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#16C784",
        "primary-hover": "#12a86e",
        "primary-light": "#1de094",
        "primary-dim": "rgba(22,199,132,0.15)",
        secondary: "#A1A1AA",
        "bg-dark": "#050505",
        "bg-light": "#F7F6F2",
        "surface-dark": "#0f0f0f",
        "surface-dark-2": "#161616",
        "surface-dark-3": "#1c1c1c",
        "surface-light": "#ffffff",
        "border-dark": "#1f1f1f",
        "border-dark-2": "#2a2a2a",
        "border-light": "#e5e5e0",
        "text-primary-dark": "#FAFAFA",
        "text-secondary-dark": "#A1A1AA",
        "text-muted-dark": "#52525B",
        "text-primary-light": "#161616",
        "text-secondary-light": "#6b6b6b",
        verified: "#16C784",
        "verified-bg": "#052e1a",
        unverified: "#F59E0B",
        "unverified-bg": "#2c1a00",
        reported: "#EF4444",
        "reported-bg": "#2c0707",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "32px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0,0,0,0.5)",
        md: "0 4px 16px rgba(0,0,0,0.5)",
        lg: "0 8px 32px rgba(0,0,0,0.6)",
        xl: "0 16px 48px rgba(0,0,0,0.7)",
        glow: "0 0 24px rgba(22,199,132,0.25)",
        "glow-sm": "0 0 12px rgba(22,199,132,0.18)",
        "glow-lg": "0 0 40px rgba(22,199,132,0.3)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,0.05)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(22,199,132,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(22,199,132,0.025) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(22,199,132,0.12), transparent)",
        "radial-glow-sm":
          "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(22,199,132,0.08), transparent)",
        "emerald-gradient": "linear-gradient(135deg, #16C784, #0ea868)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease forwards",
        "slide-up": "slideUp 0.4s ease forwards",
        "count-up": "countUp 0.8s ease forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "border-glow": "borderGlow 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 16px rgba(22,199,132,0.15)" },
          "50%": { boxShadow: "0 0 32px rgba(22,199,132,0.35)" },
        },
        borderGlow: {
          "0%, 100%": { borderColor: "rgba(22,199,132,0.3)" },
          "50%": { borderColor: "rgba(22,199,132,0.7)" },
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
