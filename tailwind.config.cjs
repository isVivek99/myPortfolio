/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],

  future: {
    hoverOnlyWhenSupported: true,
  },

  theme: {
    extend: {
      colors: {
        black: "#111111",
        white: "#FFFFFF",
        neutral: "#18181B",
        "neutral-two": "2E3039",
        "neutral-border": "#4B4C52",
        "color-blue": "#1EA2F1",
        "color-red": "#D03E3F",
        "color-yellow": "#FBCC13",
        "accent-blue": "#5D6BD1",
        "accent-bg": "#1E1E3A",
        "hover-bg": "#1E1E2E",
        "success-bg": "#1A2E1A",
        footer: "#171717",
      },
      height: {
        "1/2": "50vh",
      },
      variants: {
        fill: ["hover", "focus"],
      },
      keyframes: {
        nudge: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(6px, -6px)" },
        },
      },
      animation: {
        "spin-slow": "spin 9s linear infinite",
        nudge: "nudge 0.9s ease-in-out infinite",
      },
      boxShadow: {
        "glow-accent":
          "0 0 18px rgba(93, 107, 209, 0.55), 0 0 36px rgba(41, 48, 169, 0.35)",
        "glow-yellow":
          "0 0 20px rgba(251, 204, 19, 0.45), 0 0 40px rgba(251, 204, 19, 0.25)",
      },

      backgroundImage: {
        "blue-purple-gradient":
          "linear-gradient(176deg, #2930A9 10.97%, #5D6BD1 290%)",
        "radial-blur-gradient":
          "radial-gradient(rgba(0, 0, 0, 0.45), transparent 70%)",
        "grainy-gradient": "linear-gradient(to right, #FE3E70, transparent)",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        header: "3.5rem",
        subheader: "1.5rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
