import { Provider as Redux } from "react-redux";
import store from "../../store.js";
import AlertResetProvider from "../context/AlertResetContext.jsx";
import { Provider as Chakra } from "./ui/provider.jsx";

export default function Providers({ children }) {
  return (
    <Redux store={store}>
      <Chakra>
        <AlertResetProvider>{children}</AlertResetProvider>
      </Chakra>
    </Redux>
  );
}
