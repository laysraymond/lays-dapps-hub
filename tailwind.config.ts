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
        primary: "#0F6E56",
        "primary-hover": "#0a5540",
        "primary-light": "#1a8a6c",
        secondary: "#BA7517",
        "secondary-hover": "#9a6012",
        "bg-dark": "#161616",
        "bg-light": "#F7F6F2",
        "surface-dark": "#1e1e1e",
        "surface-dark-2": "#252525",
        "surface-light": "#ffffff",
        "border-dark": "#2a2a2a",
        "border-light": "#e5e5e0",
        "text-primary-dark": "#f0f0f0",
        "text-secondary-dark": "#a0a0a0",
        "text-primary-light": "#161616",
        "text-secondary-light": "#6b6b6b",
        verified: "#22c55e",
        "verified-bg": "#052e16",
        unverified: "#f59e0b",
        "unverified-bg": "#292201",
        reported: "#ef4444",
        "reported-bg": "#2c0707",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0,0,0,0.3)",
        md: "0 4px 12px rgba(0,0,0,0.4)",
        lg: "0 8px 24px rgba(0,0,0,0.5)",
        glow: "0 0 20px rgba(15,110,86,0.3)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
