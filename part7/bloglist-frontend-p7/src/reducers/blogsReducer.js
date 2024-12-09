import { createSelector, createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs.js";
import { alertAndReset } from "./alertReducer.js";
import { addUserBlog, removeUserBlog } from "./usersReducer.js";

const blogsSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(_, action) {
      return action.payload;
    },
    addBlog(state, action) {
      state.push(action.payload);
    },
    update(state, action) {
      const index = state.findIndex((blog) => blog.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },
    remove(state, action) {
      const index = state.findIndex((blog) => blog.id === action.payload);
      if (index !== -1) state.splice(index, 1);
    },
    addComment(state, action) {
      const index = state.findIndex((blog) => blog.id === action.payload.id);
      if (index !== -1) state[index].comments.push(action.payload.comment);
    },
  },
});

export const { setBlogs, addBlog, update, remove, addComment } =
  blogsSlice.actions;

export const initializeBlogs = () => async (dispatch) => {
  const blogs = await blogService.getAll();
  dispatch(setBlogs(blogs));
};

export const createBlog = (newBlog, resetRef) => async (dispatch) => {
  try {
    const newBlogData = await blogService.create(newBlog);
    dispatch(addBlog(newBlogData));
    dispatch(addUserBlog(newBlogData));
    dispatch(
      alertAndReset(
        `Added blog ${newBlogData.title}, by ${newBlogData.author}`,
        resetRef
      )
    );
  } catch (err) {
    dispatch(alertAndReset(err.message, resetRef));
  }
};

export const updateBlog = (blogId, updatedBlog) => async (dispatch) => {
  const updatedBlogData = await blogService.update(blogId, updatedBlog);
  dispatch(update(updatedBlogData));
};

export const deleteBlog = (blogId) => async (dispatch) => {
  await blogService.remove(blogId);
  dispatch(remove(blogId));
  dispatch(removeUserBlog(blogId));
};

export const addCommentToBlog = (blogId, newComment) => async (dispatch) => {
  const addedComment = await blogService.addComment(blogId, newComment);
  dispatch(addComment({ id: blogId, comment: addedComment.newComment }));
};

export const selectBlogsSortedByLikesDesc = createSelector(
  (state) => state.blogs,
  (blogs) => blogs.toSorted((a, b) => b.likes - a.likes)
);

export const selectBlogById = createSelector(
  [(state) => state.blogs, (_, blogId) => blogId],
  (blogs, blogId) => blogs.find((b) => b.id === blogId)
);

export default blogsSlice.reducer;
