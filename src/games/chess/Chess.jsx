import React, { useState, useEffect, useRef } from "react";
import "./Chess.css";
import { usePremium } from "../../context/PremiumContext";
import { Bot, Users, Globe, Lock } from "lucide-react";
import Seo from "../../components/common/Seo";
import { usePlayer } from "../../context/PlayerContext";
import { saveScore } from "../../components/common/Leaderboard";
import { getGenAIMove } from "../../lib/genaiBot";

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
  const [castlingRights, setCastlingRights] = useState({
    white: { kingside: true, queenside: true },
    black: { kingside: true, queenside: true },
  });
  const [enPassantTarget, setEnPassantTarget] = useState(null);
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
    setCastlingRights({
      white: { kingside: true, queenside: true },
      black: { kingside: true, queenside: true },
    });
    setEnPassantTarget(null);
  };

  // Apply a move (incl. castling, en passant, promotion) to a board copy.
  const applyMoveToBoard = (sourceBoard, move) => {
    const nb = sourceBoard.map((r) => [...r]);
    const piece = nb[move.from[0]][move.from[1]];

    if (move.enPassant) {
      // Captured pawn sits on the mover's start row, destination column.
      nb[move.from[0]][move.to[1]] = null;
    }

    if (move.castle) {
      const row = move.from[0];
      if (move.castle === "kingside") {
        nb[row][5] = nb[row][7];
        nb[row][7] = null;
      } else {
        nb[row][3] = nb[row][0];
        nb[row][0] = null;
      }
    }

    let placed = piece;
    if (move.promotion) {
      const map = { q: "Q", r: "R", b: "B", n: "N" };
      const letter = map[move.promotion] || "Q";
      placed = {
        piece: piece.color === "white" ? letter : letter.toLowerCase(),
        color: piece.color,
      };
    }

    nb[move.to[0]][move.to[1]] = placed;
    nb[move.from[0]][move.from[1]] = null;
    return nb;
  };

  // Human-readable move notation for the history panel.
  const formatMove = (move) => {
    if (move.castle === "kingside") return "O-O";
    if (move.castle === "queenside") return "O-O-O";
    const from = `${String.fromCharCode(65 + move.from[1])}${8 - move.from[0]}`;
    const to = `${String.fromCharCode(65 + move.to[1])}${8 - move.to[0]}`;
    let text = `${from} → ${to}`;
    if (move.promotion) text += `=${move.promotion.toUpperCase()}`;
    if (move.enPassant) text += " e.p.";
    return text;
  };

  // Recompute castling rights after a move (king/rook moved or rook captured).
  const nextCastlingRights = (rights, move) => {
    const nr = {
      white: { ...rights.white },
      black: { ...rights.black },
    };
    const revoke = (r, c) => {
      if (r === 7 && c === 4) {
        nr.white.kingside = false;
        nr.white.queenside = false;
      }
      if (r === 0 && c === 4) {
        nr.black.kingside = false;
        nr.black.queenside = false;
      }
      if (r === 7 && c === 0) nr.white.queenside = false;
      if (r === 7 && c === 7) nr.white.kingside = false;
      if (r === 0 && c === 0) nr.black.queenside = false;
      if (r === 0 && c === 7) nr.black.kingside = false;
    };
    revoke(move.from[0], move.from[1]);
    revoke(move.to[0], move.to[1]);
    return nr;
  };

  // En passant target square created by a two-square pawn advance.
  const nextEnPassantTarget = (move, piece) => {
    if (
      piece?.piece.toUpperCase() === "P" &&
      Math.abs(move.to[0] - move.from[0]) === 2
    ) {
      return [(move.from[0] + move.to[0]) / 2, move.from[1]];
    }
    return null;
  };

  // Castling moves for a color, fully rule-checked (rights, empty path,
  // not castling out of / through / into check).
  const getCastlingMoves = (color, boardToUse, rights) => {
    const row = color === "white" ? 7 : 0;
    const king = boardToUse[row][4];
    if (!king || king.piece.toUpperCase() !== "K" || king.color !== color) {
      return [];
    }
    if (isKingInCheck(color, boardToUse)) return [];
    const enemy = color === "white" ? "black" : "white";
    const moves = [];

    if (rights[color].kingside) {
      const rook = boardToUse[row][7];
      if (
        rook?.piece.toUpperCase() === "R" &&
        rook.color === color &&
        !boardToUse[row][5] &&
        !boardToUse[row][6] &&
        !isSquareAttackedByColor(row, 5, enemy, boardToUse) &&
        !isSquareAttackedByColor(row, 6, enemy, boardToUse)
      ) {
        moves.push({ from: [row, 4], to: [row, 6], castle: "kingside" });
      }
    }

    if (rights[color].queenside) {
      const rook = boardToUse[row][0];
      if (
        rook?.piece.toUpperCase() === "R" &&
        rook.color === color &&
        !boardToUse[row][1] &&
        !boardToUse[row][2] &&
        !boardToUse[row][3] &&
        !isSquareAttackedByColor(row, 3, enemy, boardToUse) &&
        !isSquareAttackedByColor(row, 2, enemy, boardToUse)
      ) {
        moves.push({ from: [row, 4], to: [row, 2], castle: "queenside" });
      }
    }

    return moves;
  };

  // Legal moves for a piece including special moves, filtered so they never
  // leave the mover's king in check. Used for the interactive board.
  const getLegalMovesForPiece = (row, col) => {
    const piece = board[row][col];
    if (!piece) return [];
    let moves = getValidMovesForPiece(row, col, board, enPassantTarget);
    if (piece.piece.toUpperCase() === "K") {
      moves = moves.concat(
        getCastlingMoves(piece.color, board, castlingRights),
      );
    }
    return moves.filter(
      (move) => !isKingInCheck(piece.color, applyMoveToBoard(board, move)),
    );
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

  // GenAI bot move (with fallback)
  const makeAIMove = async () => {
    const allMoves = getLegalMoves("black");
    if (allMoves.length === 0) {
      if (isKingInCheck("black")) {
        setGameStatus("checkmate");
      } else {
        setGameStatus("stalemate");
      }
      return;
    }
    // Try GenAI endpoint first
    const move = await getGenAIMove({
      game: "chess",
      state: { board, legalMoves: allMoves },
    });
    let chosenMove = null;
    if (move && typeof move === "object" && move.from && move.to) {
      // Validate move is legal; use the matching legal move so special-move
      // flags (castle / en passant / promotion) are preserved.
      chosenMove =
        allMoves.find(
          (m) =>
            m.from[0] === move.from[0] &&
            m.from[1] === move.from[1] &&
            m.to[0] === move.to[0] &&
            m.to[1] === move.to[1],
        ) || null;
    }
    // Fallback: local scoring logic
    if (!chosenMove) {
      const scoredMoves = allMoves.map((move) => {
        let score = 0;
        const testBoard = board.map((r) => [...r]);
        const piece = testBoard[move.from[0]][move.from[1]];
        testBoard[move.to[0]][move.to[1]] = piece;
        testBoard[move.from[0]][move.from[1]] = null;
        if (
          !getLegalMoves("white", testBoard).length &&
          isKingInCheck("white", testBoard)
        ) {
          score += 50000;
        } else if (isKingInCheck("white", testBoard)) {
          score += 200;
        }
        if (
          isKingInCheck("black", board) &&
          !isKingInCheck("black", testBoard)
        ) {
          score += 5000;
        }
        const capturedPiece = board[move.to[0]][move.to[1]];
        if (capturedPiece) {
          score += getPieceValue(capturedPiece.piece) * 10;
        }
        if (
          isSquareAttackedByColor(move.to[0], move.to[1], "white", testBoard)
        ) {
          const movingPiece = board[move.from[0]][move.from[1]];
          score -= getPieceValue(movingPiece.piece) * 5;
        }
        const distFromCenter =
          Math.abs(move.to[0] - 3.5) + Math.abs(move.to[1] - 3.5);
        score += (7 - distFromCenter) * 2;
        return { move, score };
      });
      scoredMoves.sort((a, b) => b.score - a.score);
      chosenMove = scoredMoves[0].move;
    }
    // Play the move
    const movingPiece = board[chosenMove.from[0]][chosenMove.from[1]];
    const newBoard = applyMoveToBoard(board, chosenMove);
    setBoard(newBoard);
    setCastlingRights((prev) => nextCastlingRights(prev, chosenMove));
    setEnPassantTarget(nextEnPassantTarget(chosenMove, movingPiece));
    setMoveHistory([...moveHistory, formatMove(chosenMove)]);
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
    const boardToUse = testBoard || board;
    // Special moves (en passant / castling) depend on live state, so only
    // include them when evaluating the actual current position.
    const epTarget = testBoard ? null : enPassantTarget;
    let rawMoves = getAllPossibleMoves(color, boardToUse, epTarget);
    if (!testBoard) {
      rawMoves = rawMoves.concat(
        getCastlingMoves(color, boardToUse, castlingRights),
      );
    }

    return rawMoves.filter(
      (move) => !isKingInCheck(color, applyMoveToBoard(boardToUse, move)),
    );
  };

  const getAllPossibleMoves = (color, testBoard = null, epTarget = null) => {
    const moves = [];
    const boardToUse = testBoard || board;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = boardToUse[row][col];
        if (piece && piece.color === color) {
          const pieceMoves = getValidMovesForPiece(
            row,
            col,
            boardToUse,
            epTarget,
          );
          moves.push(...pieceMoves);
        }
      }
    }

    return moves;
  };

  const getValidMovesForPiece = (row, col, testBoard = null, epTarget = null) => {
    const boardToUse = testBoard || board;
    const piece = boardToUse[row][col];
    if (!piece) return [];

    const moves = [];
    const pieceName = piece.piece.toUpperCase();

    // Add promotion support: if pawn reaches last rank, add promotion moves
    const addMove = (r, c, promotion = null) => {
      if (r >= 0 && r < 8 && c >= 0 && c < 8) {
        const target = boardToUse[r][c];
        if (!target || target.color !== piece.color) {
          // If this is a pawn move to last rank, add promotion options
          if (
            pieceName === "P" &&
            ((piece.color === "white" && r === 0) ||
              (piece.color === "black" && r === 7))
          ) {
            ["q", "r", "b", "n"].forEach((promo) => {
              moves.push({ from: [row, col], to: [r, c], promotion: promo });
            });
          } else {
            moves.push({ from: [row, col], to: [r, c] });
          }
        }
      }
    };

    // Pawn moves
    if (pieceName === "P") {
      const direction = piece.color === "white" ? -1 : 1;
      const startRow = piece.color === "white" ? 6 : 1;

      // Forward move (one square)
      const oneForward = boardToUse[row + direction]?.[col];
      if (oneForward === null) {
        addMove(row + direction, col);
        // Forward move (two squares from start)
        const twoForward = boardToUse[row + 2 * direction]?.[col];
        if (row === startRow && twoForward === null) {
          addMove(row + 2 * direction, col);
        }
      }

      // Captures (diagonal left)
      if (
        col - 1 >= 0 &&
        boardToUse[row + direction]?.[col - 1] &&
        boardToUse[row + direction][col - 1] !== null &&
        boardToUse[row + direction][col - 1].color !== piece.color
      ) {
        addMove(row + direction, col - 1);
      }
      // Captures (diagonal right)
      if (
        col + 1 < 8 &&
        boardToUse[row + direction]?.[col + 1] &&
        boardToUse[row + direction][col + 1] !== null &&
        boardToUse[row + direction][col + 1].color !== piece.color
      ) {
        addMove(row + direction, col + 1);
      }

      // En passant
      if (epTarget) {
        const [er, ec] = epTarget;
        if (er === row + direction && Math.abs(ec - col) === 1) {
          moves.push({ from: [row, col], to: [er, ec], enPassant: true });
        }
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
        setValidMoves(getLegalMovesForPiece(row, col));
      }
    } else {
      // Find the move object matching the clicked destination (first match
      // for a promotion square defaults to queen).
      const chosenMove = validMoves.find(
        (m) => m.to[0] === row && m.to[1] === col,
      );
      if (chosenMove) {
        const movingPiece = board[chosenMove.from[0]][chosenMove.from[1]];
        const opponent = movingPiece.color === "white" ? "black" : "white";
        const newBoard = applyMoveToBoard(board, chosenMove);
        setBoard(newBoard);
        setCastlingRights((prev) => nextCastlingRights(prev, chosenMove));
        setEnPassantTarget(nextEnPassantTarget(chosenMove, movingPiece));
        setMoveHistory([...moveHistory, formatMove(chosenMove)]);
        setCurrentPlayer(opponent);
        setSelectedSquare(null);
        setValidMoves([]);

        // Check game status for the side to move next
        const opponentLegalMoves = getLegalMoves(opponent, newBoard);
        if (opponentLegalMoves.length === 0) {
          if (isKingInCheck(opponent, newBoard)) {
            setGameStatus("checkmate");
          } else {
            setGameStatus("stalemate");
          }
        } else if (isKingInCheck(opponent, newBoard)) {
          setGameStatus("check");
        } else {
          setGameStatus("playing");
        }
      } else if (board[row][col]?.color === currentPlayer) {
        setSelectedSquare({ row, col });
        setValidMoves(getLegalMovesForPiece(row, col));
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
              const isValid = validMoves.some(
                (m) => m.to[0] === rowIndex && m.to[1] === colIndex,
              );

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
