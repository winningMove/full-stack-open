import { useQuery, useReactiveVar } from "@apollo/client";
import { Link } from "react-router";
import { userVar } from "../client/client";
import { ALL_BOOKS } from "../client/queries";

const Recommended = () => {
  const user = useReactiveVar(userVar);
  const { loading, error, data } = useQuery(ALL_BOOKS, {
    variables: { genre: user?.favoriteGenre },
  });

  if (loading) return <p>Loading recommended books...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Recommended books</h2>
      <p>
        Books in your favorite genre: <strong>{user?.favoriteGenre}</strong>
      </p>
      {data.allBooks.length ? (
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
      ) : (
        <p>
          No books yet! <Link to="/new-book">Add one</Link> you know about.
        </p>
      )}
    </div>
  );
};

export default Recommended;
