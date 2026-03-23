import React, { useState, useEffect, useRef } from "react";
import "./Chess.css";
import { usePremium } from "../../context/PremiumContext";
import { Bot, Users, Globe, Lock } from "lucide-react";
import Seo from "../../components/common/Seo";
import { usePlayer } from "../../context/PlayerContext";
import { saveScore } from "../../components/common/Leaderboard";

export default function Chess() {
  const { isPremium, chessTheme, updateChessTheme } = usePremium();
  const { playerName } = usePlayer();
  const scoreSavedRef = useRef(false);
  const [gameMode, setGameMode] = useState(null); // 'bot', 'local', 'online'
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("white");
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameStatus, setGameStatus] = useState("playing"); // 'playing', 'checkmate', 'check', 'stalemate'
  const [onlineCode, setOnlineCode] = useState("");
  const [validMoves, setValidMoves] = useState([]);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: "Playntric Chess",
    url: "https://playntric.vercel.app/chess",
    description:
      "Play free online chess on Playntric against a bot or locally with move tracking and board themes.",
    genre: ["Strategy", "Board Game"],
    applicationCategory: "Game",
    operatingSystem: "Any",
  };

  useEffect(() => {
    if (gameMode) {
      initializeGame();
    }
  }, [gameMode]);

  // Save score when game ends with checkmate
  useEffect(() => {
    if (gameStatus === "checkmate" && !scoreSavedRef.current) {
      scoreSavedRef.current = true;
      // currentPlayer is the checkmated (losing) side; winner is opposite
      const winner = currentPlayer === "white" ? "black" : "white";
      const humanWon = gameMode === "bot" ? winner === "white" : true;
      if (humanWon && playerName) {
        const winsKey = `chess_wins_${playerName.toLowerCase()}`;
        const wins = parseInt(localStorage.getItem(winsKey) || "0") + 1;
        localStorage.setItem(winsKey, String(wins));
        saveScore("chess", { name: playerName, score: wins * 100 });
      }
    }
  }, [gameStatus]);

  useEffect(() => {
    if (
      gameMode === "bot" &&
      currentPlayer === "black" &&
      (gameStatus === "playing" || gameStatus === "check")
    ) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameMode, gameStatus]);

  function initializeBoard() {
    const emptyBoard = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));

    // Setup black pieces
    emptyBoard[0] = ["r", "n", "b", "q", "k", "b", "n", "r"].map((p) => ({
      piece: p,
      color: "black",
    }));
    for (let i = 0; i < 8; i++) {
      emptyBoard[1][i] = { piece: "p", color: "black" };
    }

    // Setup white pieces
    for (let i = 0; i < 8; i++) {
      emptyBoard[6][i] = { piece: "P", color: "white" };
    }
    emptyBoard[7] = ["R", "N", "B", "Q", "K", "B", "N", "R"].map((p) => ({
      piece: p,
      color: "white",
    }));

    return emptyBoard;
  }

  const initializeGame = () => {
    scoreSavedRef.current = false;
    if (gameMode === "online") {
      setOnlineCode(Math.random().toString(36).substring(2, 8).toUpperCase());
    }
    setBoard(initializeBoard());
    setSelectedSquare(null);
    setCurrentPlayer("white");
    setMoveHistory([]);
    setGameStatus("playing");
    setValidMoves([]);
  };

  const getPieceValue = (piece) => {
    const values = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 1000 };
    return values[piece.toUpperCase()] || 0;
  };

  const isSquareAttackedByColor = (row, col, byColor, testBoard = null) => {
    const boardToUse = testBoard || board;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = boardToUse[r][c];
        if (piece && piece.color === byColor) {
          const moves = getValidMovesForPiece(r, c, boardToUse);
          if (moves.some((m) => m.to[0] === row && m.to[1] === col)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const findKingPosition = (color, testBoard = null) => {
    const boardToUse = testBoard || board;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (
          boardToUse[r][c]?.piece.toUpperCase() === "K" &&
          boardToUse[r][c]?.color === color
        ) {
          return [r, c];
        }
      }
    }
    return null;
  };

  const isKingInCheck = (color, testBoard = null) => {
    const kingPos = findKingPosition(color, testBoard);
    if (!kingPos) return false;
    const enemyColor = color === "white" ? "black" : "white";
    return isSquareAttackedByColor(
      kingPos[0],
      kingPos[1],
      enemyColor,
      testBoard,
    );
  };

  const isCheckmate = (color, testBoard = null) => {
    if (!isKingInCheck(color, testBoard)) return false;

    const allMoves = getAllPossibleMoves(color, testBoard);

    for (const move of allMoves) {
      const newBoard = (testBoard || board).map((r) => [...r]);
      const piece = newBoard[move.from[0]][move.from[1]];
      newBoard[move.to[0]][move.to[1]] = piece;
      newBoard[move.from[0]][move.from[1]] = null;

      if (!isKingInCheck(color, newBoard)) {
        return false;
      }
    }

    return true;
  };

  const isStalemate = (color, testBoard = null) => {
    if (isKingInCheck(color, testBoard)) return false;

    const allMoves = getAllPossibleMoves(color, testBoard);
    return allMoves.length === 0;
  };

  const makeAIMove = () => {
    const allMoves = getLegalMoves("black");

    if (allMoves.length === 0) {
      if (isKingInCheck("black")) {
        setGameStatus("checkmate");
      } else {
        setGameStatus("stalemate");
      }
      return;
    }

    // Score moves: checkmate > check > escape check if needed > captures > safe moves
    const scoredMoves = allMoves.map((move) => {
      let score = 0;

      // Test move on a copy
      const testBoard = board.map((r) => [...r]);
      const piece = testBoard[move.from[0]][move.from[1]];
      testBoard[move.to[0]][move.to[1]] = piece;
      testBoard[move.from[0]][move.from[1]] = null;

      // Checkmate = win (highest priority)
      if (
        !getLegalMoves("white", testBoard).length &&
        isKingInCheck("white", testBoard)
      ) {
        score += 50000;
      }
      // Check the opponent
      else if (isKingInCheck("white", testBoard)) {
        score += 200;
      }

      // Escape check if currently in check
      if (isKingInCheck("black", board) && !isKingInCheck("black", testBoard)) {
        score += 5000;
      }

      // Capture opponent piece (value depends on piece type)
      const capturedPiece = board[move.to[0]][move.to[1]];
      if (capturedPiece) {
        score += getPieceValue(capturedPiece.piece) * 10;
      }

      // Avoid moving into attacked squares
      if (isSquareAttackedByColor(move.to[0], move.to[1], "white", testBoard)) {
        const movingPiece = board[move.from[0]][move.from[1]];
        score -= getPieceValue(movingPiece.piece) * 5;
      }

      // Favor central control
      const distFromCenter =
        Math.abs(move.to[0] - 3.5) + Math.abs(move.to[1] - 3.5);
      score += (7 - distFromCenter) * 2;

      return { move, score };
    });

    // Sort by score and pick the best
    scoredMoves.sort((a, b) => b.score - a.score);
    const bestMove = scoredMoves[0].move;

    const newBoard = board.map((r) => [...r]);
    const piece = newBoard[bestMove.from[0]][bestMove.from[1]];
    newBoard[bestMove.to[0]][bestMove.to[1]] = piece;
    newBoard[bestMove.from[0]][bestMove.from[1]] = null;

    setBoard(newBoard);
    setMoveHistory([
      ...moveHistory,
      `${String.fromCharCode(65 + bestMove.from[1])}${8 - bestMove.from[0]} → ${String.fromCharCode(65 + bestMove.to[1])}${8 - bestMove.to[0]}`,
    ]);
    setCurrentPlayer("white");
    setSelectedSquare(null);
    setValidMoves([]);

    // Check game status after AI's move
    const whiteLegalMoves = getLegalMoves("white", newBoard);
    if (whiteLegalMoves.length === 0) {
      if (isKingInCheck("white", newBoard)) {
        setGameStatus("checkmate");
      } else {
        setGameStatus("stalemate");
      }
    } else if (isKingInCheck("white", newBoard)) {
      setGameStatus("check");
    } else {
      setGameStatus("playing");
    }
  };

  const getLegalMoves = (color, testBoard = null) => {
    const rawMoves = getAllPossibleMoves(color, testBoard);
    const boardToUse = testBoard || board;
    const legalMoves = [];

    for (const move of rawMoves) {
      const testMovedBoard = boardToUse.map((r) => [...r]);
      const piece = testMovedBoard[move.from[0]][move.from[1]];
      testMovedBoard[move.to[0]][move.to[1]] = piece;
      testMovedBoard[move.from[0]][move.from[1]] = null;

      // Only allow moves that don't leave king in check
      if (!isKingInCheck(color, testMovedBoard)) {
        legalMoves.push(move);
      }
    }
    return legalMoves;
  };

  const getAllPossibleMoves = (color, testBoard = null) => {
    const moves = [];
    const boardToUse = testBoard || board;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = boardToUse[row][col];
        if (piece && piece.color === color) {
          const pieceMoves = getValidMovesForPiece(row, col, boardToUse);
          moves.push(...pieceMoves);
        }
      }
    }

    return moves;
  };

  const getValidMovesForPiece = (row, col, testBoard = null) => {
    const boardToUse = testBoard || board;
    const piece = boardToUse[row][col];
    if (!piece) return [];

    const moves = [];
    const pieceName = piece.piece.toUpperCase();

    const addMove = (r, c) => {
      if (r >= 0 && r < 8 && c >= 0 && c < 8) {
        const target = boardToUse[r][c];
        if (!target || target.color !== piece.color) {
          moves.push({ from: [row, col], to: [r, c] });
        }
      }
    };

    // Pawn moves
    if (pieceName === "P") {
      const direction = piece.color === "white" ? -1 : 1;
      const startRow = piece.color === "white" ? 6 : 1;

      if (boardToUse[row + direction]?.[col] === null) {
        addMove(row + direction, col);

        if (
          row === startRow &&
          boardToUse[row + 2 * direction]?.[col] === null
        ) {
          addMove(row + 2 * direction, col);
        }
      }

      if (boardToUse[row + direction]?.[col - 1]?.color !== piece.color) {
        addMove(row + direction, col - 1);
      }
      if (boardToUse[row + direction]?.[col + 1]?.color !== piece.color) {
        addMove(row + direction, col + 1);
      }
    }

    // Knight moves
    if (pieceName === "N") {
      const knightMoves = [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1],
      ];
      knightMoves.forEach(([dr, dc]) => addMove(row + dr, col + dc));
    }

    // Bishop/Queen diagonal moves
    if (pieceName === "B" || pieceName === "Q") {
      for (const [dr, dc] of [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ]) {
        for (let i = 1; i < 8; i++) {
          const nr = row + dr * i;
          const nc = col + dc * i;
          if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) break;
          if (boardToUse[nr][nc]?.color === piece.color) break;
          addMove(nr, nc);
          if (boardToUse[nr][nc]) break;
        }
      }
    }

    // Rook/Queen straight moves
    if (pieceName === "R" || pieceName === "Q") {
      for (const [dr, dc] of [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
      ]) {
        for (let i = 1; i < 8; i++) {
          const nr = row + dr * i;
          const nc = col + dc * i;
          if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) break;
          if (boardToUse[nr][nc]?.color === piece.color) break;
          addMove(nr, nc);
          if (boardToUse[nr][nc]) break;
        }
      }
    }

    // King moves
    if (pieceName === "K") {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          addMove(row + dr, col + dc);
        }
      }
    }

    return moves;
  };

  const handleSquareClick = (row, col) => {
    if (gameStatus === "checkmate" || gameStatus === "stalemate") return;

    // In bot mode, only allow white (player) to move
    if (gameMode === "bot" && currentPlayer !== "white") return;

    if (selectedSquare === null) {
      if (board[row][col]?.color === currentPlayer) {
        setSelectedSquare({ row, col });
        const moves = getValidMovesForPiece(row, col);
        // Filter out moves that would leave king in check
        const legalMoves = moves.filter((move) => {
          const testBoard = board.map((r) => [...r]);
          const piece = testBoard[move.from[0]][move.from[1]];
          testBoard[move.to[0]][move.to[1]] = piece;
          testBoard[move.from[0]][move.from[1]] = null;
          return !isKingInCheck(currentPlayer, testBoard);
        });
        setValidMoves(legalMoves.map((m) => `${m.to[0]}-${m.to[1]}`));
      }
    } else {
      const moveKey = `${row}-${col}`;
      if (validMoves.includes(moveKey)) {
        // Make the move
        const newBoard = board.map((r) => [...r]);
        const piece = newBoard[selectedSquare.row][selectedSquare.col];
        newBoard[row][col] = piece;
        newBoard[selectedSquare.row][selectedSquare.col] = null;

        setBoard(newBoard);
        setMoveHistory([
          ...moveHistory,
          `${String.fromCharCode(65 + selectedSquare.col)}${8 - selectedSquare.row} → ${String.fromCharCode(65 + col)}${8 - row}`,
        ]);
        setCurrentPlayer("black");
        setSelectedSquare(null);
        setValidMoves([]);

        // Check game status after white's move
        const blackLegalMoves = getLegalMoves("black", newBoard);
        if (blackLegalMoves.length === 0) {
          if (isKingInCheck("black", newBoard)) {
            setGameStatus("checkmate");
          } else {
            setGameStatus("stalemate");
          }
        } else if (isKingInCheck("black", newBoard)) {
          setGameStatus("check");
        } else {
          setGameStatus("playing");
        }
      } else if (board[row][col]?.color === currentPlayer) {
        setSelectedSquare({ row, col });
        const moves = getValidMovesForPiece(row, col);
        // Filter out moves that would leave king in check
        const legalMoves = moves.filter((move) => {
          const testBoard = board.map((r) => [...r]);
          const piece = testBoard[move.from[0]][move.from[1]];
          testBoard[move.to[0]][move.to[1]] = piece;
          testBoard[move.from[0]][move.from[1]] = null;
          return !isKingInCheck(currentPlayer, testBoard);
        });
        setValidMoves(legalMoves.map((m) => `${m.to[0]}-${m.to[1]}`));
      } else {
        setSelectedSquare(null);
        setValidMoves([]);
      }
    }
  };

  const resetGame = () => {
    initializeGame();
  };

  const backToModes = () => {
    scoreSavedRef.current = false;
    setGameMode(null);
    setSelectedSquare(null);
    setValidMoves([]);
  };

  const getPieceSymbol = (piece) => {
    const symbols = {
      r: "♖",
      n: "♘",
      b: "♗",
      q: "♕",
      k: "♔",
      p: "♙",
      R: "♜",
      N: "♞",
      B: "♝",
      Q: "♛",
      K: "♚",
      P: "♟",
    };
    return symbols[piece.piece] || "";
  };

  const getStatusMessage = () => {
    if (gameStatus === "checkmate") {
      const winner = currentPlayer === "white" ? "Black" : "White";
      return `✓ Checkmate! ${winner} wins!`;
    }
    if (gameStatus === "stalemate") {
      return "Draw - Stalemate!";
    }
    if (gameStatus === "check") {
      return `⚠️ CHECK! ${currentPlayer.toUpperCase()}'s Turn`;
    }
    if (gameMode === "bot" && currentPlayer === "black") {
      return "🤖 AI is thinking...";
    }
    return `${currentPlayer.toUpperCase()}'s Turn`;
  };

  if (!gameMode) {
    return (
      <div className="chess-container">
        <Seo
          title="Play Chess Online Free | Playntric"
          description="Play free online chess on Playntric with bot mode, local multiplayer, move history, and board themes."
          path="/chess"
          keywords={[
            "chess online",
            "play chess free",
            "browser chess",
            "chess bot game",
            "Playntric chess",
          ]}
          structuredData={structuredData}
        />
        <h2>Chess</h2>
        <p className="game-description">Choose your game mode</p>

        <div className="mode-selection">
          <button className="mode-button" onClick={() => setGameMode("bot")}>
            <div className="mode-icon">
              <Bot size={36} />
            </div>
            <div className="mode-name">Play vs Bot</div>
            <div className="mode-desc">Challenge the improved AI</div>
          </button>

          <button className="mode-button" onClick={() => setGameMode("local")}>
            <div className="mode-icon">
              <Users size={36} />
            </div>
            <div className="mode-name">Local Player</div>
            <div className="mode-desc">Two players on same device</div>
          </button>

          <button className="mode-button" onClick={() => setGameMode("online")}>
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
    <div className="chess-container">
      <Seo
        title="Play Chess Online Free | Playntric"
        description="Play free online chess on Playntric with bot mode, local multiplayer, move history, and board themes."
        path="/chess"
        keywords={[
          "chess online",
          "play chess free",
          "browser chess",
          "chess strategy game",
          "Playntric chess",
        ]}
        structuredData={structuredData}
      />
      <h2>
        Chess -{" "}
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

      <div
        className={`chess-info ${gameStatus === "check" ? "check-warning" : ""} ${gameStatus === "checkmate" || gameStatus === "stalemate" ? "game-end" : ""}`}
      >
        <p className="current-turn">{getStatusMessage()}</p>
      </div>

      <div className={`chess-board-container theme-${chessTheme || "classic"}`}>
        <div className="chess-board">
          {board.map((row, rowIndex) =>
            row.map((square, colIndex) => {
              const key = `${rowIndex}-${colIndex}`;
              const isValid = validMoves.includes(key);

              return (
                <div
                  key={key}
                  className={`chess-square ${
                    (rowIndex + colIndex) % 2 === 0 ? "light" : "dark"
                  } ${selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex ? "selected" : ""} ${
                    isValid ? "valid-move" : ""
                  }`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                >
                  {square && (
                    <div className={`chess-piece ${square.color}`}>
                      {getPieceSymbol(square)}
                    </div>
                  )}
                </div>
              );
            }),
          )}
        </div>

        <div className="chess-info-panel">
          <div className="move-history">
            <h3>Move History</h3>
            <div className="moves-list">
              {moveHistory.length === 0 ? (
                <p className="no-moves">No moves yet</p>
              ) : (
                moveHistory.map((move, idx) => (
                  <p key={idx} className="move">
                    {idx + 1}. {move}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="chess-controls">
        <button className="reset-button" onClick={resetGame}>
          New Game
        </button>
        <button className="back-button" onClick={backToModes}>
          Back to Modes
        </button>
      </div>

      {/* Board theme selector */}
      {(() => {
        const THEMES = [
          {
            id: "classic",
            label: "Classic",
            light: "#f0d9b5",
            dark: "#b58863",
            free: true,
          },
          {
            id: "forest",
            label: "Forest",
            light: "#eeeed2",
            dark: "#769656",
            free: false,
          },
          {
            id: "ocean",
            label: "Ocean",
            light: "#dce9f5",
            dark: "#4a8fc0",
            free: false,
          },
          {
            id: "midnight",
            label: "Night",
            light: "#5c5c7a",
            dark: "#1e1e36",
            free: false,
          },
        ];
        return (
          <div className="theme-selector">
            <label>Board Theme:</label>
            <div className="theme-swatches">
              {THEMES.map((t) => {
                const locked = !t.free && !isPremium;
                return (
                  <div
                    key={t.id}
                    className={`theme-swatch ${chessTheme === t.id ? "active" : ""} ${locked ? "locked" : ""}`}
                    title={locked ? `${t.label} — Premium only` : t.label}
                    onClick={() => updateChessTheme(t.id)}
                  >
                    <div className="swatch-preview">
                      <span style={{ background: t.light }} />
                      <span style={{ background: t.dark }} />
                      <span style={{ background: t.dark }} />
                      <span style={{ background: t.light }} />
                    </div>
                    <span className="swatch-label">
                      {locked ? <Lock size={12} /> : t.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {gameMode === "online" && (
        <div className="online-beta">
          <p>ℹ️ Online multiplayer is in beta. Feature coming soon!</p>
        </div>
      )}
    </div>
  );
}
