/**
* Anti-shake function
* @param {Function} func - the function to be de-shaked
* @param {number} delay - delay time, in milliseconds
* @returns {Function} - returns a new function that will be executed at most once within the specified time interval
*/
const debounce = (func, delay) => {
  let timerId;

  return (...args) => {
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

export default debounce;
