<template>
  <div class="all-set">
    <n-tabs class="set" size="large" justify-content="space-evenly" animated>
      <n-tab-pane name="main" tab="Basic">
        <n-scrollbar class="scrollbar">
          <n-h6 prefix="bar"> Themes and Wallpapers </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">Theme Category</span>
              <span class="tip">Switch the theme category for the entire site</span>
            </div>
            <n-select class="set" v-model:value="themeType" :options="themeTypeOptions" />
          </n-card>
          <n-card
            class="set-item cover"
            :content-style="{
              flexDirection: 'column',
              alignItems: 'flex-start',
            }"
          >
            <div class="desc">
              <div class="name">
                <span class="title">Wallpaper Preference</span>
                <span class="tip"> Options other than default may cause the page to load slowly </span>
              </div>
              <n-space>
                <Transition name="fade" mode="out-in">
                  <n-button
                    v-if="backgroundType !== 0"
                    strong
                    secondary
                    @click="changeBackground(0, true)"
                  >
                    Restore Defaults
                  </n-button>
                </Transition>
                <n-button strong secondary @click="customCoverModal = true">
                  <template v-if="backgroundType === 4" #icon>
                    <SvgIcon iconName="icon-confirm" />
                  </template>
                  {{ backgroundType === 4 ? "Customization Enabled": "Customization" }}
                </n-button>
              </n-space>
            </div>
            <n-grid
              class="cover-selete"
              responsive="screen"
              cols="2 s:3 m:4 l:4"
              :x-gap="16"
              :y-gap="16"
            >
              <n-grid-item
                v-for="(item, index) in backgroundTypeArr"
                :key="index"
                :class="index === backgroundType ? 'item check' : 'item'"
                @click="changeBackground(index)"
              >
                <span class="name" v-html="item.name" />
              </n-grid-item>
            </n-grid>
          </n-card>
          <n-h6 prefix="bar"> Search </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">Search Engines</span>
              <span class="tip">Switch or customize your search engine</span>
            </div>
            <n-button
              strong
              secondary
              @click="
                () => {
                  status.setSiteStatus('focus');
                  status.setEngineChangeStatus(true);
                }
              "
            >
              Go to Adjustment
            </n-button>
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">Search suggestions</span>
              <span class="tip">Whether to show search suggestions</span>
            </div>
            <n-switch v-model:value="showSuggestions" :round="false" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">Jump method</span>
              <span class="tip">Site-wide link jump method</span>
            </div>
            <n-select class="set" v-model:value="urlJumpType" :options="urlJumpTypeOptions" />
          </n-card>
        </n-scrollbar>
      </n-tab-pane>
      <n-tab-pane name="personalization" tab="Personality">
        <n-scrollbar class="scrollbar">
          <n-h6 prefix="bar"> wallpaper </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">Wallpaper Mask</span>
              <span class="tip">Whether to display a dark mask around the wallpaper</span>
            </div>
            <n-switch v-model:value="showBackgroundGray" :round="false" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">Blurred wallpaper</span>
              <span class="tip">Adjust the degree of Gaussian blur of the wallpaper</span>
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
          <n-h6 prefix="bar"> Weather and time </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">Weather display</span>
              <span class="tip">Whether to display the weather under the time on the home page</span>
            </div>
            <n-switch v-model:value="showWeather" :round="false" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">Clock Style</span>
              <span class="tip">Select a clock style</span>
            </div>
            <n-select class="set" v-model:value="timeStyle" :options="timeStyleOptions" />
          </n-card>
          <n-card v-if="timeStyle === 'one'" class="set-item">
            <div class="name">
              <span class="title">Time display seconds</span>
              <span class="tip">Whether to display seconds after minutes</span>
            </div>
            <n-switch v-model:value="showSeconds" :round="false" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">Clock shows zero</span>
              <span class="tip">Whether to add 0 when the clock is less than 10</span>
            </div>
            <n-switch v-model:value="showZeroTime" :round="false" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">Display lunar calendar</span>
            </div>
            <n-switch v-model:value="showLunar" :round="false" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">12-hour format</span>
            </div>
            <n-switch v-model:value="use12HourFormat" :round="false" />
          </n-card>
          <n-h6 prefix="bar"> Search Box </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">Automatic shrink</span>
              <span class="tip">Whether to collapse the search box when not in search state</span>
            </div>
            <n-switch v-model:value="smallInput" :round="false" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">Auto Focus</span>
              <span class="tip">Automatically focus the search box when opening a website</span>
            </div>
            <n-switch v-model:value="autoFocus" :round="false" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">Automatic Defocus</span>
              <span class="tip">The search box automatically loses focus after jumping to search</span>
            </div>
            <n-switch v-model:value="autoInputBlur" :round="false" />
          </n-card>
        </n-scrollbar>
      </n-tab-pane>
      <n-tab-pane name="other" tab="Other">
        <n-scrollbar class="scrollbar">
          <n-h6 prefix="bar"> Reset </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">Site Reset</span>
              <span class="tip">If the site displays abnormally or there is a problem, you can try this operation</span>
            </div>
            <n-button strong secondary @click="resetSite"> Reset </n-button>
          </n-card>
          <n-h6 prefix="bar"> Backup </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">Site Backup</span>
              <span class="tip">Back up site configuration and personalized content</span>
            </div>
            <n-button strong secondary @click="backupSite"> Backup </n-button>
          </n-card>
          <n-h6 prefix="bar"> Recover </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">DATA Recover</span>
              <span class="tip">Restore the backed-up site content</span>
            </div>
            <input
              ref="recoverRef"
              type="file"
              style="display: none"
              accept=".json"
              @change="recoverSite"
            />
            <n-button strong secondary @click="recoverRef?.click()"> Recover </n-button>
          </n-card>
        </n-scrollbar>
      </n-tab-pane>
    </n-tabs>
    <!-- Customize wallpaper -->
    <n-modal preset="card" title="Customize wallpaper" v-model:show="customCoverModal" :bordered="false">
      <n-form>
        <n-form-item label="Custom wallpaper link">
          <n-input
            clearable
            type="text"
            v-model:value="customCoverUrl"
            placeholder="Please enter a custom wallpaper link"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button strong secondary @click="customCoverModal = false"> Cancel </n-button>
          <n-button strong secondary @click="setCustomCover"> Confirm </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
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
} from "naive-ui";
import { storeToRefs } from "pinia";
import { setStore, statusStore } from "@/stores";
import identifyInput from "@/utils/identifyInput";

const set = setStore();
const status = statusStore();
const {
  themeType,
  backgroundType,
  backgroundCustom,
  showBackgroundGray,
  backgroundBlur,
  smallInput,
  autoFocus,
  autoInputBlur,
  showLunar,
  showWeather,
  showSeconds,
  showZeroTime,
  use12HourFormat,
  showSuggestions,
  urlJumpType,
  timeStyle,
} = storeToRefs(set);
const recoverRef = ref(null);
const customCoverModal = ref(false);
const customCoverUrl = ref("");

const backgroundTypeArr = [
  { name: "Local default", tip: "Default wallpaper, randomly changed" },
  { name: "Daily Bing", tip: "Bing daily picture, updated every day" },
  { name: "Random scenery", tip: "Random scenery picture, randomly changed" },
  { name: "Random anime", tip: "Random two-dimensional picture, randomly changed" },
];

const themeTypeOptions = [
  {
    label: "Light",
    value: "light",
  },
  {
    label: "Dark",
    value: "dark",
  },
];

const changeBackground = (type, reset = false) => {
  if (reset) {
    $dialog.warning({
      title: "Wallpaper Restoration",
      content: "Are you sure you want to restore the default wallpaper? If the current wallpaper is a custom wallpaper, your custom wallpaper will be lost!",
      positiveText: "Recover",
      negativeText: "Cancel",
      onPositiveClick: () => {
        backgroundType.value = 0;
        $message.info("The wallpaper has been restored to the default one, and will take effect after refreshing");
      },
    });
    return true;
  }
  backgroundType.value = type;
  $message.success(`Switched to${backgroundTypeArr[type].name}, take effect after refresh`);
};

const urlJumpTypeOptions = [
  {
    label: "Open in new page",
    value: "open",
  },
  {
    label: "Open in current page",
    value: "href",
  },
];

const timeStyleOptions = [
  {
    label: "Horizontal layout",
    value: "one",
  },
  {
    label: "Vertical arrangement",
    value: "two",
  },
];

const setCustomCover = () => {
  if (identifyInput(customCoverUrl.value) === "url") {
    backgroundType.value = 4;
    backgroundCustom.value = customCoverUrl.value;
    customCoverModal.value = false;
    $message.error("Switched to custom wallpaper, takes effect after refresh");
  } else {
    $message.error("Please enter a valid URL");
  }
};

const resetSite = () => {
  $dialog.warning({
    title: "Site Reset",
    content: "Are you sure you want to reset the site to default? All your data and custom settings will be lost!",
    positiveText: "Reset",
    negativeText: "Cancel",
    onPositiveClick: () => {
      localStorage.clear();
      $message.info("The site has been reset successfully and will be refreshed soon");
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
    const fileName = `Snavigation_Backup_${dateString}.json`;
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
    $message.success("Site backup successful");
  } catch (error) {
    console.error("Site backup failed:", error);
    $message.error("Site backup failed");
  }
};

const recoverSite = async () => {
  try {
    const fileInput = recoverRef.value;
    if (!fileInput?.files.length) {
      $message.error("Please select the backup file to restore");
      return false;
    }
    const file = fileInput.files[0];
    const jsonData = await file.text();
    const data = JSON.parse(jsonData);
    $dialog.warning({
      title: "Site Restore",
      content: "Are you sure you want to use this restore file? Your existing data and custom settings will be overwritten!",
      positiveText: "Restore",
      negativeText: "Cancel",
      onPositiveClick: async () => {
        const isSuccess = await set.recoverSiteData(data);
        if (isSuccess) {
          $message.info("Site restored successfully, will be refreshed soon");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          $message.error("Site data recovery failed, please try again");
        }
      },
      onNegativeClick: () => {
        recoverRef.value.value = null;
      },
    });
  } catch (error) {
    console.error("Site data recovery failed:", error);
    $message.error("Site data recovery failed, please try again");
  }
};

onMounted(() => {
  if (backgroundCustom.value) customCoverUrl.value = backgroundCustom.value;
});
</script>

<style lang="scss">
.cover-selete {
  margin-top: 12px;
  .item {
    cursor: pointer;
    position: relative;
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--md-sys-shape-corner-medium);
    background-color: var(--md-sys-color-surface-container-low);
    transition:
      background-color 0.3s cubic-bezier(0.2, 0, 0, 1),
      box-shadow 0.3s cubic-bezier(0.2, 0, 0, 1),
      transform 0.1s;
    &.check {
      background-color: var(--md-sys-color-surface-container);
      color: var(--md-sys-color-primary);
      font-weight: 500;
      &::before {
        content: "";
        position: absolute;
        border-radius: 14px; // Medium + 2
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border: 2px solid var(--md-sys-color-primary);
        transition: opacity 0.3s;
      }
    }
    &:hover {
      background-color: var(--md-sys-color-surface-container);
      &::before {
        opacity: 0;
      }
    }
    &:active {
      transform: scale(0.98);
    }
  }
}
</style>
