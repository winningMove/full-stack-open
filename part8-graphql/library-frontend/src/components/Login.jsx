import { useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../client/client";
import { LOGIN } from "../client/mutations";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [loginMutation] = useMutation(LOGIN, {
    onCompleted: (data) => {
      login(data.login.value);
      navigate("/new-book");
    },
    onError: (error) => {
      console.error(error.graphQLErrors[0]?.message || "Login failed");
    },
  });

  const submit = (e) => {
    e.preventDefault();
    loginMutation({ variables: { username, password } });
    setUsername("");
    setPassword("");
  };

  return (
    <div>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          alignItems: "flex-start",
        }}
        onSubmit={submit}
      >
        <label>
          Username{" "}
          <input
            required
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
        <label>
          Password{" "}
          <input
            required
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
        <button type="submit">Log in</button>
      </form>
    </div>
  );
};

export default Login;
