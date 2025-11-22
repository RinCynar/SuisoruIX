<template>
  <n-tabs class="all-box" size="large" justify-content="space-evenly" animated>
    <n-tab-pane class="no-padding height--full" name="link" tab="Shortcuts">
      <ShortCut />
    </n-tab-pane>
    <n-tab-pane name="guide" tab="Guide">
     <h2>Let's start</h2>
     <h4>Search</h4>
     <h5>*Click the search box to search</h5>
     <h5>*The default search engine is Microsoft Bing,</h5>
     <h5>*Tap the right side of the search box to switch search engines.</h5>
     <h4>Shortcuts</h4>
     <h5>*Click on the time component to enter the shortcut page</h5>
     <h5>*Tap the hidden case in the upper left corner of the screen to expand the shortcut page</h5>
     <h5>*You can add frequently used websites to shortcuts for quick access.</h5>
     <h5>*Long press/right click to edit existing shortcuts</h5>
     <h4>Setup</h4>
     <h5>*After clicking on the time component, click on the hidden button in the upper right corner of the screen to enter the settings. Here, you can make multiple custom settings.</h5>
    </n-tab-pane>
    <n-tab-pane name="suisoruix" tab="SuisoruIX">
     <h2>[SuisoruIX] is a startpage developing by Open Source Community</h2>
     <h3>16/08/114-21450721</h3>
     <h3>[S-Nav](https://github.com/imsyy/SNav)</h3>
    </n-tab-pane>
  </n-tabs>
</template>

<script setup>
import { NTabs, NTabPane } from "naive-ui";
import ShortCut from "@/components/AllFunc/Box/ShortCut.vue";
</script>
<style lang="scss" scoped>
.height--full {
  height: 100%;
}
.all-box {
  color: var(--md-sys-color-on-surface);
  background-color: transparent;
  --n-tab-text-color-active: var(--md-sys-color-primary) !important;
  
  :deep(h2) {
    font-size: var(--md-sys-typescale-headline-large-size);
    font-weight: var(--md-sys-typescale-headline-large-weight);
    margin-bottom: 20px;
    color: var(--md-sys-color-on-surface);
  }

  :deep(h3) {
    font-size: var(--md-sys-typescale-title-large-size);
    font-weight: var(--md-sys-typescale-title-large-weight);
    margin: 12px 0;
    color: var(--md-sys-color-on-surface);
  }

  :deep(h4) {
    font-size: var(--md-sys-typescale-title-size);
    font-weight: var(--md-sys-typescale-title-weight);
    margin: 16px 0 12px 0;
    color: var(--md-sys-color-primary);
  }

  :deep(h5) {
    font-size: var(--md-sys-typescale-body-size);
    font-weight: var(--md-sys-typescale-body-weight);
    margin: 6px 0;
    color: var(--md-sys-color-on-surface-variant);
    line-height: 1.5;
  }
}
</style>