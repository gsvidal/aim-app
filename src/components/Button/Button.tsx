import clickSound from "/assets/click-effect.mp3";
// @ts-ignore
import useSound from "use-sound";

import "./Button.scss";

type ButtonProps = {
  children: string;
  isButtonActive?: boolean;
  type?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  isButtonActive,
  type,
  onClick,
}) => {
  const [playSound] = useSound(clickSound);

  const handleSound = () => {
    if (playSound) {
      playSound();
    }
  };

  return (
    <>
      <button
        className={`button button--${type}`}
        onClick={type === "play" ? handleSound : onClick}
        disabled={children === "register" && !isButtonActive}
      >
        {children}
      </button>
    </>
  );
};
