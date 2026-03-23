import React, { useState, useEffect } from "react";
import { Gift, Tv, CheckCircle2, PartyPopper } from "lucide-react";
import "./RewardedAd.css";

export default function RewardedAd({
  onRewarded,
  onClose,
  rewardLabel = "your reward",
}) {
  const [phase, setPhase] = useState("confirm"); // 'confirm', 'watching', 'done'
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (phase === "watching" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (phase === "watching" && countdown === 0) {
      setPhase("done");
    }
  }, [phase, countdown]);

  const startAd = () => {
    setPhase("watching");
    setCountdown(5);
  };

  const claimReward = () => {
    onRewarded();
    onClose();
  };

  return (
    <div
      className="rewarded-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="rewarded-modal">
        {phase === "confirm" && (
          <>
            <div className="rewarded-icon">
              <Gift size={48} />
            </div>
            <h3>Watch a short ad to unlock</h3>
            <p className="rewarded-desc">{rewardLabel}</p>
            <div className="rewarded-buttons">
              <button className="btn-watch" onClick={startAd}>
                Watch Ad (5s)
              </button>
              <button className="btn-skip" onClick={onClose}>
                No thanks
              </button>
            </div>
          </>
        )}

        {phase === "watching" && (
          <>
            <div className="rewarded-icon ad-playing">
              <Tv size={48} />
            </div>
            <h3>Ad playing...</h3>
            <div className="ad-sim-screen">
              {/* In production replace this with real rewarded ad SDK call */}
              <p>🎬 Your ad plays here</p>
              <p className="ad-sim-note">
                Integrate your ad SDK here (e.g. AdMob, AdSense)
              </p>
            </div>
            <div className="countdown-circle">
              <span>{countdown}</span>
            </div>
            <p className="rewarded-wait">Please wait…</p>
          </>
        )}

        {phase === "done" && (
          <>
            <div className="rewarded-icon">
              <CheckCircle2 size={48} />
            </div>
            <h3>You've earned your reward!</h3>
            <p className="rewarded-desc">{rewardLabel}</p>
            <button className="btn-watch" onClick={claimReward}>
              Claim Reward <PartyPopper size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
