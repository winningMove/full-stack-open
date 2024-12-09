import { useState, useEffect } from "react";
import axios from "axios";

const useField = (type = "text") => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const reset = () => {
    setValue("");
  };

  return [
    {
      type,
      value,
      onChange,
    },
    reset,
  ];
};

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    axios
      .get(baseUrl)
      .then(({ data }) => {
        setResources(data);
      })
      .catch((e) => console.error("Error fetching resources", e.message));
  }, [baseUrl]);

  const create = (resource) => {
    axios
      .post(baseUrl, resource)
      .then(({ data }) => {
        setResources([...resources, data]);
      })
      .catch((e) => console.error("Error adding new resource", e.message));
  };

  const service = {
    create,
  };

  return [resources, service];
};

const App = () => {
  const [content, resetContent] = useField();
  const [name, resetName] = useField();
  const [number, resetNumber] = useField();

  const [notes, noteService] = useResource("http://localhost:3005/notes");
  const [persons, personService] = useResource("http://localhost:3005/persons");

  const handleNoteSubmit = (event) => {
    event.preventDefault();
    noteService.create({ content: content.value });
    resetContent();
  };

  const handlePersonSubmit = (event) => {
    event.preventDefault();
    personService.create({ name: name.value, number: number.value });
    resetName();
    resetNumber();
  };

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map((n) => (
        <p key={n.id}>{n.content}</p>
      ))}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br />
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map((n) => (
        <p key={n.id}>
          {n.name} {n.number}
        </p>
      ))}
    </div>
  );
};

export default App;
