import { createContext, useContext, useReducer, useRef } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "RESET":
      return "";
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatchNotification] = useReducer(
    notificationReducer,
    ""
  );
  const resetTimeoutRef = useRef(null);

  return (
    <NotificationContext.Provider
      value={[notification, dispatchNotification, resetTimeoutRef]}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationValue = () => {
  const context = useContext(NotificationContext);
  return context[0];
};

export const useNotificationDispatchAndRef = () => {
  const context = useContext(NotificationContext);
  return context.slice(1);
};

export const setNewNotification = (dispatch, content, ref) => {
  dispatch({
    type: "SET",
    payload: content,
  });
  clearTimeout(ref.current);
  ref.current = setTimeout(() => {
    dispatch({ type: "RESET" });
  }, 5000);
};

export default NotificationContext;
