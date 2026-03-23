import React from "react";
import Seo from "../components/common/Seo";
import "../styles/InfoPages.css";

const FAQ_ITEMS = [
  {
    q: "Are all games on Playntric free?",
    a: "Yes. Every game is free to play in your browser.",
  },
  {
    q: "Do I need to create an account?",
    a: "No account is required. You can set a display name and start playing instantly.",
  },
  {
    q: "Can I play on mobile devices?",
    a: "Yes. Playntric is responsive and supports modern mobile browsers.",
  },
  {
    q: "How does leaderboard scoring work?",
    a: "Scores are submitted per game and the leaderboard keeps top entries for each mode.",
  },
  {
    q: "How can I support Playntric?",
    a: "Share the site with friends and keep returning for Daily Challenges and Game of the Day.",
  },
];

export default function FAQPage() {
  return (
    <div className="info-page-container">
      <Seo
        title="FAQs | Playntric"
        description="Frequently asked questions about Playntric games, leaderboard, mobile support, and gameplay."
        path="/faqs"
      />
      <h1>Frequently Asked Questions</h1>
      <p className="info-page-intro">
        Answers to the most common questions about gameplay, leaderboard, and
        platform usage.
      </p>

      <section className="info-card-list" aria-label="FAQ list">
        {FAQ_ITEMS.map((item) => (
          <article key={item.q} className="info-card">
            <h2>{item.q}</h2>
            <p>{item.a}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
