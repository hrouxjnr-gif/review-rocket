"use client";

import AppHeader from "@/components/AppHeader";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [businessName, setBusinessName] = useState("");
  const [reviewLink, setReviewLink] = useState("");
  const [currency, setCurrency] = useState("R");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();

      if (data.settings) {
        setBusinessName(data.settings.business_name || "");
        setReviewLink(data.settings.review_link || "");
        setCurrency(data.settings.currency || "R");
        setBusinessEmail(data.settings.business_email || "");
        setBusinessPhone(data.settings.business_phone || "");
        setBusinessAddress(data.settings.business_address || "");
      }
    } catch (error) {
      console.error(error);
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
          currency,
          businessEmail,
          businessPhone,
          businessAddress,
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

        <div style={{ marginTop: 40, display: "grid", gap: 22 }}>
          <section className="card" style={{ marginBottom: 0 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.05fr 0.95fr",
                gap: 24,
                alignItems: "start",
              }}
              className="settings-top-grid"
            >
              <div>
                <span className="badge">Settings</span>

                <h1
                  style={{
                    fontSize: "40px",
                    lineHeight: "1.08",
                    fontWeight: 800,
                    marginBottom: 14,
                    maxWidth: 760,
                  }}
                >
                  Save your business details once, then use them across the whole app.
                </h1>

                <p
                  className="muted-text"
                  style={{
                    fontSize: 18,
                    lineHeight: 1.75,
                    maxWidth: 760,
                  }}
                >
                  These details are used in review messages, invoices, quotes,
                  customer records, calendar records, and money totals.
                </p>
              </div>

              <div className="list-card" style={{ display: "grid", gap: 12 }}>
                <p style={{ fontWeight: 800, fontSize: 20 }}>What gets auto-filled</p>

                <div className="info-list">
                  <div className="muted-text info-line">
                    • Business name in messages and invoices
                  </div>
                  <div className="muted-text info-line">
                    • Review link in generated review requests
                  </div>
                  <div className="muted-text info-line">
                    • Currency in jobs, pricing, and invoices
                  </div>
                  <div className="muted-text info-line">
                    • Business email, phone, and address in the invoice tool
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 22,
              alignItems: "start",
            }}
            className="settings-main-grid"
          >
            <div className="card" style={{ marginBottom: 0, padding: 30 }}>
              <h2 className="section-title" style={{ marginBottom: 18 }}>
                Business Details
              </h2>

              <div style={{ display: "grid", gap: 14 }}>
                <input
                  type="text"
                  placeholder="Business name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Google review link"
                  value={reviewLink}
                  onChange={(e) => setReviewLink(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Currency symbol or code (example: R, AUD, $, £, €)"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                />

                <input
                  type="email"
                  placeholder="Business email"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Business phone"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                />

                <textarea
                  rows={4}
                  placeholder="Business address"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                />

                <div className="button-row" style={{ marginTop: 8 }}>
                  <button onClick={saveSettings} className="btn" disabled={loading}>
                    {loading ? "Saving..." : "Save Settings"}
                  </button>
                </div>

                {message && (
                  <p style={{ marginTop: 6, fontWeight: 700 }}>{message}</p>
                )}
              </div>
            </div>

            <div style={{ display: "grid", gap: 22 }}>
              <div className="card" style={{ marginBottom: 0, padding: 30 }}>
                <h2 className="section-title" style={{ marginBottom: 18 }}>
                  Live review message preview
                </h2>

                <div className="info-box">
                  <p className="muted-text" style={{ lineHeight: 1.8 }}>
                    Hi there, thank you for choosing{" "}
                    <strong>{businessName || "Your Business Name"}</strong>. If you were
                    happy with the service, we would really appreciate your review
                    {reviewLink ? ` here: ${reviewLink}` : "."}
                  </p>
                </div>
              </div>

              <div className="card" style={{ marginBottom: 0, padding: 30 }}>
                <h2 className="section-title" style={{ marginBottom: 18 }}>
                  Live invoice header preview
                </h2>

                <div className="info-box" style={{ display: "grid", gap: 8 }}>
                  <div style={{ fontWeight: 900, fontSize: 24 }}>
                    {businessName || "Your Business Name"}
                  </div>

                  <div className="muted-text">
                    {businessEmail || "business@example.com"}
                  </div>

                  <div className="muted-text">
                    {businessPhone || "+61 8 7000 0000"}
                  </div>

                  <div className="muted-text" style={{ whiteSpace: "pre-wrap" }}>
                    {businessAddress || "123 Example Street\nAdelaide SA 5000"}
                  </div>

                  <div
                    style={{
                      marginTop: 10,
                      fontWeight: 800,
                    }}
                  >
                    Currency: {currency || "R"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 22,
            }}
            className="settings-bottom-grid"
          >
            <div className="card" style={{ marginBottom: 0 }}>
              <h2 className="section-title">Why this matters</h2>

              <div className="info-list">
                <div className="muted-text info-line">
                  • You do not have to retype the same business details every time
                </div>
                <div className="muted-text info-line">
                  • Your invoice tool becomes much faster to use daily
                </div>
                <div className="muted-text info-line">
                  • Your messages and documents stay consistent and professional
                </div>
                <div className="muted-text info-line">
                  • Your currency stays correct everywhere in the app
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <h2 className="section-title">Best setup flow</h2>

              <div className="info-list">
                <div className="muted-text info-line">
                  1. Save your business name
                </div>
                <div className="muted-text info-line">
                  2. Add your direct Google review link
                </div>
                <div className="muted-text info-line">
                  3. Add your business email, phone, and address
                </div>
                <div className="muted-text info-line">
                  4. Set your correct currency
                </div>
                <div className="muted-text info-line">
                  5. Open the invoice page and test the auto-fill
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          .settings-top-grid,
          .settings-main-grid,
          .settings-bottom-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}