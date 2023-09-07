import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

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
import { Aim } from "./components/Aim/Aim";
import { Positions } from "./components/Positions/Positions";

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string>("");
  const [hasExistedToken, setHasExistedToken] = useState<boolean>(false);
  const [userTheme, setUserTheme] = useState<string>("#359e81");

  const [appData, setAppData] = useState<AppDataResponseObj>({
    username: "",
    userData: [],
    skillsData: [],
  });
  const navigate = useNavigate();

  const { username } = appData;

  useEffect(() => {
    setIsLoading(false);
    // Load from local storage to states
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    setIsUserLoggedIn(storedIsLoggedIn === "true");

    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      console.log("there's a token");
      setToken(storedToken);
      setHasExistedToken(true);
    } else {
      console.log("there's not a token");
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchUserData(token);
      if (data) {
        console.log(data);
        console.log("got data from server");
        setAppData(data);
      } else {
        localStorage.setItem("token", "");
        setToken("");
        localStorage.setItem("isLoggedIn", "false");
        setIsUserLoggedIn(false);
      }
      setIsLoading(false);
    }
    if (isUserLoggedIn && token) {
      console.log("isUserLoggedIn");
      setIsLoading(true);
      fetchData();
      const storedTheme = localStorage.getItem("colorTheme");
      storedTheme && setUserTheme(storedTheme);
    }
  }, [isUserLoggedIn, token]);

  useEffect(() => {
    if (!token && hasExistedToken) {
      console.log("there's no more token...Redirecting to the Login page");
      navigate("/");
    }
  }, [token, hasExistedToken]);

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
        username={username}
        userTheme={userTheme}
        setUserTheme={setUserTheme}
      />
      <main>
        {isUserLoggedIn ? (
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  isUserLoggedIn={isUserLoggedIn}
                  appData={appData}
                  userTheme={userTheme}
                />
              }
            />
            <Route
              path="/reaction-time"
              element={<ReactionTime token={token} />}
            />
            <Route path="/aim" element={<Aim token={token} />} />
            <Route path="/positions" element={<Positions token={token} />} />
            {/* We can also Navigate to="/" */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        ) : (
          <Routes>
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
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </main>
    </>
  );
}

export default App;
