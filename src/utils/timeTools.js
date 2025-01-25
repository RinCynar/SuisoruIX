import LunarCalendar from "lunar-calendar";

/**
* Get the current time
* @returns {Object} time object
*/
export const getCurrentTime = (ShowZero = true, Use12Hour = false) => {
  try {
    const time = new Date();

    const formatTime = (value) => (value < 10 ? "0" + value : value);
    const format12Hour = (hour) => (hour % 12 === 0 ? 12 : hour % 12);
    const getAmPm = (hour) => (hour >= 12 ? "PM" : "AM");

    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const day = formatTime(time.getDate());

    let hour = ShowZero ? formatTime(time.getHours()) : time.getHours();
    let amPm = "";
    if (Use12Hour) {
      hour = format12Hour(hour);
      amPm = getAmPm(time.getHours());
    }
    const minute = formatTime(time.getMinutes());
    const second = formatTime(time.getSeconds());
    const weekdayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weekday = weekdayArr[time.getDay()];

    const lunar = LunarCalendar.solarToLunar(
      time.getFullYear(),
      time.getMonth() + 1,
      time.getDate(),
    );

    const currentTime = {
      year,
      month,
      day,
      hour,
      minute,
      second,
      weekday,
      amPm,
      lunar: {
        data: lunar,
        year: lunar.lunarYear,
        month: lunar.lunarMonthName,
        day: lunar.lunarDayName,
        GanZhiYear: lunar.GanZhiYear,
        GanZhiMonth: lunar.GanZhiMonth,
        GanZhiDay: lunar.GanZhiDay,
        text: lunar.lunarMonthName + lunar.lunarDayName,
      },
    };
    return currentTime;
  } catch (error) {
    console.error("Error in getting time:" + error);
    return {};
  }
};

/**
* Return different greetings based on real time
* @returns {string} greeting
*/
export const getGreeting = () => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  let greeting = "";
  if (currentHour >= 6 && currentHour < 9) {
    greeting = "Good morning";
  } else if (currentHour >= 9 && currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon";
  } else if (currentHour >= 18 && currentHour < 20) {
    greeting = "Good evening";
  } else if (currentHour >= 20 && currentHour < 24) {
    greeting = "Good night";
  } else if (currentHour >= 4 && currentHour < 6) {
    greeting = "Good early-morning";
  } else {
    greeting = "It's late at night";
  }
  return greeting;
};
