import React, { createContext, useContext, useState, useMemo, useCallback } from "react";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [playerName, setPlayerNameState] = useState(
    () => localStorage.getItem("playerName") || "",
  );

  const setPlayerName = useCallback((name) => {
    const n = (name || "").trim();
    localStorage.setItem("playerName", n);
    setPlayerNameState(n);
  }, []);

  const contextValue = useMemo(
    () => ({ playerName, setPlayerName }),
    [playerName, setPlayerName]
  );

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
