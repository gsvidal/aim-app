import { useEffect, useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

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
    <>
      <p>This is the first step</p>
      <p>Message from the backend: {text}</p>
    </>
  )
}

export default App
