import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useInput from "../../hooks/useInput";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { ErrorPage } from "../ErrorPage/ErrorPage";
import "./Login.scss";
import { Loader } from "../Loader/Loader";

type LoginProps = {
  setIsUserLoggedIn: (value: boolean) => void;
  setToastMessage: (value: string) => void;
  setToken: (value: string) => void;
};

export const Login: React.FC<LoginProps> = ({
  setIsUserLoggedIn,
  setToastMessage,
  setToken
}) => {
  const usernameInput = useInput("login");
  const passwordInput = useInput("login");

  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);

  const [error, setError] = useState({ code: "", message: "" });
  const [clientError, setClientError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (usernameInput.error == "" && passwordInput.error == "") {
      setIsButtonActive(true);
    } else {
      setIsButtonActive(false);
    }
  }, [usernameInput, passwordInput]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsButtonActive(false);
    setIsLoading(true);

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
        // console.log(data)
        setToastMessage(data.message); // message: Logged in successfully
        // console.log(data.message)
        console.log(`received token (login) of ${usernameInput}:`, data["access_token"]);
        localStorage.setItem("token", data["access_token"]);
        setToken(data["access_token"]);
        localStorage.setItem("isLoggedIn", "true");
        setIsUserLoggedIn(true);
        navigate("/");
      } else {
        const error = await response.json();
        // setError(error); TODO
        setClientError(error.message);
      }
    } catch (error) {
      setError({ code: "400", message: "An error ocurred" });
      setIsLoading(false);
    }
    setIsButtonActive(true);
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {error.message == "" ? (
        <>
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
              {clientError && <p className="client-error">{clientError}</p>}
            </fieldset>
          </form>
        </>
      ) : (
        <ErrorPage error={error} />
      )}
    </>
  );
};
