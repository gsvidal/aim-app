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
import { NotFound } from "./components/NotFound/NotFound";

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
    setIsLoading(false);
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    setIsUserLoggedIn(storedIsLoggedIn === "true");

    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      console.log("there's a token");
      setToken(storedToken);
    } else {
      console.log("there's not a token");
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchUserData(token);
      if (data) {
        console.log("got data from server");
        setAppData(data);
      } else {
        localStorage.setItem("token", "");
        setToken("");
        localStorage.setItem("isLoggedIn", "false");
        setIsUserLoggedIn(false);
      }
      // console.log("setIsLoading false");
      setIsLoading(false);
    }
    if (isUserLoggedIn && token) {
      console.log("isUserLoggedIn");
      setIsLoading(true);
      fetchData();
    }
    console.log(localStorage);
  }, [isUserLoggedIn, token]);

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
            <Route
              path="*"
              element={
                <NotFound />
              }
            />
          </Routes>
        )}
      </main>
    </>
  );
}

export default App;
