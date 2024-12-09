import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AlertResetContext } from "../context/AlertResetContext";
import { alertAndReset } from "../reducers/alertReducer";
import { initializeBlogs } from "../reducers/blogsReducer";
import { setAuthenticatedUser } from "../reducers/userReducer";
import { initializeUsers } from "../reducers/usersReducer";

export const useField = (name, type = "text") => {
  const [value, setValue] = useState("");

  const onChange = (e) => {
    setValue(e.target.value);
  };
  const reset = () => {
    setValue("");
  };

  return [{ type, name, value, onChange }, reset];
};

export const useInitializeBlogs = () => {
  const alertResetRef = useContext(AlertResetContext);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        await dispatch(initializeBlogs());
      } catch (err) {
        dispatch(alertAndReset(err.message, alertResetRef));
      }
    })();
  }, [dispatch, alertResetRef]);
};

export const useInitializeUsers = () => {
  const alertResetRef = useContext(AlertResetContext);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        await dispatch(initializeUsers());
      } catch (err) {
        dispatch(alertAndReset(err.message, alertResetRef));
      }
    })();
  }, [dispatch, alertResetRef]);
};

export const useSetAuthenticatedUser = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const loggedInUserJSON = localStorage.getItem("bloglistUser");
    if (loggedInUserJSON) {
      const loggedInUser = JSON.parse(loggedInUserJSON);
      const decodedTokenExpiration = jwtDecode(loggedInUser.token).exp;
      const isTokenExpired = Date.now() / 1000 > decodedTokenExpiration;
      if (isTokenExpired) {
        localStorage.removeItem("bloglistUser");
      } else {
        dispatch(setAuthenticatedUser(loggedInUser));
      }
    }
  }, [dispatch]);
};
