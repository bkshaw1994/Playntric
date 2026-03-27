# Playntric 🎮

A multi-game web application featuring classic board games. Play Sudoku, Ludo, Chess, Wordle, and Tic Tac Toe all in one platform!

## Features

- **Sudoku** - Solve challenging sudoku puzzles with an interactive 9x9 grid
- **Ludo** - Play the classic board game with up to 4 players
- **Chess** - Play chess with full piece movement and move history tracking
- **Wordle** - Guess the 5-letter word in 6 attempts with helpful color feedback
- **Tic Tac Toe** - Play with Bot, Local Player, or Online (multiple game modes)
- **Math Speed Challenge** - Solve math problems against the clock with different difficulty levels
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Easy Navigation** - Simple navbar to switch between games

## Tech Stack

- **React 18** - Modern UI library
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **CSS3** - Beautiful styling and animations
- **JavaScript ES6+** - Modern JavaScript implementation

## Available Routes

- `/` - Home page with all games
- `/sudoku` - Sudoku game
- `/ludo` - Ludo game
- `/chess` - Chess game with multiple modes
- `/wordle` - Wordle word game
- `/tictactoe` - Tic Tac Toe with multiple modes
- `/mathspeed` - Math Speed Challenge with difficulty levels

## Installation

1. Clone or download this repository
2. Navigate to the project directory:

   ```bash
   cd game
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Development

Start the development server:

```bash
npm run dev
```

The application will open in your browser at `http://localhost:5173`

## Build for Production

Create an optimized production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
game/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar with routing
│   │   └── Navbar.css          # Navigation styles
│   ├── pages/
│   │   ├── Home.jsx            # Home page with game selection
│   │   └── Home.css            # Home page styles
│   ├── games/
│   │   ├── Sudoku.jsx          # Sudoku game component
│   │   ├── Sudoku.css          # Sudoku styles
│   │   ├── Ludo.jsx            # Ludo game component
│   │   ├── Ludo.css            # Ludo styles
│   │   ├── Chess.jsx           # Chess game component with AI
│   │   ├── Chess.css           # Chess styles
│   │   ├── Wordle.jsx          # Wordle game component
│   │   ├── Wordle.css          # Wordle styles
│   │   ├── TicTacToe.jsx       # Tic Tac Toe game component with AI
│   │   └── TicTacToe.css       # Tic Tac Toe styles
│   ├── App.jsx                 # Main application with routing
│   ├── App.css                 # App styles
│   ├── main.jsx                # Application entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── vite.config.js             # Vite configuration
├── package.json               # Dependencies and scripts
└── .gitignore                 # Git ignore rules
```

## Routing

The application uses React Router for client-side navigation. Each game has its own dedicated route:

| Route        | Game                 | Description                                       |
| ------------ | -------------------- | ------------------------------------------------- |
| `/`          | Home                 | Game selection hub with all available games       |
| `/sudoku`    | Sudoku               | Classic puzzle game                               |
| `/ludo`      | Ludo                 | 4-player board game                               |
| `/chess`     | Chess                | Strategic game with AI, Local, or Online modes    |
| `/wordle`    | Wordle               | Word guessing game                                |
| `/mathspeed` | Math Speed Challenge | Timed math problem solving with difficulty levels |
| `/tictactoe` | Tic Tac Toe          | Simple strategy game with AI or Local play        |

Navigate between games using the navbar or the Home page cards. The navbar automatically highlights the current active route.

## How to Play

### Sudoku

1. Fill the 9x9 grid so each row, column, and 3x3 box contains numbers 1-9
2. Click on a cell and enter a number
3. Use the Reset button to start over

### Ludo

1. Click "Start Game" to begin
2. Roll the dice and move your pieces
3. First to reach home wins
4. Up to 4 players can play

### Chess

Choose your game mode:

- **🤖 Play vs Bot** - Challenge the AI with smart moves
- **👥 Local Player** - Two players on the same device take turns
- **🌐 Online Players** - Share a game code with friends to play online (coming soon)

Game instructions:

1. Click on a piece to select it (must be your color's piece)
2. Valid move squares will be highlighted
3. Click on a destination square to move
4. White pieces move first
5. Move history is tracked on the right side
6. Try to checkmate your opponent!

### Wordle

1. You have 6 attempts to guess the 5-letter word
2. Type letters using the on-screen keyboard or your physical keyboard
3. After each guess, tiles change color:
   - 🟩 **Green** - Letter is correct and in the right position
   - 🟨 **Yellow** - Letter is in the word but in the wrong position
   - ⬜ **Gray** - Letter is not in the word

### Math Speed Challenge

1. Choose a difficulty level:
   - **🟢 Easy** - Numbers 1-10 (10 points per correct answer)
   - **🟡 Medium** - Numbers 1-50 (20 points per correct answer)
   - **🔴 Hard** - Numbers 1-100 (30 points per correct answer)
2. You have 60 seconds to solve as many problems as possible
3. Each problem includes addition, subtraction, multiplication, or division
4. Enter your answer and press Submit or Enter
5. Your accuracy percentage and score are tracked in real-time
6. Try to solve as many problems correctly as you can before time runs out!
7. Guess the word before running out of attempts
8. Start a new game to try again

### Tic Tac Toe

Choose your game mode:

- **🤖 Play vs Bot** - Challenge the AI with smart moves
- **👥 Local Player** - Two players on the same device take turns
- **🌐 Online Players** - Share a game code with friends to play online (coming soon)

Game rules:

1. Players take turns marking spaces in a 3×3 grid
2. The player who succeeds in placing 3 marks in a horizontal, vertical, or diagonal row wins
3. Click any empty square to make your move
4. Start a new game anytime or switch to a different game mode

## Features Included

- ✅ Interactive game interfaces
- ✅ Responsive design for all screen sizes
- ✅ Smooth animations and transitions
- ✅ Easy-to-use navigation
- ✅ Beautiful color scheme with gradients
- ✅ Move history tracking (Chess)
- ✅ Player indication (Ludo)
- ✅ Dice rolling mechanics (Ludo)

## Browser Compatibility

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Multiplayer online support
- Game difficulty levels
- Player profiles and statistics
- More games (Checkers, Connect 4, Memory, etc.)
- Sound effects and background music
- Dark mode theme
- Wordle daily challenge with leaderboard

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to fork this project and submit pull requests for any improvements!

## Author

Playntric - A fun collection of classic games for everyone to enjoy! 🎉

---

**Have fun playing! 🎮**

## GenAI Bot Integration

- **Tic Tac Toe** and **Chess** bot modes now support GenAI-powered moves via a serverless API endpoint (`/api/genai-move`).
- By default, the endpoint returns a random valid move for demo and safety. To enable real GenAI, replace the logic in `api/genai-move.js` with your preferred AI model call (e.g., OpenAI, Azure, or custom LLM).
- The client will always fall back to the original local AI logic if the GenAI API is unavailable or returns an invalid move, so gameplay is never blocked.
- Extend or secure the endpoint as needed for your deployment.

**How it works:**

- When playing vs Bot, the game sends the current board (and legal moves for Chess) to the endpoint.
- The endpoint returns the move to play, which is validated before being applied.
- If the endpoint fails or returns an invalid move, the local AI logic is used instead.

See `src/lib/genaiBot.js` and `api/genai-move.js` for details.
