import { useMutation } from "@apollo/client";
import { useState } from "react";
import { CREATE_BOOK } from "../client/mutations";

const NewBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [createBook] = useMutation(CREATE_BOOK);

  const submit = async (e) => {
    e.preventDefault();

    createBook({
      variables: { title, author, published: Number(published), genres },
    });

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres([...genres, genre]);
    setGenre("");
  };

  return (
    <div>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          alignItems: "flex-start",
        }}
        onSubmit={submit}
      >
        <label>
          Title{" "}
          <input
            required
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </label>
        <label>
          Author{" "}
          <input
            required
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
        <label>
          Published{" "}
          <input
            required
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </label>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              e.preventDefault();
              addGenre();
            }}
          />
          <button type="button" onClick={addGenre}>
            Add genre
          </button>
        </div>
        <div>Genres: {genres.join(", ")}</div>
        <button type="submit">Create book</button>
      </form>
    </div>
  );
};

export default NewBook;
