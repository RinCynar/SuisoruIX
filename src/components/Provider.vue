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
import { naivePalette, resolvedScheme } from "@/utils/theme";
import { buildNaiveThemeOverrides } from "@/style/naive-theme";

const set = setStore();

const naiveTheme = computed(() => (resolvedScheme.value === "light" ? null : darkTheme));

const locale = computed(() => (set.language === "ja" ? jaJP : enUS));
const dateLocale = computed(() => (set.language === "ja" ? dateJaJP : dateEnUS));

const themeOverrides = computed(() => buildNaiveThemeOverrides(naivePalette.value));

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
