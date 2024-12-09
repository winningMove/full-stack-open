import { createContext, useRef } from "react";

export const AlertResetContext = createContext();

const AlertResetProvider = ({ children }) => {
  const alertResetRef = useRef(null);

  return (
    <AlertResetContext.Provider value={alertResetRef}>
      {children}
    </AlertResetContext.Provider>
  );
};

export default AlertResetProvider;
