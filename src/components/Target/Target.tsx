import "./Target.scss";

type TargetProps = {
  type: string;
  userTheme?: string;
  id?: number;
  onInnerCircleClick?: () => void;
};

export const Target: React.FC<TargetProps> = ({
  type,
  userTheme,
  onInnerCircleClick,
}) => {

  const logoCircleColorTheme = {
    borderColor: userTheme,
  };
  const logoCrosshairColorTheme = {
    backgroundColor: userTheme,
  };

  return (
    <div className={`target target--${type}`}>
      <div className={`circle circle--${type}`} style={logoCircleColorTheme}>
        <div
          className={`middle-circle middle-circle--${type}`}
          style={logoCircleColorTheme}
        >
          <div
            className={`inner-circle inner-circle--${type}`}
            style={logoCircleColorTheme}
            onClick={onInnerCircleClick}
          ></div>
        </div>
      </div>
      {type === "header" && (
        <>
          <div className="crosshair" style={logoCrosshairColorTheme}></div>
          <div
            className="crosshair horizontal"
            style={logoCrosshairColorTheme}
          ></div>
        </>
      )}
    </div>
  );
};
