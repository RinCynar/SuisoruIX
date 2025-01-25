import { defineStore } from "pinia";

const useStatusDataStore = defineStore("statusData", {
  state: () => {
    return {
      imgLoadStatus: false,
      // Site status
      // normal / focus / box / set
      siteStatus: "normal",
      engineChangeStatus: false,
      searchInputValue: "",
      mainBoxBig: false,
    };
  },
  getters: {},
  actions: {
    setImgLoadStatus(value) {
      this.imgLoadStatus = value;
    },
    setSiteStatus(value, alsoChange = true) {
      this.siteStatus = value;
      if (value !== "focus") this.searchInputValue = "";
      if (alsoChange) this.engineChangeStatus = false;
    },
    setEngineChangeStatus(value) {
      this.engineChangeStatus = value;
    },
    setSearchInputValue(value) {
      this.searchInputValue = value;
    },
    setMainBoxBig(value) {
      this.mainBoxBig = value;
    },
  },

  persist: {
    key: "statusData",
    storage: window.localStorage,
    paths: ["mainBoxBig"],
  },
});

export default useStatusDataStore;
