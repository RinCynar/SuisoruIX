import { defineStore } from "pinia";

const useSetDataStore = defineStore("setData", {
  state: () => {
    return {
      // Theme category
      themeType: "dark",
      // Wallpaper category
      // 0 local / 1 Bing / 2 random landscape / 3 random anime / 4 custom
      backgroundType: 0,
      backgroundCustom: "",
      // Wallpaper mask
      showBackgroundGray: true,
      // Wallpaper blur
      backgroundBlur: 0,
      // Search engine
      searchEngine: "bing",
      lastSearchEngine: "bing",
      customEngineUrl: "",
      // Search box collapse
      smallInput: false,
      // Clear search box
      showCleanInput: true,
      // Search box automatically focuses
      autoFocus: false,
      // Search box automatically loses focus after search
      autoInputBlur: true,
      // Time style
      timeStyle: "one",
      // Display lunar calendar
      showLunar: false,
      // Whether to display seconds
      showSeconds: false,
      // Whether to display zero
      showZeroTime: true,
      // 12 Hour format
      use12HourFormat: false,
      // Weather display
      showWeather: false,
      // Whether to display search suggestions
      showSuggestions: true,
      // Jump method
      // open new tab / href current page
      urlJumpType: "open",
    };
  },
  actions: {
    setSearchEngine(value, custom = false) {

      if (this.searchEngine !== "custom") {
        this.lastSearchEngine = this.searchEngine;
      }

      if (custom) {
        this.customEngineUrl = value;
        this.searchEngine = "custom";
        return;
      }
      this.searchEngine = value;
    },

    recoverSiteData(data) {
      let isSuccess = false;
      try {
        for (const key in data) {
          if (Object.hasOwnProperty.call(data, key)) {
            const item = data[key];
            this[key] = item;
          }
        }
        isSuccess = true;
      } catch (error) {
        console.error("Processing failure during site data recovery:", error);
        isSuccess = false;
      }
      return isSuccess;
    },
  },

  persist: {
    key: "setData",
    storage: window.localStorage,
  },
});

export default useSetDataStore;
