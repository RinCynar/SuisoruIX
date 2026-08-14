<template>
  <!-- Global Configuration Components -->
  <n-config-provider
    :locale="locale"
    :date-locale="dateLocale"
    :theme="naiveTheme"
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
import { defineComponent, h, computed } from "vue";
import {
  enUS,
  dateEnUS,
  jaJP,
  dateJaJP,
  darkTheme,
  NConfigProvider,
  NDialogProvider,
  NNotificationProvider,
  NMessageProvider,
  useDialog,
  useNotification,
  useMessage,
} from "naive-ui";
import { setStore } from "@/stores";
import { naivePalette } from "@/utils/theme";

const set = setStore();

// Follow the persisted light / dark preference.
const naiveTheme = computed(() => (set.themeType === "light" ? null : darkTheme));

const locale = computed(() => (set.language === "ja" ? jaJP : enUS));
const dateLocale = computed(() => (set.language === "ja" ? dateJaJP : dateEnUS));

// naive-ui's theme engine parses color values, so pass real hex colors
// (kept in sync with the Material 3 palette) instead of CSS `var(...)`.
const themeOverrides = computed(() => ({
  common: {
    fontFamily: "'Noto Sans', 'HarmonyOS_Regular', 'Segoe UI', sans-serif",
    primaryColor: naivePalette.value.primary,
    primaryColorHover: naivePalette.value.primary,
    primaryColorSuppl: naivePalette.value.primary,
    primaryColorPressed: naivePalette.value.primary,
    borderRadius: "12px",
  },
}));

const setupNaiveTools = () => {
  window.$notification = useNotification();
  window.$message = useMessage();
  window.$dialog = useDialog();
};

const NaiveProviderContent = defineComponent({
  setup() {
    setupNaiveTools();
  },
  render() {
    return h("div", { className: "main-tools" });
  },
});
</script>

