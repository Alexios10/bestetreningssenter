import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    // https: {
    //   key: fs.readFileSync("cert.key"),
    //   cert: fs.readFileSync("cert.crt"),
    // },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
