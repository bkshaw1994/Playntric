import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Gamepad2, User, Pencil } from "lucide-react";
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
          <Link to="/" className="navbar-brand">
            <h1>
              <Gamepad2 size={22} /> Playntric
            </h1>
          </Link>

          <div className="navbar-sections" aria-label="Main sections">
            <Link
              to="/daily-challenges"
              className={`nav-button ${isActive("/daily-challenges") ? "active" : ""}`}
            >
              Daily Challenges
            </Link>
            <Link
              to="/game-of-the-day"
              className={`nav-button ${isActive("/game-of-the-day") ? "active" : ""}`}
            >
              Game of the Day
            </Link>
          </div>

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
          </div>
        </div>
      </nav>
      {showNameEdit && (
        <PlayerNameModal onClose={() => setShowNameEdit(false)} />
      )}
    </>
  );
}
