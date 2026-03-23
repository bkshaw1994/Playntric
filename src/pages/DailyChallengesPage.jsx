import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Flame, Rocket, Share2, Sparkles } from "lucide-react";
import Seo from "../components/common/Seo";
import { GAMES } from "../constants/games";
import "../styles/ChallengePages.css";

const QUEST_STORAGE_KEY = "playntric_daily_quest";
const STREAK_KEY = "playntric_streak";
const LAST_ACTIVE_DAY_KEY = "playntric_last_active_day";

const QUEST_MODIFIERS = [
  "No pauses allowed",
  "Speed focus: finish under 12 mins",
  "Accuracy mode: avoid mistakes",
  "Hardcore run: no retries",
  "Warm-up to win streak",
  "Precision mode: play calmly",
  "Combo chain: complete in order",
  "Champion route enabled",
];

function getDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function createQuest() {
  const shuffled = [...GAMES].sort(() => Math.random() - 0.5);
  return {
    dateKey: getDateKey(),
    codename: `Quest-${Math.floor(Math.random() * 9000) + 1000}`,
    games: shuffled.slice(0, 3).map((game) => ({
      name: game.name,
      path: game.path,
      icon: game.icon,
    })),
    modifiers: [...QUEST_MODIFIERS].sort(() => Math.random() - 0.5).slice(0, 2),
    xpReward: 180 + Math.floor(Math.random() * 90),
    startedAt: null,
  };
}

export default function DailyChallengesPage() {
  const [quest, setQuest] = useState(() => {
    try {
      const raw = localStorage.getItem(QUEST_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [streak, setStreak] = useState(() =>
    parseInt(localStorage.getItem(STREAK_KEY) || "0", 10),
  );
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const today = getDateKey();
    if (!quest || quest.dateKey !== today) setQuest(createQuest());
  }, []);

  useEffect(() => {
    if (!quest) return;
    localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(quest));
  }, [quest]);

  const startQuest = () => {
    if (!quest || quest.startedAt) return;
    const today = getDateKey();
    const lastActive = localStorage.getItem(LAST_ACTIVE_DAY_KEY);
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yesterday = getDateKey(y);

    if (lastActive === yesterday) setStreak((s) => s + 1);
    else if (lastActive !== today) setStreak(1);

    localStorage.setItem(LAST_ACTIVE_DAY_KEY, today);
    const updated = { ...quest, startedAt: new Date().toISOString() };
    setQuest(updated);
    localStorage.setItem(
      STREAK_KEY,
      String(lastActive === yesterday ? streak + 1 : 1),
    );
  };

  const reroll = () => setQuest(createQuest());

  const shareQuest = async () => {
    if (!quest) return;
    const text = `${quest.codename}: ${quest.games.map((g) => g.name).join(" -> ")} | ${quest.modifiers.join(" + ")}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Playntric Daily Challenge",
          text,
          url: window.location.origin,
        });
      } else {
        await navigator.clipboard.writeText(
          `${text}\n${window.location.origin}`,
        );
      }
      setMsg("Challenge shared.");
    } catch {
      setMsg("Share cancelled.");
    }
    setTimeout(() => setMsg(""), 2200);
  };

  if (!quest) return null;

  return (
    <div className="challenge-page">
      <Seo
        title="Daily Challenges | Playntric"
        description="Playntric Daily Challenges: complete the rotating challenge route and keep your streak alive."
        path="/daily-challenges"
      />
      <h1>Daily Challenges</h1>
      <p className="challenge-intro">
        Complete today&apos;s route to keep your streak and beat your friends.
      </p>

      <section className="challenge-card">
        <div className="challenge-row top">
          <h2>{quest.codename}</h2>
          <span className="challenge-pill">
            <Flame size={14} /> {streak} day streak
          </span>
        </div>

        <div className="challenge-path">
          {quest.games.map((game, i) => (
            <div key={game.path} className="challenge-node">
              <span>{game.icon}</span>
              <span>{game.name}</span>
              {i < quest.games.length - 1 && <ArrowRight size={14} />}
            </div>
          ))}
        </div>

        <div className="challenge-mods">
          {quest.modifiers.map((mod) => (
            <span key={mod} className="chip">
              {mod}
            </span>
          ))}
        </div>

        <p className="challenge-reward">
          <Rocket size={15} /> Reward: {quest.xpReward} XP
        </p>

        <div className="challenge-actions">
          <Link
            to={quest.games[0].path}
            className="btn primary"
            onClick={startQuest}
          >
            Start Challenge
          </Link>
          <button className="btn" onClick={reroll}>
            <Sparkles size={15} /> Reroll
          </button>
          <button className="btn" onClick={shareQuest}>
            <Share2 size={15} /> Share
          </button>
        </div>
        {msg && <p className="challenge-msg">{msg}</p>}
      </section>
    </div>
  );
}
