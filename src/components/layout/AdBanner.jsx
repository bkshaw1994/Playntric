import React, { useEffect, useMemo } from "react";
import { usePremium } from "../../context/PremiumContext";
import "./AdBanner.css";

const ADSENSE_CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID || "";
const ADSENSE_SLOT_BANNER = import.meta.env.VITE_ADSENSE_SLOT_BANNER || "";
const ADSENSE_SLOT_SIDEBAR = import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR || "";
const FORCE_SHOW_ADS = import.meta.env.VITE_SHOW_ADS === "true";

export default function AdBanner({ slot = "banner" }) {
  const { isPremium } = usePremium();

  const adSlot = useMemo(() => {
    if (slot === "sidebar") return ADSENSE_SLOT_SIDEBAR;
    return ADSENSE_SLOT_BANNER;
  }, [slot]);

  const shouldRender = FORCE_SHOW_ADS || !isPremium;
  const canLoadAd =
    ADSENSE_CLIENT_ID.startsWith("ca-pub-") && adSlot.trim().length > 0;

  useEffect(() => {
    if (!shouldRender || !canLoadAd || typeof window === "undefined") return;

    // Avoid duplicate push() calls in StrictMode and on re-renders.
    const pendingSlot = document.querySelector(
      "ins.adsbygoogle:not([data-adsbygoogle-status])",
    );
    if (!pendingSlot) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn("AdSense render skipped:", e?.message || e);
    }
  }, [shouldRender, canLoadAd]);

  if (!shouldRender) return null;

  return (
    <div className={`ad-banner ad-banner-${slot}`}>
      <span className="ad-label">Advertisement</span>

      {canLoadAd ? (
        <ins
          className="adsbygoogle ad-unit"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="ad-placeholder">
          <p>Ad slot configured but AdSense IDs are missing.</p>
          <p className="ad-hint">
            Set VITE_ADSENSE_CLIENT_ID and VITE_ADSENSE_SLOT_
            {slot.toUpperCase()} in .env
          </p>
        </div>
      )}
    </div>
  );
}
