const Entry = ({ entry: { id, name, number }, onDeleteClick }) => {
  return (
    <div style={{ marginBottom: "-0.5rem" }}>
      <p style={{ display: "inline-block", marginRight: "1rem" }}>
        {name} {number}
      </p>
      <button
        style={{ display: "inline-block" }}
        onClick={onDeleteClick(id, name)}
      >
        Delete
      </button>
    </div>
  );
};

const Entries = ({ displayedEntries, onDeleteClick }) => {
  return displayedEntries.length
    ? displayedEntries.map((entry) => (
        <Entry key={entry.id} entry={entry} onDeleteClick={onDeleteClick} />
      ))
    : "No matches for the filter";
};

export default Entries;
