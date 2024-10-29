import { useEffect, useState } from "react";
import getCountryInfo from "./services/countries";
import Search from "./Search";
import Countries from "./Countries";

function App() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(false);

  const displayCountries = [];

  for (const country of countries) {
    if (country.name.common.toLowerCase().includes(search.toLowerCase())) {
      displayCountries.push(country);
      if (displayCountries.length > 10) break;
    }
  }

  useEffect(() => {
    async function fetchCountries() {
      try {
        const data = await getCountryInfo();
        setCountries(data);
      } catch (e) {
        console.error("Failed to fetch initial data:", e.message);
        setError(true);
      }
    }
    fetchCountries();
  }, []);

  return (
    <>
      <Search
        search={search}
        handleSearch={(e) => {
          setSearch(e.target.value);
        }}
      />
      {error ? (
        <p>{"Couldn't fetch country data"}</p>
      ) : (
        search && <Countries countries={displayCountries} />
      )}
    </>
  );
}

export default App;
