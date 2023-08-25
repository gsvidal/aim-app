import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import viteLogo from '/vite.svg'
import './App.scss'

type Obj = {
  text: string
}

function App() {
  const [message, setMessage] = useState<Obj>({text: ""});

  const { text } = message

  const apiUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchMessage = async () => {
      const response = await fetch(`${apiUrl}/login`);
      const data = await response.json();
      setMessage(data);
    }
    fetchMessage();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />}/>
      <Route path="/login" element={<p className="para">hello there</p>}/>
    </Routes>
  )
}

export default App
