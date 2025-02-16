import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex justify-center items-center h-screen flex-col">
        <h1 className="text-4xl font-bold my-5">
          Hello Welcome to <span className="bg-blue-500 rounded text-white px-3 py-2">Frontend</span>
        </h1>
      </div>
    </>
  )
}

export default App
