/**
* Find the maximum z-index value of all elements in the page and return the appropriate z-index value that the new element should use
* @param {number} min - optional parameter, the minimum z-index value that the new element should have at least.
* @returns {number} returns the appropriate z-index value that the new element should use.
*/
export const findMaxZIndex = (min) => {
  const elements = document.getElementsByTagName("*");
  let maxZIndex = 0;
  for (let i = 0; i < elements.length; i++) {
    const zIndex = parseInt(window.getComputedStyle(elements[i]).zIndex, 10);
    if (zIndex && zIndex > maxZIndex) {
      maxZIndex = zIndex;
    }
  }

  return Math.max(min ? min : 2000, maxZIndex + 1);
};
