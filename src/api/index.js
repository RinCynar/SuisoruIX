import axios from "@/utils/request";
import fetchJsonp from "fetch-jsonp";

/**
* Get weather
* https://lbs.amap.com/api/webservice/guide/api/weatherinfo
*/
// Get Amap location information
export const getAdcode = async (key) => {
  return axios({
    method: "GET",
    url: "https://restapi.amap.com/v3/ip",
    params: { key },
  });
};

// Get Amap's weather information
export const getWeather = async (key, city) => {
  return axios({
    method: "GET",
    url: "https://restapi.amap.com/v3/weather/weatherInfo",
    params: { key, city, extensions: "base" },
  });
};

/**
* Get search suggestions from Google Custom Search API
* @param {String} keyWord - search keyword
* @param {String} apiKey - your Google API key
* @param {String} cx - your Google Custom Search Engine ID
*/
export const getSearchSuggestions = async (keyWord) => {
  try {
    const apiKey = "AIzaSyDx0i-9bI4EffpFFUQASCCzWb0odN73VX0";
    const cx = "722782f8f7f4b442f";

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