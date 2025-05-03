const Error = ({ error }: { error: string }) =>
  error && <div style={{ color: "red" }}>{`Error: ${error}`}</div>;

export default Error;
