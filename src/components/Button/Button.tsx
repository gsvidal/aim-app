import "./Button.scss";

type ButtonProps = {
  children: string;
  isButtonActive: boolean;
};

export const Button: React.FC<ButtonProps> = ({ children, isButtonActive }) => {

  // put disables={!isButt} when logs in correctly and get success message
  return <button className="button">{children}</button>;
};
