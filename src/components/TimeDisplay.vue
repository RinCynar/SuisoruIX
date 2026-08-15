<template>
  <!-- Time Display -->
  <div
    :class="[
      'weather-time',
      status.siteStatus,
      status.mainBoxBig && status.siteStatus !== 'normal' && status.siteStatus !== 'focus'
        ? 'hidden'
        : null,
      set.timeStyle,
    ]"
    @click.stop
  >
    <div
      class="time"
      @click.stop="
        status.setSiteStatus(
          status.siteStatus !== 'normal' && status.siteStatus !== 'focus' ? 'normal' : 'box',
        )
      "
    >
      <span class="hour">{{ timeData.hour ?? "00" }}</span>
      <span class="separator" :key="set.showSeconds">:</span>
      <span class="minute">{{ timeData.minute ?? "00" }}</span>
      <Transition name="fade" mode="out-in">
        <span v-if="set.showSeconds" class="second">
          <span class="separator">:</span>
          <span class="second-num">{{ timeData.second ?? "00" }}</span>
        </span>
      </Transition>
      <template v-if="set.use12HourFormat">
        <span class="amPm">{{ timeData.amPm ?? "am" }}</span>
      </template>
    </div>
    <div class="date">
      <span class="month">{{ timeData.month ?? "0" }}</span>
      <span class="day">{{ timeData.day ?? "0" }}</span>
      <span class="weekday">{{ weekdays[timeData.weekday] ?? "???" }}</span>
    </div>
  </div>
</template>

<script setup>
import { getCurrentTime } from "@/utils/timeTools";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { statusStore, setStore } from "@/stores";
import { useI18n } from "@/i18n";

const set = setStore();
const status = statusStore();
const { weekdays } = useI18n();

const timeData = ref({});
const timeInterval = ref(null);

const updateTimeData = () => {
  timeData.value = getCurrentTime(set.showZeroTime, set.use12HourFormat);
};

watch(
  () => [set.showZeroTime, set.use12HourFormat],
  () => {
    updateTimeData();
  },
);

onMounted(() => {
  updateTimeData();
  timeInterval.value = setInterval(updateTimeData, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timeInterval.value);
});
</script>

<style lang="scss" scoped>
.weather-time {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--md-sys-spacing-4);
  transform: translateY(-140px);
  color: var(--md-sys-color-on-surface);
  animation: fade-time-in 0.6s var(--md-sys-motion-easing-emphasized-decelerate);
  transition:
    transform var(--md-sys-motion-duration-medium4) var(--md-sys-motion-easing-standard),
    opacity var(--md-sys-motion-duration-medium4) var(--md-sys-motion-easing-standard),
    margin-bottom var(--md-sys-motion-duration-medium4) var(--md-sys-motion-easing-standard);
  z-index: 1;
  .time {
    cursor: pointer;
    font-family: var(--md-sys-typescale-font);
    font-size: var(--md-sys-typescale-display-large-size);
    line-height: var(--md-sys-typescale-display-large-line);
    font-weight: 400;
    margin: var(--md-sys-spacing-2) 0;
    text-shadow: var(--main-text-shadow);
    color: var(--md-sys-color-on-surface);
    transition: transform var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
    .separator {
      opacity: 0.8;
      display: inline-block;
      margin: 0 var(--md-sys-spacing-1);
      transform: translateY(-8px);
      animation: separator-breathe 0.7s infinite alternate;
    }
    .amPm {
      font-size: var(--md-sys-typescale-label-large-size);
      line-height: var(--md-sys-typescale-label-large-line);
      color: var(--md-sys-color-on-surface-variant);
      margin-left: var(--md-sys-spacing-3);
    }
    .hour,
    .minute,
    .second-num {
      font-variant-numeric: tabular-nums;
    }
    &:hover {
      transform: scale(1.02);
    }
    &:active {
      transform: scale(1);
    }
  }
  .date {
    font-size: var(--md-sys-typescale-title-medium-size);
    line-height: var(--md-sys-typescale-title-medium-line);
    color: var(--md-sys-color-on-surface-variant);
    margin: var(--md-sys-spacing-1) 0;
    text-shadow: var(--main-text-shadow);
    .month {
      &::after {
        margin: 0 var(--md-sys-spacing-1);
        content: "/";
      }
    }
    .day {
      &::after {
        margin: 0 var(--md-sys-spacing-2) 0 var(--md-sys-spacing-1);
        content: "";
      }
    }
  }

  &.focus {
    transform: translateY(-180px);
  }
  &.box,
  &.set {
    transform: translateY(-34vh);
    @media (max-width: 599.98px) {
      transform: translateY(-28vh);
    }
  }
  &.hidden {
    transform: translateY(-180px);
    opacity: 0;
  }
  &.two {
    padding-bottom: var(--md-sys-spacing-7);
    .time {
      display: flex;
      flex-direction: column;
      align-items: center;
      span {
        line-height: normal;
      }
      .separator,
      .second {
        display: none;
      }
      .hour {
        &::after {
          content: "/";
          font-size: var(--md-sys-typescale-headline-medium-size);
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 0;
          opacity: 0.4;
          transform: rotate(50deg);
          margin: var(--md-sys-spacing-3) 0;
        }
      }
    }
  }
}
</style>
