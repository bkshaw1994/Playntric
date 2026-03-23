import React from "react";
import { Link } from "react-router-dom";
import {
  Gamepad2,
  ArrowRight,
  Sparkles,
  HelpCircle,
  ScrollText,
} from "lucide-react";
import Seo from "../components/common/Seo";
import { GAMES } from "../constants/games";
import "../styles/Home.css";

export default function Home() {
  const games = GAMES;

  const sections = [
    {
      title: "Daily Challenges",
      description:
        "Take the rotating daily route, maintain streaks, and unlock rewards.",
      path: "/daily-challenges",
      icon: <Sparkles size={16} />,
    },
    {
      title: "Game of the Day",
      description:
        "Jump into today\'s featured pick and share it with friends.",
      path: "/game-of-the-day",
      icon: <Gamepad2 size={16} />,
    },
    {
      title: "FAQs",
      description:
        "Get quick answers about gameplay, scoring, and platform support.",
      path: "/faqs",
      icon: <HelpCircle size={16} />,
    },
    {
      title: "Rules of the Game",
      description:
        "Learn each game\'s rules and improve your winning strategy.",
      path: "/rules",
      icon: <ScrollText size={16} />,
    },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Playntric",
        url: "https://playntric.vercel.app/",
        description:
          "Free online browser games including Sudoku, Chess, Wordle, Tic Tac Toe, and Math Speed Challenge.",
      },
      {
        "@type": "ItemList",
        name: "Playntric Games",
        itemListElement: games.map((game, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Game",
            name: game.name,
            url: `https://playntric.vercel.app${game.path}`,
            description: game.description,
          },
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Are Playntric games free to play?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. All games on Playntric are free to play in your browser without downloads.",
            },
          },
          {
            "@type": "Question",
            name: "Can I play Playntric games on mobile?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Playntric games are responsive and work on modern mobile browsers.",
            },
          },
          {
            "@type": "Question",
            name: "Which games are available on Playntric?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Playntric currently includes Sudoku, Chess, Wordle, Tic Tac Toe, and Math Speed Challenge.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="home-container">
      <Seo
        title="Playntric | Free Online Sudoku, Chess, Wordle, Tic Tac Toe and Math Games"
        description="Play free online games on Playntric, including Sudoku, Chess, Wordle, Tic Tac Toe, and Math Speed Challenge."
        path="/"
        keywords={[
          "free online games",
          "browser games",
          "Playntric",
          "unblocked games",
          "sudoku online",
          "play chess online",
          "wordle game",
          "tic tac toe online",
          "math games",
        ]}
        structuredData={structuredData}
      />
      {/* <div className="home-header">
        <h1>
          <Gamepad2 size={32} /> Playntric
        </h1>
        <p className="home-subtitle">Play your favorite games online</p>
      </div> */}

      {/* <section className="growth-strip" aria-label="Feature navigation">
        <div className="growth-highlight">
          <Sparkles size={18} />
          <span>
            Explore dedicated sections for challenges, daily picks,
            leaderboard, and help pages.
          </span>
        </div>

        <div className="growth-actions">
          {sections.map((section) => (
            <Link
              key={section.path}
              className="growth-main-btn"
              to={section.path}
            >
              {section.icon} {section.title}
            </Link>
          ))}
        </div>
      </section> */}

      <div className="games-grid">
        {games.map((game) => (
          <Link to={game.path} key={game.name} className="game-card-link">
            <div className="game-card" style={{ borderTopColor: game.color }}>
              <div className="game-icon">{game.icon}</div>
              <h3 className="game-name">{game.name}</h3>
              <p className="game-description">{game.description}</p>
              <span className="play-button">
                Play Now <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* <section className="seo-content" aria-label="About Playntric games">
        <h2>Why Players Keep Returning to Playntric</h2>
        <p>
          Playntric is built for quick, replayable browser gaming. Whether you
          want a fast Sudoku puzzle, a strategic Chess session, a Wordle round,
          or a short Tic Tac Toe match, you can jump in instantly without
          downloads.
        </p>
        <p>
          Every game page is optimized for speed, mobile play, and clean UI. We
          continuously improve challenge quality, player stats, and leaderboard
          features to keep sessions engaging.
        </p>

        <div className="seo-links">
          {sections.map((section) => (
            <Link
              key={section.path}
              to={section.path}
              className="seo-link-chip"
            >
              {section.title}
            </Link>
          ))}
        </div>
      </section> */}

      {/* <div className="home-footer">
        <p>Choose a game to start playing and share Playntric with a friend!</p>
      </div> */}
    </div>
  );
}
