import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import viteLogo from "/vite.svg";
import "./App.scss";
import { Login } from "./components/Login/Login";
import { Register } from "./components/Register/Register";

type Obj = {
  text: string;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
