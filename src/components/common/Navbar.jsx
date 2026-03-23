import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Gamepad2, Trophy, User, Pencil } from "lucide-react";
import { usePlayer } from "../../context/PlayerContext";
import Leaderboard from "./Leaderboard";
import PlayerNameModal from "../modals/PlayerNameModal";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const { playerName } = usePlayer();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showNameEdit, setShowNameEdit] = useState(false);

  const games = [
    { name: "Home", path: "/" },
    { name: "Sudoku", path: "/sudoku" },
    { name: "Chess", path: "/chess" },
    { name: "Wordle", path: "/wordle" },
    { name: "Tic Tac Toe", path: "/tictactoe" },
    { name: "Math Speed", path: "/mathspeed" },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <h1>
              <Gamepad2 size={22} /> Playntric
            </h1>
          </Link>
          <ul className="navbar-menu">
            {games.map((game) => (
              <li key={game.path}>
                <Link
                  to={game.path}
                  className={`nav-button ${location.pathname === game.path ? "active" : ""}`}
                >
                  {game.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="navbar-actions">
            {playerName && (
              <button
                className="nav-player-btn"
                onClick={() => setShowNameEdit(true)}
                title="Change name"
              >
                <User size={15} /> {playerName} <Pencil size={12} />
              </button>
            )}
            <button
              className="nav-lb-btn"
              onClick={() => setShowLeaderboard(true)}
              title="Leaderboard"
            >
              <Trophy size={18} />
            </button>
          </div>
        </div>
      </nav>

      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}
      {showNameEdit && (
        <PlayerNameModal onClose={() => setShowNameEdit(false)} />
      )}
    </>
  );
}
