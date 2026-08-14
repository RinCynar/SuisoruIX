/**
 * Get search suggestions from Google Custom Search API
 * @param {String} keyWord - search keyword
 */
export const getSearchSuggestions = async (keyWord) => {
  try {
    // Keys can be provided via the environment; fallbacks are only used when absent.
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || "AIzaSyDx0i-9bI4EffpFFUQASCCzWb0odN73VX0";
    const cx = import.meta.env.VITE_GOOGLE_CX || "722782f8f7f4b442f";

    const encodedKeyword = encodeURIComponent(keyWord);
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?q=${encodedKeyword}&key=${apiKey}&cx=${cx}`
    );

    const data = await response.json();

    const suggestions = data.items?.map(item => item.title) || [];
    return suggestions;
  } catch (error) {
    console.error("An error occurred while processing search suggestions:", error);
    return null;
  }
};
