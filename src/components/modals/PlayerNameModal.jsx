import React, { useState } from "react";
import { User, Swords } from "lucide-react";
import { usePlayer } from "../../context/PlayerContext";
import "./PlayerNameModal.css";

export default function PlayerNameModal({ onClose }) {
  const { playerName, setPlayerName } = usePlayer();
  const [input, setInput] = useState(playerName || "");

  const handleSave = () => {
    if (!input.trim()) return;
    setPlayerName(input.trim());
    onClose?.();
  };

  return (
    <div className="pn-backdrop">
      <div className="pn-modal">
        <div className="pn-icon">
          <User size={48} />
        </div>
        <h2>What&apos;s your name?</h2>
        <p className="pn-sub">Your name will appear on scores</p>

        <input
          className="pn-input"
          type="text"
          placeholder="Enter your name..."
          value={input}
          maxLength={20}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          autoFocus
        />
        <p className="pn-char">{input.length}/20 characters</p>

        <button
          className="pn-btn"
          onClick={handleSave}
          disabled={!input.trim()}
        >
          <Swords size={18} /> Let&apos;s Play!
        </button>
      </div>
    </div>
  );
}
