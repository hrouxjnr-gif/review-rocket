"use client";

import AppHeader from "@/components/AppHeader";

export default function ContactPage() {
  return (
    <main className="page-shell">
      <div className="page-container">
        <AppHeader />

        <section style={{ maxWidth: 820, margin: "0 auto" }}>
          <div className="card">
            <span className="badge">Support</span>
            <h2 className="section-title">Contact Roux Review Rocket</h2>
            <p className="muted-text" style={{ marginBottom: 20 }}>
              Found a bug, want to suggest a feature, or need help using the app?
              Contact us directly below.
            </p>

            <div className="info-box">
              <h3 style={{ marginBottom: 8 }}>Support Email</h3>
              <p style={{ fontSize: 18, fontWeight: 700 }}>
                hendryroux32@gmail.com
              </p>
            </div>

            <div className="button-row">
              <a href="mailto:hendryroux32@gmail.com" className="btn">
                Email Support
              </a>
            </div>

            <div className="grid-list" style={{ marginTop: 24 }}>
              <div className="list-card">
                <p><strong>Bug reports</strong></p>
                <p className="list-gap">
                  Tell us what page broke, what button you clicked, and what error you saw.
                </p>
              </div>

              <div className="list-card">
                <p><strong>Feature requests</strong></p>
                <p className="list-gap">
                  Tell us what would make the app easier for your business or your staff.
                </p>
              </div>

              <div className="list-card">
                <p><strong>Business help</strong></p>
                <p className="list-gap">
                  Need help setting up your review link, pricing, or team access? Email us.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}