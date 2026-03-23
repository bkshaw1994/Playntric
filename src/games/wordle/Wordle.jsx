import React, { useState, useEffect } from "react";
import "./Wordle.css";
import { Delete } from "lucide-react";
import Seo from "../../components/common/Seo";
import { saveScore } from "../../components/common/Leaderboard";
import { usePlayer } from "../../context/PlayerContext";

export default function Wordle() {
  const { playerName } = usePlayer();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: "Playntric Wordle",
    url: "https://playntric.vercel.app/wordle",
    description:
      "Play a free Wordle-style word guessing game online with six tries on Playntric.",
    genre: ["Word Game", "Puzzle"],
    applicationCategory: "Game",
    operatingSystem: "Any",
  };
  const WORD_LIST = [
    "REACT",
    "VITES",
    "GAMES",
    "CHESS",
    "LUDIO",
    "PUZZLE",
    "WORDS",
    "BUILDING",
    "JAVASCRIPT",
    "FRONTEND",
    "CODING",
    "PLAYER",
    "WINNING",
    "CHALLENGE",
  ];

  const [targetWord, setTargetWord] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameStatus, setGameStatus] = useState("playing"); // 'playing', 'won', 'lost'
  const [message, setMessage] = useState("");
  const [usedLetters, setUsedLetters] = useState(new Set());

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    setTargetWord(randomWord);
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
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < 5) {
      setCurrentGuess((currentGuess + e.key).toUpperCase());
    }
  };

  const submitGuess = () => {
    if (currentGuess.length !== 5) {
      setMessage("Word must be 5 letters!");
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
        `🎉 You won in ${newGuesses.length} guess${newGuesses.length > 1 ? "es" : ""}!`,
      );
      saveScore("wordle", {
        name: playerName || "Anonymous",
        score: Math.max(0, (7 - newGuesses.length) * 100),
        attempts: newGuesses.length,
      });
    } else if (newGuesses.length >= 6) {
      setGameStatus("lost");
      setMessage(`😢 Game Over! The word was: ${targetWord}`);
    } else {
      setMessage(`${6 - newGuesses.length} attempts remaining`);
      setCurrentGuess("");
    }
  };

  const handleLetterClick = (letter) => {
    if (gameStatus === "playing" && currentGuess.length < 5) {
      setCurrentGuess(currentGuess + letter);
    }
  };

  const handleBackspace = () => {
    setCurrentGuess(currentGuess.slice(0, -1));
  };

  return (
    <div className="wordle-container">
      <Seo
        title="Play Wordle Online Free | Playntric"
        description="Guess the hidden word in six tries with Playntric's free online Wordle game."
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
      <p className="game-description">
        Guess the 5-letter word in 6 attempts. Green means correct position,
        Yellow means wrong position.
      </p>

      <div className="wordle-content">
        <div className="wordle-game">
          <div className="guesses-display">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="guess-row">
                {[...Array(5)].map((_, colIdx) => {
                  const letter =
                    guesses[idx]?.[colIdx] ||
                    (idx === guesses.length ? currentGuess[colIdx] : "");
                  const color = guesses[idx]
                    ? getLetterColor(guesses[idx][colIdx], colIdx)
                    : "";

                  return (
                    <div key={colIdx} className={`letter-box ${color}`}>
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
                  key={letter}
                  className={`key ${usedLetters.has(letter) ? "used" : ""}`}
                  onClick={() => handleLetterClick(letter)}
                  disabled={gameStatus !== "playing"}
                >
                  {letter}
                </button>
              ))}
              <button
                className="key backspace"
                onClick={handleBackspace}
                disabled={gameStatus !== "playing"}
              >
                <Delete size={16} /> Delete
              </button>
            </div>
          </div>
        </div>

        <div className="keyboard-input">
          <p className="input-label">Or type directly:</p>
          <input
            type="text"
            maxLength="5"
            value={currentGuess}
            onKeyDown={handleKeyDown}
            placeholder="Type a word..."
            disabled={gameStatus !== "playing"}
            className="word-input"
            autoFocus
          />
          <button
            className="submit-button"
            onClick={submitGuess}
            disabled={gameStatus !== "playing" || currentGuess.length !== 5}
          >
            Submit Guess
          </button>
        </div>
      </div>

      <div className="controls">
        <button className="new-game-button" onClick={initializeGame}>
          New Game
        </button>
      </div>
    </div>
  );
}
