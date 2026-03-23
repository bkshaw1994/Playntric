import React from "react";
import { usePremium } from "../../context/PremiumContext";
import {
  Ban,
  Lightbulb,
  Timer,
  Palette,
  Trophy,
  CreditCard,
  X,
  Crown,
} from "lucide-react";
import "./PremiumModal.css";

// Replace REPLACE_WITH_YOUR_STRIPE_LINK with your actual Stripe Payment Link
// Generated at: https://dashboard.stripe.com/payment-links
const STRIPE_PAYMENT_LINK =
  "https://buy.stripe.com/REPLACE_WITH_YOUR_STRIPE_LINK";

const features = [
  { icon: <Ban size={18} />, text: "Ad-free experience" },
  { icon: <Lightbulb size={18} />, text: "Unlimited Sudoku hints" },
  { icon: <Timer size={18} />, text: "Unlimited extra time in Math Speed" },
  { icon: <Palette size={18} />, text: "Exclusive Chess board themes" },
  { icon: <Trophy size={18} />, text: "Global leaderboard access" },
  { icon: <Palette size={18} />, text: "Custom game themes" },
];

export default function PremiumModal({ onClose }) {
  const { isPremium, unlockPremium } = usePremium();

  const handleStripeCheckout = () => {
    // In production this opens Stripe's hosted checkout
    if (STRIPE_PAYMENT_LINK.includes("REPLACE")) {
      // Dev mode: simulate purchase
      unlockPremium();
      onClose();
      alert(
        "🎉 Premium unlocked! (Dev mode - replace the Stripe link to charge real payments)",
      );
    } else {
      window.open(STRIPE_PAYMENT_LINK, "_blank");
      // After payment, use a Stripe webhook or success URL to call unlockPremium()
    }
  };

  if (isPremium) {
    return (
      <div
        className="premium-backdrop"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="premium-modal">
          <button className="premium-close" onClick={onClose}>
            <X size={18} />
          </button>
          <div className="premium-crown">
            <Crown size={48} />
          </div>
          <h2>You're Premium!</h2>
          <p className="premium-sub">
            Enjoy all the perks. Thank you for your support!
          </p>
          <ul className="premium-features">
            {features.map((f, i) => (
              <li key={i}>
                <span>{f.icon}</span>
                {f.text}
              </li>
            ))}
          </ul>
          <button className="btn-close-premium" onClick={onClose}>
            Continue Playing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="premium-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="premium-modal">
        <button className="premium-close" onClick={onClose}>
          ✕
        </button>
        <div className="premium-crown">👑</div>
        <h2>Go Premium</h2>
        <p className="premium-sub">
          One-time payment — unlock everything forever
        </p>

        <ul className="premium-features">
          {features.map((f, i) => (
            <li key={i}>
              <span>{f.icon}</span>
              {f.text}
            </li>
          ))}
        </ul>

        <div className="premium-price">
          <span className="price-amount">$4.99</span>
          <span className="price-label">one-time</span>
        </div>

        <button className="btn-go-premium" onClick={handleStripeCheckout}>
          <CreditCard size={16} /> Unlock Premium with Stripe
        </button>

        <p className="premium-note">
          Secure payment via Stripe. No subscription, no recurring charges.
        </p>
        <p className="premium-dev-note">
          ⚙️ Dev: Replace <code>STRIPE_PAYMENT_LINK</code> in PremiumModal.jsx
          with your Stripe link.
        </p>
      </div>
    </div>
  );
}
