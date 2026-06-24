import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark, streaming-app inspired palette.
        surface: {
          DEFAULT: "#0f0f12",
          raised: "#1a1a1f",
          hover: "#26262e",
        },
        brand: {
          DEFAULT: "#e50914",
          hover: "#f6121d",
        },
      },
      aspectRatio: {
        poster: "2 / 3",
      },
    },
  },
  plugins: [],
};

export default config;
