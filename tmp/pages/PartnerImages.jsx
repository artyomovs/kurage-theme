import React, { useEffect, useMemo, useRef, useState } from "react";
import "../App.css";

const DEFAULT_SHIRTS = [
  {
    id: "t1",
    name: "Neon Burst Tee",
    imageUrl: "https://placehold.co/400x400/0d1428/26dcff?text=Neon+Burst",
    sold: 142,
  },
  {
    id: "t2",
    name: "Cyberwave Logo",
    imageUrl: "https://placehold.co/400x400/0d1428/ff4db8?text=Cyberwave",
    sold: 87,
  },
  {
    id: "t3",
    name: "Minimal Stamp",
    imageUrl: "https://placehold.co/400x400/0d1428/ffffff?text=Minimal",
    sold: 63,
  },
  {
    id: "t4",
    name: "Retro Grid Tee",
    imageUrl: "https://placehold.co/400x400/0d1428/26dcff?text=Retro+Grid",
    sold: 31,
  },
  {
    id: "t5",
    name: "Street Tag",
    imageUrl: "https://placehold.co/400x400/0d1428/ff4db8?text=Street+Tag",
    sold: 18,
  },
  {
    id: "t6",
    name: "Bold Script",
    imageUrl: "https://placehold.co/400x400/0d1428/ffffff?text=Bold+Script",
    sold: 7,
  },
];

const STYLE_OPTIONS = [
  "Cyberpunk",
  "Streetwear",
  "Minimal",
  "Retro",
  "Bold",
  "Clean",
];

function formatEur(amount) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function generatePlaceholderImage(name) {
  return `https://placehold.co/400x400/0d1428/26dcff?text=${encodeURIComponent(
    name || "T-shirt"
  )}`;
}

function formatRelativeTime(dateValue) {
  const diffMs = Date.now() - new Date(dateValue).getTime();
  const seconds = Math.max(0, Math.floor(diffMs / 1000));
  if (seconds < 15) return "Updated just now";
  if (seconds < 60) return `Updated ${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `Updated ${minutes}m ago`;
}

export default function PartnerImages() {
  const [collectionName, setCollectionName] = useState("streetwear");
  const [socialUrls, setSocialUrls] = useState("https://instagram.com/neonbrew");
  const [style, setStyle] = useState("Cyberpunk");
  const [tshirts, setTshirts] = useState(DEFAULT_SHIRTS);

  const [collectionToken, setCollectionToken] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [lastUpdatedAt, setLastUpdatedAt] = useState(() => new Date());
  const [nowTick, setNowTick] = useState(() => Date.now());

  const tokenInputRef = useRef(null);

  const totals = useMemo(() => {
    const totalSold = tshirts.reduce((acc, t) => acc + Number(t.sold || 0), 0);
    return {
      totalSold,
      totalEarned: totalSold * 2,
      totalDesigns: tshirts.length,
    };
  }, [tshirts]);

  useEffect(() => {
    const interval = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showSettings) {
      tokenInputRef.current?.focus();
    }
  }, [showSettings]);

  useEffect(() => {
    if (!message) return undefined;
    const timeout = setTimeout(() => setMessage(""), 2600);
    return () => clearTimeout(timeout);
  }, [message]);

  const slugify = (name) =>
    String(name || "")
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  const storeUrl = collectionName
    ? `https://kurageai.com/collections/${slugify(collectionName)}`
    : "";

  const isValid = collectionName.trim() && socialUrls.trim();

  const notify = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  const saveCollectionDetails = () => {
    if (!isValid) {
      notify("Fill collection name and social links first.", "error");
      return;
    }

    const payload = {
      collectionName,
      socialUrls,
      style,
      tshirts,
      lastUpdatedAt: new Date().toISOString(),
    };

    if (collectionToken.trim()) {
      localStorage.setItem(
        `krg_collection_${collectionToken.trim()}`,
        JSON.stringify(payload)
      );
    }

    setLastUpdatedAt(new Date());
    notify("Collection saved.");
  };

  const loadCollection = () => {
    if (!collectionToken.trim()) {
      notify("Paste a collection token to load.", "error");
      return;
    }

    try {
      const stored = localStorage.getItem(`krg_collection_${collectionToken.trim()}`);
      if (!stored) {
        notify("No collection found for this token.", "error");
        return;
      }

      const payload = JSON.parse(stored);
      setCollectionName(payload.collectionName || "");
      setSocialUrls(payload.socialUrls || "");
      setStyle(payload.style || STYLE_OPTIONS[0]);
      setTshirts(Array.isArray(payload.tshirts) ? payload.tshirts.slice(0, 9) : []);
      setLastUpdatedAt(payload.lastUpdatedAt || new Date());
      notify("Collection loaded.");
    } catch {
      notify("Unable to load collection. Token may be invalid.", "error");
    }
  };

  const refreshStats = () => {
    setTshirts((prev) =>
      prev.map((shirt) => {
        const bump = Math.random() < 0.35 ? 1 : 0;
        return {
          ...shirt,
          sold: shirt.sold + bump,
        };
      })
    );
    setLastUpdatedAt(new Date());
    notify("Latest information synced.");
  };

  const addTshirt = () => {
    if (tshirts.length >= 9) {
      notify("You can have up to 9 T-shirts.", "error");
      return;
    }

    const name = `New design ${tshirts.length + 1}`;
    const id = `t_${Date.now()}`;
    setTshirts((prev) => [
      {
        id,
        name,
        sold: 0,
        imageUrl: generatePlaceholderImage(name),
      },
      ...prev,
    ]);
    setLastUpdatedAt(new Date());
    notify("T-shirt added.");
  };

  const removeTshirt = (id) => {
    setTshirts((prev) => prev.filter((shirt) => shirt.id !== id));
    setLastUpdatedAt(new Date());
    notify("T-shirt removed.");
  };

  return (
    <div className="app" style={{ position: "relative" }}>
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            kurage<span className="logo-print">print</span>
          </div>
          <div className="desktop-nav" style={{ gap: "1rem" }}>
            <a className="nav-link" href="/" style={{ textDecoration: "none" }}>
              Home
            </a>
          </div>
        </div>
      </header>

      <main className="customer-portal-main">
        <section className="section customer-portal-shell fade-in is-visible">
          <div className="customer-portal-topbar">
            <div>
              <h2 className="customer-portal-title">Customer Collection Portal</h2>
              <p className="customer-portal-subtitle">
                Add or remove designs and track latest sales updates.
              </p>
            </div>

            <div className="customer-portal-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setShowSettings((prev) => !prev)}
                style={{ padding: "0.7rem 1.1rem", fontSize: "0.85rem" }}
              >
                {showSettings ? "Hide" : "Show"} settings
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={refreshStats}
                style={{ padding: "0.7rem 1.1rem", fontSize: "0.85rem" }}
              >
                Refresh info
              </button>
              <button
                type="button"
                className="primary-btn"
                onClick={addTshirt}
                disabled={tshirts.length >= 9}
                style={{
                  opacity: tshirts.length >= 9 ? 0.65 : 1,
                  cursor: tshirts.length >= 9 ? "not-allowed" : "pointer",
                  padding: "0.8rem 1.4rem",
                  fontSize: "0.9rem",
                }}
              >
                + Add T-shirt
              </button>
            </div>
          </div>

          <div className="customer-portal-stats-row">
            <div className="customer-portal-stat">
              <span className="customer-portal-stat-label">Designs</span>
              <strong className="customer-portal-stat-value">{totals.totalDesigns} / 9</strong>
            </div>
            <div className="customer-portal-stat">
              <span className="customer-portal-stat-label">Total sold</span>
              <strong className="customer-portal-stat-value">
                {totals.totalSold.toLocaleString("en-US")}
              </strong>
            </div>
            <div className="customer-portal-stat">
              <span className="customer-portal-stat-label">Earnings</span>
              <strong className="customer-portal-stat-value">{formatEur(totals.totalEarned)}</strong>
            </div>
            <div className="customer-portal-stat">
              <span className="customer-portal-stat-label">Latest info</span>
              <strong className="customer-portal-stat-value customer-portal-stat-live">
                {formatRelativeTime(lastUpdatedAt || nowTick)}
              </strong>
            </div>
          </div>

          {showSettings && (
            <div className="customer-portal-settings">
              <div className="customer-portal-settings-grid">
                <label className="portal-field">
                  <span>Collection token</span>
                  <input
                    ref={tokenInputRef}
                    value={collectionToken}
                    onChange={(e) => setCollectionToken(e.target.value)}
                    placeholder="Paste your collection token"
                  />
                </label>

                <label className="portal-field">
                  <span>Collection name</span>
                  <input
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                    placeholder="My drop"
                  />
                </label>

                <label className="portal-field">
                  <span>Social links</span>
                  <input
                    value={socialUrls}
                    onChange={(e) => setSocialUrls(e.target.value)}
                    placeholder="Instagram/TikTok/YouTube"
                  />
                </label>

                <label className="portal-field">
                  <span>Style</span>
                  <select value={style} onChange={(e) => setStyle(e.target.value)}>
                    {STYLE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="customer-portal-settings-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={loadCollection}
                  disabled={!collectionToken.trim()}
                  style={{
                    opacity: !collectionToken.trim() ? 0.6 : 1,
                    cursor: !collectionToken.trim() ? "not-allowed" : "pointer",
                    padding: "0.6rem 1rem",
                    fontSize: "0.82rem",
                  }}
                >
                  Load
                </button>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={saveCollectionDetails}
                  disabled={!isValid}
                  style={{
                    opacity: !isValid ? 0.6 : 1,
                    cursor: !isValid ? "not-allowed" : "pointer",
                    padding: "0.7rem 1.15rem",
                    fontSize: "0.82rem",
                  }}
                >
                  Save
                </button>
                <a
                  className="secondary-btn"
                  href={storeUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    opacity: storeUrl ? 1 : 0.5,
                    pointerEvents: storeUrl ? "auto" : "none",
                    padding: "0.6rem 1rem",
                    fontSize: "0.82rem",
                  }}
                >
                  Open store
                </a>
              </div>
            </div>
          )}

          <div className="customer-portal-grid">
            {tshirts.map((shirt) => (
              <article key={shirt.id} className="customer-portal-card shadow-3d-subtle">
                <img src={shirt.imageUrl} alt={shirt.name} className="customer-portal-image" />
                <div className="customer-portal-card-body">
                  <h3>{shirt.name}</h3>
                  <p>Sold: {shirt.sold}</p>
                  <p>Earned: {formatEur(shirt.sold * 2)}</p>
                  <button
                    type="button"
                    className="nav-link customer-portal-remove"
                    onClick={() => removeTshirt(shirt.id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          {message && (
            <div
              className={`customer-portal-toast ${
                messageType === "error"
                  ? "customer-portal-toast--error"
                  : "customer-portal-toast--ok"
              }`}
            >
              {message}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} kurage print. All rights reserved.</span>
        <span>Customer portal.</span>
      </footer>
    </div>
  );
}
