import React from "react";
import Seo from "../components/common/Seo";
import Leaderboard from "../components/common/Leaderboard";
import "../styles/ChallengePages.css";

export default function LeaderboardPage() {
  return (
    <div className="challenge-page">
      <Seo
        title="Leaderboard | Playntric"
        description="See top scores and global rankings on the Playntric leaderboard."
        path="/leaderboard"
      />
      <Leaderboard standalone />
    </div>
  );
}
