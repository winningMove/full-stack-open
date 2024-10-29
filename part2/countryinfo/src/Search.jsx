const Search = ({ search, handleSearch }) => {
  return (
    <div>
      <label htmlFor="country-search">
        Search for countries:{" "}
        <input
          type="text"
          id="country-search"
          value={search}
          onChange={handleSearch}
        />
      </label>
    </div>
  );
};

export default Search;
