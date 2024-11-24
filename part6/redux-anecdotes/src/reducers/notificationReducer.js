import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    notify(_, action) {
      return action.payload;
    },
    clear() {
      return "";
    },
  },
});

const { notify, clear } = notificationSlice.actions;

export const setNotification =
  (content, durationSeconds, ref) => (dispatch) => {
    dispatch(notify(content));
    clearTimeout(ref.current);
    ref.current = setTimeout(() => {
      dispatch(clear());
    }, durationSeconds * 1000);
  };

export default notificationSlice.reducer;
