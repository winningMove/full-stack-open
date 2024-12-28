import { useQuery, useReactiveVar } from "@apollo/client";
import { filterGenre } from "../client/client.js";
import { ALL_BOOKS } from "../client/queries.js";
import "./Books.css";

const Books = () => {
  const filterGenreValue = useReactiveVar(filterGenre);
  const { loading, error, data } = useQuery(ALL_BOOKS, {
    variables: { genre: filterGenreValue },
  });

  const handleGenreToggle = (genre) =>
    filterGenre(filterGenreValue === genre ? null : genre);

  if (loading) return <p>Loading books...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Books</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "0.5rem",
          maxWidth: "50%",
        }}
      >
        {data.allGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreToggle(genre)}
            className={
              filterGenreValue === genre ? "selected-button" : undefined
            }
          >
            {genre}
          </button>
        ))}
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {data.allBooks.map(({ id, title, author, published }) => (
            <tr key={id}>
              <td>{title}</td>
              <td>{author.name}</td>
              <td>{published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
