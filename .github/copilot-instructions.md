# Playntric Instructions

A multi-game web application for playing Sudoku, Ludo, and Chess with an easy-to-use navigation interface using React Router.

## Getting Started

### Development

Run `npm run dev` to start the development server at http://localhost:5173

### Production Build

Run `npm run build` to create an optimized production build

### Preview Build

Run `npm run preview` to view the production build locally

## Project Overview

This project uses:

- **React 18** with Vite for fast development
- **React Router DOM** for client-side routing
- **CSS3** for responsive styling
- **Modular component architecture** with separate game components and pages

## Available Routes

- `/` - Home page with all games showcase
- `/sudoku` - Sudoku puzzle game
- `/ludo` - Ludo board game
- `/chess` - Chess with multiple game modes (vs Bot, Local, Online)
- `/wordle` - Wordle word guessing game
- `/tictactoe` - Tic Tac Toe with multiple game modes (vs Bot, Local, Online)
- `/mathspeed` - Math Speed Challenge with difficulty levels

## Available Games

1. **Sudoku** - Classic number puzzle
   - 9x9 grid with pre-filled numbers
   - Click to input numbers
   - Reset button to start over

2. **Ludo** - Classic board game
   - 4-player support
   - Dice rolling mechanics
   - Position tracking for each player

3. **Chess** - Strategic board game with multiple modes
   - Play vs Bot: Challenge the AI with intelligent moves
   - Local Player: Two players on the same device
   - Online Players: Play with friends using game codes (coming soon)
   - Full chess board setup with valid move highlighting
   - Move history tracking

4. **Wordle** - Word guessing game
   - Guess the 5-letter word in 6 attempts
   - Color feedback: Green (correct), Yellow (wrong position), Gray (not in word)
   - Interactive keyboard interface

5. **Tic Tac Toe** - Classic strategy game with multiple modes
   - Play vs Bot: Challenge the AI with intelligent moves
   - Local Player: Two players on the same device
   - Online Players: Play with friends using game codes (coming soon)

6. **Math Speed Challenge** - Fast-paced math problem solving
   - Three difficulty levels (Easy, Medium, Hard)
   - Solve math problems with addition, subtraction, multiplication, and division
   - 60-second timer to complete as many problems as possible
   - Real-time score tracking and accuracy calculation
   - Difficulty levels: Easy (1-10), Medium (1-50), Hard (1-100)

## File Structure

- `src/components/` - Navbar component for game navigation
- `src/games/` - Individual game implementations
- `src/App.jsx` - Main application router and state management
- `public/` - Static assets (if needed)

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Browser Support

Works on all modern browsers (Chrome, Firefox, Safari, Edge)
