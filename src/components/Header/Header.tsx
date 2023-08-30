import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import "./Header.scss";

type HeaderProps = {
  isUserLoggedIn: boolean;
  setIsUserLoggedIn: (value: boolean) => void;
  setToastMessage: (value: string) => void;
  token: string;
  setToken: (value: string) => void;
};

export const Header: React.FC<HeaderProps> = ({
  isUserLoggedIn,
  setIsUserLoggedIn,
  setToastMessage,
  token,
  setToken,
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

  const handleLogout = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    // Logout frontend
    localStorage.setItem("isLoggedIn", "false");
    setIsUserLoggedIn(false);

    // Logout backend
    const response = await fetch(`${apiUrl}/logout`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    localStorage.setItem("token", "");
    setToken("");
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
      <div
        className={`backdrop ${isMenuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      ></div>
      <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
        {isUserLoggedIn && (
          <ul className="nav__menu nav__menu--features">
            <li className="nav__item">
              <Link to="/" className="nav__link" onClick={toggleMenu}>
                My Dashboard
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/rt" className="nav__link" onClick={toggleMenu}>
                RT
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/" className="nav__link" onClick={toggleMenu}>
                Aim
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/" className="nav__link" onClick={toggleMenu}>
                Positions
              </Link>
            </li>
          </ul>
        )}
        <ul className="nav__menu nav__menu--auth">
          {isUserLoggedIn ? (
            <li className="nav__item" onClick={handleLogout}>
              <Link to="/" className="nav__link" onClick={toggleMenu}>
                Logout
              </Link>
            </li>
          ) : (
            <>
              <li className="nav__item">
                <Link to="/register" className="nav__link" onClick={toggleMenu}>
                  Register
                </Link>
              </li>
              <li className="nav__item">
                <Link to="/login" className="nav__link" onClick={toggleMenu}>
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
