# Playntric - Folder Structure

## Project Organization

```
playntric/
├── public/                          # Static assets
├── src/
│   ├── assets/                      # Images, icons, fonts, etc.
│   │
│   ├── components/                  # Reusable UI components
│   │   ├── common/                  # Shared/reusable components
│   │   │   ├── Navbar.jsx           # Main navigation bar
│   │   │   ├── Navbar.css
│   │   │   ├── Leaderboard.jsx      # Global leaderboard display
│   │   │   ├── Leaderboard.css
│   │   │   ├── RewardedAd.jsx       # Rewarded ad modal
│   │   │   └── RewardedAd.css
│   │   │
│   │   ├── layout/                  # Layout components
│   │   │   ├── AdBanner.jsx         # Google AdSense banner
│   │   │   └── AdBanner.css
│   │   │
│   │   └── modals/                  # Modal components
│   │       ├── PlayerNameModal.jsx  # Player name input modal
│   │       ├── PlayerNameModal.css
│   │       ├── PremiumModal.jsx     # Premium features modal (disabled)
│   │       └── PremiumModal.css
│   │
│   ├── games/                       # Game implementations (feature-based)
│   │   ├── sudoku/
│   │   │   ├── Sudoku.jsx           # Sudoku puzzle game
│   │   │   └── Sudoku.css
│   │   │
│   │   ├── chess/
│   │   │   ├── Chess.jsx            # Chess with AI & multiplayer
│   │   │   └── Chess.css
│   │   │
│   │   ├── wordle/
│   │   │   ├── Wordle.jsx           # Wordle word guessing
│   │   │   └── Wordle.css
│   │   │
│   │   ├── tictactoe/
│   │   │   ├── TicTacToe.jsx        # Tic Tac Toe with AI
│   │   │   └── TicTacToe.css
│   │   │
│   │   ├── mathspeed/
│   │   │   ├── MathSpeedChallenge.jsx # Math speed challenge
│   │   │   └── MathSpeedChallenge.css
│   │   │
│   │   └── ludo/                    # (Disabled)
│   │       ├── Ludo.jsx
│   │       └── Ludo.css
│   │
│   ├── pages/                       # Page components
│   │   └── Home.jsx                 # Home page with game cards
│   │
│   ├── context/                     # React Context providers
│   │   ├── PremiumContext.jsx       # Premium features & chess themes
│   │   └── PlayerContext.jsx        # Player name & global state
│   │
│   ├── hooks/                       # Custom React hooks (expandable)
│   │
│   ├── lib/                         # Utility & third-party integrations
│   │   └── supabase.js              # Supabase client initialization
│   │
│   ├── constants/                   # Configuration constants (expandable)
│   │
│   ├── styles/                      # Global styles
│   │   ├── App.css                  # App layout styles
│   │   ├── index.css                # Global styles
│   │   └── Home.css                 # Home page styles
│   │
│   ├── App.jsx                      # Main app component & router
│   └── main.jsx                     # React entry point
│
├── .env                             # Environment variables
├── .github/
│   └── copilot-instructions.md      # GitHub Copilot instructions
├── index.html                       # HTML entry point
├── package.json                     # Dependencies & scripts
├── vite.config.js                   # Vite configuration
└── vercel.json                      # Vercel deployment config
```

## Structure Principles

### 1. **Feature-Based Game Organization**

- Each game has its own folder under `src/games/`
- Contains game component + stylesheet + any game-specific assets
- Easy to add, remove, or modify games independently

### 2. **Component Categorization**

- **Common**: Shared components used across the app (Navbar, Leaderboard)
- **Layout**: Presentational components for page structure (Ad banners, sidebars)
- **Modals**: Dialog components for user interactions

### 3. **Separation of Concerns**

- Backend/API logic: `lib/supabase.js`
- State management: `context/`
- Styles: `styles/` (global) + per-component `.css` files
- Configuration: `constants/` (expandable for game settings, API URLs, etc.)

### 4. **Scalability**

- `hooks/` folder ready for custom React hooks
- `constants/` folder for centralized configuration
- `assets/` folder for images, fonts, and other static files

## Import Paths Guide

### From the App Root

```javascript
// Importing a game
import Chess from "./games/chess/Chess";

// Importing a common component
import Navbar from "./components/common/Navbar";

// Importing a context
import { usePlayer } from "./context/PlayerContext";

// Importing a utility
import { supabase } from "./lib/supabase";

// Importing global styles
import "./styles/App.css";
```

### From a Game Component (e.g., `src/games/chess/Chess.jsx`)

```javascript
// Relative imports to go up to src level
import { usePlayer } from "../../context/PlayerContext";
import Leaderboard from "../../components/common/Leaderboard";
import { saveScore } from "../../components/common/Leaderboard";
```

### From a Component (e.g., `src/components/common/Navbar.jsx`)

```javascript
// Relative imports to go up to src level
import { usePlayer } from "../../context/PlayerContext";
import PlayerNameModal from "../modals/PlayerNameModal";
```

## Adding New Features

### Adding a New Game

```
1. Create folder: src/games/[gamename]/
2. Add files:
   - [GameName].jsx (component)
   - [GameName].css (styles)
3. Update imports in App.jsx:
   - Add import
   - Add route
4. Update Navbar & Home.jsx navigation
```

### Adding a Shared Component

```
1. Create file in appropriate folder:
   - src/components/common/   (reusable across apps)
   - src/components/layout/   (layout-specific)
   - src/components/modals/   (dialogs)
2. Create matching .css file
3. Export for use in other components
```

### Adding a Custom Hook

```
1. Create file: src/hooks/use[HookName].js
2. Export the hook
3. Import in components: import { use[HookName] } from "../../hooks/use[HookName]"
```

## Build & Deployment

- **Vite** handles module bundling and fast HMR
- **Vercel** for deployment with SPA routing rewrite in `vercel.json`
- **Supabase** for real-time leaderboard & player data
- **Google AdSense** for monetization (slot IDs in `.env`)

---

Last updated: 23 March 2026
