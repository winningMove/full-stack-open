import { useEffect, useState } from "react";
import formatWithCommas from "./utils";
import Weather from "./Weather";

const Country = ({ country }) => {
  return (
    <div className="country-info">
      <h2>{country.name.common}</h2>
      <p>Capital: {country?.capital?.join(", ") ?? "No official capital"}</p>
      <p>
        Area:{" "}
        {country.area > 0
          ? `${formatWithCommas(country.area)} km\u00B2`
          : "No data"}
      </p>
      <h4>Languages:</h4>
      <ul style={{ listStyle: "none" }}>
        {country?.languages ? (
          Object.values(country.languages).map((lang) => (
            <li key={lang}>{lang}</li>
          ))
        ) : (
          <li>No official languages</li>
        )}
      </ul>
      <img
        src={country.flags.png}
        alt={country.flags.alt ?? `Flag of ${country.name.official}`}
      />
      {country?.capital?.[0] && country?.capitalInfo?.latlng && (
        <Weather
          capital={{
            city: country.capital[0],
            latlng: country.capitalInfo.latlng,
          }}
        />
      )}
    </div>
  );
};

const Countries = ({ countries }) => {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (countries.length === 1) {
      setSelected(countries[0]);
    } else {
      setSelected(null);
    }
  }, [countries]);

  if (countries.length > 10) return <p>Too many matches; specify further</p>;

  return (
    <div style={{ paddingTop: "0.5rem" }}>
      {selected ? (
        <Country country={selected} />
      ) : countries.length ? (
        countries.map((country) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
            key={country.name.official}
          >
            <p>{country.name.common} </p>
            <button
              onClick={() => {
                setSelected(country);
              }}
            >
              Show
            </button>
          </div>
        ))
      ) : (
        <p>No matches</p>
      )}
    </div>
  );
};

export default Countries;
