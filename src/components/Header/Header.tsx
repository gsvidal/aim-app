import { useEffect, useState } from "react";
import "./Header.scss";
import { Link } from "react-router-dom";

type HeaderProps = {
  isUserLoggedIn: boolean;
  setIsUserLoggedIn: (value: boolean) => void;
  setToastMessage: (value: string) => void;
};

export const Header: React.FC<HeaderProps> = ({
  isUserLoggedIn,
  setIsUserLoggedIn,
  setToastMessage,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsMenuOpen((isMenuOpen) => !isMenuOpen);
  };

  // Close Nav bar when window width is greater or equal than 800
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 800) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    // Logout front
    localStorage.setItem("isLoggedIn", "false");
    setIsUserLoggedIn(false);
    // Logout back
    const response = await fetch(`${apiUrl}/logout`);
    const data = await response.json();
    setToastMessage(data.message); // message: Logged out successfully
  };

  return (
    <header className="header">
      <a href="/" className="header__logo">
        <img
          src="/assets/aim-logo-trans.png"
          alt="Aim App"
          className="header__logo-img"
          width="50"
        />
        <p className="header__logo-title">Aim App</p>
      </a>
      <section
        className={`header__menu-toggle ${isMenuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
        <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
        <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
      </section>
      <div className={`backdrop ${isMenuOpen ? "open" : ""}`}></div>
      <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
        {isUserLoggedIn && (
          <ul className="nav__menu nav__menu--features">
            {/* Try an a tag */}
            <li className="nav__item">
              <Link to="/">My Dashboard</Link>
            </li>
            <li className="nav__item">RT</li>
            <li className="nav__item">Aim</li>
            <li className="nav__item">Positions</li>
          </ul>
        )}
        <ul className="nav__menu nav__menu--auth">
          {isUserLoggedIn ? (
            <li className="nav__item" onClick={handleLogout}>
              <Link to="/" onClick={handleCloseMenu}>
                Logout
              </Link>
            </li>
          ) : (
            <>
              <li className="nav__item">
                <Link to="/register" onClick={handleCloseMenu}>
                  Register
                </Link>
              </li>
              <li className="nav__item">
                <Link to="/login" onClick={handleCloseMenu}>
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};