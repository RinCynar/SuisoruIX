/**
* Determine whether the input string is a URL, email address or plain text.
*
* @param {string} input - input string
* @returns {(string | boolean)} - return "url" means URL, "email" means email address, true means plain text
*/
const identifyInput = (input) => {
  /**
   * Web Regex
   * @type {RegExp}
   */
  const urlRegex = new RegExp("https?://[\\w.-]+", "i");

  /**
   * IP Regex
   * @type {RegExp}
   */
  const ipv4Regex = new RegExp(
    "^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
  );

  /**
   * Email Regex
   * @type {RegExp}
   */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (urlRegex.test(input) || ipv4Regex.test(input)) return "url";

  if (emailRegex.test(input)) return "email";

  return "text";
};

export default identifyInput;
