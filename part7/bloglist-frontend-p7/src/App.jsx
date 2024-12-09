import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login.jsx";
import {
  useInitializeBlogs,
  useInitializeUsers,
  useSetAuthenticatedUser,
} from "./hooks/index.js";
import { selectUser } from "./reducers/userReducer.js";
import BlogsView from "./views/BlogsView.jsx";
import BlogView from "./views/BlogView.jsx";
import Home from "./views/Home.jsx";
import UsersView from "./views/UsersView.jsx";
import UserView from "./views/UserView.jsx";

const App = () => {
  const user = useSelector(selectUser);

  useInitializeBlogs();
  useInitializeUsers();
  useSetAuthenticatedUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user === null ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/"
          element={user === null ? <Navigate to="login" replace /> : <Home />}
        >
          <Route index element={<BlogsView />} />
          <Route path="blogs">
            <Route index element={<Navigate to="/" replace />} />
            <Route path=":blogId" element={<BlogView />} />
          </Route>
          <Route path="users">
            <Route index element={<UsersView />} />
            <Route path=":userId" element={<UserView />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
