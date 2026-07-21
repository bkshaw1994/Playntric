import React from "react";
import { Link } from "react-router-dom";
import { Home as HomeIcon } from "lucide-react";
import Seo from "../components/common/Seo";
import "../styles/InfoPages.css";

export default function NotFound() {
  return (
    <div className="info-page-container">
      <Seo
        title="Page Not Found | Playntric"
        description="The page you are looking for does not exist. Explore free online games on Playntric."
        path="/404"
      />
      <h1>404 — Page Not Found</h1>
      <p className="info-page-intro">
        Sorry, the page you are looking for doesn't exist or has moved. Head
        back to the home page to explore all of Playntric's free online games.
      </p>

      <section className="info-card-list" aria-label="Available games">
        <article className="info-card">
          <h2>Play a game instead</h2>
          <ul>
            <li>
              <Link to="/sudoku">Sudoku</Link>
            </li>
            <li>
              <Link to="/chess">Chess</Link>
            </li>
            <li>
              <Link to="/wordle">Wordle</Link>
            </li>
            <li>
              <Link to="/tictactoe">Tic Tac Toe</Link>
            </li>
            <li>
              <Link to="/mathspeed">Math Speed Challenge</Link>
            </li>
          </ul>
        </article>
      </section>

      <Link to="/" className="nav-button">
        <HomeIcon size={16} /> Back to Home
      </Link>
    </div>
  );
}
