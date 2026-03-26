"use client";

import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export default function HomePage() {
  return (
    <main className="page-shell">
      <AppHeader />

      <div className="page-container" style={{ marginTop: 44 }}>
        <div style={{ display: "grid", gap: 22 }}>
          {/* HERO */}
          <section className="card" style={{ marginBottom: 0 }}>
            <div className="home-hero-grid">
              <div>
                <span className="badge">Built for service businesses</span>

                <h1 className="home-hero-title-new">
                  Get more reviews without creating more admin.
                </h1>

                <p className="home-hero-text-new muted-text">
                  Roux Review Rocket helps you turn completed jobs into
                  professional review requests, clean customer records, and
                  faster follow-up.
                </p>

                <div className="button-row" style={{ marginTop: 20 }}>
                  <Link href="/dashboard" className="btn">
                    Start in Dashboard
                  </Link>

                  <Link href="/pricing" className="btn-outline">
                    View Pricing
                  </Link>
                </div>

                <div className="hero-mini-points">
                  <div className="hero-mini-point">Review requests in seconds</div>
                  <div className="hero-mini-point">Customer records saved</div>
                  <div className="hero-mini-point">Free invoice tool included</div>
                </div>
              </div>

              <div className="list-card hero-preview-card">
                <p className="muted-text" style={{ marginBottom: 8 }}>
                  One cleaner workflow after every completed job
                </p>

                <div className="hero-preview-stack">
                  <div className="hero-preview-row">
                    <span className="hero-dot" />
                    <div>
                      <strong>Save the job</strong>
                      <p className="muted-text">
                        Name, phone, address, date, notes, and cost
                      </p>
                    </div>
                  </div>

                  <div className="hero-preview-row">
                    <span className="hero-dot" />
                    <div>
                      <strong>Generate the message</strong>
                      <p className="muted-text">
                        Clean review text ready to copy or send
                      </p>
                    </div>
                  </div>

                  <div className="hero-preview-row">
                    <span className="hero-dot" />
                    <div>
                      <strong>Reuse later</strong>
                      <p className="muted-text">
                        Find old jobs fast in Customers, Calendar, and Invoice
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* BENEFITS */}
          <section className="home-benefit-grid">
            <div className="card" style={{ marginBottom: 0 }}>
              <p className="muted-text" style={{ marginBottom: 8 }}>
                Reputation
              </p>
              <h3 className="home-card-title">Ask while the job is still fresh</h3>
              <p className="muted-text">
                Send review requests while the customer still clearly remembers
                the work.
              </p>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <p className="muted-text" style={{ marginBottom: 8 }}>
                Records
              </p>
              <h3 className="home-card-title">Keep every customer organized</h3>
              <p className="muted-text">
                Save names, notes, addresses, prices, and old messages in one
                place.
              </p>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <p className="muted-text" style={{ marginBottom: 8 }}>
                Admin
              </p>
              <h3 className="home-card-title">Invoice without extra tools</h3>
              <p className="muted-text">
                Create quotes and invoices inside the same workflow.
              </p>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="card" style={{ marginBottom: 0 }}>
            <div className="section-heading-row">
              <div>
                <span className="badge">How it works</span>
                <h2 className="section-title" style={{ marginTop: 12 }}>
                  Three fast steps
                </h2>
              </div>
            </div>

            <div className="home-steps-grid">
              <div className="list-card">
                <div className="step-number">01</div>
                <h3 className="home-card-title">Enter the job</h3>
                <p className="muted-text">
                  Add the customer details, cost, and rough notes.
                </p>
              </div>

              <div className="list-card">
                <div className="step-number">02</div>
                <h3 className="home-card-title">Generate the request</h3>
                <p className="muted-text">
                  Turn rough notes into a professional review message.
                </p>
              </div>

              <div className="list-card">
                <div className="step-number">03</div>
                <h3 className="home-card-title">Save and reuse it</h3>
                <p className="muted-text">
                  Find the job later, send it again, or turn it into an invoice.
                </p>
              </div>
            </div>
          </section>

          {/* PROOF / EXAMPLE */}
          <section className="home-two-col-grid">
            <div className="card" style={{ marginBottom: 0 }}>
              <span className="badge">Why this matters</span>
              <h2 className="section-title" style={{ marginTop: 12 }}>
                Reviews influence real buying decisions
              </h2>

              <p className="muted-text" style={{ marginTop: 14, lineHeight: 1.8 }}>
                People read reviews before choosing local businesses. A stronger
                review habit plus cleaner customer records can help you look
                more credible and handle repeat work faster.
              </p>

              <div className="proof-stat-box">
                <div className="proof-stat-number">97%</div>
                <div className="proof-stat-text muted-text">
                  of consumers read reviews online
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <span className="badge">Simple example</span>
              <h2 className="section-title" style={{ marginTop: 12 }}>
                What it looks like in practice
              </h2>

              <div className="info-list" style={{ marginTop: 14 }}>
                <div className="muted-text info-line">
                  A plumber finishes a job.
                </div>

                <div className="muted-text info-line">
                  Instead of writing a message from scratch, the team saves the
                  job and generates the review request in seconds.
                </div>

                <div className="muted-text info-line">
                  If the customer calls back later, the old notes, price, and
                  message are already there.
                </div>
              </div>
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="card" style={{ marginBottom: 0 }}>
            <div className="home-final-cta">
              <div>
                <span className="badge">Start now</span>
                <h2 className="section-title" style={{ marginTop: 12 }}>
                  Keep the workflow simple from the first completed job.
                </h2>
                <p
                  className="muted-text"
                  style={{ maxWidth: 700, marginTop: 12 }}
                >
                  Start in the dashboard, test the review workflow, and expand
                  into customers, calendar, team, and invoices when you need it.
                </p>
              </div>

              <div className="button-row" style={{ marginTop: 20 }}>
                <Link href="/dashboard" className="btn">
                  Open Dashboard
                </Link>

                <Link href="/pricing" className="btn-outline">
                  Compare Plans
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        .home-hero-grid {
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          gap: 24px;
          align-items: start;
        }

        .home-hero-title-new {
          font-size: 58px;
          line-height: 0.96;
          font-weight: 900;
          max-width: 760px;
          margin: 16px 0 16px;
          letter-spacing: -0.03em;
        }

        .home-hero-text-new {
          max-width: 680px;
          font-size: 18px;
          line-height: 1.8;
        }

        .hero-mini-points {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }

        .hero-mini-point {
          padding: 10px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(255, 255, 255, 0.04);
          font-weight: 700;
          font-size: 14px;
        }

        .hero-preview-card {
          height: 100%;
          display: grid;
          gap: 16px;
          align-content: start;
        }

        .hero-preview-stack {
          display: grid;
          gap: 14px;
        }

        .hero-preview-row {
          display: grid;
          grid-template-columns: 12px 1fr;
          gap: 12px;
          align-items: start;
        }

        .hero-dot {
          width: 12px;
          height: 12px;
          border-radius: 999px;
          margin-top: 6px;
          background: linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%);
          display: block;
        }

        .home-benefit-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .section-heading-row {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: end;
          margin-bottom: 18px;
        }

        .home-steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .home-two-col-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
        }

        .home-card-title {
          font-size: 24px;
          font-weight: 900;
          line-height: 1.12;
          margin-bottom: 10px;
        }

        .step-number {
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.08em;
          opacity: 0.7;
          margin-bottom: 12px;
        }

        .proof-stat-box {
          margin-top: 18px;
          padding: 18px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
        }

        .proof-stat-number {
          font-size: 42px;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 8px;
        }

        .proof-stat-text {
          line-height: 1.6;
        }

        .home-final-cta {
          display: grid;
          gap: 4px;
        }

        @media (max-width: 1100px) {
          .home-hero-title-new {
            font-size: 50px;
          }

          .home-benefit-grid,
          .home-steps-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 980px) {
          .home-hero-grid,
          .home-benefit-grid,
          .home-steps-grid,
          .home-two-col-grid {
            grid-template-columns: 1fr !important;
          }

          .home-hero-title-new {
            font-size: 42px;
            line-height: 1;
          }

          .home-hero-text-new {
            font-size: 17px;
          }
        }

        @media (max-width: 640px) {
          .home-hero-title-new {
            font-size: 34px;
          }

          .home-card-title {
            font-size: 21px;
          }

          .proof-stat-number {
            font-size: 34px;
          }
        }
      `}</style>
    </main>
  );
}