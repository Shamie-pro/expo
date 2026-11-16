/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // 🌻 AM-AM sunflower palette (keep in sync with src/theme.ts)
      colors: {
        sun: {
          50: "#FFFAE6",
          100: "#FFF1BD",
          200: "#FFE480",
          300: "#FFD43B",
          400: "#FCC419",
          500: "#F5A800",
          600: "#D98E00",
        },
        seed: {
          100: "#E9DCCB",
          300: "#B99B7C",
          500: "#7A5230",
          700: "#4A2E14",
          900: "#2B1A0B",
        },
        leaf: {
          100: "#E3F0D0",
          500: "#6A9A2E",
          600: "#557D22",
        },
      },
    },
  },
  plugins: [],
}
