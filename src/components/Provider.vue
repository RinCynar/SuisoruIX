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
    fontFamily: "'HarmonyOS_Regular', sans-serif",
    primaryColor: "#ffffff",
    primaryColorHover: "#ffffff70",
    primaryColorSuppl: "#ffffff30",
    primaryColorPressed: "#ffffff30",
  },
};

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
