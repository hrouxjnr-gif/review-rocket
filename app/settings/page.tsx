"use client";

import AppHeader from "@/components/AppHeader";
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
        body: JSON.stringify({
          businessName,
          reviewLink,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Settings saved successfully.");
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setMessage("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <main className="page-shell">
      <div className="page-container">
        <AppHeader />

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