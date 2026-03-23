import React, { useEffect, useMemo, useRef } from "react";
import { usePremium } from "../../context/PremiumContext";
import "./AdBanner.css";

const ADSENSE_CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID || "";
const ADSENSE_SLOT_BANNER = import.meta.env.VITE_ADSENSE_SLOT_BANNER || "";
const ADSENSE_SLOT_SIDEBAR = import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR || "";
const FORCE_SHOW_ADS = import.meta.env.VITE_SHOW_ADS === "true";

function loadAdSenseScript(clientId) {
  if (!clientId || typeof window === "undefined") return;

  const existing = document.querySelector('script[data-google-adsense="true"]');
  if (existing) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
  script.crossOrigin = "anonymous";
  script.dataset.googleAdsense = "true";
  document.head.appendChild(script);
}

export default function AdBanner({ slot = "banner" }) {
  const { isPremium } = usePremium();
  const adRef = useRef(null);

  const adSlot = useMemo(() => {
    if (slot === "sidebar") return ADSENSE_SLOT_SIDEBAR;
    return ADSENSE_SLOT_BANNER;
  }, [slot]);

  const shouldRender = FORCE_SHOW_ADS || !isPremium;
  const canLoadAd =
    ADSENSE_CLIENT_ID.startsWith("ca-pub-") && adSlot.trim().length > 0;

  useEffect(() => {
    if (!shouldRender || !canLoadAd || !adRef.current) return;

    loadAdSenseScript(ADSENSE_CLIENT_ID);

    try {
      // Request one ad render per mounted ad unit.
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Ignore duplicate render errors from hot reload / remounts.
      console.warn("AdSense render skipped:", e?.message || e);
    }
  }, [shouldRender, canLoadAd]);

  if (!shouldRender) return null;

  return (
    <div className={`ad-banner ad-banner-${slot}`}>
      <span className="ad-label">Advertisement</span>

      {canLoadAd ? (
        <ins
          ref={adRef}
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
