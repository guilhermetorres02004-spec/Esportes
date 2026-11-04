/** @type {import('tailwindcss').Config} */
export default {
  content: ["./*.html", "./*.{js,jsx}", "./src/**/*.{html,js,jsx,ts,tsx}"],
  safelist: [
    { pattern: /^(text|border)-(blue|emerald|green|red)-600$/ },
  ],
  theme: { extend: {} },
  plugins: [],
};
