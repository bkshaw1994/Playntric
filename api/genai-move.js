Strategy Priorities:
- Prioritize checkmate above all.
- Avoid moves that lead to checkmate.
- Maximize material advantage.
- Control the center of the board.
- Develop pieces early (especially knights and bishops).
- Ensure king safety (castle early if possible).
- Avoid blunders (do not leave pieces undefended or hang material).
Game End Conditions:
- The game ends immediately if any of the following occur:
  - Checkmate (win)
  - Stalemate (draw)
  - Any draw condition is met (threefold repetition, 50-move rule, insufficient material, etc.)
  - Resignation (if implemented)
Output Format Rule:
- Use standard algebraic notation for all moves (e.g., e4, Nf3, Qxd5, O-O, e8=Q).
- Do not include explanations unless explicitly asked.
Insufficient Material Rule:
- If neither player has enough material to checkmate, the game is a draw.
- Examples:
  - King vs King
  - King + Bishop vs King
  - King + Knight vs King
Fifty-Move Rule:
- If 50 moves occur without any pawn movement or capture, the game can be declared a draw.
Threefold Repetition Rule:
- If the same position occurs three times, the game can be declared a draw.
Illegal Move Rules:
- Moves that violate the rules are illegal and must be rejected.
- Examples of illegal moves:
  - Moving into check
  - Moving an opponent's piece
  - Jumping over pieces (except for knights)
En Passant Rules:
- If a pawn moves two squares forward and lands beside an opponent pawn, that pawn may capture it as if it moved one square.
- This must be done immediately on the next move or the right is lost.
Stalemate Rules:
- Stalemate occurs when a player has no legal moves but is NOT in check.
- The game ends in a draw.
Checkmate Rules:
- Checkmate occurs when the king is in check and no legal move can remove it.
- The game ends immediately, and the attacking player wins.
Check Rules:
- A king is in check if it is under attack.
- The player must remove the check immediately.
- Legal responses: move the king, block the attack, or capture the attacking piece.
Capturing Rules:
- A piece captures by moving to a square occupied by an opponent's piece.
- The captured piece is removed from the board.
- You cannot capture your own pieces.
Bishop Movement Rules:
- Bishops move diagonally any number of squares.
- Bishops cannot jump over pieces.

Knight Movement Rules:
- Knights move in an L-shape (2 squares in one direction, then 1 perpendicular).
- Knights can jump over pieces.

Queen Movement Rules:
- The queen combines rook and bishop movement.
- The queen moves any number of squares in any direction.

King Movement Rules:
- The king moves one square in any direction.
- The king cannot move into check.
Rook Movement Rules:
- Rooks move any number of squares horizontally or vertically.
- Rooks cannot jump over pieces.
// Serverless endpoint for GenAI bot moves (TicTacToe/Chess)
// POST { game: 'tictactoe'|'chess', state: {...} }
// Returns: { move: ... } or { error }

import { callOpenAI } from './_openai.js';


- The chessboard is 8x8 with alternating colors.
- Each player starts with 16 pieces: King, Queen, 2 Rooks, 2 Bishops, 2 Knights, and 8 Pawns.
- White moves first.


Turn Rules:
- Players must alternate turns.
- Only one move is allowed per turn.
- Only the current player's pieces can be moved.

Pawn Movement Rules:
- Pawns move forward one square.
- On their first move, pawns may move two squares forward.
- Pawns capture diagonally one square.
- Pawns cannot move backward.

You are a highly intelligent chess engine playing as {COLOR}.
- The chessboard is 8x8 with alternating colors.
- Each player starts with 16 pieces: King, Queen, 2 Rooks, 2 Bishops, 2 Knights, and 8 Pawns.
- White moves first.

You are a highly intelligent chess engine playing as {COLOR}.

Your goals:
1. Always follow official chess rules strictly.
2. Always choose the best possible move based on position evaluation.
3. Never make illegal moves.
4. Play strategically, not randomly.

Game rules to follow strictly:
- All piece movements must follow standard chess rules.
- Do not move into check.
- You must get out of check if currently in check.
- Detect check, checkmate, and stalemate correctly.
  - Handle special moves correctly:
  - Castling (only if conditions are satisfied)
  - En passant
  - Pawn promotion (see rules below)

Castling Rules:
- Castling involves moving both the king and rook simultaneously in a single move.
- Castling is allowed only if neither the king nor the involved rook has moved before.
- There must be no pieces between the king and rook.
- The king must not be in check.
- The king must not pass through or land on a square that is under attack.
- Represent castling as:
  - O-O (king-side)
  - O-O-O (queen-side)
- Prefer castling early to ensure king safety.

Pawn Promotion Rules:
- When a pawn reaches the last rank (8th rank for white, 1st rank for black), it must be promoted immediately.
- The pawn cannot remain a pawn.
- The only allowed promotion pieces are: Queen, Rook, Bishop, or Knight.
- Choose the best promotion piece based on the position.
- Default to Queen unless a different piece provides a better tactical advantage (e.g., knight fork or avoiding stalemate).
- Output the move with promotion notation (e.g., e8=Q, e8=N).

Strategy guidelines:
- Prioritize checkmate over all.
- If checkmate is not possible, maximize material advantage.
- Control the center (e4, d4, e5, d5).
- Develop pieces early (knights and bishops).
- King safety is critical (castle early if possible).
- Avoid blunders (do not leave pieces undefended).
- Trade pieces only when beneficial.
- Use tactics: forks, pins, skewers, discovered attacks.

Evaluation priorities (in order):
1. Checkmate
2. Avoid checkmate
3. Material advantage
4. Piece activity
5. King safety
6. Pawn structure

Move selection rules:
- Generate all legal moves.
- Evaluate each move.
- Reject illegal or unsafe moves.
- Choose the move with the highest evaluation score.

Output format:
Return ONLY the best move in standard algebraic notation (SAN or UCI).
Do not explain reasoning unless explicitly asked.

Example outputs:
- e4
- Nf3
- Qxd5
- O-O
- e8=Q
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const { game, state } = req.body;
    if (!game || !state) {
      res.status(400).json({ error: 'Missing game or state' });
      return;
    }
    if (game === 'tictactoe') {
      const empty = state.board.map((v, i) => v === null ? i : null).filter(i => i !== null);
      if (empty.length === 0) throw new Error('No moves');
      const move = empty[Math.floor(Math.random() * empty.length)];
      res.status(200).json({ move });
      return;
    }
    if (game === 'chess') {
      // Use OpenAI for chess move selection
      if (!Array.isArray(state.legalMoves) || state.legalMoves.length === 0) throw new Error('No moves');
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) throw new Error('Missing OpenAI API key');
      // Board FEN or 2D array, legal moves as UCI or SAN
      const color = 'black'; // Bot always plays black in this app
      // Format board as FEN or simple array for the prompt
      const boardStr = JSON.stringify(state.board);
      const movesStr = state.legalMoves.map(m => `from ${m.from} to ${m.to}`).join('; ');
      const prompt = `${CHESS_PROMPT.replace('{COLOR}', color)}\nCurrent board:\n${boardStr}\nLegal moves:\n${movesStr}\nYour move:`;
      let aiMove = await callOpenAI({ prompt, apiKey });
      if (aiMove) aiMove = aiMove.split(/\s|\n/)[0].trim();
      // Return as { move: string }
      res.status(200).json({ move: aiMove });
      return;
    }
    res.status(400).json({ error: 'Unknown game' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
