import { FONT_FAMILY } from "@/utils/theme";

const hexToRgba = (hex, alpha) => {
  if (!hex || hex[0] !== "#") return `rgba(0, 0, 0, ${alpha})`;
  const value = parseInt(hex.slice(1), 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
};

/**
 * Map a Material 3 token object (from `generateTokens` / `naivePalette`)
 * onto Naive UI `theme-overrides`. Naive UI cannot parse CSS `var(...)`,
 * so every color must be a real hex string.
 *
 * @param {Record<string, string>} tokens
 */
export function buildNaiveThemeOverrides(tokens) {
  const t = tokens || {};
  const primary = t.primary || "#6750A4";
  const onPrimary = t.onPrimary || "#FFFFFF";
  const primaryContainer = t.primaryContainer || "#EADDFF";
  const onPrimaryContainer = t.onPrimaryContainer || "#21005D";
  const secondary = t.secondary || "#625B71";
  const secondaryContainer = t.secondaryContainer || "#E8DEF8";
  const onSecondaryContainer = t.onSecondaryContainer || "#1D192B";
  const error = t.error || "#B3261E";
  const errorContainer = t.errorContainer || "#F9DEDC";
  const onSurface = t.onSurface || "#1D1B20";
  const onSurfaceVariant = t.onSurfaceVariant || "#49454F";
  const surface = t.surface || "#FEF7FF";
  const surfaceContainer = t.surfaceContainer || "#F3EDF7";
  const surfaceContainerLowest = t.surfaceContainerLowest || "#FFFFFF";
  const surfaceContainerLow = t.surfaceContainerLow || "#F7F2FA";
  const surfaceContainerHigh = t.surfaceContainerHigh || "#ECE6F0";
  const surfaceContainerHighest = t.surfaceContainerHighest || "#E6E0E9";
  const outline = t.outline || "#79747E";
  const outlineVariant = t.outlineVariant || "#CAC4D0";
  const shadow = t.shadow || "#000000";

  const elevation1 = `0 1px 2px 0 ${hexToRgba(shadow, 0.15)}, 0 1px 3px 1px ${hexToRgba(shadow, 0.08)}`;
  const elevation2 = `0 1px 2px 0 ${hexToRgba(shadow, 0.15)}, 0 2px 6px 2px ${hexToRgba(shadow, 0.08)}`;
  const elevation3 = `0 1px 3px 0 ${hexToRgba(shadow, 0.15)}, 0 4px 8px 3px ${hexToRgba(shadow, 0.08)}`;

  const pill = "999px";
  const shapeSmall = "8px";
  const shapeMedium = "12px";
  const shapeLarge = "16px";
  const shapeExtraLarge = "28px";

  return {
    common: {
      fontFamily: FONT_FAMILY,
      fontSize: "14px",
      fontSizeMini: "11px",
      fontSizeTiny: "11px",
      fontSizeSmall: "14px",
      fontSizeMedium: "14px",
      fontSizeLarge: "16px",
      fontSizeHuge: "16px",
      lineHeight: "20px",
      borderRadius: shapeMedium,
      borderRadiusSmall: shapeSmall,
      primaryColor: primary,
      primaryColorHover: primary,
      primaryColorPressed: primaryContainer,
      primaryColorSuppl: primary,
      infoColor: primary,
      infoColorHover: primary,
      infoColorPressed: primaryContainer,
      infoColorSuppl: primary,
      errorColor: error,
      errorColorHover: error,
      errorColorPressed: errorContainer,
      errorColorSuppl: error,
      textColorBase: onSurface,
      textColor1: onSurface,
      textColor2: onSurface,
      textColor3: onSurfaceVariant,
      textColorDisabled: onSurfaceVariant,
      placeholderColor: onSurfaceVariant,
      placeholderColorDisabled: outline,
      iconColor: onSurfaceVariant,
      iconColorHover: onSurface,
      iconColorPressed: onSurface,
      iconColorDisabled: outline,
      dividerColor: outlineVariant,
      borderColor: outlineVariant,
      closeIconColor: onSurfaceVariant,
      closeIconColorHover: onSurface,
      closeIconColorPressed: onSurface,
      closeColorHover: surfaceContainerHigh,
      closeColorPressed: surfaceContainerHighest,
      clearColor: onSurfaceVariant,
      clearColorHover: onSurface,
      clearColorPressed: onSurface,
      scrollbarColor: outlineVariant,
      scrollbarColorHover: outline,
      hoverColor: surfaceContainerHigh,
      pressedColor: surfaceContainerHighest,
      cardColor: surfaceContainerHigh,
      modalColor: surfaceContainerHighest,
      popoverColor: surfaceContainerHighest,
      bodyColor: surface,
      inputColor: surfaceContainer,
      tableColor: surfaceContainer,
      actionColor: surfaceContainer,
      tagColor: secondaryContainer,
      tabColor: surfaceContainerLow,
      invertedColor: onSurface,
      boxShadow1: elevation1,
      boxShadow2: elevation2,
      boxShadow3: elevation3,
    },
    Button: {
      borderRadiusTiny: pill,
      borderRadiusSmall: pill,
      borderRadiusMedium: pill,
      borderRadiusLarge: pill,
      heightMedium: "48px",
      heightLarge: "48px",
      fontSizeMedium: "14px",
      fontWeight: "500",
      paddingMedium: "0 24px",
      paddingLarge: "0 24px",
      color: surfaceContainer,
      colorHover: surfaceContainerHigh,
      colorPressed: surfaceContainerHighest,
      colorFocus: surfaceContainerHigh,
      textColor: onSurface,
      textColorHover: onSurface,
      textColorPressed: onSurface,
      textColorFocus: onSurface,
      border: `1px solid ${outlineVariant}`,
      borderHover: `1px solid ${outline}`,
      borderPressed: `1px solid ${outline}`,
      borderFocus: `1px solid ${outline}`,
      colorSecondary: secondaryContainer,
      colorSecondaryHover: secondaryContainer,
      colorSecondaryPressed: secondary,
      colorPrimary: primary,
      colorHoverPrimary: primary,
      colorPressedPrimary: primaryContainer,
      colorFocusPrimary: primary,
      textColorPrimary: onPrimary,
      textColorHoverPrimary: onPrimary,
      textColorPressedPrimary: onPrimaryContainer,
      textColorFocusPrimary: onPrimary,
      borderPrimary: `1px solid ${primary}`,
      borderHoverPrimary: `1px solid ${primary}`,
      borderPressedPrimary: `1px solid ${primaryContainer}`,
      borderFocusPrimary: `1px solid ${primary}`,
      rippleColor: primary,
      rippleColorPrimary: primary,
    },
    Card: {
      borderRadius: shapeLarge,
      color: surfaceContainerHigh,
      colorModal: surfaceContainerHighest,
      colorPopover: surfaceContainerHighest,
      textColor: onSurface,
      titleTextColor: onSurface,
      titleFontSizeMedium: "16px",
      titleFontWeight: "500",
      borderColor: outlineVariant,
      boxShadow: elevation1,
      closeBorderRadius: pill,
    },
    Dialog: {
      borderRadius: shapeExtraLarge,
      color: surfaceContainerHighest,
      textColor: onSurface,
      titleTextColor: onSurface,
      titleFontSize: "22px",
      titleFontWeight: "400",
      iconColor: onSurface,
      iconColorInfo: primary,
      iconColorWarning: error,
      iconColorError: error,
      closeBorderRadius: pill,
      padding: "24px",
    },
    Modal: {
      color: surfaceContainerHighest,
      textColor: onSurface,
      boxShadow: elevation3,
    },
    Drawer: {
      color: surfaceContainerHighest,
      textColor: onSurface,
      borderRadius: shapeExtraLarge,
    },
    Switch: {
      railColor: surfaceContainerHighest,
      railColorActive: primary,
      buttonColor: surfaceContainerLowest,
      boxShadowFocus: `0 0 0 2px ${hexToRgba(primary, 0.24)}`,
      railBorderRadiusSmall: pill,
      railBorderRadiusMedium: pill,
      railBorderRadiusLarge: pill,
      buttonBorderRadiusSmall: pill,
      buttonBorderRadiusMedium: pill,
      buttonBorderRadiusLarge: pill,
    },
    Slider: {
      fillColor: primary,
      fillColorHover: primary,
      handleColor: primary,
      dotColor: surfaceContainerHighest,
      railColor: surfaceContainerHighest,
      railColorHover: outlineVariant,
    },
    Input: {
      heightMedium: "48px",
      borderRadius: shapeMedium,
      color: surfaceContainer,
      colorFocus: surfaceContainerHigh,
      textColor: onSurface,
      caretColor: primary,
      placeholderColor: onSurfaceVariant,
      border: `1px solid ${outlineVariant}`,
      borderHover: `1px solid ${outline}`,
      borderFocus: `1px solid ${primary}`,
      boxShadowFocus: `0 0 0 2px ${hexToRgba(primary, 0.2)}`,
    },
    InputNumber: {
      borderRadius: shapeMedium,
      color: surfaceContainer,
      textColor: onSurface,
      border: `1px solid ${outlineVariant}`,
      borderHover: `1px solid ${outline}`,
      borderFocus: `1px solid ${primary}`,
    },
    InternalSelection: {
      heightMedium: "48px",
      borderRadius: shapeMedium,
      color: surfaceContainer,
      colorActive: surfaceContainerHigh,
      textColor: onSurface,
      placeholderColor: onSurfaceVariant,
      border: `1px solid ${outlineVariant}`,
      borderHover: `1px solid ${outline}`,
      borderActive: `1px solid ${primary}`,
      borderFocus: `1px solid ${primary}`,
      boxShadowActive: `0 0 0 2px ${hexToRgba(primary, 0.2)}`,
      boxShadowFocus: `0 0 0 2px ${hexToRgba(primary, 0.2)}`,
      arrowColor: onSurfaceVariant,
    },
    InternalSelectMenu: {
      borderRadius: shapeMedium,
      color: surfaceContainerHighest,
      optionTextColor: onSurface,
      optionTextColorActive: onSecondaryContainer,
      optionTextColorPressed: onSurface,
      optionColorPending: surfaceContainerHigh,
      optionColorActive: secondaryContainer,
      optionColorActivePending: secondaryContainer,
    },
    Dropdown: {
      borderRadius: shapeMedium,
      color: surfaceContainerHighest,
      optionTextColor: onSurface,
      optionTextColorHover: onSurface,
      optionTextColorActive: onSecondaryContainer,
      optionColorHover: surfaceContainerHigh,
      optionColorActive: secondaryContainer,
      prefixColor: onSurfaceVariant,
    },
    Tabs: {
      tabTextColorLine: onSurfaceVariant,
      tabTextColorActiveLine: primary,
      tabTextColorHoverLine: onSurface,
      tabTextColorBar: onSurfaceVariant,
      tabTextColorActiveBar: primary,
      tabTextColorHoverBar: onSurface,
      barColor: primary,
      tabFontWeightActive: "500",
      tabBorderColor: outlineVariant,
      paneTextColor: onSurface,
    },
    Form: {
      labelTextColor: onSurface,
      labelFontWeight: "500",
      feedbackTextColorError: error,
    },
    Message: {
      borderRadius: pill,
      color: surfaceContainerHighest,
      textColor: onSurface,
      iconColor: onSurface,
      iconColorInfo: primary,
      iconColorSuccess: primary,
      iconColorWarning: error,
      iconColorError: error,
      boxShadow: elevation2,
    },
    Notification: {
      borderRadius: shapeLarge,
      color: surfaceContainerHighest,
      textColor: onSurface,
      titleTextColor: onSurface,
      boxShadow: elevation3,
    },
    ColorPicker: {
      borderRadius: shapeMedium,
      color: surfaceContainer,
      textColor: onSurface,
      border: `1px solid ${outlineVariant}`,
    },
    Tooltip: {
      borderRadius: shapeSmall,
      color: surfaceContainerHighest,
      textColor: onSurface,
    },
    Popover: {
      borderRadius: shapeMedium,
      color: surfaceContainerHighest,
      textColor: onSurface,
    },
    Scrollbar: {
      color: outlineVariant,
      colorHover: outline,
    },
    Tag: {
      borderRadius: pill,
      color: secondaryContainer,
      textColor: onSecondaryContainer,
    },
  };
}
