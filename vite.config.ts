import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { reactRouter } from "@react-router/dev/vite";

export default defineConfig({
  plugins: [reactRouter(), tailwindcss()],
  resolve: {
    alias: [
      {
        find: /^primereact\/api$/,
        replacement: "primereact/api/api.cjs.js",
      },
    ],
  },
  ssr: {
    noExternal: ["primereact"],
  },
  base: "/",
});
