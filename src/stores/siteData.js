import { defineStore } from "pinia";
import defaultShortCut from "@/assets/defaultShortCut";

const useSiteDataStore = defineStore("siteData", {
  state: () => {
    return {

      shortcutData: defaultShortCut,
    };
  },
  actions: {
    setShortcutData(value) {
      this.shortcutData = value;
    },
  },

  persist: {
    key: "siteData",
    storage: window.localStorage,
  },
});

export default useSiteDataStore;
