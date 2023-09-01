import { Link } from "react-router-dom";
import { Button } from "../Button/Button";
import "./NotFound.scss";

export const NotFound: React.FC = () => {
  return (
    <section className="not-found glass-container">
      <img
        src="https://i.postimg.cc/J0dbnrtF/not-found.png"
        alt="Not Found"
        width="800"
      />
      <div className="not-found__copy">
        <h1>404 Page not found</h1>
        <h2>Woops!, looks like this page doesn't exist.</h2>
        <Link to="/">
          <Button>Go to Home Page</Button>
        </Link>
      </div>
    </section>
  );
};
