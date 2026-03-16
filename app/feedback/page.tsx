"use client";

import AppHeader from "@/components/AppHeader";

export default function FeedbackPage() {
  return (
    <main className="page-shell">
      <div className="page-container">
        <AppHeader />

        <div className="card" style={{ maxWidth: 820 }}>
          <h2 className="section-title">Contact</h2>
          <p className="muted-text">
            Found a bug, want to suggest a feature, or want to contact Roux Review Rocket directly?
          </p>

          <div
            className="info-box"
            style={{ marginTop: 20 }}
          >
            <h3>Email</h3>
            <p style={{ fontSize: 18, fontWeight: 700 }}>
              hendryroux32@gmail.com
            </p>
          </div>

          <div className="button-row">
            <a
              href="mailto:hendryroux32@gmail.com"
              className="btn"
            >
              Email Me
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}