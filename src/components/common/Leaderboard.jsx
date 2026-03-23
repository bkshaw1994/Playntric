import React, { useState, useEffect } from "react";
import {
  Trophy,
  Calculator,
  BookOpen,
  Grid3x3,
  Crown,
  Hash,
  Gamepad2,
  X,
  Globe,
  HardDrive,
} from "lucide-react";
import { usePlayer } from "../../context/PlayerContext";
import { supabase, isSupabaseReady } from "../../lib/supabase";
import "./Leaderboard.css";

const GAMES = [
  {
    key: "mathspeed",
    icon: <Calculator size={15} />,
    label: "Math Speed",
    scoreLabel: "Score",
    extraLabel: "Accuracy",
    extraKey: "accuracy",
    extraSuffix: "%",
  },
  {
    key: "wordle",
    icon: <BookOpen size={15} />,
    label: "Wordle",
    scoreLabel: "Score",
    extraLabel: "Attempts",
    extraKey: "attempts",
    extraSuffix: "/6",
  },
  {
    key: "sudoku",
    icon: <Grid3x3 size={15} />,
    label: "Sudoku",
    scoreLabel: "Score",
    extraLabel: null,
  },
  {
    key: "chess",
    icon: <Crown size={15} />,
    label: "Chess",
    scoreLabel: "Win pts",
    extraLabel: null,
  },
  {
    key: "tictactoe",
    icon: <Hash size={15} />,
    label: "Tic Tac Toe",
    scoreLabel: "Win pts",
    extraLabel: null,
  },
];

// ─── Score persistence ────────────────────────────────────────────────────

export function saveScore(game, entry) {
  const resolvedName =
    (
      entry?.name ||
      sessionStorage.getItem("guestPlayerName") ||
      localStorage.getItem("authPlayerName") ||
      localStorage.getItem("playerName") ||
      "Anonymous"
    )
      .toString()
      .trim() || "Anonymous";
  const resolvedScore = Number(entry?.score ?? 0) || 0;

  // Always save locally first (offline support + fast reads)
  const key = `lb_${game}`;
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  existing.push({
    ...entry,
    name: resolvedName,
    score: resolvedScore,
    date: new Date().toLocaleDateString(),
  });
  existing.sort((a, b) => b.score - a.score);
  localStorage.setItem(key, JSON.stringify(existing.slice(0, 100)));

  // Save to Supabase if configured (fire-and-forget)
  if (supabase) {
    const { name, score, ...metadata } = entry || {};
    supabase
      .from("scores")
      .insert({
        game,
        player_name: resolvedName,
        score: resolvedScore,
        metadata,
      })
      .then(({ error }) => {
        if (error) console.warn("Supabase save failed:", error.message);
      });
  }
}

// ─── Data fetching ─────────────────────────────────────────────────────────

function deduplicateByPlayer(rows) {
  const best = {};
  for (const row of rows) {
    const name = (row.player_name || row.name || "Anonymous").trim();
    const nameKey = name.toLowerCase();
    const score = row.score ?? 0;
    if (!best[nameKey] || score > best[nameKey].score) {
      best[nameKey] = {
        name,
        score,
        metadata: row.metadata || row,
        date:
          row.date ||
          (row.created_at ? row.created_at.split("T")[0] : "") ||
          "",
      };
    }
  }
  return Object.values(best)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

async function fetchScores(game) {
  if (supabase) {
    const { data, error } = await supabase
      .from("scores")
      .select("*")
      .eq("game", game)
      .order("score", { ascending: false })
      .limit(200);

    if (!error && data?.length > 0) return deduplicateByPlayer(data);
  }

  // Fallback: localStorage
  const local = JSON.parse(localStorage.getItem(`lb_${game}`) || "[]");
  return deduplicateByPlayer(local.map((e) => ({ ...e, player_name: e.name })));
}

// ─── Leaderboard component ────────────────────────────────────────────────

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboard({ game, onClose, standalone = false }) {
  const { playerName } = usePlayer();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGame, setActiveGame] = useState(game || "mathspeed");

  const activeMeta = GAMES.find((g) => g.key === activeGame);

  useEffect(() => {
    setLoading(true);
    fetchScores(activeGame).then((s) => {
      setScores(s);
      setLoading(false);
    });
  }, [activeGame]);

  const myRank = playerName
    ? scores.findIndex(
        (s) => s.name.toLowerCase() === playerName.toLowerCase(),
      ) + 1
    : 0;

  const clearLocalScores = () => {
    localStorage.removeItem(`lb_${activeGame}`);
    setScores([]);
  };

  const modal = (
    <div className={`lb-modal ${standalone ? "lb-modal-standalone" : ""}`}>
      {!standalone && (
        <button className="lb-close" onClick={onClose}>
          <X size={18} />
        </button>
      )}

      <h2>
        <Trophy size={24} /> Leaderboard
      </h2>

      {isSupabaseReady ? (
        <div className="lb-banner lb-global">
          <Globe size={13} /> Global rankings — all players worldwide
        </div>
      ) : (
        <div className="lb-banner lb-local">
          <HardDrive size={13} /> Local scores only — configure Supabase in{" "}
          <code>.env</code> for global rankings
        </div>
      )}

      {playerName && myRank > 0 && (
        <div className="lb-my-rank">
          Your rank in <strong>{activeMeta?.label}</strong>:{" "}
          <span className="rank-badge">#{myRank}</span> out of {scores.length}
        </div>
      )}

      <div className="lb-tabs">
        {GAMES.map((tab) => (
          <button
            key={tab.key}
            className={`lb-tab ${activeGame === tab.key ? "active" : ""}`}
            onClick={() => setActiveGame(tab.key)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="lb-loading">Loading scores…</div>
      ) : scores.length === 0 ? (
        <div className="lb-empty">
          <p>
            <Gamepad2 size={24} /> No scores yet!
          </p>
          <p>Play a game to record your first score.</p>
        </div>
      ) : (
        <table className="lb-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>{activeMeta?.scoreLabel || "Score"}</th>
              {activeMeta?.extraLabel && <th>{activeMeta.extraLabel}</th>}
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((entry, i) => {
              const isMe =
                playerName &&
                entry.name.toLowerCase() === playerName.toLowerCase();
              return (
                <tr
                  key={i}
                  className={[
                    i < 3 ? "top-row" : "",
                    isMe ? "my-row" : "",
                  ].join(" ")}
                >
                  <td>{MEDALS[i] || i + 1}</td>
                  <td className="player-cell">
                    {entry.name}
                    {isMe && <span className="you-badge">YOU</span>}
                  </td>
                  <td className="score-cell">{entry.score}</td>
                  {activeMeta?.extraLabel && (
                    <td>
                      {entry.metadata?.[activeMeta.extraKey] != null
                        ? `${entry.metadata[activeMeta.extraKey]}${activeMeta.extraSuffix || ""}`
                        : "-"}
                    </td>
                  )}
                  <td>{entry.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {!isSupabaseReady && (
        <button className="lb-clear" onClick={clearLocalScores}>
          Clear local scores
        </button>
      )}
    </div>
  );

  if (standalone) {
    return <div className="lb-page-shell">{modal}</div>;
  }

  return (
    <div
      className="lb-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      {modal}
    </div>
  );
}
