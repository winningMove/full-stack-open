import { useState } from "react";

const Blog = ({
  blog,
  handleUpdateBlog,
  handleDeleteBlog,
  currentUserName,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const wrapperStyle = {
    outline: "2px solid teal",
    borderRadius: "5px",
    padding: "1rem",
    marginBottom: "1rem",
    maxWidth: "75ch",
  };

  const updateLikes = () => {
    const { id, ...updatedBlog } = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    };
    handleUpdateBlog(id, updatedBlog);
  };

  const deleteBlog = () => {
    handleDeleteBlog(blog.id, blog.title, blog.author);
  };

  return (
    <div style={wrapperStyle} data-testid="blog-div">
      <p style={{ display: "inline-block" }}>
        {blog.title}, by {blog.author}
      </p>
      <button
        style={{ display: "inline-block", marginLeft: "1rem" }}
        type="button"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "Hide" : "Show"}
      </button>
      {showDetails && (
        <>
          <div>Url: {blog.url}</div>
          <div style={{ display: "inline-block" }}>Likes: {blog.likes}</div>
          <button
            style={{ display: "inline-block", marginLeft: "1rem" }}
            type="button"
            onClick={updateLikes}
          >
            Like
          </button>
          <div>Added by: {blog.user.name}</div>
          {blog.user.username === currentUserName ? (
            <button
              type="button"
              onClick={deleteBlog}
              style={{ backgroundColor: "teal", opacity: "0.8" }}
            >
              Remove
            </button>
          ) : null}
        </>
      )}
    </div>
  );
};

export default Blog;
