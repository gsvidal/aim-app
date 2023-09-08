import { AuthForm } from "../AuthForm/AuthForm";

type RegisterProps = {
  setIsUserLoggedIn: (value: boolean) => void;
  setToastMessage: (value: string) => void;
  setToken: (value: string) => void;
};

export const Register: React.FC<RegisterProps> = ({
  setIsUserLoggedIn,
  setToastMessage,
  setToken,
}) => {
  return (
    <AuthForm
      formType="register"
      setIsUserLoggedIn={setIsUserLoggedIn}
      setToastMessage={setToastMessage}
      setToken={setToken}
    />
  );
};
