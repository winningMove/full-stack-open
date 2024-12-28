import { useReactiveVar } from "@apollo/client";
import { Link, Outlet } from "react-router";
import { logout, userVar } from "../client/client";

const Layout = () => {
  const user = useReactiveVar(userVar);
  return (
    <>
      <nav>
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <li>
            <Link to="/authors">Authors</Link>
          </li>
          <li>
            <Link to="/books">Books</Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/new-book">New Book</Link>
              </li>
              <li>
                <Link to="/recommended">Recommended</Link>
              </li>
              <li>
                <button onClick={logout}>Log out</button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login">Log in</Link>
            </li>
          )}
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
