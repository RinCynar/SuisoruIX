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

const set = setStore();
const status = statusStore();
const { t } = useI18n();
const bgUrl = ref(null);
const imgTimeout = ref(null);
const completed = ref(false);
const emit = defineEmits(["loadComplete"]);

const isSolidMode = computed(() => set.backgroundType === "m3");

// Random default background (bg0 ~ bg9)
const bgRandom = Math.floor(Math.random() * 10);

// Assign background source based on the selected theme mode
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

const imgLoadComplete = () => {
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

// Solid-color (Material 3) backgrounds do not need an image load cycle.
const solidModeReady = () => {
  imgTimeout.value = setTimeout(() => {
    status.setImgLoadStatus(true);
    if (!completed.value) {
      completed.value = true;
      emit("loadComplete");
    }
  }, 350);
};

// React to theme-mode changes made in the settings panel.
watch(
  () => [set.backgroundType, set.backgroundCustom],
  () => {
    if (!status.imgLoadStatus) return;
    clearTimeout(imgTimeout.value);
    if (isSolidMode.value) {
      bgUrl.value = null;
    } else {
      setBgUrl();
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
  background-color: var(--body-background-color);
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
      filter 0.3s,
      transform 0.3s;
    animation: fade-blur-in 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .gray {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.5) 100%),
      radial-gradient(rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, 0.3) 166%);
  }
}
</style>

