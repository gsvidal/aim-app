import "./Header.scss";

type HeaderProps = {
  isUserLoggedIn: boolean;
};

export const Header: React.FC<HeaderProps> = ({ isUserLoggedIn }) => {
  return (
    <header className="header">
      <a href="/">
        <img
          src="/assets/aim-logo-trans.png"
          alt="Aim App"
          className="header__img"
          width="50"
        />
        <p>Aim App</p>
      </a>
      <nav className="nav">
        {isUserLoggedIn && (
          <ul className="nav__menu nav__menu--features">
            <li className="nav_item">My Dashboard</li>
            <li className="nav_item">RT</li>
            <li className="nav_item">Aim</li>
            <li className="nav_item">Positions</li>
          </ul>
        )}
        <ul className="nav__menu nav__menu--auth">
          {isUserLoggedIn ? (
            <li className="nav_item">Log out</li>
          ) : (
            <>
              <li className="nav_item">Register</li>
              <li className="nav_item">Login</li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};
