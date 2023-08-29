import "./Button.scss";

type ButtonProps = {
  children: string;
  isButtonActive?: boolean;
  type?: string;
};

export const Button: React.FC<ButtonProps> = ({ children, isButtonActive, type }) => {

  // put disables={!isButt} when logs in correctly and get success message
  return <button className={`button button--${type}`}>{children}</button>;
};
