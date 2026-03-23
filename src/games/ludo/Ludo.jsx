import React, { useState } from "react";
import "./Ludo.css";

export default function Ludo() {
  const [gameState, setGameState] = useState("start");
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValue, setDiceValue] = useState(0);
  const [positions, setPositions] = useState([
    { positions: [0, 0, 0, 0], color: "red" },
    { positions: [0, 0, 0, 0], color: "yellow" },
    { positions: [0, 0, 0, 0], color: "blue" },
    { positions: [0, 0, 0, 0], color: "green" },
  ]);

  const players = [
    "Player 1 (Red)",
    "Player 2 (Yellow)",
    "Player 3 (Blue)",
    "Player 4 (Green)",
  ];
  const colors = ["#FF4444", "#FFDD44", "#4444FF", "#44CC44"];

  const rollDice = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceValue(roll);

    // Simple movement logic
    const newPositions = [...positions];
    newPositions[currentPlayer].positions[0] =
      (newPositions[currentPlayer].positions[0] + roll) % 52;
    setPositions(newPositions);

    // Move to next player after a delay
    setTimeout(() => {
      setCurrentPlayer((prev) => (prev + 1) % 4);
    }, 1000);
  };

  const startGame = () => {
    setGameState("playing");
    setCurrentPlayer(0);
  };

  const resetGame = () => {
    setGameState("start");
    setCurrentPlayer(0);
    setDiceValue(0);
    setPositions([
      { positions: [0, 0, 0, 0], color: "red" },
      { positions: [0, 0, 0, 0], color: "yellow" },
      { positions: [0, 0, 0, 0], color: "blue" },
      { positions: [0, 0, 0, 0], color: "green" },
    ]);
  };

  return (
    <div className="ludo-container">
      <h2>Ludo Game</h2>
      <p className="game-description">
        Roll the dice and move your pieces to reach home
      </p>

      {gameState === "start" ? (
        <div className="start-screen">
          <p className="info-text">
            Welcome to Ludo! Roll the dice to move your pieces from start to
            home.
          </p>
          <button className="start-button" onClick={startGame}>
            Start Game
          </button>
        </div>
      ) : (
        <div className="game-play">
          <div className="game-info">
            <p className="current-player">
              Current Player:{" "}
              <span style={{ color: colors[currentPlayer] }}>
                {players[currentPlayer]}
              </span>
            </p>
            <p className="dice-value">
              Last Dice Roll: <strong>{diceValue}</strong>
            </p>
          </div>

          <div className="ludo-board">
            <div className="board-grid">
              {[...Array(52)].map((_, i) => (
                <div key={i} className="board-cell">
                  {i}
                </div>
              ))}
            </div>

            <div className="players-positions">
              {positions.map((player, idx) => (
                <div key={idx} className="player-info">
                  <div
                    className="player-color"
                    style={{ backgroundColor: colors[idx] }}
                  ></div>
                  <p>{players[idx]}</p>
                  <p className="position">Position: {player.positions[0]}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="controls">
            <button className="dice-button" onClick={rollDice}>
              🎲 Roll Dice
            </button>
            <button className="reset-button" onClick={resetGame}>
              Reset Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
