import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Gamepad2,
  ArrowRight,
  Search,
} from "lucide-react";
import Seo from "../components/common/Seo";
import { GAMES } from "../constants/games";
import "../styles/Home.css";

const CATEGORIES = ["All", "Strategy", "Puzzle", "Math", "Word"];

const GAME_METADATA = {
  "/sudoku": { category: "Puzzle", rating: "4.9 ★", difficulty: "Easy - Hard" },
  "/chess": { category: "Strategy", rating: "4.9 ★", difficulty: "AI & Local" },
  "/wordle": { category: "Word", rating: "4.8 ★", difficulty: "4, 5, 6 Letters" },
  "/tictactoe": { category: "Strategy", rating: "4.7 ★", difficulty: "AI & Local" },
  "/mathspeed": { category: "Math", rating: "4.8 ★", difficulty: "60s Challenge" },
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredGames = useMemo(() => {
    return GAMES.filter((game) => {
      const meta = GAME_METADATA[game.path] || { category: "General" };
      const matchesSearch =
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat =
        activeCategory === "All" || meta.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchTerm, activeCategory]);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Playntric",
        url: "https://playntric.vercel.app/",
        description:
          "Free online browser games including Sudoku, Chess, Wordle, Tic Tac Toe, and Math Speed Challenge.",
      },
      {
        "@type": "ItemList",
        name: "Playntric Games",
        itemListElement: GAMES.map((game, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Game",
            name: game.name,
            url: `https://playntric.vercel.app${game.path}`,
            description: game.description,
          },
        })),
      },
    ],
  };

  return (
    <div className="home-container">
      <Seo
        title="Playntric | Pro Online Browser Gaming Portal"
        description="Play free online browser games on Playntric, including Sudoku, Chess, Wordle, Tic Tac Toe, and Math Speed Challenge."
        path="/"
        keywords={[
          "free online games",
          "browser games",
          "Playntric",
          "sudoku online",
          "play chess online",
          "wordle game",
          "tic tac toe online",
          "math games",
        ]}
        structuredData={structuredData}
      />

      {/* Top Search & Category Filter Bar */}
      <section className="portal-toolbar">
        <div className="search-input-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search games (e.g. Chess, Sudoku...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="game-search-input"
          />
        </div>

        <div className="category-filter-chips">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              className={`filter-chip ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Games Grid */}
      <section className="games-section">
        <div className="section-header-row">
          <h2>
            <Gamepad2 size={24} /> Featured Games ({filteredGames.length})
          </h2>
        </div>

        {filteredGames.length === 0 ? (
          <div className="no-games-found">
            <p>No games matched your search "{searchTerm}".</p>
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("All");
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="games-grid">
            {filteredGames.map((game) => {
              const meta = GAME_METADATA[game.path] || {
                category: "Puzzle",
                rating: "4.8 ★",
                difficulty: "Normal",
              };

              return (
                <Link to={game.path} key={game.name} className="game-card-link">
                  <div
                    className="game-card"
                    style={{ "--accent-color": game.color }}
                  >
                    <div className="card-top-bar">
                      <span className="card-cat-badge">{meta.category}</span>
                      <span className="card-rating">{meta.rating}</span>
                    </div>

                    <div className="game-icon-wrap" style={{ color: game.color }}>
                      <span className="game-emoji">{game.icon}</span>
                    </div>

                    <h3 className="game-name">{game.name}</h3>
                    <p className="game-description">{game.description}</p>

                    <div className="card-footer-bar">
                      <span className="game-diff-tag">{meta.difficulty}</span>
                      <span className="play-button">
                        Play <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Why Playntric Feature Section */}
      <section className="why-section">
        <h2>Why Gamers Choose Playntric</h2>
        <div className="why-grid">
          <div className="why-card">
            <h3>⚡ Lightning Fast Engine</h3>
            <p>
              Built with Vite & React for sub-second loading speeds and zero latency.
            </p>
          </div>
          <div className="why-card">
            <h3>📱 Cross-Platform Ready</h3>
            <p>
              Play smoothly on your desktop, laptop, tablet, or smartphone.
            </p>
          </div>
          <div className="why-card">
            <h3>🏆 Global High Scores</h3>
            <p>
              Compete on real-time leaderboards and track your game statistics.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
