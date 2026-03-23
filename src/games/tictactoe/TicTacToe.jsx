import React, { useState, useEffect, useRef } from "react";
import "./TicTacToe.css";
import { Bot, Users, Globe } from "lucide-react";
import { usePlayer } from "../../context/PlayerContext";
import { saveScore } from "../../components/common/Leaderboard";

export default function TicTacToe() {
  const [gameMode, setGameMode] = useState(null); // 'bot', 'local', 'online'
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameStatus, setGameStatus] = useState("playing"); // 'playing', 'won', 'draw'
  const [winner, setWinner] = useState(null);
  const [playerSymbols, setPlayerSymbols] = useState({
    X: "Player 1",
    O: "Player 2",
  });
  const [onlineCode, setOnlineCode] = useState("");
  const [gameHistoy, setGameHistory] = useState([]);
  const { playerName } = usePlayer();
  const scoreSavedRef = useRef(false);

  useEffect(() => {
    if (gameMode === "bot" && !isXNext && gameStatus === "playing") {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isXNext, gameMode, gameStatus, board]);

  // Save score when game is won
  useEffect(() => {
    if (gameStatus === "won" && !scoreSavedRef.current) {
      scoreSavedRef.current = true;
      // In bot mode human plays X; in local/online mode always credit playerName
      const humanWon = gameMode === "bot" ? winner === "X" : true;
      if (humanWon && playerName) {
        const winsKey = `ttt_wins_${playerName.toLowerCase()}`;
        const wins = parseInt(localStorage.getItem(winsKey) || "0") + 1;
        localStorage.setItem(winsKey, String(wins));
        saveScore("tictactoe", { name: playerName, score: wins * 100 });
      }
    }
  }, [gameStatus]);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  const isBoardFull = (squares) => squares.every((square) => square !== null);

  const makeAIMove = () => {
    const emptySquares = board
      .map((square, idx) => (square === null ? idx : null))
      .filter((val) => val !== null);

    if (emptySquares.length === 0) return;

    // Simple AI logic
    const winningMove = findWinningMove(board, "O");
    if (winningMove !== null) {
      playMove(winningMove);
      return;
    }

    const blockingMove = findWinningMove(board, "X");
    if (blockingMove !== null) {
      playMove(blockingMove);
      return;
    }

    // Take center if available
    if (board[4] === null) {
      playMove(4);
      return;
    }

    // Take corners
    const corners = [0, 2, 6, 8].filter((idx) => board[idx] === null);
    if (corners.length > 0) {
      playMove(corners[Math.floor(Math.random() * corners.length)]);
      return;
    }

    // Take any available
    playMove(emptySquares[Math.floor(Math.random() * emptySquares.length)]);
  };

  const findWinningMove = (squares, player) => {
    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        const testBoard = [...squares];
        testBoard[i] = player;
        if (calculateWinner(testBoard) === player) {
          return i;
        }
      }
    }
    return null;
  };

  const playMove = (index) => {
    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);

    const gameWinner = calculateWinner(newBoard);
    const isFull = isBoardFull(newBoard);

    if (gameWinner) {
      setWinner(gameWinner);
      setGameStatus("won");
    } else if (isFull) {
      setGameStatus("draw");
    }

    setIsXNext(!isXNext);
  };

  const handleSquareClick = (index) => {
    if (board[index] !== null || gameStatus !== "playing") return;

    if (gameMode === "bot" && !isXNext) return;

    playMove(index);
  };

  const resetGame = () => {
    scoreSavedRef.current = false;
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameStatus("playing");
    setWinner(null);
  };

  const startGame = (mode) => {
    setGameMode(mode);
    if (mode === "online") {
      setOnlineCode(Math.random().toString(36).substring(2, 8).toUpperCase());
    }
    resetGame();
  };

  const getStatusMessage = () => {
    if (gameStatus === "won") {
      if (gameMode === "bot" && winner === "O") {
        return "🤖 AI won! Better luck next time.";
      }
      return `🎉 ${winner === "X" ? playerSymbols.X : playerSymbols.O} won!`;
    }
    if (gameStatus === "draw") {
      return "It's a draw!";
    }
    const currentPlayer = isXNext ? playerSymbols.X : playerSymbols.O;
    return `Current: ${currentPlayer}`;
  };

  if (!gameMode) {
    return (
      <div className="tictactoe-container">
        <h2>Tic Tac Toe</h2>
        <p className="game-description">Choose your game mode</p>

        <div className="mode-selection">
          <button className="mode-button" onClick={() => startGame("bot")}>
            <div className="mode-icon">
              <Bot size={36} />
            </div>
            <div className="mode-name">Play vs Bot</div>
            <div className="mode-desc">Challenge the AI</div>
          </button>

          <button className="mode-button" onClick={() => startGame("local")}>
            <div className="mode-icon">
              <Users size={36} />
            </div>
            <div className="mode-name">Local Player</div>
            <div className="mode-desc">Two players on same device</div>
          </button>

          <button className="mode-button" onClick={() => startGame("online")}>
            <div className="mode-icon">
              <Globe size={36} />
            </div>
            <div className="mode-name">Online Players</div>
            <div className="mode-desc">Play with friends online</div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tictactoe-container">
      <h2>
        Tic Tac Toe -{" "}
        {gameMode === "bot"
          ? "vs Bot"
          : gameMode === "local"
            ? "Local"
            : "Online"}
      </h2>

      {gameMode === "online" && (
        <div className="online-info">
          <p>
            Game Code: <strong>{onlineCode}</strong>
          </p>
          <p className="online-note">
            Share this code with your friend to join
          </p>
        </div>
      )}

      <div className="game-status">
        <p className="status-text">{getStatusMessage()}</p>
      </div>

      <div className="board">
        {board.map((value, index) => (
          <button
            key={index}
            className={`square ${value}`}
            onClick={() => handleSquareClick(index)}
            disabled={
              gameMode === "bot" && !isXNext && gameStatus === "playing"
            }
          >
            {value && <span className="symbol">{value}</span>}
          </button>
        ))}
      </div>

      <div className="game-controls">
        <button className="reset-button" onClick={resetGame}>
          New Game
        </button>
        <button className="back-button" onClick={() => setGameMode(null)}>
          Back to Modes
        </button>
      </div>

      {gameMode === "online" && (
        <div className="online-beta">
          <p>ℹ️ Online multiplayer is in beta. Feature coming soon!</p>
        </div>
      )}
    </div>
  );
}
