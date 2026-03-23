import React, { createContext, useContext, useState, useEffect } from "react";

const PremiumContext = createContext();

export function PremiumProvider({ children }) {
  // Premium is enabled for all users (modal disabled)
  const isPremium = true;

  const [chessTheme, setChessTheme] = useState(() => {
    return localStorage.getItem("chessTheme") || "classic";
  });

  const unlockPremium = () => {};

  const updateChessTheme = (theme) => {
    setChessTheme(theme);
    localStorage.setItem("chessTheme", theme);
  };

  return (
    <PremiumContext.Provider
      value={{ isPremium, unlockPremium, chessTheme, updateChessTheme }}
    >
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  return useContext(PremiumContext);
}
