<template>
  <n-tabs class="all-box" size="large" justify-content="space-evenly" animated>
    <n-tab-pane class="no-padding height--full" name="link" :tab="t('shortcut.tab')">
      <ShortCut />
    </n-tab-pane>
    <n-tab-pane name="suisoruix" :tab="t('box.tab.about')">
      <n-scrollbar class="scrollbar">
        <div class="about-page">
          <h2 class="about-title">{{ t("about.title") }}</h2>
          <p class="about-lead">{{ t("about.desc") }}</p>

          <h3 class="about-heading">{{ t("about.designTitle") }}</h3>
          <p class="about-body">{{ t("about.designDesc") }}</p>
          <ul class="about-list">
            <li>{{ t("about.designDynamic") }}</li>
            <li>{{ t("about.designSmooth") }}</li>
            <li>{{ t("about.designResponsive") }}</li>
          </ul>

          <h3 class="about-heading">{{ t("about.techTitle") }}</h3>
          <p class="about-body">{{ t("about.techDesc") }}</p>

          <h3 class="about-heading">{{ t("about.versionTitle") }}</h3>
          <p class="about-body">v{{ version }}</p>

          <h3 class="about-heading">{{ t("about.creditsTitle") }}</h3>
          <p class="about-body">
            {{ t("about.creditsBased") }}:
            <a href="https://github.com/imsyy/SNav" target="_blank" rel="noopener">SNav</a>
          </p>
          <p class="about-body">
            {{ t("about.creditsDeveloped") }}:
            <a href="https://rincynar.top" target="_blank" rel="noopener">RinCynar</a>
          </p>

          <p class="about-copy">{{ t("about.copyright", { year }) }}</p>
        </div>
      </n-scrollbar>
    </n-tab-pane>
  </n-tabs>
</template>

<script setup>
import { NTabs, NTabPane, NScrollbar } from "naive-ui";
import { useI18n } from "@/i18n";
import ShortCut from "@/components/AllFunc/Box/ShortCut.vue";

const { t } = useI18n();
const version = import.meta.env.VITE_SITE_VERSION ?? "2.0.0 beta 6";
const year = new Date().getFullYear();
</script>

<style lang="scss" scoped>
.height--full {
  height: 100%;
}
.about-page {
  padding: 0 var(--md-sys-spacing-4);
}
.about-title {
  margin-top: 0;
  font-size: var(--md-sys-typescale-headline-medium-size);
  line-height: var(--md-sys-typescale-headline-medium-line);
  font-weight: 400;
  color: var(--md-sys-color-on-surface);
}
.about-heading {
  margin-top: var(--md-sys-spacing-5);
  font-size: var(--md-sys-typescale-title-large-size);
  line-height: var(--md-sys-typescale-title-large-line);
  font-weight: 400;
  color: var(--md-sys-color-on-surface);
}
.about-lead,
.about-body,
.about-list {
  font-size: var(--md-sys-typescale-body-medium-size);
  line-height: var(--md-sys-typescale-body-medium-line);
  color: var(--md-sys-color-on-surface-variant);
}
.about-lead {
  margin-bottom: var(--md-sys-spacing-4);
}
.about-list {
  padding-left: var(--md-sys-spacing-5);
}
.about-body a {
  color: var(--md-sys-color-primary);
}
.about-copy {
  margin-top: var(--md-sys-spacing-6);
  font-size: var(--md-sys-typescale-label-small-size);
  line-height: var(--md-sys-typescale-label-small-line);
  color: var(--md-sys-color-on-surface-variant);
}
</style>
