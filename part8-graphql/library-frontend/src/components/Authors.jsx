import { useMutation, useQuery } from "@apollo/client";
import { SET_BIRTHYEAR } from "../client/mutations.js";
import { ALL_AUTHORS } from "../client/queries.js";

const Authors = () => {
  const { loading, error, data } = useQuery(ALL_AUTHORS);
  const [setBirthYear] = useMutation(SET_BIRTHYEAR);

  const submitBirthYear = (e) => {
    e.preventDefault();

    const { author, year } = e.target;
    setBirthYear({
      variables: { name: author.value, year: Number(year.value) },
    });

    year.value = "";
  };

  if (loading) return <p>Loading authors...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Born</th>
            <th>Books</th>
          </tr>
          {data.allAuthors.map(({ id, name, born, bookCount }) => (
            <tr key={id}>
              <td>{name}</td>
              <td>{born}</td>
              <td>{bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Set author birthyear</h3>
      <form onSubmit={submitBirthYear}>
        <label>
          Author:{" "}
          <select required name="author">
            {data.allAuthors.map(({ id, name }) => (
              <option key={id} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <div>
          <label>
            Birthyear: <input required name="year" type="number" />
          </label>
        </div>

        <button type="submit">Update author</button>
      </form>
    </div>
  );
};

export default Authors;
