import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Gamepad2, User, Pencil, LogIn, LogOut, ChevronDown } from "lucide-react";
import { usePlayer } from "../../context/PlayerContext";
import { useAuth } from "../../context/AuthContext";
import PlayerNameModal from "../modals/PlayerNameModal";
import LoginModal from "../modals/LoginModal";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const { playerName } = usePlayer();
  const { user, isAuthenticated, logout } = useAuth();

  const [showNameEdit, setShowNameEdit] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

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
            {isAuthenticated && user ? (
              <div className="user-profile-menu">
                <button
                  className="nav-user-badge"
                  onClick={() => setShowDropdown(!showDropdown)}
                  title="Account Settings"
                >
                  <span className="user-avatar-small">
                    {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                  </span>
                  <span className="user-name-text">{user.username}</span>
                  <ChevronDown size={14} />
                </button>

                {showDropdown && (
                  <div
                    className="user-dropdown-menu"
                    onMouseLeave={() => setShowDropdown(false)}
                  >
                    <div className="dropdown-user-header">
                      <p className="dropdown-username">{user.username}</p>
                      <p className="dropdown-email">{user.email}</p>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link
                      to="/login"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <User size={15} /> Profile Details
                    </Link>
                    <button
                      className="dropdown-item logout-item"
                      onClick={() => {
                        setShowDropdown(false);
                        logout();
                      }}
                    >
                      <LogOut size={15} /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {playerName && (
                  <button
                    className="nav-player-btn"
                    onClick={() => setShowNameEdit(true)}
                    title="Change guest name"
                  >
                    <User size={15} /> {playerName} <Pencil size={12} />
                  </button>
                )}

                <button
                  className="nav-login-btn"
                  onClick={() => setShowLoginModal(true)}
                >
                  <LogIn size={15} /> Log In
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {showNameEdit && (
        <PlayerNameModal onClose={() => setShowNameEdit(false)} />
      )}

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
}
