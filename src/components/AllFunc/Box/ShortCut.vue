<template>
  <!-- shortcut -->
  <div class="shortcut__layout">
    <Transition name="fade" mode="out-in">
      <div v-if="shortcutData[0]" class="shortcut">
        <n-scrollbar class="scrollbar">
          <n-grid
            class="all-shortcut"
            responsive="screen"
            cols="2 s:3 m:4 l:5"
            :x-gap="12"
            :y-gap="12"
          >
            <n-grid-item
              v-for="item in shortcutData"
              :key="item"
              class="shortcut-item"
              @contextmenu="shortCutContextmenu($event, item)"
              @click="shortCutJump(item.url)"
            >
              <span class="icon-container" aria-hidden="true">{{ item.name?.charAt(0) }}</span>
              <span class="name">{{ item.name }}</span>
            </n-grid-item>
            <n-grid-item
              class="shortcut-item add"
              @contextmenu="
                (e) => {
                  e.preventDefault();
                }
              "
              @click="addShortcutModalOpen"
            >
              <span class="icon-container add" aria-hidden="true">
                <SvgIcon iconName="icon-add" />
              </span>
              <span class="name">{{ t("shortcut.add") }}</span>
            </n-grid-item>
          </n-grid>
        </n-scrollbar>
      </div>
      <div v-else class="not-shortcut">
        <span class="tip">{{ t("shortcut.empty") }}</span>
        <n-button strong secondary @click="addShortcutModalOpen">
          <template #icon>
            <SvgIcon iconName="icon-add" />
          </template>
          {{ t("shortcut.add") }}
        </n-button>
      </div>
    </Transition>
    <div class="footer__btn-group">
      <div class="footer__btn" @click="downloadHtmlFile">
        <SvgIcon iconName="icon-xiazai" />
        <span class="btnName">DL</span>
      </div>
      <div class="footer__btn" @click="clickFileDom">
        <input type="file" name="Upload" id="shortCutUploadInput" />
        <SvgIcon iconName="icon-shangchuan" />
        <span class="btnName">UP</span>
      </div>
    </div>
  </div>
  <!-- Adding Shortcuts -->
  <n-modal
    preset="card"
    v-model:show="addShortcutModalShow"
    :title="t(addShortcutModalType ? 'shortcut.modalTitleEdit' : 'shortcut.modalTitleAdd')"
    :bordered="false"
    @mask-click="addShortcutClose"
  >
    <n-form
      ref="addShortcutRef"
      :rules="addShortcutRules"
      :model="addShortcutValue"
      :label-width="80"
    >
      <n-form-item :label="t('shortcut.id')" path="id">
        <n-input-number
          disabled
          :placeholder="t('shortcut.idPlaceholder')"
          v-model:value="addShortcutValue.id"
          style="width: 100%"
          :show-button="false"
        />
      </n-form-item>
      <n-form-item :label="t('shortcut.name')" path="name">
        <n-input
          clearable
          show-count
          maxlength="14"
          v-model:value="addShortcutValue.name"
          :placeholder="t('shortcut.namePlaceholder')"
        />
      </n-form-item>
      <n-form-item :label="t('shortcut.url')" path="url">
        <n-input clearable v-model:value="addShortcutValue.url" :placeholder="t('shortcut.urlPlaceholder')" />
      </n-form-item>
    </n-form>
    <template #footer>
      <n-space justify="end">
        <n-button strong secondary @click="addShortcutClose"> {{ t("shortcut.cancel") }} </n-button>
        <n-button strong secondary @click="addOrEditShortcuts">
          {{ t(addShortcutModalType ? "shortcut.edit" : "shortcut.add") }}
        </n-button>
      </n-space>
    </template>
  </n-modal>
  <!-- Shortcut menu -->
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    size="large"
    :x="shortCutDropdownX"
    :y="shortCutDropdownY"
    :options="shortCutDropdownOptions"
    :show="shortCutDropdownShow"
    :on-clickoutside="
      () => {
        shortCutDropdownShow = false;
      }
    "
    @select="shortCutDropdownSelect"
  />
</template>

<script setup>
import { ref, nextTick, h } from "vue";
import {
  NButton,
  NScrollbar,
  NGrid,
  NGridItem,
  NSpace,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NDropdown,
} from "naive-ui";
import { storeToRefs } from "pinia";
import { siteStore, setStore } from "@/stores";
import { useI18n } from "@/i18n";
import SvgIcon from "@/components/SvgIcon.vue";
import identifyInput from "@/utils/identifyInput";
import { onMounted, onBeforeUnmount } from "vue";

const set = setStore();
const site = siteStore();
const { t } = useI18n();
const { shortcutData } = storeToRefs(site);

const renderIcon = (icon) => {
  return () => {
    return h(SvgIcon, { iconName: `icon-${icon}` }, null);
  };
};

const addShortcutRef = ref(null);
const addShortcutModalShow = ref(false);
const addShortcutModalType = ref(false);
const addShortcutValue = ref({
  id: null,
  name: "",
  url: "",
});
const addShortcutRules = {
  id: {
    required: true,
    type: "number",
    message: t("shortcut.idPlaceholder"),
    trigger: ["input", "blur"],
  },
  name: {
    required: true,
    message: t("shortcut.namePlaceholder"),
    trigger: ["input", "blur"],
  },
  url: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error(t("shortcut.urlPlaceholder"));
      } else if (identifyInput(value) !== "url") {
        return new Error(t("shortcut.checkInput"));
      }
      return true;
    },
    trigger: ["input", "blur"],
  },
};

const shortCutDropdownX = ref(0);
const shortCutDropdownY = ref(0);
const shortCutDropdownShow = ref(false);
const shortCutDropdownOptions = [
  {
    label: t("shortcut.edit"),
    key: "edit",
    icon: renderIcon("edit"),
  },
  {
    label: t("shortcut.delete"),
    key: "delete",
    icon: renderIcon("delete-1"),
  },
];

const addShortcutClose = () => {
  addShortcutModalShow.value = false;
  addShortcutValue.value = {
    id: null,
    name: "",
    url: "",
  };
};

const addShortcutModalOpen = () => {
  const shortcutMaxID = shortcutData.value.reduce((max, item) => {
    return item.id > max ? item.id : max;
  }, -1);
  addShortcutValue.value = {
    id: shortcutMaxID + 1,
    name: "",
    url: "",
  };
  addShortcutModalType.value = false;
  addShortcutModalShow.value = true;
};

const addOrEditShortcuts = () => {
  addShortcutRef.value?.validate((errors) => {
    if (errors) {
      $message.error(t("shortcut.checkInput"));
      return false;
    }
    if (!addShortcutModalType.value) {
      const isDuplicate = shortcutData.value?.some(
        (item) =>
          item.name === addShortcutValue.value.name || item.url === addShortcutValue.value.url,
      );
      if (isDuplicate) {
        $message.error(t("shortcut.duplicate"));
        return false;
      }
      shortcutData.value.push({
        id: addShortcutValue.value.id,
        name: addShortcutValue.value.name,
        url: addShortcutValue.value.url,
      });
      $message.success(t("shortcut.editSuccess"));
      addShortcutClose();
      return true;
    } else {
      const index = shortcutData.value.findIndex((item) => item.id === addShortcutValue.value.id);
      if (index === -1) {
        $message.error(t("shortcut.deleteFail"));
        return false;
      }
      shortcutData.value[index].name = addShortcutValue.value.name;
      shortcutData.value[index].url = addShortcutValue.value.url;
      $message.success(t("shortcut.editSuccess"));
      addShortcutClose();
      return true;
    }
  });
};

const delShortcuts = () => {
  const deleteId = addShortcutValue.value.id;
  if (typeof deleteId === "number") {
    const indexToRemove = shortcutData.value.findIndex((item) => item.id === deleteId);
    if (indexToRemove !== -1) {
      shortcutData.value.splice(indexToRemove, 1);
      for (let i = indexToRemove; i < shortcutData.value.length; i++) {
        shortcutData.value[i].id = i;
      }
      $message.success(t("shortcut.deleteSuccess"));
      return true;
    }
    $message.error(t("shortcut.deleteFail"));
  } else {
    $message.error(t("shortcut.deleteFail"));
  }
};

const shortCutContextmenu = (e, data) => {
  e.preventDefault();
  shortCutDropdownShow.value = false;
  const { id, name, url } = data;
  addShortcutValue.value = { id, name, url };
  nextTick().then(() => {
    shortCutDropdownShow.value = true;
    shortCutDropdownX.value = e.clientX;
    shortCutDropdownY.value = e.clientY;
  });
};

const shortCutDropdownSelect = (key) => {
  shortCutDropdownShow.value = false;
  console.log(key);
  switch (key) {
    case "edit":
      addShortcutModalType.value = true;
      addShortcutModalShow.value = true;
      break;
    case "delete":
      $dialog.warning({
        title: t("shortcut.deleteDialogTitle"),
        content: t("shortcut.deleteDialogContent", { name: addShortcutValue.value.name }),
        positiveText: t("shortcut.delete"),
        negativeText: t("shortcut.cancel"),
        onPositiveClick: () => {
          delShortcuts();
        },
      });
      break;
    default:
      break;
  }
};

const shortCutJump = (url) => {
  const urlRegex = /^(https?:\/\/)/i;
  const urlFormat = urlRegex.test(url) ? url : `//${url}`;
  if (set.urlJumpType === "href") {
    window.location.href = urlFormat;
  } else if (set.urlJumpType === "open") {
    window.open(urlFormat, "_blank");
  }
};


// download start
function downloadHtmlFile() {
  let DTinnerStr = "";
  shortcutData.value.forEach((item) => {
    DTinnerStr += `<DT><A HREF="${item.url}" >${item.name}</A> \n`;
  });
  const htmlStr = `
    <!DOCTYPE NETSCAPE-Bookmark-file-1>
    <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
    <meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'none'; img-src data: *; object-src 'none'"></meta>
    <TITLE>Bookmarks</TITLE>
    <H1>SuisoruIXFile</H1>

    <DL><p>
        <DT><H3 ADD_DATE="1716991740" LAST_MODIFIED="1716991740">SuisoruIXFile</H3>
        <DL><p>
            ${DTinnerStr}
        </DL><p>
    </DL>
  `;

  const htmlStrBolo = new Blob([htmlStr], { type: "text/html" });
  const htmlStrUrl = URL.createObjectURL(htmlStrBolo);

  const aLink = document.createElement("a");
  aLink.href = htmlStrUrl;
  aLink.download = "SuisoruIXFile.html";
  aLink.click();
  URL.revokeObjectURL(htmlStrUrl);
}
// download end

// upload start
// Click the button to upload the file idea
// 1. Use the <input type="file"/> element to easily obtain the file.
// 2. Listen to the input change event and hide the input element
// 3. When clicking the upload button, trigger the input click event
// 4. By triggering the input change event, parse the obtained file information
onMounted(() => {
// By triggering the input change event, parse the obtained file information
  document.querySelector("#shortCutUploadInput")?.addEventListener("change", uploadHtmlFile);
});
onBeforeUnmount(() => {
  document.querySelector("#shortCutUploadInput")?.removeEventListener("change", uploadHtmlFile);
});

function uploadHtmlFile() {
  if (this.files) {
    const fileReader = new FileReader();
    fileReader.readAsText(this.files[0]);
    fileReader.onload = function () {
      if (typeof fileReader.result === "string") {
        parserBookmarksFile(fileReader.result);
      }
    };
  }
}

function parserBookmarksFile(result) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(result, "text/html");
  const aElements = doc.querySelectorAll("a");
  aElements.forEach((a) => {
    const isDuplicate = shortcutData.value?.some(
      (item) => item.name === a.textContent || item.url === a.href,
    );
    if (isDuplicate) {
      return;
    }
    shortcutData.value.push({
      id: shortcutData.length,
      name: a.textContent,
      url: a.href,
    });
  });
}
function clickFileDom() {
  const fileDom = document.querySelector("#shortCutUploadInput");
  if (fileDom) {
    fileDom.click();
  } else {
    console.warn("Element does not exist");
  }
}
// upload end


</script>

<style lang="scss" scoped>
.shortcut__layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .shortcut {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .all-shortcut {
      padding: var(--md-sys-spacing-4);
      box-sizing: border-box;
      @media (max-width: 599.98px) {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }
      @media (min-width: 600px) and (max-width: 904.98px) {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      }
      @media (min-width: 905px) {
        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
      }
      .shortcut-item {
        cursor: pointer;
        min-height: 56px;
        padding: var(--md-sys-spacing-2) var(--md-sys-spacing-4);
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: var(--md-sys-spacing-3);
        background-color: var(--md-sys-color-surface-container-high);
        border-radius: var(--md-sys-shape-corner-large);
        box-shadow: var(--md-sys-elevation-1);
        font-size: var(--md-sys-typescale-title-medium-size);
        line-height: var(--md-sys-typescale-title-medium-line);
        transition:
          background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard),
          box-shadow var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard),
          transform var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
        .icon-container {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--md-sys-shape-corner-medium);
          background-color: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
          font-size: var(--md-sys-typescale-title-medium-size);
          font-weight: 500;
          &.add {
            background-color: var(--md-sys-color-secondary-container);
            color: var(--md-sys-color-on-secondary-container);
          }
        }
        .name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &:hover {
          background-color: var(--md-sys-elevation-tint-3);
          box-shadow: var(--md-sys-elevation-3);
          transform: translateY(-2px);
        }
        &:active {
          transform: translateY(0);
          box-shadow: var(--md-sys-elevation-1);
        }
      }
    }
  }
  .not-shortcut {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .tip {
      font-size: var(--md-sys-typescale-headline-medium-size);
      line-height: var(--md-sys-typescale-headline-medium-line);
      margin-bottom: var(--md-sys-spacing-4);
      color: var(--md-sys-color-on-surface-variant);
    }
  }
  .footer__btn-group {
    display: flex;
    padding: var(--md-sys-spacing-3) 0;
    padding-left: var(--md-sys-spacing-4);
    .footer__btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--md-sys-spacing-1);
      border-radius: var(--md-sys-shape-corner-full);
      min-width: 48px;
      min-height: 48px;
      height: 48px;
      padding: 0 var(--md-sys-spacing-4);
      background-color: var(--md-sys-color-surface-container);
      color: var(--md-sys-color-on-surface);
      text-align: center;
      cursor: pointer;
      font-size: var(--md-sys-typescale-label-large-size);
      line-height: var(--md-sys-typescale-label-large-line);
    }
    #shortCutUploadInput {
      display: none;
    }
    div + div {
      margin-left: var(--md-sys-spacing-3);
    }
  }
}
</style>
