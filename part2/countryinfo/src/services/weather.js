import axios from "axios";

const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

const getWeatherFor = async ([lat, lon]) => {
  const { data } = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather`,
    {
      params: {
        lat: `${lat}`,
        lon: `${lon}`,
        units: "metric",
        appid: apiKey,
      },
    }
  );
  return data;
};

export default getWeatherFor;
