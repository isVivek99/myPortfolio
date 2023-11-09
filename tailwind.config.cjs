/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],

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
        footer: "#171717",
      },
      height: {
        "1/2": "50vh",
      },
      variants: {
        fill: ["hover", "focus"],
      },
      animation: {
        "spin-slow": "spin 9s linear infinite",
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
      },
    },
  },
  plugins: [],
};
