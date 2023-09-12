import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import sassDts from "vite-plugin-sass-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), sassDts()],
  base: "/aim-app/",
  build: {
    rollupOptions: {
      input: {
        main: "./index.html", // Specify the main HTML file here
        "404": "./404.html", // Specify the 404.html file here
      },
    },
  },
});
