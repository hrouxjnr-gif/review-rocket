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
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
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
    } catch (error) {
      console.error("Save failed:", error);
      setMessage("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "32px 24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 32, color: "#0f172a" }}>
              Settings
            </h1>
            <p style={{ marginTop: 8, color: "#64748b" }}>
              Save your business name and Google review link once.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link
              href="/"
              style={{
                textDecoration: "none",
                color: "#2563eb",
                fontWeight: 700,
              }}
            >
              Home
            </Link>

            <Link
              href="/dashboard"
              style={{
                textDecoration: "none",
                color: "#2563eb",
                fontWeight: 700,
              }}
            >
              Dashboard
            </Link>

            <UserButton />
          </div>
        </header>

        <section
          style={{
            background: "white",
            borderRadius: 18,
            padding: 24,
            border: "1px solid #e2e8f0",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          <h2 style={{ marginTop: 0, color: "#0f172a" }}>Business Details</h2>

          <input
            type="text"
            placeholder="Business name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            style={{
              width: "100%",
              marginTop: 16,
              padding: 12,
              borderRadius: 10,
              border: "1px solid #cbd5e1",
              fontSize: 15,
            }}
          />

          <input
            type="text"
            placeholder="Google review link"
            value={reviewLink}
            onChange={(e) => setReviewLink(e.target.value)}
            style={{
              width: "100%",
              marginTop: 12,
              padding: 12,
              borderRadius: 10,
              border: "1px solid #cbd5e1",
              fontSize: 15,
            }}
          />

          <button
            onClick={saveSettings}
            style={{
              marginTop: 16,
              padding: "14px 20px",
              cursor: "pointer",
              borderRadius: 10,
              border: "none",
              background: "#2563eb",
              color: "white",
              fontWeight: 700,
              fontSize: 16,
            }}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>

          {message && (
            <p style={{ marginTop: 16, color: "#0f172a", fontWeight: 600 }}>
              {message}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}