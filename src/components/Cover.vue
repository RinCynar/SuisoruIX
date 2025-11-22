<template>
  <div :class="status.siteStatus !== 'normal' ? 'cover focus' : 'cover'">
    <img
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
      <div v-if="set.showBackgroundGray" class="gray" />
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { statusStore, setStore } from "@/stores";

const set = setStore();
const status = statusStore();
const bgUrl = ref(null);
const imgTimeout = ref(null);
const emit = defineEmits(["loadComplete"]);

// Wallpaper random number
// Please modify the first number after Math.random() according to the number of pictures in the folder.
const bgRandom = Math.floor(Math.random() * 10 + 1);

// Assign wallpaper
const setBgUrl = () => {
  const { backgroundType } = set;
  switch (backgroundType) {
    case 0:
      bgUrl.value = `/background/bg${bgRandom}.jpg`;
      break;
    case 1: {
      const isMobile = window.innerWidth < 768;
      bgUrl.value = `https://api.dujin.org/bing/${isMobile ? "m" : "1920"}.php`;
      break;
    }
    case 2:
      bgUrl.value = "https://api.aixiaowai.cn/gqapi/gqapi.php";
      break;
    case 3:
      bgUrl.value = "https://api.aixiaowai.cn/api/api.php";
      break;
    case 4:
      bgUrl.value = set.backgroundCustom;
      break;
    default:
      bgUrl.value = `/background/bg${bgRandom}.jpg`;
      break;
  }
};

const imgLoadComplete = () => {
  // Apply a slight delay to allow wallpaper animation
  imgTimeout.value = setTimeout(
    () => {
      // Try to apply dynamic theme based on wallpaper
      try {
        if (window.applyDynamicThemeFromImage) {
          window.applyDynamicThemeFromImage(bgUrl.value);
        }
      } catch (e) {
        console.warn("applyDynamicThemeFromImage error:", e);
      }
      status.setImgLoadStatus(true);
    },
    Math.floor(Math.random() * (600 - 300 + 1)) + 300,
  );
};

const imgAnimationEnd = () => {
  console.log("Wallpaper loaded and animation completed");
  emit("loadComplete");
};

const imgLoadError = () => {
  console.error("Wallpaper loading failed:", bgUrl.value);
  $message.error("Wallpaper loading failed, temporarily switched back to default");
  bgUrl.value = `/background/bg${bgRandom}.jpg`;
};

onMounted(() => {
  setBgUrl();
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
  background-color: var(--md-sys-color-background);
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
