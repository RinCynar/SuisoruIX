<template>
  <Transition name="fadeDown" mode="out-in">
    <div
      v-if="
        set.showSuggestions &&
        searchKeyword !== null &&
        status.siteStatus === 'focus' &&
        !status.engineChangeStatus
      "
      class="suggestions"
      :style="{ height: `${suggestionsHeights}px` }"
    >
      <n-scrollbar style="max-height: 45vh">
        <!-- quicktouch -->
        <Transition
          name="fade"
          mode="out-in"
          @after-enter="changeSuggestionsHeights"
          @after-leave="changeSuggestionsHeights"
        >
          <div v-if="searchKeyword !== null" class="special-result" ref="specialallResultsRef">
            <!-- quicktranslate -->
            <div
              v-if="searchKeywordType === 'text'"
              class="s-result"
              @click.stop="toSearch(keyWord, 2)"
            >
              <SvgIcon iconName="icon-translation-two" />
              <span class="text">{{ t("search.quickTranslate", { text: keyWord }) }}</span>
            </div>
            <!-- direct access -->
            <div
              v-if="searchKeywordType !== 'text'"
              class="s-result"
              @click.stop="toSearch(searchKeyword, searchKeywordType === 'email' ? 3 : 4)"
            >
              <SvgIcon :iconName="`icon-${searchKeywordType === 'email' ? 'email' : 'link'}`" />
              <span class="text">
                {{
                  t(searchKeywordType === "email" ? "search.sendEmail" : "search.directAccess", {
                    email: searchKeyword,
                    url: searchKeyword,
                  })
                }}
              </span>
            </div>
          </div>
        </Transition>
        <!-- Search suggestions -->
        <Transition
          name="fade"
          mode="out-in"
          @after-enter="changeSuggestionsHeights"
          @after-leave="changeSuggestionsHeights"
        >
          <div
            v-if="searchKeyword !== null && searchSuggestionsData[0]"
            class="all-result"
            ref="allResultsRef"
          >
            <div
              v-for="item in searchSuggestionsData"
              class="s-result"
              :key="item"
              @click.stop="toSearch(item, 1)"
            >
              <SvgIcon iconName="icon-search" className="search" />
              <span class="text">{{ item }}</span>
            </div>
          </div>
        </Transition>
      </n-scrollbar>
    </div>
  </Transition>
</template>

<script setup>
import { NScrollbar } from "naive-ui";
import { nextTick, ref, watch } from "vue";
import { statusStore, setStore } from "@/stores";
import { useI18n } from "@/i18n";
import { getSearchSuggestions } from "@/api";
import debounce from "@/utils/debounce";
import identifyInput from "@/utils/identifyInput";
const set = setStore();
const status = statusStore();
const { t } = useI18n();
const emit = defineEmits(["toSearch"]);
const searchKeyword = ref(null);
const searchKeywordType = ref("text");
const searchSuggestionsData = ref([]);
const specialallResultsRef = ref(null);
const allResultsRef = ref(null);
const suggestionsHeights = ref(0);
const props = defineProps({
  keyWord: {
    type: String,
    required: true,
  },
});

const keywordsSearch = debounce((val) => {
  const searchValue = val?.trim();
  if (!searchValue || searchValue === "") {
    searchKeyword.value = null;
    return false;
  }
  status.setEngineChangeStatus(false);
  searchKeyword.value = searchValue;
  if (searchKeyword.value) {
    console.log(val + "'s search suggestions");
    getSearchSuggestions(searchValue)
      .then((res) => {
        console.log(res);
        searchSuggestionsData.value = Array.from(res);
        nextTick().then(() => {
          changeSuggestionsHeights();
        });
      })
      .catch((error) => {
        searchSuggestionsData.value = [];
        console.error("An error occurred while processing search suggestions:", error);
      });
  }
}, 300);

const keyboardEvents = (keyCode, event) => {
  try {
    const mainInput = document.getElementById("main-input");
    if (keyCode === 38 || keyCode === 40) {
      event.preventDefault();
      if (mainInput && allResultsRef.value && searchSuggestionsData.value[0]) {
        const suggestionItems = allResultsRef.value.querySelectorAll(".s-result");
        if (suggestionItems.length > 0) {
          const focusedItem = document.querySelector(".s-result.focus");
          const currentIndex = Array.from(suggestionItems).indexOf(focusedItem);
          suggestionItems.forEach((item) => item.classList.toggle("focus", false));
          let nextIndex = keyCode === 38 ? currentIndex - 1 : currentIndex + 1;
          nextIndex = Math.max(0, Math.min(nextIndex, suggestionItems.length - 1));
          if (nextIndex !== -1) {
            suggestionItems[nextIndex].classList.toggle("focus", true);
            mainInput.value = suggestionItems[nextIndex].querySelector(".text").textContent;
          }
        }
      }
    }
    if (keyCode === 13) {
      toSearch(mainInput.value, 1);
    }
  } catch (error) {
    $message.error(t("search.suggestionsError"));
    console.error("There is an error with keyboard events:" + error);
  }
};

const changeSuggestionsHeights = () => {
  try {
    const allResultsHeight = allResultsRef.value?.offsetHeight;
    const specialallResultsHeight = specialallResultsRef.value?.offsetHeight;
    suggestionsHeights.value = (specialallResultsHeight || 0) + (allResultsHeight || 0);
  } catch (error) {
    console.error("Error calculating height:" + error);
  }
};

const toSearch = (val, type = 1) => {
  emit("toSearch", val, type);
};

watch(
  () => props.keyWord,
  (val) => {
    if (set.showSuggestions) {
      searchSuggestionsData.value = [];
      searchKeywordType.value = identifyInput(val);
      keywordsSearch(val);
    }
  },
);

defineExpose({ keyboardEvents });
</script>

<style lang="scss" scoped>
.suggestions {
  position: absolute;
  top: -8px;
  left: 0;
  width: 100%;
  max-height: 45vh;
  overflow: hidden;
  color: var(--md-sys-color-on-surface);
  background-color: var(--md-sys-color-surface-container-high);
  backdrop-filter: blur(var(--md-sys-surface-blur));
  border-radius: var(--md-sys-shape-corner-extra-large);
  box-shadow: var(--md-sys-elevation-2);
  transition:
    height var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard),
    opacity var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard),
    transform var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard);
  z-index: 1;

  .all-result,
  .special-result {
    .s-result {
      cursor: pointer;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      min-height: 48px;
      padding: var(--md-sys-spacing-2) var(--md-sys-spacing-4);
      font-size: var(--md-sys-typescale-body-medium-size);
      line-height: var(--md-sys-typescale-body-medium-line);
      transition:
        background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard),
        padding-left var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);

      .i-icon {
        opacity: 0.8;
        margin-right: var(--md-sys-spacing-2);
        color: var(--md-sys-color-on-surface-variant);
      }

      .text {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      @media (min-width: 600px) {
        &:hover,
        &.focus {
          background-color: var(--md-sys-color-surface-container);
          padding-left: var(--md-sys-spacing-5);
        }
      }

      &:active {
        background-color: var(--md-sys-color-surface-container);
        padding-left: var(--md-sys-spacing-5);
      }
    }
  }
}
</style>
