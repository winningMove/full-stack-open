import "./Notification.css";

const Notification = ({ info }) => {
  return (
    <div className="notification">
      <h3>{info}</h3>
    </div>
  );
};

export default Notification;
