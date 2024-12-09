import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs.js";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(_, action) {
      return action.payload;
    },
    reset() {
      return null;
    },
  },
});

export const { setUser, reset } = userSlice.actions;

export const setAuthenticatedUser = (loggedInUser) => (dispatch) => {
  dispatch(setUser(loggedInUser));
  blogService.setToken(loggedInUser.token);
};

export const resetUser = () => (dispatch) => {
  dispatch(reset());
  blogService.setToken(null);
};

export const selectUser = (state) => state.user;

export default userSlice.reducer;
