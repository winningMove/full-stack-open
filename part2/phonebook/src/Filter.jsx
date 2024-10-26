const Filter = ({ filterText, onFilterChange }) => {
  return (
    <label>
      Show only entries where name includes:{" "}
      <input type="text" value={filterText} onChange={onFilterChange} />
    </label>
  );
};

export default Filter;
