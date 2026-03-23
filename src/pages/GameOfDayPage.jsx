import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Copy, Share2, Star } from "lucide-react";
import Seo from "../components/common/Seo";
import { GAMES } from "../constants/games";
import "../styles/ChallengePages.css";

export default function GameOfDayPage() {
  const [msg, setMsg] = useState("");

  const gameOfDay = useMemo(() => {
    const seed = new Date().toISOString().slice(0, 10);
    const hash = seed
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return GAMES[hash % GAMES.length];
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${gameOfDay.path}`,
      );
      setMsg("Link copied.");
    } catch {
      setMsg("Could not copy.");
    }
    setTimeout(() => setMsg(""), 2200);
  };

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Playntric Game of the Day: ${gameOfDay.name}`,
          text: `Today\'s game is ${gameOfDay.name}. Join me on Playntric!`,
          url: `${window.location.origin}${gameOfDay.path}`,
        });
      } else {
        await copyLink();
      }
      setMsg("Shared successfully.");
    } catch {
      setMsg("Share cancelled.");
    }
    setTimeout(() => setMsg(""), 2200);
  };

  return (
    <div className="challenge-page">
      <Seo
        title="Game of the Day | Playntric"
        description="Discover and play the Playntric Game of the Day with one click."
        path="/game-of-the-day"
      />
      <h1>Game of the Day</h1>
      <p className="challenge-intro">
        A fresh daily pick chosen from the top Playntric games.
      </p>

      <section className="challenge-card game-day">
        <p className="game-day-label">
          <Star size={16} /> Today&apos;s Pick
        </p>
        <h2>
          {gameOfDay.icon} {gameOfDay.name}
        </h2>
        <p>{gameOfDay.description}</p>
        <div className="challenge-actions">
          <Link to={gameOfDay.path} className="btn primary">
            Play {gameOfDay.name} <ArrowRight size={14} />
          </Link>
          <button className="btn" onClick={copyLink}>
            <Copy size={14} /> Copy Link
          </button>
          <button className="btn" onClick={share}>
            <Share2 size={14} /> Share
          </button>
        </div>
        {msg && <p className="challenge-msg">{msg}</p>}
      </section>
    </div>
  );
}
