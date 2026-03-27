// Shared GenAI bot client for TicTacToe and Chess
// Usage: await getGenAIMove({ game, state })

export async function getGenAIMove({ game, state }) {
  try {
    const res = await fetch("/api/genai-move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game, state }),
    });
    if (!res.ok) throw new Error("GenAI API error");
    const data = await res.json();
    if (data && data.move !== undefined) return data.move;
    throw new Error(data.error || "No move");
  } catch (e) {
    return null; // Fallback to local AI
  }
}
