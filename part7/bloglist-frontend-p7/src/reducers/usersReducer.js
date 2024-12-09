import { createSelector, createSlice } from "@reduxjs/toolkit";
import usersService from "../services/users.js";

const usersSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    setUsers(_, action) {
      return action.payload;
    },
    addUserBlog(state, action) {
      const userId = action.payload.user.id;
      const user = state.find((u) => u.id === userId);
      user.blogs.push(action.payload);
    },
    removeUserBlog(state, action) {
      const blogId = action.payload;
      const user = state.find((u) => u.blogs.some((b) => b.id === blogId));
      const blogIndex = user.blogs.findIndex((b) => b.id === blogId);
      user.blogs.splice(blogIndex, 1);
    },
  },
});

export const { setUsers, addUserBlog, removeUserBlog } = usersSlice.actions;

export const initializeUsers = () => async (dispatch) => {
  const users = await usersService.getAll();
  dispatch(setUsers(users));
};

export const selectUsers = (state) => state.users;

export const selectUserById = createSelector(
  [selectUsers, (_, userId) => userId],
  (users, userId) => users.find((u) => u.id === userId)
);

export default usersSlice.reducer;
