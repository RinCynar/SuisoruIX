<template>
  <footer id="footer" @click.stop>
    <div class="copyright">
      <span class="site-name">{{ siteName }}</span>
      <span class="year">{{ fullYear }}</span>
      <span class="anthor" @click="jumpTo(copyrightLink ?? 'https://rincynar.top')">
        {{ siteAnthor }}
      </span>
      <span v-if="icp" class="icp" @click="jumpTo('https://google.cn/icp')">
        {{ icp }}
      </span>
      <span class="about" @click="aboutSiteModal = true">{{ t("footer.about") }}</span>
    </div>
    <!-- About -->
    <n-modal
      preset="card"
      :bordered="false"
      v-model:show="aboutSiteModal"
      transform-origin="center"
    >
      <div class="about-modal">
        <div class="about">
          <span class="name">{{ siteName }}</span>
          <span class="version">v {{ packageJson.version }}</span>
        </div>
        <div class="desc">
          <n-space class="link" justify="center">
            <n-button strong secondary @click="jumpTo('https://github.com/RinCynar/SuisoruIX')">
              {{ t("footer.about") }} · Github
            </n-button>
          </n-space>
        </div>
      </div>
    </n-modal>
  </footer>
</template>

<script setup>
import { ref } from "vue";
import { setStore } from "@/stores";
import { useI18n } from "@/i18n";
import { NModal, NButton, NSpace } from "naive-ui";
import packageJson from "@/../package.json";

const set = setStore();
const { t } = useI18n();

const icp = import.meta.env.VITE_ICP;
const siteName = import.meta.env.VITE_SITE_TITLE;
const siteAnthor = import.meta.env.VITE_SITE_ANTHOR;
const copyrightLink = import.meta.env.VITE_SITE_COPYRIGHTLINK;
const fullYear = new Date().getFullYear();

const aboutSiteModal = ref(false);

const jumpTo = (url) => {
  if (set.urlJumpType === "href") {
    window.location.href = url;
  } else if (set.urlJumpType === "open") {
    window.open(url, "_blank");
  }
};
</script>

<style lang="scss" scoped>
#footer {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 0;
  height: 48px;
  width: 100%;
  color: var(--md-sys-color-on-surface-variant);
  z-index: 1;
  .copyright {
    display: flex;
    align-items: center;
    font-size: var(--md-sys-typescale-label-small-size);
    line-height: var(--md-sys-typescale-label-small-line);
    span {
      margin: 0 var(--md-sys-spacing-1);
      opacity: 0.8;
      transition: opacity var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
      &::before {
        opacity: 0.8;
        transition: none;
      }
    }
    .year {
      &::before {
        content: "@";
        opacity: 1;
        margin-right: var(--md-sys-spacing-1);
      }
    }
    .icp {
      &::before {
        content: "|";
        margin-right: var(--md-sys-spacing-1);
      }
    }
    .about {
      &::before {
        content: "|";
        margin-right: var(--md-sys-spacing-1);
      }
    }
    .anthor,
    .icp,
    .about {
      cursor: pointer;
      min-height: 48px;
      display: inline-flex;
      align-items: center;
      &:hover {
        opacity: 1;
        color: var(--md-sys-color-on-surface);
      }
    }
  }
}
.about-modal {
  margin-bottom: var(--md-sys-spacing-3);
  .about {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    .name {
      font-size: var(--md-sys-typescale-headline-medium-size);
      line-height: var(--md-sys-typescale-headline-medium-line);
      font-weight: 400;
      margin-bottom: var(--md-sys-spacing-1);
    }
    .version {
      color: var(--md-sys-color-on-surface-variant);
      font-size: var(--md-sys-typescale-body-large-size);
      line-height: var(--md-sys-typescale-body-large-line);
    }
  }
  .desc {
    margin-top: var(--md-sys-spacing-4);
  }
}
</style>
