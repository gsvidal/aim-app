import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useInput from "../../hooks/useInput";

import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import { ErrorPage } from "../ErrorPage/ErrorPage";
import { Loader } from "../Loader/Loader";

import "./AuthForm.scss";

type AuthFormProps = {
  formType: string;
  setIsUserLoggedIn: (value: boolean) => void;
  setToastMessage: (value: string) => void;
  setToken: (value: string) => void;
};

export const AuthForm: React.FC<AuthFormProps> = ({
  formType,
  setIsUserLoggedIn,
  setToastMessage,
  setToken,
}) => {
  const usernameInput = useInput(formType);
  const passwordInput = useInput(formType);
  const passwordConfirmationInput =
    formType === "register" ? useInput("register") : null;

  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);

  const [error, setError] = useState({ code: "", message: "" });
  const [clientError, setClientError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (
      usernameInput.error == "" &&
      passwordInput.error == "" &&
      formType === "register" &&
      passwordConfirmationInput?.error == ""
    ) {
      setIsButtonActive(true);
    } else {
      setIsButtonActive(false);
    }
  }, [usernameInput, passwordInput, passwordConfirmationInput]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsButtonActive(false);
    setIsLoading(true);

    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${apiUrl}/${formType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameInput.value,
          password: passwordInput.value,
          ...(passwordConfirmationInput && {
            "password-confirmation": passwordConfirmationInput.value,
          }),
        }),
      });

      if (response.ok) {
        // In case registered successfully
        const data = await response.json();
        setToastMessage(data.message); // message: Registered successfully
        localStorage.setItem("token", data["access_token"]);
        setToken(data["access_token"]);
        localStorage.setItem("isLoggedIn", "true");
        setIsUserLoggedIn(true);
        navigate("/");
      } else {
        const error = await response.json();
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
        <form onSubmit={handleSubmit} className="glass-container">
          <fieldset>
            <legend>{formType}</legend>
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
            {formType === "register" && (
              <Input
                name="password-confirmation"
                label="Password Confirmation"
                type="password"
                {...passwordConfirmationInput}
              />
            )}

            <Button isButtonActive={isButtonActive}>{formType}</Button>
            {clientError && <p className="client-error">{clientError}</p>}
          </fieldset>
        </form>
      ) : (
        <ErrorPage error={error} />
      )}
    </>
  );
};
