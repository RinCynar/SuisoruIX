import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";
import path from "path";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // PWA
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /(.*?)\.(woff2|woff|ttf)/,
            handler: "CacheFirst",
            options: {
              cacheName: "file-cache",
            },
          },
          {
            urlPattern: /(.*?)\.(webp|png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/,
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
            },
          },
        ],
      },
      manifest: {
        name: "SuisoruIX",
        short_name: "SuisoruIX",
        description: "StartPage",
        display: "standalone",
        start_url: "/",
        theme_color: "#fff",
        background_color: "#efefef",
        icons: [
          {
            src: "/icon/logo-144.png",
            sizes: "144x144",
            type: "image/png",
          },
        ],
      },
    }),
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
