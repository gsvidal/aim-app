import { ChangeEvent, useEffect, useState } from "react";

import { Link } from "react-router-dom";

import "./Header.scss";
import { Target } from "../Target/Target";

type HeaderProps = {
  isUserLoggedIn: boolean;
  setIsUserLoggedIn: (value: boolean) => void;
  setToastMessage: (value: string) => void;
  token: string;
  setToken: (value: string) => void;
  username: string;
  userTheme: string;
  setUserTheme: (value: string) => void;
};

export const Header: React.FC<HeaderProps> = ({
  isUserLoggedIn,
  setIsUserLoggedIn,
  setToastMessage,
  token,
  setToken,
  username,
  userTheme,
  setUserTheme,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [isThemeOpen, setIsThemeOpen] = useState<boolean>(false);

  const handleSelectTheme = (event: ChangeEvent<HTMLInputElement>) => {
    setUserTheme(event.target.value);
  };

  useEffect(() => {
    if (userTheme !== "#359e81") {
      localStorage.setItem("colorTheme", userTheme);
    }
  }, [userTheme]);

  const toggleThemeMenu = () => {
    setIsThemeOpen(!isThemeOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen((isMenuOpen) => !isMenuOpen);
  };

  // Close Nav bar when window width is greater or equal than 800
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 800) {
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
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
    setUserTheme("#359e81");

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

  const colorTheme = {
    color: userTheme,
  };

  return (
    <header className="header">
      <a href="/aim-app" className="header__logo">
        <Target type="header" userTheme={userTheme} />
        <p className="header__logo-title" style={colorTheme}>
          Aim App
        </p>
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
            <Link to="/" className="nav__link" onClick={toggleMenu}>
              <li className="nav__item">Dashboard</li>
            </Link>
            <Link
              to="/reaction-time"
              className="nav__link"
              onClick={toggleMenu}
            >
              <li className="nav__item">Reaction Time</li>
            </Link>
            <Link to="/aim" className="nav__link" onClick={toggleMenu}>
              <li className="nav__item">Aim</li>
            </Link>
            <Link to="/positions" className="nav__link" onClick={toggleMenu}>
              <li className="nav__item">Positions</li>
            </Link>
          </ul>
        )}
        <ul className="nav__menu nav__menu--auth">
          {isUserLoggedIn ? (
            <div className="nav__username-container">
              <div
                className="nav__username-mini-container"
                onClick={toggleUserMenu}
              >
                <span
                  className={`chevron-icon ${isUserMenuOpen ? "open" : ""}`}
                ></span>
                <p className="nav__username">{username}</p>
              </div>

              <ul
                className={`nav__username-list ${
                  isUserMenuOpen ? "active" : ""
                }`}
              >
                <li className="nav__link theme">
                  <div
                    className="nav__item nav__username-item"
                    onClick={toggleThemeMenu}
                  >
                    <div>My theme</div>
                    <input
                      type="color"
                      className={`input-theme ${isThemeOpen ? "activate" : ""}`}
                      onChange={handleSelectTheme}
                      value={userTheme}
                    />
                  </div>
                </li>
                <Link to="/" className="nav__link" onClick={toggleMenu}>
                  <li
                    className="nav__item nav__username-item"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </Link>
              </ul>
            </div>
          ) : (
            <>
              <Link to="/register" className="nav__link" onClick={toggleMenu}>
                <li className="nav__item">Register</li>
              </Link>
              <Link to="/login" className="nav__link" onClick={toggleMenu}>
                <li className="nav__item">Login</li>
              </Link>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};
