import { useState, useEffect, useRef } from "react";
import entryService from "./services/entries";
import Filter from "./Filter";
import EntryForm from "./EntryForm";
import Entries from "./Entries";
import Notification from "./Notification";

const App = () => {
  const [entries, setEntries] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterText, setFilterText] = useState("");
  const [alertMessage, setAlertMessage] = useState({});
  const alertTimeout = useRef(null);

  const displayedEntries = filterText
    ? entries.filter(({ name }) =>
        name.toLowerCase().includes(filterText.toLowerCase())
      )
    : entries;

  const displayAlert = (isError, message) => {
    setAlertMessage({
      error: isError,
      message,
    });

    if (alertTimeout.current) clearTimeout(alertTimeout.current);
    alertTimeout.current = setTimeout(() => {
      setAlertMessage({});
    }, 5000);
  };

  useEffect(() => {
    async function fetchEntries() {
      try {
        const initialEntries = await entryService.getAll();
        setEntries(initialEntries);
      } catch (error) {
        console.error(error.message);
        displayAlert(true, "Failed to fetch data from server");
      }
    }
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(newName && newNumber)) return;

    const existingEntry = entries.find((entry) => entry.name === newName);

    if (existingEntry) {
      if (
        confirm(
          `${newName} is already included in the phonebook. Replace their number with a new one?`
        )
      ) {
        try {
          const newEntry = await entryService.update(existingEntry.id, {
            ...existingEntry,
            number: newNumber,
          });
          setEntries(
            entries.map((entry) =>
              entry.id !== newEntry.id ? entry : newEntry
            )
          );
          displayAlert(false, `Replaced ${newEntry.name}'s number`);
        } catch (error) {
          console.error(error.message);
          displayAlert(true, `${newName}'s data was previously removed`);
          setEntries(entries.filter((entry) => entry.id !== existingEntry.id));
        }
      }
    } else {
      try {
        const newEntry = await entryService.create({
          name: newName,
          number: newNumber,
        });
        setEntries([...entries, newEntry]);
        displayAlert(false, `Added ${newEntry.name}`);
      } catch (error) {
        console.error(error.message);
        displayAlert(true, "Failed to add new entry");
      }
    }

    setNewName("");
    setNewNumber("");
  };

  const handleChange = (setterFn) => (e) => setterFn(e.target.value);

  const handleDelete = (id, name) => async () => {
    if (confirm(`Delete ${name}?`)) {
      try {
        await entryService.remove(id);
      } catch (error) {
        console.error(error.message);
        displayAlert(true, "Entry previously deleted");
      } finally {
        setEntries(entries.filter((entry) => entry.id !== id));
      }
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification alertMessage={alertMessage} />
      <Filter
        filterText={filterText}
        onFilterChange={handleChange(setFilterText)}
      />
      <h2>Add New Entry</h2>
      <EntryForm
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleChange(setNewName)}
        onNumberChange={handleChange(setNewNumber)}
        onSubmit={handleSubmit}
      />
      <h2>Numbers</h2>
      <Entries
        displayedEntries={displayedEntries}
        onDeleteClick={handleDelete}
      />
    </div>
  );
};

export default App;
