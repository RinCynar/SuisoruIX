import { ref } from "vue";
import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
} from "@material/material-color-utilities";

export const DEFAULT_SEED_COLOR = "#6750A4";

/**
 * Real (parsed) colors shared with naive-ui's theme engine, which cannot
 * parse CSS `var(...)` strings. Kept in sync by `applyThemePalette`.
 */
export const naivePalette = ref({
  primary: DEFAULT_SEED_COLOR,
  onPrimary: "#ffffff",
});

// Fixed baseline palettes used when the Material 3 dynamic mode is off.
const BASELINE_PALETTES = {
  light: { primary: "#6750A4", onPrimary: "#ffffff" },
  dark: { primary: "#D0BCFF", onPrimary: "#381E72" },
};

/**
 * CSS variables that hold the Material 3 color roles. They are managed
 * at runtime so the palette can be regenerated from a user seed color.
 */
const COLOR_ROLE_VARS = [
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
  "outline",
  "outlineVariant",
];

const hexToRgba = (hex, alpha) => {
  const value = parseInt(hex.slice(1), 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Material 3 surface container tones per spec.
 * https://m3.material.io/styles/color/static/baseline
 */
const SURFACE_CONTAINER_TONES = {
  light: { lowest: 100, low: 96, container: 94, high: 92, highest: 90 },
  dark: { lowest: 4, low: 10, container: 12, high: 17, highest: 22 },
};

const GLASS_ALPHAS = {
  light: { low: 0.35, container: 0.5, high: 0.72, highest: 0.88 },
  dark: { low: 0.45, container: 0.58, high: 0.78, highest: 0.92 },
};

/**
 * Apply a full Material 3 color scheme (generated from `seedColor`) to the
 * document root. When `enabled` is false, the runtime overrides are removed
 * and the stylesheet defaults (fixed palette) take over again.
 *
 * @param {Object} options
 * @param {boolean} options.enabled - true when the Material 3 mode is active
 * @param {string} options.seedColor - hex color used to generate the palette
 * @param {"light"|"dark"} options.themeType - light or dark scheme
 */
export const applyThemePalette = ({ enabled = false, seedColor = DEFAULT_SEED_COLOR, themeType = "dark" } = {}) => {
  const root = document.documentElement;
  const rootStyle = root.style;

  if (!enabled) {
    for (const role of COLOR_ROLE_VARS) {
      rootStyle.removeProperty(`--md-sys-color-${role}`);
    }
    for (const level of ["lowest", "low", "container", "high", "highest"]) {
      rootStyle.removeProperty(`--md-sys-color-surface-container-${level}`);
    }
    rootStyle.removeProperty("--body-background-color");
    // naive-ui needs real colors (it cannot parse `var(...)`).
    naivePalette.value = BASELINE_PALETTES[themeType === "light" ? "light" : "dark"];
    return;
  }

  let seed = seedColor;
  if (!/^#([0-9a-fA-F]{6})$/.test(seed)) {
    seed = DEFAULT_SEED_COLOR;
  }

  try {
    const theme = themeFromSourceColor(argbFromHex(seed));
    const isDark = themeType === "dark";
    const scheme = isDark ? theme.schemes.dark : theme.schemes.light;
    // naive-ui needs real colors (it cannot parse `var(...)`).
    naivePalette.value = {
      primary: hexFromArgb(scheme.primary),
      onPrimary: hexFromArgb(scheme.onPrimary),
    };
    const neutral = theme.palettes.neutral;
    const tones = SURFACE_CONTAINER_TONES[isDark ? "dark" : "light"];
    const alphas = GLASS_ALPHAS[isDark ? "dark" : "light"];

    for (const role of COLOR_ROLE_VARS) {
      const argb = scheme[role];
      if (typeof argb === "number") {
        rootStyle.setProperty(`--md-sys-color-${role}`, hexFromArgb(argb));
      }
    }

    const surfaceContainers = {
      lowest: neutral.tone(tones.lowest),
      low: neutral.tone(tones.low),
      container: neutral.tone(tones.container),
      high: neutral.tone(tones.high),
      highest: neutral.tone(tones.highest),
    };

    for (const [level, argb] of Object.entries(surfaceContainers)) {
      const hex = hexFromArgb(argb);
      // The four "glass" levels keep translucency for the blurred surfaces.
      if (level === "lowest") {
        rootStyle.setProperty("--md-sys-color-surface-container-lowest", hex);
      } else {
        rootStyle.setProperty(
          `--md-sys-color-surface-container-${level}`,
          hexToRgba(hex, alphas[level]),
        );
      }
    }

    // The solid page background (used by the cover in Material 3 mode).
    rootStyle.setProperty("--body-background-color", hexFromArgb(scheme.surface));
  } catch (error) {
    console.error("Failed to generate Material 3 palette:", error);
  }
};
