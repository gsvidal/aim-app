import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { Login } from "./components/Login/Login";
import { Register } from "./components/Register/Register";
import { Header } from "./components/Header/Header";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { Loader } from "./components/Loader/Loader";
import { Toast } from "./components/Toast/Toast";

// import viteLogo from "/vite.svg";
import "./App.scss";
import { ReactionTime } from "./components/ReactionTime/ReactionTime";
import { AppDataResponseObj, fetchUserData } from "./api/adapter";

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string>("");

  const [appData, setAppData] = useState<AppDataResponseObj>({
    username: "",
    userData: [],
    skillsData: [],
  });

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    setIsUserLoggedIn(storedIsLoggedIn === "true");

    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
    }
    if (isUserLoggedIn === true && token) {
      console.log("both states ok")
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchUserData(token);
      if (data) {
        setAppData(data);
      } else {
        setIsUserLoggedIn(false);
      }
      setIsLoading(false);
    }
    if (isUserLoggedIn) {
      setIsLoading(true);

      fetchData();
    }
  }, [isUserLoggedIn]);

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
            <Route
              path="/"
              element={
                <Dashboard isUserLoggedIn={isUserLoggedIn} appData={appData} />
              }
            />
            <Route
              path="/reaction-time"
              element={<ReactionTime token={token} />}
            />
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
