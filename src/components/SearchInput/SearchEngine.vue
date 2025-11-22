<template>
  <Transition name="fadeDown" mode="out-in">
    <div v-if="status.engineChangeStatus" class="engine-choose">
      <n-scrollbar style="max-height: 44.5vh">
        <n-grid class="all-engine" responsive="screen" cols="2 s:3 m:4 l:4" :x-gap="10" :y-gap="10">
          <n-grid-item
            v-for="(item, key) in defaultEngine"
            :key="key"
            :class="['engine', key === set.searchEngine ? 'choose' : null]"
            @click="changeSearchEngine(key)"
          >
            <SvgIcon :iconName="`icon-${key}`" />
            <span class="name">{{ item.name }}</span>
          </n-grid-item>
          <n-grid-item
            :class="['engine', set.searchEngine === 'custom' ? 'choose' : null]"
            @click="customEngineClick"
          >
            <SvgIcon iconName="icon-custom" />
            <span class="name">Custom</span>
          </n-grid-item>
          <n-grid-item class="engine" @click="customEngineModal = true">
            <SvgIcon iconName="icon-custom" />
            <span class="name">Custom Configuration</span>
          </n-grid-item>
        </n-grid>
      </n-scrollbar>
      <!-- Custom Search Engine -->
      <n-modal
        preset="card"
        title="Custom Search Engine"
        v-model:show="customEngineModal"
        :bordered="false"
      >
        <n-form
          ref="customEngineRef"
          :rules="customEngineRules"
          :model="customEngineValue"
          :label-width="80"
        >
          <n-form-item label="Custom search engine address" path="url">
            <n-input
              clearable
              v-model:value="customEngineValue.url"
              placeholder="Please enter a custom search engine address"
            />
          </n-form-item>
        </n-form>
        <template #footer>
          <n-space justify="end">
            <n-button strong secondary @click="customEngineModal = false"> Cancel </n-button>
            <n-button strong secondary @click="setCustomEngine"> Confirm </n-button>
          </n-space>
        </template>
      </n-modal>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from "vue";
import {
  NSpace,
  NButton,
  NScrollbar,
  NGrid,
  NGridItem,
  NModal,
  NForm,
  NFormItem,
  NInput,
} from "naive-ui";
import { statusStore, setStore } from "@/stores";
import defaultEngine from "@/assets/defaultEngine.json";

const set = setStore();
const status = statusStore();

const customEngineRef = ref(null);
const customEngineModal = ref(false);
const customEngineValue = ref({
  url: set.customEngineUrl,
});
const customEngineRules = {
  url: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error("Please enter a custom search engine address");
      } else if (!/^https:\/\/[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(value)) {
        return new Error("Please check whether it is a URL and whether it starts with https://");
      }
      return true;
    },
    trigger: ["input", "blur"],
  },
};

const changeSearchEngine = (key) => {
  const mainInput = document.getElementById("main-input");
  set.setSearchEngine(key);
  status.setEngineChangeStatus(false);
  mainInput?.focus();
};

const customEngineClick = () => {
  if (set.customEngineUrl) {
    changeSearchEngine("custom");
  } else {
    $message.info("No custom data, please configure");
    customEngineModal.value = true;
  }
};

const setCustomEngine = () => {
  customEngineRef.value?.validate((errors) => {
    if (!errors) {
      set.setSearchEngine(customEngineValue.value.url, true);
      customEngineModal.value = false;
      $message.success("Custom Search Engine Enabled");
    } else {
      $message.error("Please check your input");
    }
  });
};
</script>

<style lang="scss" scoped>
.engine-choose {
  position: absolute;
  top: -10px;
  left: 0;
  width: 100%;
  color: var(--md-sys-color-on-surface);
  background-color: var(--md-sys-color-surface);
  backdrop-filter: blur(20px) saturate(1.15);
  border-radius: var(--md-sys-shape-corner-medium);
  box-sizing: border-box;
  z-index: 1;
  .all-engine {
    padding: 10px;
    box-sizing: border-box;
    .engine {
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 40px;
      padding: 0 16px;
      grid-column: span 1 / span 1;
      border-radius: 10px;
      box-sizing: border-box;
      background-color: var(--md-sys-color-surface);
      transition:
        background-color var(--md-sys-motion-duration-short),
        box-shadow var(--md-sys-motion-duration-short),
        transform var(--md-sys-motion-duration-short);
      .i-icon {
        margin-right: 12px;
      }
      .name {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &.choose {
        background-color: var(--md-sys-color-primary-container);
        &::before {
          content: "";
          position: absolute;
          border-radius: 14px;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          border: 2px solid var(--md-sys-color-primary-container);
          transition: opacity var(--md-sys-motion-duration-short);
        }
      }
      &:hover {
        background-color: var(--md-sys-color-primary-container);
        box-shadow: 0 6px 14px rgba(0,0,0,0.12);
        &::before {
          opacity: 0;
        }
      }
      &:active {
        box-shadow: none;
      }
    }
    @media (max-width: 798px) {
      grid-template-columns: repeat(3, minmax(0px, 1fr));
    }
    @media (max-width: 580px) {
      grid-template-columns: repeat(2, minmax(0px, 1fr));
    }
  }
}
</style>
