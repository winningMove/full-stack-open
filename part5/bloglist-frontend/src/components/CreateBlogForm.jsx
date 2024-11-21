import "./CreateBlogForm.css";
import { useState } from "react";

const CreateBlogForm = ({ handleCreateBlog }) => {
  const [newBlog, setNewBlog] = useState({});

  const addBlog = (e) => {
    e.preventDefault();
    handleCreateBlog(newBlog);
    setNewBlog({});
  };

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog} className="create-form">
        <label htmlFor="title">
          Title:{" "}
          <input
            type="text"
            id="title"
            name="title"
            value={newBlog.title ?? ""}
            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
          />
        </label>
        <label htmlFor="author">
          Author:{" "}
          <input
            type="text"
            id="author"
            name="author"
            value={newBlog.author ?? ""}
            onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
          />
        </label>
        <label htmlFor="url">
          URL:{" "}
          <input
            type="text"
            id="url"
            name="url"
            value={newBlog.url ?? ""}
            onChange={(e) => setNewBlog({ ...newBlog, url: e.target.value })}
          />
        </label>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateBlogForm;
