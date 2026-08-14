import { computed } from "vue";
import { setStore } from "@/stores";
import en from "./en";
import ja from "./ja";

const messages = { en, ja };

/**
 * Lightweight i18n composable.
 * Reactively resolves translations based on the persisted `language` setting
 * (supported: "en" / "ja").
 *
 * @returns {{ t: Function, weekdays: import("vue").ComputedRef<string[]>, language: import("vue").ComputedRef<string> }}
 */
export function useI18n() {
  const set = setStore();

  const dict = computed(() => messages[set.language] || messages.en);

  const t = (key, params = {}) => {
    let str = dict.value[key] ?? key;
    for (const [k, v] of Object.entries(params)) {
      str = str.split(`{${k}}`).join(v);
    }
    return str;
  };

  const weekdays = computed(() => {
    return [0, 1, 2, 3, 4, 5, 6].map((i) => dict.value[`weekday.${i}`] ?? "");
  });

  return { t, weekdays, language: computed(() => set.language) };
}
