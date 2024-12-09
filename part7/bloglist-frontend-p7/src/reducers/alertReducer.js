import { createSlice } from "@reduxjs/toolkit";

const alertSlice = createSlice({
  name: "alert",
  initialState: "",
  reducers: {
    setAlert(_, action) {
      return action.payload;
    },
    resetAlert() {
      return "";
    },
  },
});

export const { setAlert, resetAlert } = alertSlice.actions;

export const alertAndReset = (content, resetRef) => (dispatch) => {
  dispatch(setAlert(content));
  clearTimeout(resetRef.current);
  resetRef.current = setTimeout(() => dispatch(resetAlert()), 5000);
};

export const selectAlert = (state) => state.alert;

export default alertSlice.reducer;
