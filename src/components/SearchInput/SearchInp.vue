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
      <div class="engine" title="Switch search engine" @click="changeEngine">
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
        title="Please enter your search content"
        autocomplete="false"
        :placeholder="inputTip"
        v-model="status.searchInputValue"
        @focus="status.setSiteStatus('focus')"
        @click.stop="status.setEngineChangeStatus(false)"
        @keydown.stop="pressKeyboard"
      />
      <div class="go" title="Search" @click="toSearch(status.searchInputValue)">
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
import { ref } from "vue";
import { statusStore, setStore } from "@/stores";
import SearchEngine from "@/components/SearchInput/SearchEngine.vue";
import Suggestions from "@/components/SearchInput/Suggestions.vue";
import defaultEngine from "@/assets/defaultEngine.json";

const set = setStore();
const status = statusStore();

const inputTip = import.meta.env.VITE_INPUT_TIP ?? "What's you want?";

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
      $message.info("Please enter your search content", { duration: 1500 });
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
  transition: width 0.35s linear;
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
    height: 42px;
    width: 100%;
    border-radius: 30px;
    color: var(--main-text-color);
    background-color: var(--main-background-color);
    backdrop-filter: blur(10px);
    opacity: 1;
    animation: fade-up-in 0.7s cubic-bezier(0.37, 0.99, 0.36, 1);
    transition:
      transform 0.3s,
      background-color 0.3s,
      opacity 0.5s;
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
      font-size: 16px;
      color: var(--main-text-color);
      &::placeholder {
        width: 100%;
        text-align: center;
        color: var(--main-text-color);
        letter-spacing: 2px;
        transition: opacity 0.3s;
      }
    }
    .engine,
    .go {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 64px;
      font-size: 20px;
      border-radius: 30px;
      transition:
        background-color 0.3s,
        opacity 0.3s;
      &:hover {
        background-color: var(--main-background-color);
      }
      @media (max-width: 520px) {
        font-size: 18px;
      }
    }
  }
  &.small {
    width: 260px;
    .all {
      .engine,
      .go {
        opacity: 0;
      }
      .input {
        &::placeholder {
          opacity: 0.6;
        }
      }
      &.focus {
        .engine,
        .go {
          opacity: 1;
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
      transform: translateY(-60px);
      background-color: var(--main-input-hover-color);
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
