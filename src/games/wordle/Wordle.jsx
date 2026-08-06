import React, { useState } from "react";
import "./Wordle.css";
import { Delete } from "lucide-react";
import Seo from "../../components/common/Seo";
import { saveScore } from "../../components/common/Leaderboard";
import { usePlayer } from "../../context/PlayerContext";
import { getRandomWord } from "../../lib/wordBank";

const MAX_ATTEMPTS = 6;

const LEVELS = {
  easy: { label: "Easy", length: 4, icon: "🟢", desc: "4-letter word" },
  medium: { label: "Medium", length: 5, icon: "🟡", desc: "5-letter word" },
  hard: { label: "Hard", length: 6, icon: "🔴", desc: "6-letter word" },
};

export default function Wordle() {
  const { playerName } = usePlayer();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: "Playntric Wordle",
    url: "https://playntric.vercel.app/wordle",
    description:
      "Play a free Wordle-style word guessing game online with easy, medium, and hard levels on Playntric.",
    genre: ["Word Game", "Puzzle"],
    applicationCategory: "Game",
    operatingSystem: "Any",
  };

  const [difficulty, setDifficulty] = useState(null);
  const [targetWord, setTargetWord] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameStatus, setGameStatus] = useState("playing"); // 'playing', 'won', 'lost'
  const [message, setMessage] = useState("");
  const [usedLetters, setUsedLetters] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const wordLength = difficulty ? LEVELS[difficulty].length : 5;

  const loadNewWord = async (level) => {
    setLoading(true);
    setGuesses([]);
    setCurrentGuess("");
    setGameStatus("playing");
    setMessage("");
    setUsedLetters(new Set());
    const word = await getRandomWord(LEVELS[level].length);
    setTargetWord(word);
    setLoading(false);
  };

  const startLevel = (level) => {
    setDifficulty(level);
    loadNewWord(level);
  };

  const newGame = () => {
    if (difficulty) loadNewWord(difficulty);
  };

  const backToLevels = () => {
    setDifficulty(null);
    setTargetWord("");
    setGuesses([]);
    setCurrentGuess("");
    setGameStatus("playing");
    setMessage("");
    setUsedLetters(new Set());
  };

  const getLetterColor = (letter, index) => {
    if (targetWord[index] === letter) return "correct";
    if (targetWord.includes(letter)) return "present";
    return "absent";
  };

  const handleKeyDown = (e) => {
    if (gameStatus !== "playing") return;

    if (e.key === "Enter") {
      submitGuess();
    } else if (e.key === "Backspace") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < wordLength) {
      setCurrentGuess((prev) => (prev + e.key).toUpperCase());
    }
  };

  const submitGuess = () => {
    if (currentGuess.length !== wordLength) {
      setMessage(`Word must be ${wordLength} letters!`);
      return;
    }

    const newUsedLetters = new Set(usedLetters);
    currentGuess.split("").forEach((letter) => newUsedLetters.add(letter));
    setUsedLetters(newUsedLetters);

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);

    if (currentGuess === targetWord) {
      setGameStatus("won");
      setMessage(
        `🎉 You won in ${newGuesses.length} guess${
          newGuesses.length > 1 ? "es" : ""
        }!`,
      );
      saveScore("wordle", {
        name: playerName || "Anonymous",
        score: Math.max(0, (MAX_ATTEMPTS + 1 - newGuesses.length) * 100),
        attempts: newGuesses.length,
        difficulty,
      });
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameStatus("lost");
      setMessage(`😢 Game Over! The word was: ${targetWord}`);
    } else {
      setMessage(`${MAX_ATTEMPTS - newGuesses.length} attempts remaining`);
      setCurrentGuess("");
    }
  };

  const handleLetterClick = (letter) => {
    if (gameStatus === "playing" && currentGuess.length < wordLength) {
      setCurrentGuess((prev) => prev + letter);
    }
  };

  const handleBackspace = () => {
    setCurrentGuess((prev) => prev.slice(0, -1));
  };

  return (
    <div className="wordle-container">
      <Seo
        title="Play Wordle Online Free | Playntric"
        description="Guess the hidden word with easy, medium, and hard levels on Playntric."
        path="/wordle"
        keywords={[
          "wordle online",
          "word guessing game",
          "free word game",
          "browser puzzle game",
          "Playntric wordle",
        ]}
        structuredData={structuredData}
      />
      <h2>Wordle Game</h2>

      {!difficulty ? (
        <div className="difficulty-selection">
          <p className="game-description">Select a difficulty level to start:</p>
          <div className="difficulty-cards">
            {Object.entries(LEVELS).map(([key, level]) => (
              <button
                type="button"
                key={key}
                className="difficulty-card"
                onClick={() => startLevel(key)}
              >
                <span className="diff-icon">{level.icon}</span>
                <span className="diff-label">{level.label}</span>
                <span className="diff-desc">{level.desc}</span>
              </button>
            ))}
          </div>
        </div>
      ) : loading ? (
        <div className="wordle-loading">
          <p>Loading random word...</p>
        </div>
      ) : (
        <div className="wordle-content">
          <div className="wordle-game">
            <div className="guesses-display">
              {[...Array(MAX_ATTEMPTS)].map((_, idx) => (
                <div key={idx} className="guess-row">
                  {[...Array(wordLength)].map((_, colIdx) => {
                    const letter =
                      guesses[idx]?.[colIdx] ||
                      (idx === guesses.length ? currentGuess[colIdx] : "");
                    const color = guesses[idx]
                      ? getLetterColor(guesses[idx][colIdx], colIdx)
                      : "";

                    return (
                      <div
                        key={colIdx}
                        className={`letter-box ${color} len-${wordLength}`}
                      >
                        {letter}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="game-message">
              <p>{message}</p>
            </div>

            <div className="keyboard-section">
              <div className="keyboard">
                {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map(
                  (letter) => (
                    <button
                      type="button"
                      key={letter}
                      className={`key ${usedLetters.has(letter) ? "used" : ""}`}
                      onClick={() => handleLetterClick(letter)}
                      disabled={gameStatus !== "playing"}
                    >
                      {letter}
                    </button>
                  ),
                )}
              </div>
              <div className="keyboard">
                {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((letter) => (
                  <button
                    type="button"
                    key={letter}
                    className={`key ${usedLetters.has(letter) ? "used" : ""}`}
                    onClick={() => handleLetterClick(letter)}
                    disabled={gameStatus !== "playing"}
                  >
                    {letter}
                  </button>
                ))}
              </div>
              <div className="keyboard">
                {["Z", "X", "C", "V", "B", "N", "M"].map((letter) => (
                  <button
                    type="button"
                    key={letter}
                    className={`key ${usedLetters.has(letter) ? "used" : ""}`}
                    onClick={() => handleLetterClick(letter)}
                    disabled={gameStatus !== "playing"}
                  >
                    {letter}
                  </button>
                ))}
                <button
                  type="button"
                  className="key backspace"
                  onClick={handleBackspace}
                  disabled={gameStatus !== "playing"}
                >
                  <Delete size={16} /> Delete
                </button>
              </div>
            </div>

            <div className="keyboard-input">
              <p className="input-label">Or type directly:</p>
              <input
                type="text"
                maxLength={wordLength}
                value={currentGuess}
                onChange={(e) =>
                  setCurrentGuess(
                    e.target.value
                      .replace(/[^a-zA-Z]/g, "")
                      .toUpperCase()
                      .slice(0, wordLength),
                  )
                }
                onKeyDown={handleKeyDown}
                placeholder="Type a word..."
                disabled={gameStatus !== "playing"}
                className="word-input"
                autoFocus
              />
              <button
                type="button"
                className="submit-button"
                onClick={submitGuess}
                disabled={
                  gameStatus !== "playing" || currentGuess.length !== wordLength
                }
              >
                Submit Guess
              </button>
            </div>
          </div>

          <div className="controls">
            <button
              type="button"
              className="new-game-button"
              onClick={newGame}
              disabled={loading}
            >
              New Game
            </button>
            <button
              type="button"
              className="new-game-button"
              onClick={backToLevels}
            >
              Change Level
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
