import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import GameMode from "./components/GameMode/GameMode";
import GameBoard from "components/GameBoard/GameBoard";
import Footer from "components/Footer/footer";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path={"/"} element={<HomePage />} />
          <Route exact path={"/gamemode"} element={<GameMode />} />
          <Route exact path={"/game"} element={<GameBoard />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
