<template>
  <div
    :class="[
      'cover',
      status.siteStatus !== 'normal' ? 'focus' : null,
      isSolidMode ? 'solid' : 'image',
    ]"
  >
    <img
      v-if="!isSolidMode"
      v-show="status.imgLoadStatus"
      class="background"
      alt="background"
      :src="bgUrl"
      :style="{ '--blur': set.backgroundBlur + 'px' }"
      @load="imgLoadComplete"
      @error.once="imgLoadError"
      @animationend="imgAnimationEnd"
    />
    <Transition name="fade">
      <div v-if="set.showBackgroundGray && !isSolidMode" class="gray" />
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch } from "vue";
import { statusStore, setStore } from "@/stores";
import { useI18n } from "@/i18n";
import {
  extractSeedFromImage,
  extractSeedFromUrl,
  setWallpaperSeed,
} from "@/utils/theme";

const set = setStore();
const status = statusStore();
const { t } = useI18n();
const bgUrl = ref(null);
const imgTimeout = ref(null);
const completed = ref(false);
const emit = defineEmits(["loadComplete", "paletteReady"]);

const isSolidMode = computed(() => set.backgroundType === "m3");

const bgRandom = Math.floor(Math.random() * 10);

const setBgUrl = () => {
  switch (set.backgroundType) {
    case "custom":
      bgUrl.value = set.backgroundCustom || `/background/bg${bgRandom}.jpg`;
      break;
    case "m3":
      bgUrl.value = null;
      break;
    default:
      bgUrl.value = `/background/bg${bgRandom}.jpg`;
      break;
  }
};

const publishWallpaperSeed = (seed) => {
  setWallpaperSeed(seed);
  emit("paletteReady", seed);
};

const extractFromEventTarget = (img) => {
  const seed = extractSeedFromImage(img);
  publishWallpaperSeed(seed);
};

const extractFromCurrentUrl = async () => {
  if (!bgUrl.value) return;
  const seed = await extractSeedFromUrl(bgUrl.value);
  publishWallpaperSeed(seed);
};

const imgLoadComplete = (event) => {
  extractFromEventTarget(event.target);
  imgTimeout.value = setTimeout(
    () => {
      status.setImgLoadStatus(true);
    },
    Math.floor(Math.random() * (600 - 300 + 1)) + 300,
  );
};

const imgAnimationEnd = () => {
  if (!completed.value) {
    completed.value = true;
    emit("loadComplete");
  }
};

const imgLoadError = () => {
  console.error("Background loading failed:", bgUrl.value);
  $message.error(t("cover.loadError"));
  bgUrl.value = `/background/bg${bgRandom}.jpg`;
};

const solidModeReady = () => {
  imgTimeout.value = setTimeout(() => {
    status.setImgLoadStatus(true);
    if (!completed.value) {
      completed.value = true;
      emit("loadComplete");
    }
  }, 350);
};

watch(
  () => [set.backgroundType, set.backgroundCustom],
  () => {
    if (!status.imgLoadStatus) return;
    clearTimeout(imgTimeout.value);
    if (isSolidMode.value) {
      bgUrl.value = null;
    } else {
      setBgUrl();
      extractFromCurrentUrl();
    }
  },
);

onMounted(() => {
  if (isSolidMode.value) {
    solidModeReady();
  } else {
    setBgUrl();
  }
});

onBeforeUnmount(() => {
  clearTimeout(imgTimeout.value);
});
</script>

<style lang="scss" scoped>
.cover {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: var(--md-sys-color-surface);
  &.solid {
    background-color: var(--md-sys-color-surface);
  }
  &.focus {
    .background {
      filter: blur(calc(var(--blur) + 10px)) brightness(0.8);
      transform: scale(1.3);
    }
  }
  .background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    backface-visibility: hidden;
    transform: scale(1.2);
    filter: blur(var(--blur));
    transition:
      filter var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard),
      transform var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard);
    animation: fade-blur-in 1s var(--md-sys-motion-easing-emphasized-decelerate);
  }
  .gray {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(
        color-mix(in srgb, var(--md-sys-color-scrim) 0%, transparent) 0,
        color-mix(in srgb, var(--md-sys-color-scrim) 50%, transparent) 100%
      ),
      radial-gradient(
        color-mix(in srgb, var(--md-sys-color-scrim) 0%, transparent) 33%,
        color-mix(in srgb, var(--md-sys-color-scrim) 30%, transparent) 166%
      );
  }
}
</style>
