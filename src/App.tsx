import { useEffect, useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

type Obj = {
  text: string
}

function App() {
  const [message, setMessage] = useState<Obj>({text: ""});

  const { text } = message

  useEffect(() => {
    const fetchMessage = async () => {
      const response = await fetch('http://127.0.0.1:5000/login');
      const data = await response.json();
      setMessage(data);
    }
    fetchMessage();
  }, []);

  return (
    <>
      <p>This is the first step</p>
      <p>Message from the backend: {text}</p>
    </>
  )
}

export default App
