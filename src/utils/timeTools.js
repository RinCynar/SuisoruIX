/**
 * Get the current time
 * @param {boolean} ShowZero - pad single-digit values with a leading zero
 * @param {boolean} Use12Hour - use 12 hour format
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

    return {
      year,
      month,
      day,
      hour,
      minute,
      second,
      // 0 = Sunday ... 6 = Saturday (localized by the view layer)
      weekday: time.getDay(),
      amPm,
    };
  } catch (error) {
    console.error("Error in getting time:" + error);
    return {};
  }
};

/**
 * Return a greeting key based on the current hour.
 * Localized by the caller.
 * @returns {string} greeting key
 */
export const getGreetingKey = () => {
  const currentHour = new Date().getHours();
  if (currentHour >= 6 && currentHour < 12) {
    return "morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    return "afternoon";
  } else if (currentHour >= 18 && currentHour < 20) {
    return "evening";
  } else if (currentHour >= 20 && currentHour < 24) {
    return "night";
  } else if (currentHour >= 4 && currentHour < 6) {
    return "earlyMorning";
  }
  return "lateNight";
};

