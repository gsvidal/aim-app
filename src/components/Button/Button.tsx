import "./Button.scss";

type ButtonProps = {
  children: string;
  isButtonActive: boolean;
};

export const Button: React.FC<ButtonProps> = ({ children, isButtonActive }) => {
  console.log(isButtonActive);
  return (
    <button className="button" disabled={!isButtonActive}>
      {children}
    </button>
  );
};
