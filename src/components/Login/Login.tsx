import { FormEvent, useEffect, useState } from "react";
import useInput from "../../hooks/useInput";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import "./Login.scss";

type InputErrorProps = {
  username: string;
  password: string;
};

export const Login: React.FC = () => {
  const usernameInput = useInput("");
  const passwordInput = useInput("");

  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);

  useEffect(() => {
    if (
      usernameInput.error == "" &&
      passwordInput.error == "" &&
      usernameInput.value !== "" &&
      passwordInput.value !== ""
    ) {
      setIsButtonActive(true);
    } else {
      setIsButtonActive(false);
    }
  }, [usernameInput, passwordInput]);

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
        <Button isButtonActive={isButtonActive}>Login</Button>
      </fieldset>
    </form>
  );
};
