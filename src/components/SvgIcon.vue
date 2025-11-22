<template>
  <component :is="renderTag" :class="computedClass" aria-hidden="true">
    <template v-if="renderAsMaterial">
      {{ materialName }}
    </template>
    <template v-else>
      <svg :class="svgClass"><use :xlink:href="iconHref" /></svg>
    </template>
  </component>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  iconName: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    default: "i-icon",
  },
});

// Mapping of common existing icon ids to Material Icons names
const materialMap = {
  "icon-search": "search",
  "icon-home": "home",
  "icon-setting": "settings",
  "icon-close": "close",
  "icon-add": "add",
  "icon-edit": "edit",
  "icon-delete": "delete",
  "icon-email": "email",
  "icon-link": "link",
  "icon-packup": "expand_less",
  "icon-unfold": "expand_more",
  "icon-confirm": "check_circle",
  "icon-info": "info",
};

const renderAsMaterial = computed(() => {
  // if iconName starts with 'mi-' -> treat as direct material icon name
  if (props.iconName && props.iconName.startsWith("mi-")) return true;
  // if iconName is in map, use material icon
  return Boolean(materialMap[props.iconName]);
});

const materialName = computed(() => {
  if (props.iconName.startsWith("mi-")) return props.iconName.slice(3);
  return materialMap[props.iconName] || "";
});

const renderTag = computed(() => (renderAsMaterial.value ? "i" : "span"));

const computedClass = computed(() => {
  if (renderAsMaterial.value) {
    // Use material-icons class and pass through user className
    return ["material-icons", props.className].filter(Boolean).join(" ");
  }
  return ["svg-icon-wrapper", props.className].filter(Boolean).join(" ");
});

const iconHref = computed(() => `#${props.iconName}`);

const svgClass = computed(() => "i-icon");
</script>

<style lang="scss">
.i-icon {
  width: 1em;
  height: 1em;
  min-width: 1em;
  position: relative;
  fill: currentColor;
  vertical-align: -0.15em;
}
.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 1em; /* inherit */
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}
.svg-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>