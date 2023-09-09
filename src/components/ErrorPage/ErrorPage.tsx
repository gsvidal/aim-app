import "./ErrorPage.scss";

type ErrorPageProps = {
  error: {
    code: string;
    message: string;
  };
};

export const ErrorPage: React.FC<ErrorPageProps> = ({ error }) => {
  const { code, message } = error;

  return (
    <section className="error__page">
      <h1 className="error__title">Something went wrong!</h1>
      <span className="error__text error__text--code">{code}</span>
      <img
        alt={code}
        className="error__image"
        src="https://i.postimg.cc/VstTCh0P/error-page.png"
        width="400"
        title={message}
      />
      <span className="error__text error__text--message">{message}</span>
    </section>
  );
};
