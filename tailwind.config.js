/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        obv: ["obviously"],
        obvwide: ["obviously-wide"],
      },
    },
  },
  plugins: [],
};
