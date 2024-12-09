import { useSelector } from "react-redux";
import { selectAlert } from "../reducers/alertReducer";
import { Alert } from "./ui/alert.jsx";

const Notification = () => {
  const alert = useSelector(selectAlert);
  return alert && <Alert status="error" title={alert} borderRadius="md" />;
};

export default Notification;
