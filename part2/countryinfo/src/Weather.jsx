import { useEffect, useState } from "react";
import getWeatherFor from "./services/weather";

const Weather = ({ capital: { city, latlng } }) => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const data = await getWeatherFor(latlng);
        setWeather(data);
      } catch (e) {
        console.error("Failed to fetch weather data:", e.message);
        setError(true);
      }
    }
    fetchWeather();
  }, [city, latlng]);

  if (error) return <p>{`Couldn't get weather for ${city}`}</p>;
  if (!weather) return <p>Loading weather data...</p>;

  return (
    <div>
      <h4>Weather in {city}</h4>
      <p>Temperature: {weather?.main?.temp ?? "N/A"} °C</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={`An icon indicating ${
          weather?.weather?.[0]?.description ?? "some weather condition"
        }`}
      />
      <p>Wind speed: {weather?.wind?.speed ?? "N/A"} m/s</p>
    </div>
  );
};

export default Weather;
