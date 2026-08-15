<template>
  <div class="all-set">
    <n-tabs class="set" size="large" justify-content="space-evenly" animated>
      <n-tab-pane name="main" :tab="t('settings.tab.basic')">
        <n-scrollbar class="scrollbar">
          <n-h6 prefix="bar"> Language </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">Language</span>
              <span class="tip">English / 日本語</span>
            </div>
            <n-select class="set" v-model:value="language" :options="languageOptions" />
          </n-card>
          <n-h6 prefix="bar">{{ t('settings.theme.section') }}</n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">{{ t('settings.theme.mode') }}</span>
              <span class="tip">{{ t('settings.theme.modeTip') }}</span>
            </div>
            <n-grid class="cover-selete" responsive="screen" cols="3" :x-gap="12" :y-gap="12">
              <n-grid-item
                v-for="item in themeModeOptions"
                :key="item.value"
                :class="['item', backgroundType === item.value ? 'check' : null]"
                @click="changeBackground(item.value)"
              >
                <span class="name">{{ item.name }}</span>
              </n-grid-item>
            </n-grid>
          </n-card>
          <n-card v-if="backgroundType === 'm3'" class="set-item">
            <div class="name">
              <span class="title">{{ t('settings.theme.seedColor') }}</span>
              <span class="tip">{{ t('settings.theme.seedColorTip') }}</span>
            </div>
            <n-color-picker
              class="set seed-picker"
              v-model:value="seedColorValue"
              :show-alpha="false"
              :modes="['hex']"
              @complete="onSeedColorComplete"
            />
          </n-card>
          <n-card v-if="backgroundType === 'custom'" class="set-item custom-card">
            <div class="name">
              <span class="title">{{ t('settings.theme.customBackground') }}</span>
              <span class="tip">{{ t('settings.theme.customBackgroundTip') }}</span>
            </div>
            <div class="custom-content">
              <div v-if="backgroundCustom" class="custom-preview">
                <img :src="backgroundCustom" alt="preview" />
              </div>
              <n-space>
                <n-button strong secondary @click="customCoverModal = true">
                  {{ t('settings.theme.change') }}
                </n-button>
                <n-button v-if="backgroundCustom" strong secondary @click="removeCustomBackground">
                  {{ t('settings.theme.remove') }}
                </n-button>
              </n-space>
            </div>
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">{{ t('settings.theme.type') }}</span>
              <span class="tip">{{ t('settings.theme.typeTip') }}</span>
            </div>
            <n-select class="set" v-model:value="themeType" :options="themeTypeOptions" />
          </n-card>
          <n-card v-if="backgroundType !== 'm3'" class="set-item">
            <div class="name">
              <span class="title">{{ t('settings.theme.mask') }}</span>
              <span class="tip">{{ t('settings.theme.maskTip') }}</span>
            </div>
            <n-switch v-model:value="showBackgroundGray" />
          </n-card>
          <n-card v-if="backgroundType !== 'm3'" class="set-item">
            <div class="name">
              <span class="title">{{ t('settings.theme.blur') }}</span>
              <span class="tip">{{ t('settings.theme.blurTip') }}</span>
            </div>
            <n-slider
              class="set"
              v-model:value="backgroundBlur"
              :step="0.01"
              :min="0"
              :max="10"
              :tooltip="false"
            />
          </n-card>
          <n-h6 prefix="bar">{{ t('settings.search.section') }}</n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">{{ t('settings.search.engine') }}</span>
              <span class="tip">{{ t('settings.search.engineTip') }}</span>
            </div>
            <n-button strong secondary @click="goAdjustEngine">{{ t('settings.search.engineGo') }}</n-button>
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">{{ t('settings.search.suggestions') }}</span>
              <span class="tip">{{ t('settings.search.suggestionsTip') }}</span>
            </div>
            <n-switch v-model:value="showSuggestions" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">{{ t('settings.search.jumpMethod') }}</span>
              <span class="tip">{{ t('settings.search.jumpMethodTip') }}</span>
            </div>
            <n-select class="set" v-model:value="urlJumpType" :options="urlJumpTypeOptions" />
          </n-card>
          <n-h6 prefix="bar">{{ t('settings.time.section') }}</n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">{{ t('settings.time.style') }}</span>
              <span class="tip">{{ t('settings.time.styleTip') }}</span>
            </div>
            <n-select class="set" v-model:value="timeStyle" :options="timeStyleOptions" />
          </n-card>
          <n-card v-if="timeStyle === 'one'" class="set-item">
            <div class="name">
              <span class="title">{{ t('settings.time.seconds') }}</span>
              <span class="tip">{{ t('settings.time.secondsTip') }}</span>
            </div>
            <n-switch v-model:value="showSeconds" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">{{ t('settings.time.zero') }}</span>
              <span class="tip">{{ t('settings.time.zeroTip') }}</span>
            </div>
            <n-switch v-model:value="showZeroTime" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">{{ t('settings.time.h12') }}</span>
            </div>
            <n-switch v-model:value="use12HourFormat" />
          </n-card>
        </n-scrollbar>
      </n-tab-pane>
      <n-tab-pane name="personalization" :tab="t('settings.tab.personalize')">
        <n-scrollbar class="scrollbar">
          <n-h6 prefix="bar">{{ t('settings.input.section') }}</n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">{{ t('settings.input.shrink') }}</span>
              <span class="tip">{{ t('settings.input.shrinkTip') }}</span>
            </div>
            <n-switch v-model:value="smallInput" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">{{ t('settings.input.focus') }}</span>
              <span class="tip">{{ t('settings.input.focusTip') }}</span>
            </div>
            <n-switch v-model:value="autoFocus" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">{{ t('settings.input.blur') }}</span>
              <span class="tip">{{ t('settings.input.blurTip') }}</span>
            </div>
            <n-switch v-model:value="autoInputBlur" />
          </n-card>
        </n-scrollbar>
      </n-tab-pane>
      <n-tab-pane name="other" :tab="t('settings.tab.other')">
        <n-scrollbar class="scrollbar">
          <n-h6 prefix="bar">{{ t('settings.reset.section') }}</n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">{{ t('settings.reset.title') }}</span>
              <span class="tip">{{ t('settings.reset.tip') }}</span>
            </div>
            <n-button strong secondary @click="resetSite">{{ t('settings.reset.button') }}</n-button>
          </n-card>
          <n-h6 prefix="bar">{{ t('settings.backup.section') }}</n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">{{ t('settings.backup.title') }}</span>
              <span class="tip">{{ t('settings.backup.tip') }}</span>
            </div>
            <n-button strong secondary @click="backupSite">{{ t('settings.backup.button') }}</n-button>
          </n-card>
          <n-h6 prefix="bar">{{ t('settings.recover.section') }}</n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">{{ t('settings.recover.title') }}</span>
              <span class="tip">{{ t('settings.recover.tip') }}</span>
            </div>
            <input
              ref="recoverRef"
              type="file"
              style="display: none"
              accept=".json"
              @change="recoverSite"
            />
            <n-button strong secondary @click="recoverRef?.click()">{{ t('settings.recover.button') }}</n-button>
          </n-card>
        </n-scrollbar>
      </n-tab-pane>
    </n-tabs>
    <!-- Customize background -->
    <n-modal
      preset="card"
      :title="t('settings.custom.modalTitle')"
      v-model:show="customCoverModal"
      :bordered="false"
    >
      <n-form>
        <n-form-item :label="t('settings.custom.linkLabel')">
          <n-input
            clearable
            v-model:value="customCoverUrl"
            :placeholder="t('settings.custom.linkPlaceholder')"
          />
        </n-form-item>
        <n-form-item :label="t('settings.custom.uploadLabel')">
          <n-button strong secondary @click="localImageInput?.click()">
            {{ t('settings.custom.uploadLabel') }}
          </n-button>
          <input
            ref="localImageInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="onLocalImageChange"
          />
        </n-form-item>
        <div v-if="customPreview" class="modal-preview">
          <img :src="customPreview" alt="preview" />
        </div>
        <n-text depth="3">{{ t('settings.custom.uploadHint') }}</n-text>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button strong secondary @click="closeCustomModal">{{ t('common.cancel') }}</n-button>
          <n-button strong secondary @click="setCustomCover">{{ t('common.confirm') }}</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import {
  NH6,
  NTabs,
  NTabPane,
  NSpace,
  NCard,
  NSwitch,
  NSelect,
  NScrollbar,
  NButton,
  NGrid,
  NGridItem,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NSlider,
  NColorPicker,
  NText,
} from "naive-ui";
import { storeToRefs } from "pinia";
import { setStore, statusStore } from "@/stores";
import { useI18n } from "@/i18n";
import identifyInput from "@/utils/identifyInput";

const set = setStore();
const status = statusStore();
const { t } = useI18n();

const {
  language,
  themeType,
  backgroundType,
  backgroundCustom,
  seedColor,
  showBackgroundGray,
  backgroundBlur,
  smallInput,
  autoFocus,
  autoInputBlur,
  showSeconds,
  showZeroTime,
  use12HourFormat,
  showSuggestions,
  urlJumpType,
  timeStyle,
} = storeToRefs(set);

const recoverRef = ref(null);
const localImageInput = ref(null);
const customCoverModal = ref(false);
const customCoverUrl = ref("");
const customPreview = ref("");
const seedColorValue = ref(seedColor.value);

const languageOptions = [
  { label: "English", value: "en" },
  { label: "日本語", value: "ja" },
];

const themeTypeOptions = computed(() => [
  { label: t("settings.theme.type.light"), value: "light" },
  { label: t("settings.theme.type.dark"), value: "dark" },
  { label: t("settings.theme.type.system"), value: "system" },
]);

const themeModeOptions = computed(() => [
  { value: "default", name: t("settings.theme.mode.default"), tip: t("settings.theme.mode.defaultTip") },
  { value: "m3", name: t("settings.theme.mode.m3"), tip: t("settings.theme.mode.m3Tip") },
  { value: "custom", name: t("settings.theme.mode.custom"), tip: t("settings.theme.mode.customTip") },
]);

const urlJumpTypeOptions = computed(() => [
  { label: t("settings.search.jumpMethod.open"), value: "open" },
  { label: t("settings.search.jumpMethod.href"), value: "href" },
]);

const timeStyleOptions = computed(() => [
  { label: t("settings.time.style.one"), value: "one" },
  { label: t("settings.time.style.two"), value: "two" },
]);

const changeBackground = (type) => {
  if (type === "custom" && !backgroundCustom.value) {
    customCoverModal.value = true;
    return;
  }
  backgroundType.value = type;
  const modeName = themeModeOptions.value.find((item) => item.value === type)?.name;
  $message.success(t("settings.theme.enabled", { name: modeName ?? "" }));
};

const onSeedColorComplete = (value) => {
  if (/^#([0-9a-fA-F]{6})$/.test(value)) {
    seedColor.value = value;
  }
};

const removeCustomBackground = () => {
  backgroundCustom.value = "";
  backgroundType.value = "default";
  customPreview.value = "";
  $message.info(t("settings.custom.removed"));
};

const goAdjustEngine = () => {
  status.setSiteStatus("focus");
  status.setEngineChangeStatus(true);
};

const closeCustomModal = () => {
  customCoverModal.value = false;
  customCoverUrl.value = "";
  customPreview.value = "";
};

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

// Downscale / re-encode a local image so it fits comfortably in browser storage.
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1920;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Keep transparency when the source image supports it.
        const hasAlpha = /png|webp|gif/i.test(file.type);
        resolve(hasAlpha ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = () => reject(new Error("decode"));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error("read"));
    reader.readAsDataURL(file);
  });
};

const onLocalImageChange = async (event) => {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  if (file.size > MAX_IMAGE_SIZE) {
    $message.error(t("settings.custom.tooLarge"));
    return;
  }
  try {
    const dataUrl = await compressImage(file);
    customPreview.value = dataUrl;
    customCoverUrl.value = "";
  } catch (error) {
    console.error("Image processing failed:", error);
    $message.error(t("settings.custom.readError"));
  }
};

const setCustomCover = () => {
  const value = customCoverUrl.value?.trim();
  if (value) {
    if (identifyInput(value) === "url") {
      backgroundType.value = "custom";
      backgroundCustom.value = value;
      closeCustomModal();
      $message.success(t("settings.theme.enabled", { name: t("settings.theme.mode.custom") }));
    } else {
      $message.error(t("settings.custom.invalidUrl"));
    }
    return;
  }
  if (customPreview.value) {
    backgroundType.value = "custom";
    backgroundCustom.value = customPreview.value;
    closeCustomModal();
    $message.success(t("settings.theme.enabled", { name: t("settings.theme.mode.custom") }));
    return;
  }
  $message.error(t("settings.custom.invalidUrl"));
};

const resetSite = () => {
  $dialog.warning({
    title: t("settings.reset.dialogTitle"),
    content: t("settings.reset.dialogContent"),
    positiveText: t("settings.reset.button"),
    negativeText: t("common.cancel"),
    onPositiveClick: () => {
      localStorage.clear();
      $message.info(t("settings.reset.success"));
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
  });
};

const backupSite = () => {
  try {
    const date = new Date();
    const dateString = date.toISOString().replace(/[:.]/g, "-");
    const fileName = `SuisoruIX_Backup_${dateString}.json`;
    const jsonData = JSON.stringify(set.$state);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    $message.success(t("settings.backup.success"));
  } catch (error) {
    console.error("Site backup failed:", error);
    $message.error(t("settings.backup.fail"));
  }
};

const recoverSite = async () => {
  try {
    const fileInput = recoverRef.value;
    if (!fileInput?.files.length) {
      $message.error(t("settings.recover.noFile"));
      return false;
    }
    const file = fileInput.files[0];
    const jsonData = await file.text();
    const data = JSON.parse(jsonData);
    $dialog.warning({
      title: t("settings.recover.dialogTitle"),
      content: t("settings.recover.dialogContent"),
      positiveText: t("settings.recover.button"),
      negativeText: t("common.cancel"),
      onPositiveClick: async () => {
        const isSuccess = await set.recoverSiteData(data);
        if (isSuccess) {
          $message.info(t("settings.recover.success"));
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          $message.error(t("settings.recover.fail"));
        }
      },
      onNegativeClick: () => {
        recoverRef.value.value = null;
      },
    });
  } catch (error) {
    console.error("Site data recovery failed:", error);
    $message.error(t("settings.recover.invalid"));
  }
};

watch(seedColor, (value) => {
  seedColorValue.value = value;
});

onMounted(() => {
  // Pre-fill the URL field when the current custom background is a link.
  if (backgroundCustom.value && !backgroundCustom.value.startsWith("data:")) {
    customCoverUrl.value = backgroundCustom.value;
  }
});
</script>

<style lang="scss">
.cover-selete {
  margin-top: var(--md-sys-spacing-3);
  .item {
    cursor: pointer;
    position: relative;
    width: 100%;
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--md-sys-shape-corner-full);
    background-color: var(--md-sys-color-surface-container);
    font-size: var(--md-sys-typescale-label-large-size);
    line-height: var(--md-sys-typescale-label-large-line);
    transition:
      background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard),
      color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard),
      transform var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
    &.check {
      background-color: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-secondary-container);
      font-weight: 500;
    }
    &:hover {
      background-color: var(--md-sys-elevation-tint-2);
    }
    &:active {
      transform: scale(0.98);
    }
  }
}
.custom-card .n-card__content {
  flex-direction: column !important;
  align-items: flex-start !important;
  .custom-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md-sys-spacing-3);
  }
}
.custom-preview {
  width: 100%;
  max-width: 320px;
  border-radius: var(--md-sys-shape-corner-large);
  overflow: hidden;
  border: 1px solid var(--md-sys-color-outline-variant);
  img {
    display: block;
    width: 100%;
    height: 120px;
    object-fit: cover;
  }
}
.seed-picker {
  width: 200px;
}
.modal-preview {
  width: 100%;
  max-height: 220px;
  border-radius: var(--md-sys-shape-corner-large);
  overflow: hidden;
  margin-bottom: var(--md-sys-spacing-2);
  border: 1px solid var(--md-sys-color-outline-variant);
  img {
    display: block;
    width: 100%;
    max-height: 220px;
    object-fit: cover;
  }
}
</style>
