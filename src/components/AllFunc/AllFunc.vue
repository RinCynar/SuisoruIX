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
  background-color: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);
  border-radius: var(--md-sys-shape-corner-extra-large);
  box-shadow: var(--md-sys-elevation-surface-3);
  backdrop-filter: blur(8px);
  transition:
    opacity var(--md-sys-motion-duration-short) ease,
    transform var(--md-sys-motion-duration-medium) ease,
    margin-top var(--md-sys-motion-duration-short2) ease,
    height var(--md-sys-motion-duration-short2) ease,
    box-shadow var(--md-sys-motion-duration-short) ease;
  z-index: 2;
  .all-set {
    overflow: hidden;
    height: 100%;
    :deep(.scrollbar) {
      max-height: calc(64vh - 84px);
      transition: max-height 0.3s;
    }
    :deep(.set-item) {
      width: 100%;
      border-radius: var(--md-sys-shape-corner-large);
      margin-bottom: 16px;
      border: 1px solid var(--md-sys-color-outline-variant);
      box-shadow: var(--md-sys-elevation-surface-1);
      background-color: var(--md-sys-color-surface-container-low);
      --n-color: var(--md-sys-color-surface-container-low);
      transition: box-shadow var(--md-sys-motion-duration-short) ease,
                  background-color var(--md-sys-motion-duration-short) ease;
      &:hover {
        box-shadow: var(--md-sys-elevation-surface-2);
      }
      .n-card__content {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
        .desc {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          @media (max-width: 720px) {
            flex-direction: column;
            align-items: flex-start;
            .name {
              margin-bottom: 12px;
            }
          }
        }
        .name {
          display: flex;
          flex-direction: column;
          .title {
            font-size: var(--md-sys-typescale-title-size);
            font-weight: var(--md-sys-typescale-title-weight);
            color: var(--md-sys-color-on-surface);
            margin-bottom: 4px;
          }
          .tip {
            font-size: var(--md-sys-typescale-body-small-size);
            opacity: 0.75;
            color: var(--md-sys-color-on-surface-variant);
          }
        }
        .set {
          width: 200px;
          @media (max-width: 768px) {
            width: 140px;
            min-width: 140px;
          }
        }
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
  @media (max-width: 478px) {
    height: 60vh;
  }
}
</style>
