<template>
  <Transition name="fadeDown" mode="out-in">
    <div v-if="status.engineChangeStatus" class="engine-choose">
      <n-scrollbar style="max-height: 44.5vh">
        <n-grid class="all-engine" responsive="screen" cols="2 s:3 m:4 l:4" :x-gap="12" :y-gap="12">
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
            <span class="name">{{ t("engine.custom") }}</span>
          </n-grid-item>
          <n-grid-item class="engine" @click="customEngineModal = true">
            <SvgIcon iconName="icon-custom" />
            <span class="name">{{ t("engine.customConfig") }}</span>
          </n-grid-item>
        </n-grid>
      </n-scrollbar>
      <!-- Custom Search Engine -->
      <n-modal
        preset="card"
        :title="t('engine.modalTitle')"
        v-model:show="customEngineModal"
        :bordered="false"
      >
        <n-form
          ref="customEngineRef"
          :rules="customEngineRules"
          :model="customEngineValue"
          :label-width="80"
        >
          <n-form-item :label="t('engine.address')" path="url">
            <n-input
              clearable
              v-model:value="customEngineValue.url"
              :placeholder="t('engine.addressPlaceholder')"
            />
          </n-form-item>
        </n-form>
        <template #footer>
          <n-space justify="end">
            <n-button strong secondary @click="customEngineModal = false">
              {{ t("common.cancel") }}
            </n-button>
            <n-button strong secondary @click="setCustomEngine">
              {{ t("common.confirm") }}
            </n-button>
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
import { useI18n } from "@/i18n";
import defaultEngine from "@/assets/defaultEngine.json";

const set = setStore();
const status = statusStore();
const { t } = useI18n();

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
        return new Error(t("engine.addressRequired"));
      } else if (!/^https:\/\/[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(value)) {
        return new Error(t("engine.addressInvalid"));
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
    $message.info(t("engine.noData"));
    customEngineModal.value = true;
  }
};

const setCustomEngine = () => {
  customEngineRef.value?.validate((errors) => {
    if (!errors) {
      set.setSearchEngine(customEngineValue.value.url, true);
      customEngineModal.value = false;
      $message.success(t("engine.enabled"));
    } else {
      $message.error(t("engine.checkInput"));
    }
  });
};
</script>

<style lang="scss" scoped>
.engine-choose {
  position: absolute;
  top: -8px;
  left: 0;
  width: 100%;
  color: var(--md-sys-color-on-surface);
  background-color: var(--md-sys-color-surface-container-highest);
  backdrop-filter: blur(var(--md-sys-surface-blur));
  border-radius: var(--md-sys-shape-corner-extra-large);
  box-shadow: var(--md-sys-elevation-2);
  box-sizing: border-box;
  z-index: 1;
  .all-engine {
    padding: var(--md-sys-spacing-3);
    box-sizing: border-box;
    .engine {
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 48px;
      padding: 0 var(--md-sys-spacing-4);
      grid-column: span 1 / span 1;
      border-radius: var(--md-sys-shape-corner-full);
      box-sizing: border-box;
      background-color: var(--md-sys-color-surface-container);
      font-size: var(--md-sys-typescale-label-large-size);
      line-height: var(--md-sys-typescale-label-large-line);
      transition:
        background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard),
        box-shadow var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
      .i-icon {
        margin-right: var(--md-sys-spacing-3);
      }
      .name {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &.choose {
        background-color: var(--md-sys-color-secondary-container);
        color: var(--md-sys-color-on-secondary-container);
      }
      &:hover {
        background-color: var(--md-sys-elevation-tint-2);
      }
      &:active {
        background-color: var(--md-sys-color-surface-container-high);
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
