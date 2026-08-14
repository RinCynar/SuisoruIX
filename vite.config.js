import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // viteCompression
    viteCompression(),
  ],
  server: {
    port: 5588,
    open: true,
  },
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: "terser",
    rollupOptions: {
      output: {
        // Split the heavy vendor libraries into parallel-loadable chunks.
        manualChunks: {
          "naive-ui": ["naive-ui"],
          "vue-vendor": ["vue", "pinia", "pinia-plugin-persistedstate"],
          "m3-color": ["@material/material-color-utilities"],
        },
      },
    },
    terserOptions: {
      compress: {
        pure_funcs: ["console.log"],
      },
    },
  },
});
