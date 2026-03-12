"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [businessName, setBusinessName] = useState("");
  const [reviewLink, setReviewLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.settings) {
        setBusinessName(data.settings.business_name || "");
        setReviewLink(data.settings.review_link || "");
      }
    } catch {}
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const saveSettings = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ businessName, reviewLink }),
      });

      const data = await res.json();
      setMessage(data.success ? "Settings saved successfully." : data.error || "Something went wrong.");
    } catch {
      setMessage("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <main className="page-shell">
      <div className="page-container">
        <header className="topbar">
          <div className="brand-block">
            <h1>Settings</h1>
            <p className="brand-subtitle">
              Save your business name and Google review link once.
            </p>
          </div>

          <div className="nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/dashboard" className="nav-link">Dashboard</Link>
            <Link href="/calendar" className="nav-link">Calendar</Link>
            <UserButton />
          </div>
        </header>

        <div className="card" style={{ maxWidth: 760 }}>
          <h2 className="section-title">Business Details</h2>

          <input
            type="text"
            placeholder="Business name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />

          <div style={{ height: 12 }} />

          <input
            type="text"
            placeholder="Google review link"
            value={reviewLink}
            onChange={(e) => setReviewLink(e.target.value)}
          />

          <div className="button-row">
            <button onClick={saveSettings} className="btn" disabled={loading}>
              {loading ? "Saving..." : "Save Settings"}
            </button>
          </div>

          {message && (
            <p style={{ marginTop: 16, fontWeight: 700 }}>{message}</p>
          )}
        </div>
      </div>
    </main>
  );
}