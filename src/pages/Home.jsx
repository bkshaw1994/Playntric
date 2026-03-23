import React from "react";
import { Link } from "react-router-dom";
import {
  Gamepad2,
  ArrowRight,
  Grid3x3,
  Dices,
  Crown,
  BookOpen,
  Hash,
  Calculator,
} from "lucide-react";
import "../styles/Home.css";

export default function Home() {
  const games = [
    {
      name: "Sudoku",
      icon: "🧩",
      path: "/sudoku",
      description: "Solve classic number puzzles",
      color: "#667eea",
    },
    {
      name: "Chess",
      icon: "♟️",
      path: "/chess",
      description: "Strategic board game with AI",
      color: "#f093fb",
    },
    {
      name: "Wordle",
      icon: "📝",
      path: "/wordle",
      description: "Guess the 5-letter word",
      color: "#4facfe",
    },
    {
      name: "Tic Tac Toe",
      icon: "⭕",
      path: "/tictactoe",
      description: "Classic game with AI or local play",
      color: "#43e97b",
    },
    {
      name: "Math Speed Challenge",
      icon: "🧮",
      path: "/mathspeed",
      description: "Solve math problems quickly",
      color: "#2ecc71",
    },
  ];

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>
          <Gamepad2 size={32} /> Playntric
        </h1>
        <p className="home-subtitle">Play your favorite games online</p>
      </div>

      <div className="games-grid">
        {games.map((game) => (
          <Link to={game.path} key={game.name} className="game-card-link">
            <div className="game-card" style={{ borderTopColor: game.color }}>
              <div className="game-icon">{game.icon}</div>
              <h3 className="game-name">{game.name}</h3>
              <p className="game-description">{game.description}</p>
              <span className="play-button">
                Play Now <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="home-footer">
        <p>Choose a game to start playing!</p>
      </div>
    </div>
  );
}
