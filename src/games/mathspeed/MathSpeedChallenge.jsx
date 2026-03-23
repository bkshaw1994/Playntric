import React, { useState, useEffect } from "react";
import "./MathSpeedChallenge.css";
import { Timer, Tv } from "lucide-react";
import RewardedAd from "../../components/common/RewardedAd";
import { usePremium } from "../../context/PremiumContext";
import { saveScore } from "../../components/common/Leaderboard";
import { usePlayer } from "../../context/PlayerContext";

export default function MathSpeedChallenge() {
  const [difficulty, setDifficulty] = useState(null);
  const [gameStatus, setGameStatus] = useState("setup"); // 'setup', 'playing', 'finished'
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [problemsCount, setProblemsCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showRewardedAd, setShowRewardedAd] = useState(false);
  const [extraTimeUsed, setExtraTimeUsed] = useState(false);
  const { isPremium } = usePremium();
  const { playerName } = usePlayer();

  useEffect(() => {
    if (gameStatus === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameStatus === "playing" && timeLeft === 0) {
      setGameStatus("finished");
    }
  }, [timeLeft, gameStatus]);

  const generateProblem = (diffLevel) => {
    const operations = ["+", "-", "*", "/"];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let num1, num2;

    switch (diffLevel) {
      case "easy":
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        break;
      case "medium":
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        break;
      case "hard":
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * 100) + 1;
        break;
      default:
        num1 = 0;
        num2 = 0;
    }

    let answer;
    switch (operation) {
      case "+":
        answer = num1 + num2;
        break;
      case "-":
        answer = num1 - num2;
        break;
      case "*":
        answer = num1 * num2;
        break;
      case "/":
        answer = Math.round((num1 / num2) * 100) / 100;
        break;
      default:
        answer = 0;
    }

    return { num1, num2, operation, answer };
  };

  const startGame = (level) => {
    setDifficulty(level);
    setGameStatus("playing");
    setTimeLeft(60);
    setScore(0);
    setProblemsCount(0);
    setCorrectCount(0);
    setUserAnswer("");
    setCurrentProblem(generateProblem(level));
    setExtraTimeUsed(false);
  };

  const checkAnswer = () => {
    const userVal = parseFloat(userAnswer);
    const isCorrect = Math.abs(userVal - currentProblem.answer) < 0.01;

    if (isCorrect) {
      setCorrectCount(correctCount + 1);
      setScore(
        score +
          (difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 30),
      );
    }

    setProblemsCount(problemsCount + 1);
    setUserAnswer("");
    setCurrentProblem(generateProblem(difficulty));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  };

  const resetGame = () => {
    setDifficulty(null);
    setGameStatus("setup");
    setTimeLeft(60);
    setScore(0);
    setProblemsCount(0);
    setCorrectCount(0);
    setUserAnswer("");
    setCurrentProblem(null);
    setExtraTimeUsed(false);
  };

  const addExtraTime = () => {
    setTimeLeft((t) => t + 30);
    setExtraTimeUsed(true);
  };

  const getAccuracy = () => {
    if (problemsCount === 0) return 0;
    return Math.round((correctCount / problemsCount) * 100);
  };

  if (gameStatus === "setup") {
    return (
      <div className="math-challenge-container">
        <h2>Math Speed Challenge</h2>
        <p className="game-description">
          Solve math problems as quickly as you can!
        </p>

        <div className="difficulty-selection">
          <button
            className="difficulty-button easy"
            onClick={() => startGame("easy")}
          >
            <div className="difficulty-icon">🟢</div>
            <div className="difficulty-name">Easy</div>
            <div className="difficulty-desc">1-10 Numbers</div>
          </button>

          <button
            className="difficulty-button medium"
            onClick={() => startGame("medium")}
          >
            <div className="difficulty-icon">🟡</div>
            <div className="difficulty-name">Medium</div>
            <div className="difficulty-desc">1-50 Numbers</div>
          </button>

          <button
            className="difficulty-button hard"
            onClick={() => startGame("hard")}
          >
            <div className="difficulty-icon">🔴</div>
            <div className="difficulty-name">Hard</div>
            <div className="difficulty-desc">1-100 Numbers</div>
          </button>
        </div>
      </div>
    );
  }

  if (gameStatus === "finished") {
    const accuracy = getAccuracy();
    // Save score to leaderboard
    saveScore("mathspeed", {
      name: playerName || "Anonymous",
      score,
      accuracy,
      difficulty,
    });

    return (
      <div className="math-challenge-container">
        <h2>Game Over!</h2>

        <div className="final-stats">
          <div className="stat-card">
            <div className="stat-label">Final Score</div>
            <div className="stat-value">{score}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Problems Solved</div>
            <div className="stat-value">
              {correctCount}/{problemsCount}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Accuracy</div>
            <div className="stat-value">{accuracy}%</div>
          </div>
        </div>

        <button className="restart-button" onClick={resetGame}>
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="math-challenge-container">
      <h2>
        Math Speed Challenge -{" "}
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </h2>

      <div className="game-header">
        <div className="timer">
          <span className={`time-display ${timeLeft <= 10 ? "warning" : ""}`}>
            <Timer size={16} /> {timeLeft}s
          </span>
        </div>
        <div className="score-display">💯 Score: {score}</div>
      </div>

      <div className="problem-area">
        <div className="problem">
          <span className="problem-number">{currentProblem.num1}</span>
          <span className="problem-operation">{currentProblem.operation}</span>
          <span className="problem-number">{currentProblem.num2}</span>
          <span className="equals">=</span>
          <span className="question-mark">?</span>
        </div>

        <div className="answer-section">
          <input
            type="text"
            inputMode="decimal"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Your answer..."
            className="answer-input"
            autoFocus
          />
          <button className="submit-answer-button" onClick={checkAnswer}>
            Submit
          </button>
        </div>
      </div>

      <div className="progress-section">
        <p className="progress-text">
          Problems: {problemsCount} | Correct: {correctCount}
        </p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${problemsCount > 0 ? (correctCount / problemsCount) * 100 : 0}%`,
            }}
          ></div>
        </div>
      </div>

      {(!extraTimeUsed || isPremium) && (
        <div className="extra-time-section">
          {isPremium ? (
            <button className="extra-time-btn" onClick={addExtraTime}>
              <Timer size={16} /> +30 Seconds (Premium)
            </button>
          ) : (
            <button
              className="extra-time-btn extra-time-ad"
              onClick={() => setShowRewardedAd(true)}
            >
              <Tv size={16} /> Watch Ad for +30s
            </button>
          )}
        </div>
      )}

      {showRewardedAd && (
        <RewardedAd
          rewardLabel="+30 seconds of extra time"
          onRewarded={addExtraTime}
          onClose={() => setShowRewardedAd(false)}
        />
      )}
    </div>
  );
}
