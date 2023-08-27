import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import viteLogo from "/vite.svg";
import "./App.scss";
import { Login } from "./components/Login/Login";
import { Register } from "./components/Register/Register";
import { Header } from "./components/Header/Header";

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);

  return (
    <>
      <Header isUserLoggedIn={isUserLoggedIn}/>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login setIsUserLoggedIn={setIsUserLoggedIn}/>} />
          <Route path="/register" element={<Register setIsUserLoggedIn={setIsUserLoggedIn}/>} />
        </Routes>
      </main>
    </>
  );
}

export default App;
