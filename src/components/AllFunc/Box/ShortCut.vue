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
            :x-gap="10"
            :y-gap="10"
          >
            <n-grid-item
              v-for="item in shortcutData"
              :key="item"
              class="shortcut-item"
              @contextmenu="shortCutContextmenu($event, item)"
              @click="shortCutJump(item.url)"
            >
              <span class="name">{{ item.name }}</span>
            </n-grid-item>
            <n-grid-item
              class="shortcut-item"
              @contextmenu="
                (e) => {
                  e.preventDefault();
                }
              "
              @click="addShortcutModalOpen"
            >
              <SvgIcon iconName="icon-add" />
              <span class="name">Add shortcut</span>
            </n-grid-item>
          </n-grid>
        </n-scrollbar>
      </div>
      <div v-else class="not-shortcut">
        <span class="tip">There is no shortcut yet, go add it</span>
        <n-button strong secondary @click="addShortcutModalOpen">
          <template #icon>
            <SvgIcon iconName="icon-add" />
          </template>
          Add shortcut
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
    :title="`${addShortcutModalType ? 'Edit' : 'Add'}Shortcuts`"
    :bordered="false"
    @mask-click="addShortcutClose"
  >
    <n-form
      ref="addShortcutRef"
      :rules="addShortcutRules"
      :model="addShortcutValue"
      :label-width="80"
    >
      <n-form-item label="ID" path="id">
        <n-input-number
          disabled
          placeholder="Please imput ID"
          v-model:value="addShortcutValue.id"
          style="width: 100%"
          :show-button="false"
        />
      </n-form-item>
      <n-form-item label="Shortcut Name" path="name">
        <n-input
          clearable
          show-count
          maxlength="14"
          v-model:value="addShortcutValue.name"
          placeholder="Please imput shortcut name"
        />
      </n-form-item>
      <n-form-item label="Site Links" path="url">
        <n-input clearable v-model:value="addShortcutValue.url" placeholder="Please imput site links" />
      </n-form-item>
    </n-form>
    <template #footer>
      <n-space justify="end">
        <n-button strong secondary @click="addShortcutClose"> Cancel </n-button>
        <n-button strong secondary @click="addOrEditShortcuts">
          {{ addShortcutModalType ? "Edit" : "Add" }}
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
import SvgIcon from "@/components/SvgIcon.vue";
import identifyInput from "@/utils/identifyInput";
import { onMounted, onBeforeUnmount } from "vue";

const set = setStore();
const site = siteStore();
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
    message: "Please enter a valid ID",
    trigger: ["input", "blur"],
  },
  name: {
    required: true,
    message: "Please enter a name",
    trigger: ["input", "blur"],
  },
  url: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error("Please enter a site link");
      } else if (identifyInput(value) !== "url") {
        return new Error("Please check if it is the correct URL");
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
    label: "Edit",
    key: "edit",
    icon: renderIcon("edit"),
  },
  {
    label: "Delete",
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
      $message.error("Please check your input");
      return false;
    }
    if (!addShortcutModalType.value) {
      const isDuplicate = shortcutData.value?.some(
        (item) =>
          item.name === addShortcutValue.value.name || item.url === addShortcutValue.value.url,
      );
      if (isDuplicate) {
        $message.error("The newly added name or link is a duplicate of an existing shortcut");
        return false;
      }
      shortcutData.value.push({
        id: addShortcutValue.value.id,
        name: addShortcutValue.value.name,
        url: addShortcutValue.value.url,
      });
      $message.success("Shortcut added successfully");
      addShortcutClose();
      return true;
    } else {
      const index = shortcutData.value.findIndex((item) => item.id === addShortcutValue.value.id);
      if (index === -1) {
        $message.error("The item does not exist in the shortcut, please try again");
        return false;
      }
      shortcutData.value[index].name = addShortcutValue.value.name;
      shortcutData.value[index].url = addShortcutValue.value.url;
      $message.success("Shortcut edited successfully");
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
      $message.success("Shortcut deleted successfully");
      return true;
    }
    $message.error("Shortcut deletion failed, please try again");
  } else {
    $message.error("Shortcut deletion failed, please try again");
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
        title: "Delete shortcut",
        content: `Confirm Delete ${addShortcutValue.value.name} Shortcut? This action cannot be undone!`,
        positiveText: "Delete",
        negativeText: "Cancel",
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
      padding: 20px;
      box-sizing: border-box;
      .shortcut-item {
        cursor: pointer;
        height: 60px;
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--main-background-light-color);
        border-radius: 8px;
        font-size: 16px;
        transition:
          background-color 0.3s,
          box-shadow 0.3s;
        .i-icon {
          width: 1rem;
          margin-right: 6px;
          font-size: 20px;
          opacity: 1;
        }
        .name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &:hover {
          background-color: var(--main-background-hover-color);
          box-shadow: 0 0 0px 2px var(--main-background-hover-color);
        }
        &:active {
          box-shadow: none;
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
      font-size: 24px;
      margin-bottom: 20px;
    }
  }
  .footer__btn-group {
    display: flex;
    padding: 15px 0;
    padding-left: 20px;
    .footer__btn {
      border-radius: 8px;
      width: 80px;
      height: 40px;
      background-color: var(--main-background-light-color);
      line-height: 40px;
      text-align: center;
      cursor: pointer;
      font-size: 16px;
    }
    #shortCutUploadInput {
      display: none;
    }
    div + div {
      margin-left: 10px;
    }
  }
}
</style>
