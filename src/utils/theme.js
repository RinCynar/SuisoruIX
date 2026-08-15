import { ref } from "vue";
import {
  argbFromHex,
  argbFromRgb,
  hexFromArgb,
  Hct,
  SchemeTonalSpot,
  MaterialDynamicColors,
  QuantizerCelebi,
  Score,
} from "@material/material-color-utilities";

export const DEFAULT_SEED_COLOR = "#6750A4";
export const FONT_FAMILY =
  '"Roboto", -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif';

const COLOR_ROLES = [
  "primary",
  "onPrimary",
  "primaryContainer",
  "onPrimaryContainer",
  "secondary",
  "onSecondary",
  "secondaryContainer",
  "onSecondaryContainer",
  "tertiary",
  "onTertiary",
  "tertiaryContainer",
  "onTertiaryContainer",
  "error",
  "onError",
  "errorContainer",
  "onErrorContainer",
  "surface",
  "onSurface",
  "surfaceVariant",
  "onSurfaceVariant",
  "surfaceDim",
  "surfaceBright",
  "surfaceContainerLowest",
  "surfaceContainerLow",
  "surfaceContainer",
  "surfaceContainerHigh",
  "surfaceContainerHighest",
  "outline",
  "outlineVariant",
  "inverseSurface",
  "inverseOnSurface",
  "inversePrimary",
  "scrim",
  "shadow",
  "surfaceTint",
];

const BASELINE_LIGHT = {
  primary: "#6750A4",
  onPrimary: "#FFFFFF",
  primaryContainer: "#EADDFF",
  onPrimaryContainer: "#21005D",
  secondary: "#625B71",
  onSecondary: "#FFFFFF",
  secondaryContainer: "#E8DEF8",
  onSecondaryContainer: "#1D192B",
  tertiary: "#7D5260",
  onTertiary: "#FFFFFF",
  tertiaryContainer: "#FFD8E4",
  onTertiaryContainer: "#31111D",
  error: "#B3261E",
  onError: "#FFFFFF",
  errorContainer: "#F9DEDC",
  onErrorContainer: "#410E0B",
  surface: "#FEF7FF",
  onSurface: "#1D1B20",
  surfaceVariant: "#E7E0EC",
  onSurfaceVariant: "#49454F",
  surfaceDim: "#DED8E1",
  surfaceBright: "#FEF7FF",
  surfaceContainerLowest: "#FFFFFF",
  surfaceContainerLow: "#F7F2FA",
  surfaceContainer: "#F3EDF7",
  surfaceContainerHigh: "#ECE6F0",
  surfaceContainerHighest: "#E6E0E9",
  outline: "#79747E",
  outlineVariant: "#CAC4D0",
  inverseSurface: "#322F35",
  inverseOnSurface: "#F5EFF7",
  inversePrimary: "#D0BCFF",
  scrim: "#000000",
  shadow: "#000000",
  surfaceTint: "#6750A4",
};

const BASELINE_DARK = {
  primary: "#D0BCFF",
  onPrimary: "#381E72",
  primaryContainer: "#4F378B",
  onPrimaryContainer: "#EADDFF",
  secondary: "#CCC2DC",
  onSecondary: "#332D41",
  secondaryContainer: "#4A4458",
  onSecondaryContainer: "#E8DEF8",
  tertiary: "#EFB8C8",
  onTertiary: "#492532",
  tertiaryContainer: "#633B48",
  onTertiaryContainer: "#FFD8E4",
  error: "#F2B8B5",
  onError: "#601410",
  errorContainer: "#8C1D18",
  onErrorContainer: "#F9DEDC",
  surface: "#141218",
  onSurface: "#E6E1E5",
  surfaceVariant: "#49454F",
  onSurfaceVariant: "#CAC4D0",
  surfaceDim: "#141218",
  surfaceBright: "#3B383E",
  surfaceContainerLowest: "#0F0D13",
  surfaceContainerLow: "#1D1B20",
  surfaceContainer: "#211F26",
  surfaceContainerHigh: "#2B2930",
  surfaceContainerHighest: "#36343B",
  outline: "#938F99",
  outlineVariant: "#49454F",
  inverseSurface: "#E6E1E5",
  inverseOnSurface: "#322F35",
  inversePrimary: "#6750A4",
  scrim: "#000000",
  shadow: "#000000",
  surfaceTint: "#D0BCFF",
};

/**
 * Real hex colors shared with naive-ui's theme engine, which cannot parse
 * CSS `var(...)`. Kept in sync by `applyThemePalette`.
 */
export const naivePalette = ref({ ...BASELINE_DARK });
export const resolvedScheme = ref("dark");

let lastWallpaperSeed = DEFAULT_SEED_COLOR;

export const getWallpaperSeed = () => lastWallpaperSeed;

export const setWallpaperSeed = (hex) => {
  if (/^#([0-9a-fA-F]{6})$/.test(hex)) {
    lastWallpaperSeed = hex;
  }
};

const toCssVar = (role) =>
  `--md-sys-color-${role.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`;

/**
 * Resolve the persisted theme preference into a concrete light / dark scheme.
 * `"system"` follows `prefers-color-scheme`.
 */
export const resolveThemeType = (themeType) => {
  if (themeType === "system") {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "dark";
  }
  return themeType === "light" ? "light" : "dark";
};

/**
 * Build a complete Material 3 token map from a seed color via SchemeTonalSpot.
 */
export const generateTokens = (seedColor, isDark) => {
  const seed = /^#([0-9a-fA-F]{6})$/.test(seedColor) ? seedColor : DEFAULT_SEED_COLOR;
  const scheme = new SchemeTonalSpot(Hct.fromInt(argbFromHex(seed)), isDark, 0);
  const tokens = {};
  for (const role of COLOR_ROLES) {
    const dynamicColor = MaterialDynamicColors[role];
    if (dynamicColor && typeof dynamicColor.getArgb === "function") {
      tokens[role] = hexFromArgb(dynamicColor.getArgb(scheme));
    }
  }
  return tokens;
};

const SURFACE_SOLID_ROLES = [
  ["surfaceContainerLowest", "--md-sys-color-surface-container-lowest-solid"],
  ["surfaceContainerLow", "--md-sys-color-surface-container-low-solid"],
  ["surfaceContainer", "--md-sys-color-surface-container-solid"],
  ["surfaceContainerHigh", "--md-sys-color-surface-container-high-solid"],
  ["surfaceContainerHighest", "--md-sys-color-surface-container-highest-solid"],
];

/**
 * Apply a full Material 3 scheme to `:root`. Always writes tokens — wallpaper
 * modes also live inside this system (tinted via `[data-surface-mode]`).
 *
 * @param {Object} options
 * @param {string} options.seedColor - hex seed used to generate the palette
 * @param {"light"|"dark"|"system"} options.themeType
 * @param {"solid"|"wallpaper"} options.surfaceMode
 */
export const applyThemePalette = ({
  seedColor = DEFAULT_SEED_COLOR,
  themeType = "dark",
  surfaceMode = "solid",
} = {}) => {
  const root = document.documentElement;
  const resolved = resolveThemeType(themeType);
  const isDark = resolved === "dark";
  const mode = surfaceMode === "wallpaper" ? "wallpaper" : "solid";

  root.setAttribute("theme", resolved);
  root.setAttribute("data-surface-mode", mode);
  resolvedScheme.value = resolved;

  let tokens;
  try {
    tokens = generateTokens(seedColor, isDark);
  } catch (error) {
    console.error("Failed to generate Material 3 palette:", error);
    tokens = isDark ? { ...BASELINE_DARK } : { ...BASELINE_LIGHT };
  }

  const rootStyle = root.style;
  for (const [role, hex] of Object.entries(tokens)) {
    rootStyle.setProperty(toCssVar(role), hex);
  }
  for (const [role, cssVar] of SURFACE_SOLID_ROLES) {
    if (tokens[role]) {
      rootStyle.setProperty(cssVar, tokens[role]);
    }
  }
  rootStyle.setProperty("--body-background-color", tokens.surface);

  naivePalette.value = tokens;
  return tokens;
};

/**
 * Quantize a downsampled image and return the best Material seed color.
 * Falls back to the default seed if the canvas is tainted or empty.
 *
 * @param {CanvasImageSource} image
 * @returns {string} hex seed
 */
export const extractSeedFromImage = (image) => {
  try {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return DEFAULT_SEED_COLOR;
    ctx.drawImage(image, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);
    const pixels = [];
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 255) continue;
      pixels.push(argbFromRgb(data[i], data[i + 1], data[i + 2]));
    }
    if (!pixels.length) return DEFAULT_SEED_COLOR;
    const quantized = QuantizerCelebi.quantize(pixels, 128);
    const ranked = Score.score(quantized);
    if (!ranked[0]) return DEFAULT_SEED_COLOR;
    return hexFromArgb(ranked[0]);
  } catch (error) {
    console.warn("Failed to extract seed color from image:", error);
    return DEFAULT_SEED_COLOR;
  }
};

/**
 * Load `url` (optionally with CORS) and extract a seed. Resolves to the
 * default seed on any failure so callers can keep applying a valid palette.
 */
export const extractSeedFromUrl = (url) => {
  return new Promise((resolve) => {
    if (!url) {
      resolve(DEFAULT_SEED_COLOR);
      return;
    }
    const img = new Image();
    if (!url.startsWith("data:")) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => resolve(extractSeedFromImage(img));
    img.onerror = () => resolve(DEFAULT_SEED_COLOR);
    img.src = url;
  });
};
