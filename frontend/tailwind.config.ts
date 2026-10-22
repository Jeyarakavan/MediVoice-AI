import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "hsl(214 88% 40%)",
          light: "hsl(214 88% 55%)",
          dark: "hsl(214 88% 28%)",
          50: "hsl(214 88% 97%)",
          100: "hsl(214 88% 92%)",
          500: "hsl(214 88% 40%)",
          600: "hsl(214 88% 34%)",
          700: "hsl(214 88% 28%)",
        },
        accent: {
          DEFAULT: "hsl(173 80% 40%)",
          light: "hsl(173 80% 55%)",
          50: "hsl(173 80% 97%)",
          100: "hsl(173 80% 90%)",
        },
        medical: {
          blue: "hsl(214 88% 40%)",
          teal: "hsl(173 80% 40%)",
          white: "#FFFFFF",
          lightGray: "hsl(220 14% 96%)",
        },
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        brand: "0 8px 32px hsl(214 88% 40% / 0.25)",
        glow: "0 0 0 3px hsl(214 88% 40% / 0.15)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        slideInRight: {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        slideInLeft: {
          from: { transform: "translateX(-100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 hsl(173 80% 40% / 0.4)" },
          "50%": { boxShadow: "0 0 0 8px hsl(173 80% 40% / 0)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "slide-in-left": "slideInLeft 0.3s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "pulse-glow": "pulseGlow 2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
