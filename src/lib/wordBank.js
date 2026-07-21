// Dictionary-backed word bank for Wordle.
// Fetches a random real word of the requested length from the Datamuse API
// (https://api.datamuse.com) so target words are not hard-coded. Falls back to
// a small offline list per length if the network/API is unavailable.

const FALLBACK_WORDS = {
  4: ["GAME", "WORD", "PLAY", "MOVE", "STAR", "CODE", "QUIZ", "MIND", "LUCK"],
  5: ["REACT", "GAMES", "CHESS", "BOARD", "SCORE", "BRAIN", "LOGIC", "QUEEN"],
  6: ["PUZZLE", "PLAYER", "WINNER", "CASTLE", "KNIGHT", "MEMORY", "STREAK"],
};

function randomIndex(size) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  // Rejection-free modulo is fine here: bias is negligible for small lists.
  return buf[0] % size;
}

function pick(arr) {
  return arr[randomIndex(arr.length)];
}

// Returns a random uppercase dictionary word of exactly `length` letters.
export async function getRandomWord(length) {
  const fallback = FALLBACK_WORDS[length] || FALLBACK_WORDS[5];
  try {
    const pattern = "?".repeat(length);
    const res = await fetch(
      `https://api.datamuse.com/words?sp=${pattern}&max=1000`,
    );
    if (!res.ok) throw new Error("Dictionary API error");
    const data = await res.json();
    const words = (data || [])
      .map((entry) => (entry.word || "").toUpperCase())
      .filter((word) => word.length === length && /^[A-Z]+$/.test(word));
    if (words.length === 0) throw new Error("No words returned");
    return pick(words);
  } catch (e) {
    return pick(fallback);
  }
}
