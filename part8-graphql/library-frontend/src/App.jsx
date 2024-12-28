import { useReactiveVar, useSubscription } from "@apollo/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { updateAuthorsCache, updateBooksCache, userVar } from "./client/client";
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from "./client/queries";
import Authors from "./components/Authors";
import Books from "./components/Books";
import Layout from "./components/Layout";
import Login from "./components/Login";
import NewBook from "./components/NewBook";
import Recommended from "./components/Recommended";

const App = () => {
  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const bookAdded = data.data.bookAdded;
      // update cache for filter views with matching genres (incl. Recommended view),
      // as well as all-books view (null genre)
      [...bookAdded.genres, null].forEach((genre) => {
        updateBooksCache(
          client.cache,
          { query: ALL_BOOKS, variables: { genre } },
          bookAdded
        );
      });

      updateAuthorsCache(client.cache, { query: ALL_AUTHORS }, bookAdded);

      alert(`Added book: ${bookAdded.title}`);
    },
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="authors" replace />} />
          <Route path="authors" element={<Authors />} />
          <Route path="books" element={<Books />} />
          <Route
            path="new-book"
            element={
              <ProtectedRoute>
                <NewBook />
              </ProtectedRoute>
            }
          />
          <Route
            path="login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="recommended"
            element={
              <ProtectedRoute>
                <Recommended />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const ProtectedRoute = ({ children }) => {
  const user = useReactiveVar(userVar);
  return user ? children : <Navigate to="/login" replace />;
};

const PublicOnlyRoute = ({ children }) => {
  const user = useReactiveVar(userVar);
  return user ? <Navigate to="/new-book" replace /> : children;
};

export default App;
