const EntryForm = ({
  newName,
  newNumber,
  onNameChange,
  onNumberChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>
          Name: <input type="text" value={newName} onChange={onNameChange} />
        </label>
      </div>
      <div>
        <label>
          Number:{" "}
          <input type="text" value={newNumber} onChange={onNumberChange} />
        </label>
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  );
};

export default EntryForm;
