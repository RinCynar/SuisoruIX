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
  margin-bottom: 20px;
  transform: translateY(-140px);
  color: var(--main-text-color);
  animation: fade-time-in 0.6s cubic-bezier(0.2, 0, 0, 1);
  transition:
    transform 0.4s cubic-bezier(0.2, 0, 0, 1),
    opacity 0.4s cubic-bezier(0.2, 0, 0, 1),
    margin-bottom 0.4s cubic-bezier(0.2, 0, 0, 1);
  z-index: 1;
  .time {
    cursor: pointer;
    font-size: 5rem;
    font-weight: 400;
    margin: 6px 0px;
    text-shadow: var(--main-text-shadow);
    transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1);
    .separator {
      opacity: 0.8;
      font-size: 4.5rem;
      display: inline-block;
      margin: 0 5px;
      transform: translateY(-8px);
      animation: separator-breathe 0.7s infinite alternate;
    }
    .amPm {
      font-size: 1.25rem;
      opacity: 0.6;
      margin-left: 12px;
    }
    .hour,
    .minute,
    .second-num {
      font-variant-numeric: tabular-nums;
    }
    &:hover {
      transform: scale(1.05);
    }
    &:active {
      transform: scale(1);
    }
  }
  .date {
    font-size: 1.15rem;
    opacity: 0.85;
    margin: 4px 0px;
    text-shadow: var(--main-text-shadow);
    .month {
      &::after {
        margin: 0 4px;
        content: "/";
      }
    }
    .day {
      &::after {
        margin: 0 8px 0 4px;
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
    @media (max-width: 478px) {
      transform: translateY(-32vh);
    }
  }
  &.hidden {
    transform: translateY(-180px);
    opacity: 0;
  }
  &.two {
    padding-bottom: 60px;
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
          font-size: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 0;
          opacity: 0.4;
          transform: rotate(50deg);
          margin: 12px 0;
        }
      }
    }
  }
}
</style>
