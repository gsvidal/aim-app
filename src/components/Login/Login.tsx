import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useInput from "../../hooks/useInput";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import "./Login.scss";
import { ErrorPage } from "../ErrorPage/ErrorPage";

export const Login: React.FC = () => {
  const usernameInput = useInput("");
  const passwordInput = useInput("");

  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);

  const [error, setError] = useState({ code: "", message: "" });

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsButtonActive(false)

    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameInput["value"],
          password: passwordInput["value"],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // message: Logged in successfully
      } else {
        const error = await response.json();
        setError(error);
      }
    } catch (error) {
      setError({ code: "400", message: "An error ocurred" });
    }
    setIsButtonActive(true)
  };

  return (
    <>
      {error.message == "" ? (
        <form action="/login" method="post" onSubmit={handleSubmit}>
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
      ) : (
        <ErrorPage error={error} />
      )}
    </>
  );
};
