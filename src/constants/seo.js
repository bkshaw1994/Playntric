export const SITE_NAME = "Playntric";
export const SITE_URL =
  import.meta.env.VITE_SITE_URL || "https://playntric.vercel.app";
export const DEFAULT_TITLE =
  "Playntric | Free Online Sudoku, Chess, Wordle, Tic Tac Toe and Math Games";
export const DEFAULT_DESCRIPTION =
  "Play free online browser games on Playntric, including Sudoku, Chess, Wordle, Tic Tac Toe, and Math Speed Challenge.";
export const DEFAULT_KEYWORDS = [
  "free online games",
  "browser games",
  "sudoku online",
  "play chess online",
  "wordle game",
  "tic tac toe online",
  "math games",
  "puzzle games",
  "Playntric",
];
export const DEFAULT_OG_IMAGE = "/playntric-og.svg";

export function getAbsoluteUrl(path = "/") {
  try {
    const base =
      typeof window !== "undefined" ? window.location.origin : SITE_URL;
    return new URL(path, base).toString();
  } catch {
    return SITE_URL;
  }
}
