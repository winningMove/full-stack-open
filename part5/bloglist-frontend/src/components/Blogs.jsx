import { forwardRef, useImperativeHandle, useState } from "react";
import Blog from "./Blog";
import CreateBlogForm from "./CreateBlogForm";
import PropTypes from "prop-types";

const Blogs = forwardRef(
  (
    {
      user,
      blogs,
      onLogout,
      handleCreateBlog,
      handleUpdateBlog,
      handleDeleteBlog,
    },
    ref
  ) => {
    const [createFormVisible, setCreateFormVisible] = useState(false);

    const toggleFormVisible = () => {
      setCreateFormVisible(!createFormVisible);
    };

    useImperativeHandle(ref, () => {
      return { toggleFormVisible };
    });

    return (
      <>
        <h2>Blogs</h2>
        <div>
          <p>Logged in as {user.name}</p>
          <button type="button" onClick={onLogout}>
            Log out
          </button>
        </div>

        <div style={{ margin: "1rem 0" }}>
          <div style={{ display: createFormVisible ? "none" : "" }}>
            <button type="button" onClick={toggleFormVisible}>
              New blog
            </button>
          </div>
          <div style={{ display: createFormVisible ? "" : "none" }}>
            <CreateBlogForm handleCreateBlog={handleCreateBlog} />
            <button type="button" onClick={toggleFormVisible}>
              Cancel
            </button>
          </div>
        </div>

        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleUpdateBlog={handleUpdateBlog}
            handleDeleteBlog={handleDeleteBlog}
            currentUserName={user.username}
          />
        ))}
      </>
    );
  }
);

Blogs.propTypes = {
  user: PropTypes.object.isRequired,
  blogs: PropTypes.array.isRequired,
  onLogout: PropTypes.func.isRequired,
  handleCreateBlog: PropTypes.func.isRequired,
  handleUpdateBlog: PropTypes.func.isRequired,
  handleDeleteBlog: PropTypes.func.isRequired,
};

Blogs.displayName = "Blogs";

export default Blogs;
