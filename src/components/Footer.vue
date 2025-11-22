<template>
  <footer id="footer" @click.stop>
    <div class="copyright">
      <span class="site-name">{{ siteName }}</span>
      <span class="year">{{ fullYear }}</span>
      <span class="anthor" @click="jumpTo(copyrightLink ?? 'https://blog.rincynar.top')">
        {{ siteAnthor }}
      </span>
      <span v-if="icp" class="icp" @click="jumpTo('https://google.cn/icp')">
        {{ icp }}
      </span>
      <span class="about" @click="aboutSiteModal = true">About</span>
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
              Github
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
import { NModal, NButton, NSpace } from "naive-ui";
import packageJson from "@/../package.json";

const set = setStore();

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
  height: 60px;
  width: 100%;
  color: var(--md-sys-color-on-surface);
  z-index: 1;
  .copyright {
    display: flex;
    align-items: center;
    font-size: var(--md-sys-typescale-body-small-size);
    font-weight: var(--md-sys-typescale-body-small-weight);
    gap: 2px;
    span {
      margin: 0 2px;
      opacity: 0.7;
      transition: opacity var(--md-sys-motion-duration-short2) ease;
      &::before {
        opacity: 0.6;
        transition: none;
      }
    }
    .year {
      &::before {
        content: "@";
        opacity: 0.8;
        margin-right: 4px;
      }
    }
    .icp {
      &::before {
        content: "|";
        margin-right: 4px;
      }
    }
    .about {
      &::before {
        content: "|";
        margin-right: 4px;
      }
    }
    .anthor,
    .icp,
    .about {
      cursor: pointer;
      color: var(--md-sys-color-primary);
      &:hover {
        opacity: 1;
        text-decoration: underline;
      }
      &:active {
        opacity: 0.8;
      }
    }
  }
}
.about-modal {
  margin-bottom: 16px;
  .about {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    color: var(--md-sys-color-on-surface);
    .name {
      font-size: var(--md-sys-typescale-headline-large-size);
      font-weight: var(--md-sys-typescale-headline-large-weight);
      margin-bottom: 8px;
    }
    .version {
      opacity: 0.7;
      font-size: var(--md-sys-typescale-body-size);
      font-weight: 400;
    }
  }
  .desc {
    margin-top: 24px;
  }
}
</style>
