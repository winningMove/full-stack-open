import axios from "axios";

const getCountryInfo = async () => {
  const { data } = await axios.get(
    "https://studies.cs.helsinki.fi/restcountries/api/all"
  );
  return data;
};

export default getCountryInfo;
