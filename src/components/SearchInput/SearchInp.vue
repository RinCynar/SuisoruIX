<template>
  <!-- Search box -->
  <div
    :class="[
      'search-input',
      set.smallInput ? 'small' : null,
      status.siteStatus === 'focus' ? 'focus' : null,
    ]"
    @click.stop
  >
    <!-- Search box mask -->
    <div
      v-if="status.siteStatus === 'focus'"
      class="mask"
      @click="closeSearchInput(false)"
      @contextmenu.stop="
        (event) => {
          event.preventDefault();
        }
      "
    />
    <!-- Main search box -->
    <div class="all" ref="searchAllRef" @animationend="inputAnimationEnd">
      <div class="engine" :title="t('search.switchEngine')" @click="changeEngine">
        <Transition name="fade" mode="out-in">
          <SvgIcon
            :iconName="`icon-${
              set.searchEngine !== 'custom' ? defaultEngine[set.searchEngine]?.icon : 'custom'
            }`"
            :key="set.searchEngine"
          />
        </Transition>
      </div>
      <input
        class="input"
        id="main-input"
        ref="searchInputRef"
        type="text"
        label="search"
        :title="t('search.inputTitle')"
        autocomplete="false"
        :placeholder="inputTip"
        v-model="status.searchInputValue"
        @focus="status.setSiteStatus('focus')"
        @click.stop="status.setEngineChangeStatus(false)"
        @keydown.stop="pressKeyboard"
      />
      <div class="go" :title="t('search.go')" @click="toSearch(status.searchInputValue)">
        <SvgIcon iconName="icon-search" className="search" />
      </div>
    </div>
    <!-- Search engine switch -->
    <SearchEngine />
    <!-- Search suggestions -->
    <Suggestions ref="suggestionsRef" :keyWord="status.searchInputValue" @toSearch="toSearch" />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { statusStore, setStore } from "@/stores";
import { useI18n } from "@/i18n";
import SearchEngine from "@/components/SearchInput/SearchEngine.vue";
import Suggestions from "@/components/SearchInput/Suggestions.vue";
import defaultEngine from "@/assets/defaultEngine.json";

const set = setStore();
const status = statusStore();
const { t } = useI18n();

const inputTip = computed(() => import.meta.env.VITE_INPUT_TIP ?? t("search.placeholder"));

const searchAllRef = ref(null);
const searchInputRef = ref(null);

const suggestionsRef = ref(null);

const closeSearchInput = (check = false) => {
  if (check && !set.autoInputBlur) {
    status.setSiteStatus("focus");
  } else {
    status.setSearchInputValue("");
    status.setSiteStatus("normal");
    searchInputRef.value?.blur();
  }
  status.setEngineChangeStatus(false);
};

const toSearch = (val, type = 1) => {
  const searchValue = val?.trim();
  const jumpLink = (url) => {
    if (set.urlJumpType === "href") {
      window.location.href = url;
    } else if (set.urlJumpType === "open") {
      window.open(url, "_blank");
    }
  };
  if (searchValue) {
    const searchFormat = encodeURIComponent(searchValue);
    console.log("Go to search:" + searchValue, type);
    switch (type) {
      case 1:
        if (set.searchEngine !== "custom") {
          const engine = defaultEngine[set.searchEngine];
          jumpLink(engine?.url + searchFormat);
        } else {
          jumpLink(set.customEngineUrl + searchFormat);
        }
        break;
      case 2: {
        const hasTranslation = defaultEngine[set.searchEngine]?.translation;
        jumpLink(
          hasTranslation
            ? hasTranslation + searchFormat
            : `https://fanyi.baidu.com/#en/zh/${searchFormat}`,
        );
        break;
      }
      case 3:
        jumpLink(`mailto:${searchFormat}`);
        break;
      case 4: {
        const urlRegex = /^(https?:\/\/)/i;
        const url = urlRegex.test(searchFormat) ? searchFormat : `//${searchFormat}`;
        jumpLink(url);
        break;
      }
      default:
        break;
    }
    closeSearchInput(true);
  } else {
    if (status.siteStatus === "focus") {
      $message.info(t("search.empty"), { duration: 1500 });
    }
    status.setSiteStatus("focus");
    searchInputRef.value?.focus();
  }
};

const inputAnimationEnd = () => {
  console.log("Search box animation ends");
  if (set.autoFocus) {
    status.setSiteStatus("focus");
    searchInputRef.value?.focus();
  }
};

const pressKeyboard = (event) => {
  const keyCode = event.keyCode;
  suggestionsRef.value?.keyboardEvents(keyCode, event);
};

const changeEngine = () => {
  status.setSiteStatus("focus", false);
  status.setEngineChangeStatus(!status.engineChangeStatus);
};
</script>

<style lang="scss" scoped>
.search-input {
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 680px;
  width: calc(100% - 60px);
  transition: width 0.35s cubic-bezier(0.2, 0, 0, 1);
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
  .all {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 52px;
    width: 100%;
    border-radius: var(--md-sys-shape-corner-full);
    color: var(--main-text-color);
    background-color: var(--main-background-color);
    backdrop-filter: blur(20px);
    opacity: 1;
    box-shadow: var(--main-box-shadow);
    animation: fade-up-in 0.7s cubic-bezier(0.2, 0, 0, 1);
    transition:
      transform 0.3s cubic-bezier(0.2, 0, 0, 1),
      background-color 0.3s cubic-bezier(0.2, 0, 0, 1),
      box-shadow 0.3s cubic-bezier(0.2, 0, 0, 1),
      opacity 0.5s cubic-bezier(0.2, 0, 0, 1);
    z-index: 1;
    .input {
      display: flex;
      justify-content: center;
      height: 100%;
      width: 100%;
      padding: 0;
      margin: 0;
      border: none;
      outline: none;
      background: none;
      font-size: 18px;
      color: var(--main-text-color);
      &::placeholder {
        width: 100%;
        text-align: center;
        color: var(--main-text-color);
        letter-spacing: 2px;
        transition: opacity 0.3s ease;
      }
    }
    .engine,
    .go {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 44px;
      width: 44px;
      margin: 0 4px;
      font-size: 20px;
      border-radius: var(--md-sys-shape-corner-full);
      transition:
        background-color 0.3s ease,
        opacity 0.3s ease;
      &:hover {
        background-color: var(--main-background-hover-color);
      }
      @media (max-width: 520px) {
        font-size: 18px;
        height: 40px;
        width: 40px;
      }
    }
  }
  &.small {
    width: 260px;
    .all {
      .engine,
      .go {
        opacity: 0;
        pointer-events: none;
      }
      .input {
        &::placeholder {
          opacity: 0.8;
        }
      }
      &.focus {
        .engine,
        .go {
          opacity: 1;
          pointer-events: auto;
        }
      }
    }
    &:hover {
      // width: calc(100% - 60px);
      .all {
        .input {
          &::placeholder {
            opacity: 1;
          }
        }
      }
    }
  }
  &.focus {
    width: calc(100% - 60px);
    .all {
      transform: translateY(-80px);
      background-color: var(--main-input-hover-color);
      box-shadow: 0px 6px 16px 4px rgba(0,0,0,0.15);
      .input {
        color: var(--main-text-hover-color);
        &::placeholder {
          opacity: 0;
        }
      }
      .engine,
      .go,
      .delete {
        opacity: 1;
        color: var(--main-text-hover-color);
      }
    }
  }
}
</style>
