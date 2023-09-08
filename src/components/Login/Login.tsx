import { AuthForm } from "../AuthForm/AuthForm";

type LoginProps = {
  setIsUserLoggedIn: (value: boolean) => void;
  setToastMessage: (value: string) => void;
  setToken: (value: string) => void;
};

export const Login: React.FC<LoginProps> = ({
  setIsUserLoggedIn,
  setToastMessage,
  setToken,
}) => {
  return (
    <AuthForm
      formType="login"
      setIsUserLoggedIn={setIsUserLoggedIn}
      setToastMessage={setToastMessage}
      setToken={setToken}
    />
  );
};
