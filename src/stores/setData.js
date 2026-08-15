import { defineStore } from "pinia";
import { DEFAULT_SEED_COLOR } from "@/utils/theme";

const useSetDataStore = defineStore("setData", {
  state: () => {
    return {
      // Language
      // en / ja
      language: "en",
      // Theme category: light / dark / system
      themeType: "dark",
      // Theme / background mode
      // "default" - built-in wallpaper + fixed palette
      // "m3"      - Material 3 dynamic palette from seed color + solid background
      // "custom"  - custom background image (URL or local data URL)
      backgroundType: "default",
      backgroundCustom: "",
      // Material 3 seed color
      seedColor: DEFAULT_SEED_COLOR,
      // Background mask
      showBackgroundGray: true,
      // Background blur
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
      // Whether to display seconds
      showSeconds: false,
      // Whether to display zero
      showZeroTime: true,
      // 12 Hour format
      use12HourFormat: false,
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

    /**
     * Normalize persisted settings written by older versions of the app
     * (numeric backgroundType values, removed features) to the current schema.
     */
    migrate() {
      // Legacy numeric backgroundType: 0 local / 1 Bing / 2 scenery / 3 anime / 4 custom
      if (typeof this.backgroundType === "number") {
        const legacyMap = { 0: "default", 1: "default", 2: "default", 3: "default", 4: "custom" };
        this.backgroundType = legacyMap[this.backgroundType] ?? "default";
      }
      if (!["default", "m3", "custom"].includes(this.backgroundType)) {
        this.backgroundType = "default";
      }
      if (!["en", "ja"].includes(this.language)) {
        this.language = "en";
      }
      if (!["light", "dark", "system"].includes(this.themeType)) {
        this.themeType = "dark";
      }
      if (!this.seedColor || !/^#([0-9a-fA-F]{6})$/.test(this.seedColor)) {
        this.seedColor = DEFAULT_SEED_COLOR;
      }
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

