const Notification = ({ alertMessage: { error, message } }) => {
  if (error === undefined) return null;

  const color = error ? "red" : "green";
  const style = {
    fontSize: "1.5rem",
    padding: "0.5rem",
    borderRadius: "3px",
    marginBottom: "1rem",
    width: "50%",
    outline: `2px solid ${color}`,
    color: color,
    backgroundColor: "lightgray",
  };

  return <div style={style}>{message}</div>;
};

export default Notification;
