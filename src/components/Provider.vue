<template>
  <!-- Global Configuration Components -->
  <n-config-provider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="darkTheme"
    :theme-overrides="themeOverrides"
    abstract
    inline-theme-disabled
  >
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider :max="1">
          <slot />
          <NaiveProviderContent />
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup>
import { defineComponent, h } from "vue";
import {
  zhCN,
  dateZhCN,
  darkTheme,
  NConfigProvider,
  NDialogProvider,
  NNotificationProvider,
  NMessageProvider,
  useDialog,
  useNotification,
  useMessage,
} from "naive-ui";

const themeOverrides = {
  common: {
    fontFamily: "var(--md-sys-typescale-font-family, 'HarmonyOS_Regular', sans-serif)",
    /* Use CSS variables so the native CSS tokens control the Naive UI theme */
    primaryColor: "var(--md-sys-color-primary)",
    primaryColorHover: "var(--md-sys-color-primary-container)",
    primaryColorSuppl: "var(--md-sys-color-on-primary-container)",
    primaryColorPressed: "var(--md-sys-color-primary-container)",
  },
};

const setupNaiveTools = () => {
  window.$notification = useNotification();
  window.$message = useMessage();
  window.$dialog = useDialog();
};

/*
  Simple dynamic theme extractor:
  - Samples the image on a canvas to compute an average color
  - Derives primary / primary-container and on-primary tokens
  - Sets CSS vars on `:root` so components and Naive UI pick them up
*/
const rgbToHex = (r, g, b) => {
  const toHex = (n) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const luminance = (r, g, b) => {
  const srgb = [r, g, b].map((v) => v / 255).map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
};

const contrastIsLight = (r, g, b) => {
  // return true if light text (white) is better
  const L = luminance(r, g, b);
  // WCAG relative luminance threshold
  return (L < 0.5);
};

const lightenRgb = (r, g, b, amount = 0.18) => {
  const to = (v) => Math.min(255, Math.round(v + (255 - v) * amount));
  return [to(r), to(g), to(b)];
};

const applyDynamicThemeFromImage = async (imgUrl) => {
  try {
    if (!imgUrl) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgUrl;
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
    });
    const canvas = document.createElement("canvas");
    const w = (canvas.width = Math.min(120, img.naturalWidth || 120));
    const h = (canvas.height = Math.min(80, img.naturalHeight || 80));
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    let r = 0,
      g = 0,
      b = 0,
      count = 0;
    // sample every 4th pixel to be faster
    for (let i = 0; i < data.length; i += 16) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);

    const primaryHex = rgbToHex(r, g, b);
    const [pcR, pcG, pcB] = lightenRgb(r, g, b, 0.26);
    const primaryContainerHex = rgbToHex(pcR, pcG, pcB);
    const onPrimary = contrastIsLight(r, g, b) ? "#ffffff" : "#000000";
    const onPrimaryContainer = contrastIsLight(pcR, pcG, pcB) ? "#ffffff" : "#000000";

    const root = document.documentElement.style;
    root.setProperty("--md-sys-color-primary", primaryHex);
    root.setProperty("--md-sys-color-primary-container", primaryContainerHex);
    root.setProperty("--md-sys-color-on-primary", onPrimary);
    root.setProperty("--md-sys-color-on-primary-container", onPrimaryContainer);

    // subtle surface tint: mix a darkened variant
    root.setProperty("--md-sys-color-surface-tint", primaryHex + "22");
  } catch (error) {
    // silent fail — do not block app
    console.warn("Dynamic theme extraction failed:", error);
  }
};

// expose helper globally so other components (Cover.vue) can call it when wallpaper loads
window.applyDynamicThemeFromImage = applyDynamicThemeFromImage;

const NaiveProviderContent = defineComponent({
  setup() {
    setupNaiveTools();
  },
  render() {
    return h("div", { className: "main-tools" });
  },
});
</script>
