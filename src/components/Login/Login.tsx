import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useInput from "../../hooks/useInput";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { ErrorPage } from "../ErrorPage/ErrorPage";
import "./Login.scss";

type LoginProps = {
  setIsUserLoggedIn: (value:boolean) => void;
}

export const Login: React.FC<LoginProps> = ({setIsUserLoggedIn}) => {
  const usernameInput = useInput("login");
  const passwordInput = useInput("login");

  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);

  const [error, setError] = useState({ code: "", message: "" });

  const navigate = useNavigate();

  useEffect(() => {
    if (
      usernameInput.error == "" &&
      passwordInput.error == ""
    ) {
      setIsButtonActive(true);
    } else {
      setIsButtonActive(false);
    }
  }, [usernameInput, passwordInput]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsButtonActive(false);
    console.log("submit login form");

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
        // In case login successfully
        const data = await response.json();
        console.log(data); // message: Logged in successfully
        setIsUserLoggedIn(true);
        navigate("/");
      } else {
        const error = await response.json();
        setError(error);
      }
    } catch (error) {
      setError({ code: "400", message: "An error ocurred" });
    }
    setIsButtonActive(true);
  };

  return (
    <>
      {error.message == "" ? (
        <form onSubmit={handleSubmit}>
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
