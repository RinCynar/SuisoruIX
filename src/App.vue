<template>
  <Provider>
    <!-- background -->
    <Cover @loadComplete="loadComplete" @paletteReady="onPaletteReady" />
    <!-- main page -->
    <Transition name="fade" mode="out-in">
      <main
        v-if="status.imgLoadStatus"
        tabindex="0"
        id="main"
        :class="`main-${status.siteStatus}`"
        :style="{ pointerEvents: mainClickable ? 'auto' : 'none' }"
        @click="status.setSiteStatus('normal')"
        @contextmenu="mainContextmenu"
        @keydown="mainPressKeyboard"
      >
        <TimeDisplay />
        <SearchInp @contextmenu.stop />
        <AllFunc @contextmenu.stop />
        <Footer />
        <!-- transition -->
        <Transition name="fade">
          <div
            class="all-controls"
            v-show="status.siteStatus !== 'focus' && status.siteStatus !== 'normal'"
          >
            <div
              class="change-status"
              :title="status.mainBoxBig ? 'Close' : 'Open'"
              @click.stop="status.setMainBoxBig(!status.mainBoxBig)"
            >
              <Transition name="fade" mode="out-in">
                <SvgIcon
                  :iconName="`icon-${status.mainBoxBig ? 'packup' : 'unfold'}`"
                  :key="status.mainBoxBig ? 'packup' : 'unfold'"
                />
              </Transition>
            </div>
            <div
              class="change-status"
              :title="status.siteStatus !== 'set' ? 'Settings' : 'Home'"
              @click.stop="status.setSiteStatus(status.siteStatus !== 'set' ? 'set' : 'normal')"
            >
              <Transition name="fade" mode="out-in">
                <SvgIcon
                  :iconName="`icon-${status.siteStatus !== 'set' ? 'setting' : 'home'}`"
                  :key="status.siteStatus !== 'set' ? 'setting' : 'home'"
                />
              </Transition>
            </div>
          </div>
        </Transition>
      </main>
      <div v-else id="loading">
        <img src="/icon/logo.png" alt="logo" class="logo" />
        <span class="tip">SuisoruIX</span>
      </div>
    </Transition>
  </Provider>
</template>

<script setup>
import { onMounted, onBeforeUnmount, nextTick, watch, ref } from "vue";
import { statusStore, setStore } from "@/stores";
import { getGreetingKey } from "@/utils/timeTools";
import {
  applyThemePalette,
  getWallpaperSeed,
  resolveThemeType,
} from "@/utils/theme";
import { useI18n } from "@/i18n";
import Provider from "@/components/Provider.vue";
import Cover from "@/components/Cover.vue";
import TimeDisplay from "@/components/TimeDisplay.vue";
import SearchInp from "@/components/SearchInput/SearchInp.vue";
import AllFunc from "@/components/AllFunc/AllFunc.vue";
import Footer from "@/components/Footer.vue";

const set = setStore();
const status = statusStore();
const { t } = useI18n();
const mainClickable = ref(false);

const welcomeText = import.meta.env.VITE_WELCOME_TEXT ?? "Ciallo～(∠・ω< )⌒☆";

let systemThemeQuery = null;

const applyCurrentTheme = (seedOverride) => {
  const htmlElement = document.documentElement;
  htmlElement.setAttribute("lang", set.language === "ja" ? "ja" : "en");
  const surfaceMode = set.backgroundType === "m3" ? "solid" : "wallpaper";
  const seed =
    seedOverride ?? (surfaceMode === "solid" ? set.seedColor : getWallpaperSeed());
  applyThemePalette({
    seedColor: seed,
    themeType: set.themeType,
    surfaceMode,
  });
};

const onPaletteReady = (seed) => {
  applyCurrentTheme(seed);
};

const mainContextmenu = (event) => {
  event.preventDefault();
  status.setSiteStatus("box");
};

const loadComplete = () => {
  nextTick().then(() => {
    mainClickable.value = true;
    $message.info(`${t(`app.greeting.${getGreetingKey()}`)}, ${welcomeText}`, {
      showIcon: false,
      duration: 3000,
    });
  });
};

const mainPressKeyboard = (event) => {
  const keyCode = event.keyCode;

  if (keyCode === 13) {
    const mainInput = document.getElementById("main-input");
    status.setSiteStatus("focus");
    mainInput?.focus();
  }
};

const onSystemThemeChange = () => {
  if (set.themeType === "system") {
    applyCurrentTheme();
  }
};

watch(
  () => [set.themeType, set.backgroundType, set.seedColor, set.language],
  () => applyCurrentTheme(),
);

onMounted(() => {
  set.migrate();
  applyCurrentTheme();
  if (typeof window !== "undefined" && window.matchMedia) {
    systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    systemThemeQuery.addEventListener("change", onSystemThemeChange);
  }
  // Touch the resolver so the html[theme] attribute matches the OS on first paint
  // when the user has chosen "system".
  resolveThemeType(set.themeType);
});

onBeforeUnmount(() => {
  systemThemeQuery?.removeEventListener("change", onSystemThemeChange);
});
</script>

<style lang="scss" scoped>
#main,
#loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &.main-normal,
  &.main-focus {
    .main-box {
      opacity: 0;
      margin-top: 0;
      transform: scale(0.35);
      pointer-events: none;
    }
  }
  &.main-box,
  &.main-set {
    .main-box {
      opacity: 1;
      margin-top: 20vh;
      transform: scale(1);
      visibility: visible;
      @media (max-width: 599.98px) {
        margin-top: 0;
      }
    }
    .search-input {
      :deep(.all) {
        opacity: 0;
        width: 0;
        visibility: hidden;
      }
    }
  }
  @media (max-width: 599.98px) {
    &.main-normal,
    &.main-focus {
      .main-box {
        transform: translateY(110%);
        opacity: 1;
      }
    }
    &.main-box,
    &.main-set {
      .main-box {
        transform: translateY(0);
      }
    }
  }
  .all-controls {
    position: fixed;
    width: 100%;
    top: 0;
    padding: var(--md-sys-spacing-2);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    .change-status {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      font-size: var(--md-sys-icon-size-medium);
      border-radius: var(--md-sys-shape-corner-full);
      color: var(--md-sys-color-on-surface);
      z-index: 1;
      transition:
        background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard),
        transform var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
      &:hover {
        background-color: var(--md-sys-color-surface-container);
        backdrop-filter: blur(var(--md-sys-surface-blur));
      }
      &:active {
        transform: scale(0.92);
      }
    }
  }
}
#loading {
  color: var(--md-sys-color-on-surface);
  background-color: var(--md-sys-color-surface);
  .logo {
    width: 96px;
    height: 96px;
    margin-bottom: var(--md-sys-spacing-5);
    animation: logo-breathe 3s infinite alternate;
  }
  .tip {
    font-size: var(--md-sys-typescale-title-large-size);
    line-height: var(--md-sys-typescale-title-large-line);
  }
}
</style>
