import React, { useState, useEffect } from "react";
import "../sudoku/Sudoku.css";
import { PartyPopper, Lightbulb, Tv, Star, RotateCcw } from "lucide-react";
import RewardedAd from "../../components/common/RewardedAd";
import Seo from "../../components/common/Seo";
import { usePremium } from "../../context/PremiumContext";
import { saveScore } from "../../components/common/Leaderboard";
import { usePlayer } from "../../context/PlayerContext";

export default function Sudoku() {
  const [grid, setGrid] = useState([]);
  const [initialGrid, setInitialGrid] = useState([]);
  const [solution, setSolution] = useState([]);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [showRewardedAd, setShowRewardedAd] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [invalidCells, setInvalidCells] = useState(new Set());
  const { isPremium } = usePremium();
  const { playerName } = usePlayer();

  const generateRandomSudoku = () => {
    const puzzle = Array(9)
      .fill(null)
      .map(() => Array(9).fill(0));

    // Fill diagonal 3x3 boxes first (they don't conflict)
    for (let box = 0; box < 3; box++) {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(
        () => Math.random() - 0.5,
      );
      let index = 0;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          puzzle[box * 3 + i][box * 3 + j] = numbers[index++];
        }
      }
    }

    // Fill remaining cells with backtracking
    fillSudoku(puzzle);

    // Save solved version
    const solved = puzzle.map((r) => [...r]);

    // Remove numbers to create puzzle (difficulty: ~40 numbers shown)
    const blanks = 41;
    let removed = 0;
    while (removed < blanks) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0;
        removed++;
      }
    }

    return { puzzle, solved };
  };

  const fillSudoku = (puzzle) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] === 0) {
          const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(
            () => Math.random() - 0.5,
          );
          for (let num of numbers) {
            if (isValid(puzzle, row, col, num)) {
              puzzle[row][col] = num;
              if (fillSudoku(puzzle)) return true;
              puzzle[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const isValid = (puzzle, row, col, num) => {
    // Check row
    for (let c = 0; c < 9; c++) {
      if (puzzle[row][c] === num) return false;
    }

    // Check column
    for (let r = 0; r < 9; r++) {
      if (puzzle[r][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (puzzle[r][c] === num) return false;
      }
    }

    return true;
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const { puzzle, solved } = generateRandomSudoku();
    setGrid(puzzle.map((row) => [...row]));
    setInitialGrid(puzzle.map((row) => [...row]));
    setSolution(solved);
    setHintsLeft(isPremium ? 999 : 3);
    setCompleted(false);
    setInvalidCells(new Set());
  };

  const applyHint = () => {
    // Find a random empty cell
    const emptyCells = [];
    grid.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (cell === 0) emptyCells.push([r, c]);
      }),
    );
    if (emptyCells.length === 0) return;
    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newGrid = grid.map((row) => [...row]);
    newGrid[r][c] = solution[r][c];
    setGrid(newGrid);
    setHintsLeft((h) => h - 1);
    checkCompletion(newGrid);
  };

  const checkCompletion = (currentGrid) => {
    const done = currentGrid.every((row, r) =>
      row.every((cell, c) => cell === solution[r][c]),
    );
    if (done) {
      setCompleted(true);
      saveScore("sudoku", {
        name: playerName || "Anonymous",
        score: hintsLeft * 10 + 100,
      });
    }
  };

  const handleCellChange = (row, col, value) => {
    if (initialGrid[row][col] === 0) {
      const numValue =
        value === "" ? 0 : Math.min(9, Math.max(0, parseInt(value) || 0));

      const newGrid = grid.map((r, i) =>
        i === row ? r.map((cell, j) => (j === col ? numValue : cell)) : [...r],
      );

      setGrid(newGrid);

      // Validate the entered number
      if (numValue > 0) {
        const isInvalid = !isValidPlacement(newGrid, row, col, numValue);
        const newInvalidCells = new Set(invalidCells);

        if (isInvalid) {
          newInvalidCells.add(`${row}-${col}`);
        } else {
          newInvalidCells.delete(`${row}-${col}`);
        }
        setInvalidCells(newInvalidCells);
      } else {
        // Clear invalid state if cell is empty
        const newInvalidCells = new Set(invalidCells);
        newInvalidCells.delete(`${row}-${col}`);
        setInvalidCells(newInvalidCells);
      }

      checkCompletion(newGrid);
    }
  };

  const isValidPlacement = (puzzle, row, col, num) => {
    // Check row for duplicates (excluding current cell)
    for (let c = 0; c < 9; c++) {
      if (c !== col && puzzle[row][c] === num) return false;
    }

    // Check column for duplicates (excluding current cell)
    for (let r = 0; r < 9; r++) {
      if (r !== row && puzzle[r][col] === num) return false;
    }

    // Check 3x3 box for duplicates (excluding current cell)
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if ((r !== row || c !== col) && puzzle[r][c] === num) return false;
      }
    }

    return true;
  };

  const getNumberCount = () => {
    const counts = Array(10).fill(0);
    grid.forEach((row) => {
      row.forEach((cell) => {
        if (cell > 0) counts[cell]++;
      });
    });
    return counts;
  };

  const resetGame = () => {
    initializeGame();
  };

  const numberCounts = getNumberCount();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: "Playntric Sudoku",
    url: "https://playntric.vercel.app/sudoku",
    description:
      "Play free online Sudoku on Playntric with hints, validation, and a fresh puzzle every round.",
    genre: ["Puzzle", "Logic"],
    applicationCategory: "Game",
    operatingSystem: "Any",
  };

  return (
    <div className="sudoku-container">
      <Seo
        title="Play Sudoku Online Free | Playntric"
        description="Play free Sudoku online with hints, smart validation, and fresh puzzles on Playntric."
        path="/sudoku"
        keywords={[
          "sudoku online",
          "play sudoku free",
          "sudoku puzzle",
          "logic game",
          "Playntric sudoku",
        ]}
        structuredData={structuredData}
      />
      <h2>Sudoku Puzzle</h2>
      <p className="game-description">
        Fill the 9x9 grid so that each row, column, and 3x3 box contains the
        numbers 1-9
      </p>

      {completed && (
        <div className="sudoku-completed">
          <PartyPopper size={20} /> Puzzle Complete! Excellent work!
        </div>
      )}

      <div className="sudoku-content">
        <div className="sudoku-grid">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="sudoku-row">
              {row.map((cell, colIndex) => (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  type="number"
                  min="1"
                  max="9"
                  value={cell === 0 ? "" : cell}
                  onChange={(e) =>
                    handleCellChange(rowIndex, colIndex, e.target.value)
                  }
                  className={`sudoku-cell ${
                    initialGrid[rowIndex][colIndex] !== 0 ? "fixed" : ""
                  } ${
                    (rowIndex + 1) % 3 === 0 ? "border-bottom" : ""
                  } ${(colIndex + 1) % 3 === 0 ? "border-right" : ""} ${
                    invalidCells.has(`${rowIndex}-${colIndex}`) ? "invalid" : ""
                  }`}
                  maxLength="1"
                  disabled={initialGrid[rowIndex][colIndex] !== 0 || completed}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Number Counter */}
        <div className="number-tracker">
          <h3>Number Usage</h3>
          <div className="number-buttons">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                className={`number-badge ${numberCounts[num] === 9 ? "disabled" : ""}`}
                disabled={numberCounts[num] === 9}
              >
                <span className="number">{num}</span>
                <span className="count">{numberCounts[num]}/9</span>
              </button>
            ))}
          </div>

          <div className="hint-section">
            <h3>Hints {isPremium ? "∞" : `${hintsLeft}/3`}</h3>
            {hintsLeft > 0 ? (
              <button
                className="hint-btn"
                onClick={applyHint}
                disabled={completed}
              >
                <Lightbulb size={16} /> Use Hint
              </button>
            ) : (
              <button
                className="hint-btn hint-ad"
                onClick={() => setShowRewardedAd(true)}
              >
                <Tv size={16} /> Watch Ad for +1 Hint
              </button>
            )}
            {!isPremium && (
              <p className="hint-premium-note">
                <Star size={14} /> Premium = unlimited hints
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="button-group">
        <button className="reset-button" onClick={resetGame}>
          <RotateCcw size={16} /> New Puzzle
        </button>
      </div>

      {showRewardedAd && (
        <RewardedAd
          rewardLabel="+1 Hint for Sudoku"
          onRewarded={() => setHintsLeft((h) => h + 1)}
          onClose={() => setShowRewardedAd(false)}
        />
      )}
    </div>
  );
}
