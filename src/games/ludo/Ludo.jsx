import React, { useState, useEffect } from "react";
import { Gamepad2, RotateCcw, Award, Users, ShieldAlert } from "lucide-react";
import { usePlayer } from "../../context/PlayerContext";
import "./Ludo.css";

const PLAYERS_CONFIG = [
  { id: 0, name: "Red", color: "#ef4444", startPos: 0, homeStart: 51, homePath: [100, 101, 102, 103, 104, 105] },
  { id: 1, name: "Green", color: "#22c55e", startPos: 13, homeStart: 12, homePath: [200, 201, 202, 203, 204, 205] },
  { id: 2, name: "Yellow", color: "#eab308", startPos: 26, homeStart: 25, homePath: [300, 301, 302, 303, 304, 305] },
  { id: 3, name: "Blue", color: "#3b82f6", startPos: 39, homeStart: 38, homePath: [400, 401, 402, 403, 404, 405] },
];

// Safe positions on main 52-cell track
const SAFE_CELLS = [0, 8, 13, 21, 26, 34, 39, 47];

export default function Ludo() {
  const { playerName } = usePlayer();
  const [numPlayers, setNumPlayers] = useState(2); // 2 or 4 players
  const [gameState, setGameState] = useState("start"); // 'start' | 'playing' | 'gameover'
  const [activePlayer, setActivePlayer] = useState(0); // 0..3
  const [diceVal, setDiceVal] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);
  const [statusMsg, setStatusMsg] = useState("Roll the dice to start your turn!");
  const [winner, setWinner] = useState(null);

  // Tokens representation: array of 4 players, each having 4 tokens: { id, pos: -1 (home base) | 0..51 (track) | 100+ (home stretch) | 999 (finished) }
  const [tokens, setTokens] = useState(() =>
    PLAYERS_CONFIG.map(() => [
      { id: 0, pos: -1, stepsMoved: 0 },
      { id: 1, pos: -1, stepsMoved: 0 },
      { id: 2, pos: -1, stepsMoved: 0 },
      { id: 3, pos: -1, stepsMoved: 0 },
    ])
  );

  const activePlayersList = numPlayers === 2 ? [0, 2] : [0, 1, 2, 3];

  const resetGame = () => {
    setGameState("start");
    setActivePlayer(activePlayersList[0]);
    setDiceVal(null);
    setIsRolling(false);
    setHasRolled(false);
    setStatusMsg("Roll the dice to start your turn!");
    setWinner(null);
    setTokens(
      PLAYERS_CONFIG.map(() => [
        { id: 0, pos: -1, stepsMoved: 0 },
        { id: 1, pos: -1, stepsMoved: 0 },
        { id: 2, pos: -1, stepsMoved: 0 },
        { id: 3, pos: -1, stepsMoved: 0 },
      ])
    );
  };

  const startGame = (mode = 2) => {
    setNumPlayers(mode);
    setGameState("playing");
    const firstP = mode === 2 ? 0 : 0;
    setActivePlayer(firstP);
    setDiceVal(null);
    setHasRolled(false);
    setStatusMsg(`${PLAYERS_CONFIG[firstP].name}'s turn. Roll the dice!`);
  };

  const rollDice = () => {
    if (isRolling || hasRolled || gameState !== "playing") return;
    setIsRolling(true);

    let rollCount = 0;
    const interval = setInterval(() => {
      setDiceVal(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      if (rollCount > 10) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDiceVal(finalRoll);
        setIsRolling(false);
        setHasRolled(true);
        processRoll(finalRoll);
      }
    }, 60);
  };

  const processRoll = (roll) => {
    const playerTokens = tokens[activePlayer];
    const movable = playerTokens.filter((t) => canMoveToken(t, roll));

    if (movable.length === 0) {
      setStatusMsg(
        `${PLAYERS_CONFIG[activePlayer].name} rolled a ${roll}! No legal moves available.`
      );
      setTimeout(() => passTurn(false), 1200);
    } else if (movable.length === 1 && (roll !== 6 || playerTokens.every((t) => t.pos !== -1))) {
      // Auto move if only 1 token is movable
      setStatusMsg(`${PLAYERS_CONFIG[activePlayer].name} rolled a ${roll}! Moving token...`);
      setTimeout(() => moveToken(movable[0].id, roll), 600);
    } else {
      setStatusMsg(
        `${PLAYERS_CONFIG[activePlayer].name} rolled a ${roll}! Click a token to move.`
      );
    }
  };

  const canMoveToken = (token, roll) => {
    if (token.pos === 999) return false; // Finished
    if (token.pos === -1) return roll === 6; // Needs a 6 to come out
    // Check if step count exceeds 57 (52 track + 5 home stretch)
    return token.stepsMoved + roll <= 57;
  };

  const passTurn = (gotExtraTurn) => {
    if (gotExtraTurn) {
      setHasRolled(false);
      setStatusMsg(`${PLAYERS_CONFIG[activePlayer].name} gets an extra roll!`);
      return;
    }

    const currentIndex = activePlayersList.indexOf(activePlayer);
    const nextIndex = (currentIndex + 1) % activePlayersList.length;
    const nextP = activePlayersList[nextIndex];

    setActivePlayer(nextP);
    setHasRolled(false);
    setStatusMsg(`${PLAYERS_CONFIG[nextP].name}'s turn. Roll the dice!`);
  };

  const moveToken = (tokenId, roll) => {
    if (!hasRolled || isRolling) return;

    const p = activePlayer;
    const currentTokens = tokens[p];
    const targetToken = currentTokens.find((t) => t.id === tokenId);

    if (!targetToken || !canMoveToken(targetToken, roll)) return;

    let extraTurnGranted = roll === 6;

    const newTokensState = tokens.map((playerToks, pIdx) => {
      if (pIdx !== p) return playerToks;

      return playerToks.map((t) => {
        if (t.id !== tokenId) return t;

        if (t.pos === -1 && roll === 6) {
          // Out of home base
          return { ...t, pos: PLAYERS_CONFIG[p].startPos, stepsMoved: 1 };
        }

        const newSteps = t.stepsMoved + roll;
        if (newSteps === 57) {
          // Finished home
          return { ...t, pos: 999, stepsMoved: 57 };
        } else if (newSteps > 51) {
          // Inside home path
          const homeIndex = newSteps - 52;
          return {
            ...t,
            pos: PLAYERS_CONFIG[p].homePath[homeIndex],
            stepsMoved: newSteps,
          };
        } else {
          // Main loop
          const newPos = (t.pos + roll) % 52;
          return { ...t, pos: newPos, stepsMoved: newSteps };
        }
      });
    });

    // Check for capturing opponent tokens
    const movedTok = newTokensState[p].find((t) => t.id === tokenId);
    if (
      movedTok.pos >= 0 &&
      movedTok.pos < 52 &&
      !SAFE_CELLS.includes(movedTok.pos)
    ) {
      activePlayersList.forEach((oppP) => {
        if (oppP === p) return;
        newTokensState[oppP] = newTokensState[oppP].map((oppTok) => {
          if (oppTok.pos === movedTok.pos) {
            extraTurnGranted = true;
            setStatusMsg(
              `💥 ${PLAYERS_CONFIG[p].name} captured ${PLAYERS_CONFIG[oppP].name}'s token!`
            );
            return { ...oppTok, pos: -1, stepsMoved: 0 };
          }
          return oppTok;
        });
      });
    }

    setTokens(newTokensState);

    // Check Win Condition: All 4 tokens finished
    const allFinished = newTokensState[p].every((t) => t.pos === 999);
    if (allFinished) {
      setWinner(PLAYERS_CONFIG[p]);
      setGameState("gameover");
      return;
    }

    passTurn(extraTurnGranted);
  };

  return (
    <div className="ludo-wrapper">
      <div className="ludo-header">
        <h1>
          <Gamepad2 size={28} /> Ludo Classic
        </h1>
        <p className="ludo-subtitle">
          Strategic dice rolling & token race to home base
        </p>
      </div>

      {gameState === "start" ? (
        <div className="ludo-start-card">
          <h2>Select Player Mode</h2>
          <p>Choose your preferred mode to begin the match:</p>

          <div className="mode-selection-buttons">
            <button
              className="mode-btn mode-2p"
              onClick={() => startGame(2)}
            >
              <Users size={20} /> 2 Players (Red vs Yellow)
            </button>
            <button
              className="mode-btn mode-4p"
              onClick={() => startGame(4)}
            >
              <Users size={20} /> 4 Players (All Colors)
            </button>
          </div>

          <div className="rules-summary">
            <h3>Quick Rules</h3>
            <ul>
              <li>🎲 Roll a <strong>6</strong> to bring a token out of home base.</li>
              <li>🛡️ Star spots are <strong>safe zones</strong> where tokens cannot be captured.</li>
              <li>💥 Landing on an opponent token returns it to home base!</li>
              <li>🏆 First player to get all 4 tokens home wins!</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="ludo-play-area">
          {/* Status & Control Panel */}
          <div className="ludo-control-bar">
            <div className="active-player-display">
              <span
                className="player-indicator-dot"
                style={{ backgroundColor: PLAYERS_CONFIG[activePlayer].color }}
              ></span>
              <span className="player-turn-text">
                Current Turn: <strong>{PLAYERS_CONFIG[activePlayer].name}</strong>
              </span>
            </div>

            <div className="status-banner">{statusMsg}</div>

            <div className="dice-container">
              <button
                className={`dice-box ${isRolling ? "rolling" : ""} ${
                  hasRolled ? "rolled" : ""
                }`}
                onClick={rollDice}
                disabled={isRolling || hasRolled}
                style={{ borderColor: PLAYERS_CONFIG[activePlayer].color }}
              >
                {diceVal ? diceVal : "🎲"}
              </button>
              <button
                className="roll-btn"
                onClick={rollDice}
                disabled={isRolling || hasRolled}
              >
                {isRolling ? "Rolling..." : "Roll Dice"}
              </button>
            </div>
          </div>

          {/* Board Display */}
          <div className="ludo-board-frame">
            {activePlayersList.map((pIdx) => {
              const cfg = PLAYERS_CONFIG[pIdx];
              const pTokens = tokens[pIdx];
              return (
                <div key={cfg.id} className={`player-yard yard-${cfg.name.toLowerCase()}`}>
                  <h4 style={{ color: cfg.color }}>{cfg.name} Yard</h4>
                  <div className="yard-tokens-grid">
                    {pTokens.map((t) => {
                      const isMovable =
                        activePlayer === pIdx &&
                        hasRolled &&
                        canMoveToken(t, diceVal);

                      return (
                        <button
                          key={t.id}
                          className={`ludo-token ${t.pos === -1 ? "in-yard" : "on-board"} ${
                            isMovable ? "movable-glow" : ""
                          }`}
                          style={{ backgroundColor: cfg.color }}
                          onClick={() => activePlayer === pIdx && moveToken(t.id, diceVal)}
                          disabled={!isMovable}
                          title={`Token ${t.id + 1} (${t.pos === -1 ? "Home Base" : t.pos === 999 ? "Finished" : `Cell ${t.pos}`})`}
                        >
                          {t.id + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bottom-controls">
            <button className="reset-game-btn" onClick={resetGame}>
              <RotateCcw size={16} /> New Match
            </button>
          </div>
        </div>
      )}

      {/* Winner Celebration Modal */}
      {winner && (
        <div className="winner-modal-overlay">
          <div className="winner-modal-card">
            <div className="winner-icon-wrap" style={{ backgroundColor: winner.color }}>
              <Award size={48} />
            </div>
            <h2>🏆 Victory!</h2>
            <p>
              <strong>{winner.name}</strong> has successfully moved all tokens home!
            </p>
            <button className="winner-restart-btn" onClick={resetGame}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
