import { configureStore } from "@reduxjs/toolkit";
import alertReducer from "./src/reducers/alertReducer.js";
import blogsReducer from "./src/reducers/blogsReducer.js";
import userReducer from "./src/reducers/userReducer.js";
import usersReducer from "./src/reducers/usersReducer.js";

const store = configureStore({
  reducer: {
    alert: alertReducer,
    blogs: blogsReducer,
    user: userReducer,
    users: usersReducer,
  },
});

export default store;
