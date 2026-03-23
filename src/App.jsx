import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Gamepad2 } from "lucide-react";
import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";
import FAQPage from "./pages/FAQPage";
import RulesPage from "./pages/RulesPage";
import DailyChallengesPage from "./pages/DailyChallengesPage";
import GameOfDayPage from "./pages/GameOfDayPage";
import Sudoku from "./games/sudoku/Sudoku";
import Chess from "./games/chess/Chess";
import Wordle from "./games/wordle/Wordle";
import TicTacToe from "./games/tictactoe/TicTacToe";
import MathSpeedChallenge from "./games/mathspeed/MathSpeedChallenge";
import AdBanner from "./components/layout/AdBanner";
import { PremiumProvider } from "./context/PremiumContext";
import { PlayerProvider, usePlayer } from "./context/PlayerContext";
import PlayerNameModal from "./components/modals/PlayerNameModal";
import { Link } from "react-router-dom";
import "./styles/App.css";

function AppInner() {
  const { playerName } = usePlayer();
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="app-layout">
          <aside className="ad-sidebar ad-sidebar-left">
            <AdBanner slot="sidebar" />
          </aside>
          <main className="game-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/daily-challenges"
                element={<DailyChallengesPage />}
              />
              <Route path="/game-of-the-day" element={<GameOfDayPage />} />
              <Route path="/faqs" element={<FAQPage />} />
              <Route path="/rules" element={<RulesPage />} />
              <Route path="/sudoku" element={<Sudoku />} />
              <Route path="/chess" element={<Chess />} />
              <Route path="/wordle" element={<Wordle />} />
              <Route path="/tictactoe" element={<TicTacToe />} />
              <Route path="/mathspeed" element={<MathSpeedChallenge />} />
            </Routes>
          </main>
          <aside className="ad-sidebar ad-sidebar-right">
            <AdBanner slot="sidebar" />
          </aside>
        </div>
        <footer className="app-footer">
          <p>
            &copy; 2024 Playntric. Have fun playing! <Gamepad2 size={14} />
          </p>
          <div className="footer-links">
            <Link to="/faqs">FAQs</Link>
            <Link to="/rules">Rules of the Game</Link>
          </div>
        </footer>
        {!playerName && <PlayerNameModal />}
      </div>
    </Router>
  );
}

function App() {
  return (
    <PlayerProvider>
      <PremiumProvider>
        <AppInner />
      </PremiumProvider>
    </PlayerProvider>
  );
}

export default App;
