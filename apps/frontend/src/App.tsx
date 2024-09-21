import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./screens/Home"
import Game from "./screens/Game"


function App() {

  return (
    <div className= "min-h-screen bg-black" >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/play" element={<Game/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
