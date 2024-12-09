import { createContext, useState } from "react";

export const CreateFormContext = createContext();

const CreateFormProvider = ({ children }) => {
  const [createFormVisible, setCreateFormVisible] = useState(false);

  const toggleFormVisible = () => {
    setCreateFormVisible(!createFormVisible);
  };

  return (
    <CreateFormContext.Provider value={[createFormVisible, toggleFormVisible]}>
      {children}
    </CreateFormContext.Provider>
  );
};

export default CreateFormProvider;
