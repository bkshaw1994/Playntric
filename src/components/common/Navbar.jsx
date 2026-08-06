import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Pencil, Trophy, Sparkles, Gamepad2 } from "lucide-react";
import { usePlayer } from "../../context/PlayerContext";
import PlayerNameModal from "../modals/PlayerNameModal";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const { playerName } = usePlayer();
  const [showNameEdit, setShowNameEdit] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand" title="Playntric Home">
            <img src="/playntric-logo.svg" alt="Playntric Logo" className="brand-logo-img" />
          </Link>

          <div className="navbar-sections" aria-label="Main sections">
            <Link
              to="/"
              className={`nav-button ${isActive("/") ? "active" : ""}`}
            >
              <Gamepad2 size={15} /> All Games
            </Link>
            <Link
              to="/daily-challenges"
              className={`nav-button ${isActive("/daily-challenges") ? "active" : ""}`}
            >
              <Sparkles size={15} /> Daily Challenges
            </Link>
            <Link
              to="/game-of-the-day"
              className={`nav-button ${isActive("/game-of-the-day") ? "active" : ""}`}
            >
              <Trophy size={15} /> Game of the Day
            </Link>
            <Link
              to="/leaderboard"
              className={`nav-button ${isActive("/leaderboard") ? "active" : ""}`}
            >
              Leaderboard
            </Link>
          </div>

          <div className="navbar-actions">
            {playerName && (
              <button
                type="button"
                className="nav-player-btn"
                onClick={() => setShowNameEdit(true)}
                title="Change gamer name"
              >
                <span className="player-avatar-badge">
                  {playerName.charAt(0).toUpperCase()}
                </span>
                <span className="player-name-val">{playerName}</span>
                <Pencil size={12} className="edit-icon" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {showNameEdit && (
        <PlayerNameModal onClose={() => setShowNameEdit(false)} />
      )}
    </>
  );
}
