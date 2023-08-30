import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { Login } from "./components/Login/Login";
import { Register } from "./components/Register/Register";
import { Header } from "./components/Header/Header";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { Loader } from "./components/Loader/Loader";
import { Toast } from "./components/Toast/Toast";

import viteLogo from "/vite.svg";
import "./App.scss";

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);

  const [toastMessage, setToastMessage] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [token, setToken] = useState<string>("");

  useEffect(() => {
    // console.log("app mounted")
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    setIsUserLoggedIn(storedIsLoggedIn === "true");

    const storedToken = localStorage.getItem("token");
    // console.log("token stored in local inside effect:", storedToken)
    if (storedToken) {
      setToken(storedToken);
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {toastMessage && <Toast>{toastMessage}</Toast>}
      <Header
        isUserLoggedIn={isUserLoggedIn}
        setIsUserLoggedIn={setIsUserLoggedIn}
        setToastMessage={setToastMessage}
        token={token}
        setToken={setToken}
      />
      <main>
        {isUserLoggedIn ? (
          <Routes>
            <Route path="/" element={<Dashboard token={token} />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route
              path="/login"
              element={
                <Login
                  setIsUserLoggedIn={setIsUserLoggedIn}
                  setToastMessage={setToastMessage}
                  setToken={setToken}
                />
              }
            />
            <Route
              path="/register"
              element={
                <Register
                  setIsUserLoggedIn={setIsUserLoggedIn}
                  setToastMessage={setToastMessage}
                  setToken={setToken}
                />
              }
            />
          </Routes>
        )}
      </main>
    </>
  );
}

export default App;
