<template>
  <!-- Weather Clock -->
  <div
    :class="[
      'weather-time',
      status.siteStatus,
      status.mainBoxBig && status.siteStatus !== 'normal' && status.siteStatus !== 'focus'
        ? 'hidden'
        : null,
      set.showLunar ? 'lunar' : null,
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
    <div v-if="set.showLunar" class="lunar">
      <span class="year">{{ timeData.lunar?.GanZhiYear }}</span>
      <span class="text">{{ timeData.lunar?.text }}</span>
    </div>
    <div class="date">
      <span class="month">{{ timeData.month ?? "0" }}</span>
      <span class="day">{{ timeData.day ?? "0" }}</span>
      <span class="weekday">{{ timeData.weekday ?? "???" }}</span>
    </div>
    <div v-if="set.showWeather" class="weather">
      <span class="status">{{ weatherData?.condition ?? "N/A" }}</span>
      <span class="temperature">{{ weatherData?.temp ?? "N/A" }} ℃</span>
      <span class="wind">{{ weatherData?.windDir ?? "N/A" }}</span>
      <span v-if="weatherData?.windLevel" class="wind-level"> {{ weatherData.windLevel }} Level </span>
    </div>
  </div>
</template>

<script setup>
import { getCurrentTime } from "@/utils/timeTools";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { statusStore, setStore } from "@/stores";
import { getAdcode, getWeather } from "@/api";

const set = setStore();
const status = statusStore();

const timeData = ref({});
const timeInterval = ref(null);

const weatherData = ref(null);
const weatherKey = import.meta.env.VITE_WEATHER_KEY;

const updateTimeData = () => {
  timeData.value = getCurrentTime(set.showZeroTime, set.use12HourFormat);
};

const getWeatherData = async () => {
  if (!weatherKey) {
    return $message.warning("(⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧");
  }
  const currentTime = Date.now();
  let lastWeatherData = JSON.parse(localStorage.getItem("lastWeatherData")) || {
    data: {},
    lastFetchTime: 0,
  };
  const timeDifference = currentTime - lastWeatherData.lastFetchTime;
  if (timeDifference >= 5 * 60 * 1000) {
    const adCodeResult = await getAdcode(weatherKey);
    if (adCodeResult.infocode !== "10000") {
      return $message.error("Region query failed");
    }
    const weatherResult = await getWeather(weatherKey, adCodeResult.adcode);
    if (weatherResult.infocode !== "10000") {
      return $message.error("Region query failed");
    }
    const data = weatherResult.lives[0];
    weatherData.value = {
      condition: data.weather,
      temp: data.temperature,
      windDir: data.winddirection + "wind",
      windLevel: data.windpower,
    };
    lastWeatherData = { data: weatherData.value, lastFetchTime: currentTime };

    localStorage.setItem("lastWeatherData", JSON.stringify(lastWeatherData));
  } else {
    console.log("Read weather data from the cache:", lastWeatherData);
    weatherData.value = lastWeatherData.data;
  }
};

watch(
  () => [set.showZeroTime, set.use12HourFormat],
  () => {
    updateTimeData();
  },
);

onMounted(() => {
  // Time
  updateTimeData();
  timeInterval.value = setInterval(updateTimeData, 1000);
  // Weather
  getWeatherData();
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
  margin-bottom: 24px;
  transform: translateY(-140px);
  color: var(--md-sys-color-on-surface);
  animation: fade-time-in 0.6s cubic-bezier(0.21, 0.78, 0.36, 1);
  transition:
    transform var(--md-sys-motion-duration-medium) ease,
    opacity var(--md-sys-motion-duration-long) ease,
    margin-bottom var(--md-sys-motion-duration-short2) ease;
  z-index: 1;
  .time {
    cursor: pointer;
    font-size: var(--md-sys-typescale-display-large-size);
    font-weight: 400;
    margin: 12px 0;
    text-shadow: 0 6px 18px rgba(0,0,0,0.45);
    transition: transform var(--md-sys-motion-duration-short2) ease;
    letter-spacing: -1px;
    .separator {
      opacity: 0.8;
      font-size: calc(var(--md-sys-typescale-display-large-size) - 4px);
      display: inline-block;
      margin: 0 8px;
      transform: translateY(-4px);
      animation: separator-breathe 0.7s infinite alternate;
    }
    .amPm {
      font-size: var(--md-sys-typescale-body-size);
      opacity: 0.7;
      margin-left: 8px;
      font-weight: 500;
    }
    &:hover {
      transform: scale(1.06);
    }
    &:active {
      transform: scale(0.98);
    }
  }
  .date {
    font-size: var(--md-sys-typescale-title-size);
    opacity: 0.8;
    margin: 8px 0;
    text-shadow: 0 6px 18px rgba(0,0,0,0.36);
    font-weight: 500;
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
  .lunar {
    font-size: var(--md-sys-typescale-label-large-size);
    opacity: 0.65;
    text-shadow: 0 6px 18px rgba(0,0,0,0.36);
    font-weight: 500;
    .year {
      &::after {
        margin-right: 4px;
        content: "年";
      }
    }
  }
  .weather {
    opacity: 0.75;
    font-size: var(--md-sys-typescale-body-size);
    text-shadow: 0 6px 18px rgba(0,0,0,0.36);
    font-weight: 400;
    .temperature {
      margin: 0 8px;
    }
    .wind-level {
      margin-left: 8px;
    }
  }

  &.focus {
    transform: translateY(-180px);
    // transform: translateY(-24vh);
  }
  &.box,
  &.set {
    // transform: translateY(-220px);
    transform: translateY(-34vh);
    @media (max-width: 478px) {
      transform: translateY(-32vh);
    }
  }
  &.hidden {
    transform: translateY(-180px);
    // transform: translateY(-24vh);
    opacity: 0;
  }
  &.lunar {
    margin-bottom: 50px;
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
