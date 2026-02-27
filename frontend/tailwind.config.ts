import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        flash: {
          bg: "#050505",
          "bg-secondary": "#121212",
          border: "#262626",
          primary: "#F25C05",
          "primary-hover": "#FF7B29",
          "primary-muted": "rgba(242, 92, 5, 0.1)",
          text: "#FFFFFF",
          "text-muted": "#A3A3A3",
          "text-disabled": "#525252",
          accent: "#FF8C00",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        flash: "0.75rem",
        "flash-lg": "1rem",
        "flash-xl": "1.5rem",
      },
      boxShadow: {
        "flash-card": "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
        "flash-glow": "0 0 15px -3px rgba(242, 92, 5, 0.3)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out forwards",
        "slide-down": "slide-down 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
