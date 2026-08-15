<template>
  <!-- Functional area -->
  <div
    :class="status.mainBoxBig ? 'main-box big' : 'main-box'"
    @click.stop
    @contextmenu.stop="
      (e) => {
        e.preventDefault();
      }
    "
  >
    <div class="sheet-handle" aria-hidden="true" />
    <Transition name="fade" mode="out-in">
      <AllBox v-if="status.siteStatus === 'box'" />
      <AllSet v-else-if="status.siteStatus === 'set'" />
    </Transition>
  </div>
</template>

<script setup>
import { statusStore } from "@/stores";
import AllBox from "@/components/AllFunc/AllBox.vue";
import AllSet from "@/components/AllFunc/AllSet.vue";

const status = statusStore();
</script>

<style lang="scss" scoped>
.main-box {
  position: absolute;
  width: 80%;
  height: 64vh;
  max-width: 1200px;
  background-color: var(--md-sys-color-surface-container-highest);
  backdrop-filter: blur(var(--md-sys-surface-blur));
  color: var(--md-sys-color-on-surface);
  border-radius: var(--md-sys-shape-corner-extra-large);
  box-shadow: var(--md-sys-elevation-2);
  transition:
    opacity var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard),
    transform var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized-decelerate),
    margin-top var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard),
    height var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard);
  z-index: 2;
  .sheet-handle {
    display: none;
  }
  .all-set {
    overflow: hidden;
    height: 100%;
    :deep(.scrollbar) {
      padding: 0 var(--md-sys-spacing-4);
      max-height: calc(64vh - 84px);
      transition: max-height var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard);
    }
    :deep(.set-item) {
      width: 100%;
      border-radius: var(--md-sys-shape-corner-large);
      margin-bottom: var(--md-sys-spacing-3);
      border: none;
      background-color: var(--md-sys-color-surface-container-low);
      transition: background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
      --n-color: var(--md-sys-color-surface-container-low);

      &:hover {
        background-color: var(--md-sys-color-surface-container);
        --n-color: var(--md-sys-color-surface-container);
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .all-box {
    overflow: hidden;
    height: 100%;
    :deep(.n-tab-pane) {
      .scrollbar {
        max-height: calc(64vh - 84px);
      }
      .not-shortcut {
        min-height: calc(64vh - 84px);
      }
      &.no-padding {
        .scrollbar {
          max-height: calc(64vh - 44px);
        }
      }
    }
  }
  &.big {
    height: 80%;
    margin-top: 0 !important;
    :deep(.scrollbar) {
      max-height: calc(80vh - 84px);
    }
  }
  @media (min-width: 600px) and (max-width: 904.98px) {
    width: 90%;
    max-width: 840px;
  }
  @media (max-width: 599.98px) {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: auto;
    width: 100%;
    max-width: 100%;
    height: 68vh;
    margin-top: 0 !important;
    border-radius: var(--md-sys-shape-corner-extra-large) var(--md-sys-shape-corner-extra-large) 0 0;
    .sheet-handle {
      display: block;
      width: 32px;
      height: 4px;
      border-radius: var(--md-sys-shape-corner-full);
      background-color: var(--md-sys-color-outline-variant);
      margin: var(--md-sys-spacing-2) auto var(--md-sys-spacing-1);
    }
    :deep(.scrollbar) {
      max-height: calc(68vh - 84px);
    }
    &.big {
      height: 88vh;
      :deep(.scrollbar) {
        max-height: calc(88vh - 84px);
      }
    }
  }
}
</style>
