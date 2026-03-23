import React, { createContext, useContext, useState } from "react";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [playerName, setPlayerNameState] = useState(
    () => localStorage.getItem("playerName") || "",
  );

  const setPlayerName = (name) => {
    const n = name.trim();
    localStorage.setItem("playerName", n);
    setPlayerNameState(n);
  };

  return (
    <PlayerContext.Provider value={{ playerName, setPlayerName }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
