import useInput from "../../hooks/useInput";
import { Input } from "../Input/Input";
import "./Login.scss";

export const Login: React.FC = () => {
  const usernameInput = useInput("");
  const passwordInput = useInput("");

  return (
    <form action="/login" method="post">
      <fieldset>
        <legend>LOGIN</legend>
        <Input
          name="username"
          label="Username"
          type="text"
          {...usernameInput}
        />
        <Input
          name="password"
          label="Password"
          type="password"
          {...passwordInput}
        />
      </fieldset>
    </form>
  );
};
