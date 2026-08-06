import React, { createContext, useContext, useState, useMemo, useCallback } from "react";

const PremiumContext = createContext(null);

export function PremiumProvider({ children }) {
  // Premium is enabled for all users (modal disabled)
  const isPremium = true;

  const [chessTheme, setChessTheme] = useState(() => {
    return localStorage.getItem("chessTheme") || "classic";
  });

  const unlockPremium = useCallback(() => {}, []);

  const updateChessTheme = useCallback((theme) => {
    setChessTheme(theme);
    localStorage.setItem("chessTheme", theme);
  }, []);

  const contextValue = useMemo(
    () => ({ isPremium, unlockPremium, chessTheme, updateChessTheme }),
    [isPremium, unlockPremium, chessTheme, updateChessTheme]
  );

  return (
    <PremiumContext.Provider value={contextValue}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  return useContext(PremiumContext);
}
