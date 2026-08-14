<template>
  <n-tabs class="all-box" size="large" justify-content="space-evenly" animated>
    <n-tab-pane class="no-padding height--full" name="link" :tab="t('shortcut.tab')">
      <ShortCut />
    </n-tab-pane>
    <n-tab-pane name="guide" :tab="t('box.tab.guide')">
      <n-scrollbar class="scrollbar">
        <div style="padding: 0 20px;">
          <h2 style="margin-top: 0;">{{ t('guide.welcomeTitle') }}</h2>
          <p style="opacity: 0.8; margin-bottom: 30px;">{{ t('guide.welcomeDesc') }}</p>

          <h3>{{ t('guide.searchTitle') }}</h3>
          <p><strong>{{ t('guide.searchQuick') }}</strong></p>
          <p><strong>{{ t('guide.searchSwitch') }}</strong></p>
          <p><strong>{{ t('guide.searchDetect') }}</strong></p>
          <p style="margin-bottom: 30px;"><strong>{{ t('guide.searchSuggestions') }}</strong></p>

          <h3>{{ t('guide.shortcutsTitle') }}</h3>
          <p><strong>{{ t('guide.shortcutsAccess') }}</strong></p>
          <p><strong>{{ t('guide.shortcutsExpand') }}</strong></p>
          <p><strong>{{ t('guide.shortcutsAdd') }}</strong></p>
          <p style="margin-bottom: 30px;"><strong>{{ t('guide.shortcutsEdit') }}</strong></p>

          <h3>{{ t('guide.settingsTitle') }}</h3>
          <p><strong>{{ t('guide.settingsAccess') }}</strong></p>
          <p><strong>{{ t('guide.settingsThemes') }}</strong></p>
          <p><strong>{{ t('guide.settingsTime') }}</strong></p>
          <p style="margin-bottom: 30px;"><strong>{{ t('guide.settingsBackup') }}</strong></p>

          <h3>{{ t('guide.keyboardTitle') }}</h3>
          <p><code>{{ t('guide.keyboardEnter') }}</code></p>
          <p><code>{{ t('guide.keyboardEsc') }}</code></p>
          <p style="margin-bottom: 30px;"><code>{{ t('guide.keyboardRightClick') }}</code></p>

          <h3>{{ t('guide.tipsTitle') }}</h3>
          <p>{{ t('guide.tipsCollapse') }}</p>
          <p>{{ t('guide.tipsSaved') }}</p>
          <p>{{ t('guide.tipsPWA') }}</p>
        </div>
      </n-scrollbar>
    </n-tab-pane>
    <n-tab-pane name="suisoruix" :tab="t('box.tab.about')">
      <n-scrollbar class="scrollbar">
        <div style="padding: 0 20px;">
          <h2 style="margin-top: 0;">{{ t('about.title') }}</h2>
          <p style="opacity: 0.8; margin-bottom: 20px;">{{ t('about.desc') }}</p>

          <h3>{{ t('about.designTitle') }}</h3>
          <p>{{ t('about.designDesc') }}</p>
          <ul style="opacity: 0.8;">
            <li>{{ t('about.designDynamic') }}</li>
            <li>{{ t('about.designSmooth') }}</li>
            <li>{{ t('about.designResponsive') }}</li>
          </ul>

          <h3>{{ t('about.techTitle') }}</h3>
          <p style="opacity: 0.8;">{{ t('about.techDesc') }}</p>

          <h3>{{ t('about.versionTitle') }}</h3>
          <p style="opacity: 0.8;">v{{ version }}</p>

          <h3>{{ t('about.creditsTitle') }}</h3>
          <p style="opacity: 0.8;">
            {{ t('about.creditsBased') }}:
            <a href="https://github.com/imsyy/SNav" target="_blank" style="color: var(--md-sys-color-primary);">SNav</a>
          </p>
          <p style="opacity: 0.8;">
            {{ t('about.creditsDeveloped') }}:
            <a href="https://rincynar.top" target="_blank" style="color: var(--md-sys-color-primary);">RinCynar</a>
          </p>

          <p style="margin-top: 30px; opacity: 0.6; font-size: 0.9em;">{{ t('about.copyright', { year }) }}</p>
        </div>
      </n-scrollbar>
    </n-tab-pane>
  </n-tabs>
</template>

<script setup>
import { NTabs, NTabPane } from "naive-ui";
import { useI18n } from "@/i18n";
import ShortCut from "@/components/AllFunc/Box/ShortCut.vue";

const { t } = useI18n();
const version = import.meta.env.VITE_SITE_VERSION ?? "2.0.0 beta 6";
const year = new Date().getFullYear();
</script>
<style>
.height--full {
  height: 100%;
}
</style>
