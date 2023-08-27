import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useInput from "../../hooks/useInput";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import { ErrorPage } from "../ErrorPage/ErrorPage";
import "./Register.scss";

type RegisterProps = {
  setIsUserLoggedIn: (value: boolean) => void;
};

export const Register: React.FC<RegisterProps> = ({ setIsUserLoggedIn }) => {
  const usernameInput = useInput("register");
  const passwordInput = useInput("register");
  const passwordConfirmationInput = useInput("register");

  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);

  const [error, setError] = useState({ code: "", message: "" });

  const navigate = useNavigate();

  useEffect(() => {
    if (
      usernameInput.error == "" &&
      passwordInput.error == "" &&
      passwordConfirmationInput.error == ""
    ) {
      setIsButtonActive(true);
    } else {
      setIsButtonActive(false);
    }
  }, [usernameInput, passwordInput, passwordConfirmationInput]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsButtonActive(false);

    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameInput["value"],
          password: passwordInput["value"],
          "password-confirmation": passwordConfirmationInput["value"],
        }),
      });

      if (response.ok) {
        // In case registered successfully
        const data = await response.json();
        console.log(data); // message: Registered successfully
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
            <legend>REGISTER</legend>
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
            <Input
              name="password-confirmation"
              label="Password Confirmation"
              type="password"
              {...passwordConfirmationInput}
            />
            <Button isButtonActive={isButtonActive}>Register</Button>
          </fieldset>
        </form>
      ) : (
        <ErrorPage error={error} />
      )}
    </>
  );
};
