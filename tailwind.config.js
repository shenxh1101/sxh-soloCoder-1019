/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          50: "#E8EEF6",
          100: "#C5D3E8",
          200: "#9EB4D6",
          300: "#7795C4",
          400: "#5B7CB6",
          500: "#3E63A8",
          600: "#385BA0",
          700: "#305097",
          800: "#28468D",
          900: "#1B347D",
          950: "#0F3460",
        },
        accent: {
          50: "#E8F8F3",
          100: "#C5EEDF",
          200: "#9EE3CA",
          300: "#77D8B5",
          400: "#5BD0A5",
          500: "#3EC795",
          600: "#38C38D",
          700: "#30BC82",
          800: "#28B578",
          900: "#1BAA67",
          950: "#16C79A",
        },
        neutral: {
          50: "#F5F7FA",
          100: "#E4E7EB",
          200: "#CBD2D9",
          300: "#9AA5B1",
          400: "#7B8794",
          500: "#616E7C",
          600: "#535464",
          700: "#3E4C59",
          800: "#323F4B",
          900: "#1F2933",
          950: "#1A1A2E",
        },
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', '"PingFang SC"', "sans-serif"],
        display: ['"Noto Sans SC"', "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        "card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
        glow: "0 0 20px rgba(15, 52, 96, 0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "pulse-soft": "pulseSoft 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};
