import "./Button.scss";

type ButtonProps = {
  children: string;
  isButtonActive?: boolean;
  type?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
};

export const Button: React.FC<ButtonProps> = ({ children, isButtonActive, type, onClick }) => {

  // put disables={!isButt} when logs in correctly and get success message
  return <button className={`button button--${type}`} onClick={onClick}>{children}</button>;
};
