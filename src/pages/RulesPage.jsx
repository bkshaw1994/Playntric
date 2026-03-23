import React from "react";
import Seo from "../components/common/Seo";
import "../styles/InfoPages.css";

const RULES = [
  {
    game: "Sudoku",
    points: [
      "Fill all 81 cells with numbers 1 to 9.",
      "Each row, column, and 3x3 box must contain unique digits.",
      "Use hints strategically to maximize your score.",
    ],
  },
  {
    game: "Chess",
    points: [
      "Checkmate the opponent king to win.",
      "Use legal moves only; invalid moves are blocked.",
      "Bot and local modes are available.",
    ],
  },
  {
    game: "Wordle",
    points: [
      "Guess the hidden word in six attempts.",
      "Green means correct letter and position.",
      "Yellow means correct letter but wrong position.",
    ],
  },
  {
    game: "Tic Tac Toe",
    points: [
      "Get three of your marks in a row, column, or diagonal.",
      "If all cells are filled with no line, it is a draw.",
      "Bot and local player modes are supported.",
    ],
  },
  {
    game: "Math Speed Challenge",
    points: [
      "Solve as many math problems as possible before time ends.",
      "Higher accuracy improves your leaderboard outcome.",
      "Use extra-time rewards smartly in critical moments.",
    ],
  },
];

export default function RulesPage() {
  return (
    <div className="info-page-container">
      <Seo
        title="Game Rules | Playntric"
        description="Official game rules for Sudoku, Chess, Wordle, Tic Tac Toe, and Math Speed Challenge on Playntric."
        path="/rules"
      />
      <h1>Rules of the Game</h1>
      <p className="info-page-intro">
        Follow these quick rules to play better, improve your score, and climb
        the leaderboard.
      </p>

      <section className="info-card-list" aria-label="Game rules list">
        {RULES.map((rule) => (
          <article key={rule.game} className="info-card">
            <h2>{rule.game}</h2>
            <ul>
              {rule.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </div>
  );
}
