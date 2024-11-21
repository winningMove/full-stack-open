import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import blogService from "./services/blogs.js";
import loginService from "./services/login.js";
import Login from "./components/Login.jsx";
import Blogs from "./components/Blogs.jsx";
import Notification from "./components/Notification.jsx";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState("");
  const info = useRef(null);
  const createFormRef = useRef();
  const sortedBlogsToDisplay = blogs.toSorted((a, b) => b.likes - a.likes);

  useEffect(() => {
    async function getBlogs() {
      try {
        const blogs = await blogService.getAll();
        setBlogs(blogs);
      } catch (err) {
        setAlert(err.message);
        info.current = setTimeout(() => {
          setAlert("");
        }, 5000);
      }
    }
    getBlogs();
    return () => {
      clearTimeout(info.current);
    };
  }, []);

  useEffect(() => {
    const loggedInUserJSON = localStorage.getItem("bloglistUser");
    if (loggedInUserJSON) {
      const loggedInUser = JSON.parse(loggedInUserJSON);
      const decodedTokenExpiration = jwtDecode(loggedInUser.token).exp;
      const isTokenExpired = Date.now() / 1000 > decodedTokenExpiration;
      if (isTokenExpired) {
        localStorage.removeItem("bloglistUser");
      } else {
        setUser(loggedInUser);
        blogService.setToken(loggedInUser.token);
      }
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      localStorage.setItem("bloglistUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
    } catch (err) {
      setAlert("Incorrect credentials");
      clearTimeout(info.current);
      info.current = setTimeout(() => {
        setAlert("");
      }, 5000);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("bloglistUser");
    blogService.setToken(null);
  };

  const handleCreateBlog = async (newBlog) => {
    try {
      const newBlogData = await blogService.create(newBlog);
      setBlogs([...blogs, newBlogData]);
      setAlert(`Added blog ${newBlogData.title}, by ${newBlogData.author}`);
      createFormRef.current.toggleFormVisible();
    } catch (err) {
      setAlert(err.message);
    } finally {
      clearTimeout(info.current);
      info.current = setTimeout(() => {
        setAlert("");
      }, 5000);
    }
  };

  const handleUpdateBlog = async (blogId, updatedBlog) => {
    try {
      const updatedBlogData = await blogService.update(blogId, updatedBlog);
      const updatedBlogs = blogs.map((b) =>
        b.id === updatedBlogData.id ? updatedBlogData : b
      );
      setBlogs(updatedBlogs);
    } catch (err) {
      setAlert(err.message);
      clearTimeout(info.current);
      info.current = setTimeout(() => {
        setAlert("");
      }, 5000);
    }
  };

  const handleDeleteBlog = async (blogId, title, author) => {
    if (!confirm(`Remove blog ${title}, by ${author}?`)) return;

    try {
      await blogService.remove(blogId);
      setBlogs(blogs.filter((b) => b.id !== blogId));
    } catch (err) {
      setAlert(err.message);
      clearTimeout(info.current);
      info.current = setTimeout(() => {
        setAlert("");
      }, 5000);
    }
  };

  return (
    <div>
      {alert && <Notification info={alert} />}
      {user === null ? (
        <Login handleLogin={handleLogin} />
      ) : (
        <Blogs
          user={user}
          blogs={sortedBlogsToDisplay}
          onLogout={handleLogout}
          handleCreateBlog={handleCreateBlog}
          handleUpdateBlog={handleUpdateBlog}
          handleDeleteBlog={handleDeleteBlog}
          ref={createFormRef}
        />
      )}
    </div>
  );
};

export default App;
