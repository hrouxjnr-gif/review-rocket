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
                  Turn completed jobs into fresh reviews, clean records, and
                  better follow-up.
                </h1>

                <p className="home-hero-text-new muted-text">
                  Roux Review Rocket helps service businesses generate
                  professional review requests, save customer history, organize
                  jobs, and keep daily work flowing without messy notes, missed
                  follow-ups, or lost job records.
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
                  <div className="hero-mini-point">Customer history in one place</div>
                  <div className="hero-mini-point">Free invoice tool included</div>
                </div>
              </div>

              <div className="list-card hero-preview-card">
                <div style={{ display: "grid", gap: 14 }}>
                  <div>
                    <p className="muted-text" style={{ marginBottom: 6 }}>
                      What the app helps you do
                    </p>
                    <h3 style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.1 }}>
                      One cleaner workflow after every completed job
                    </h3>
                  </div>

                  <div className="hero-preview-stack">
                    <div className="hero-preview-row">
                      <span className="hero-dot" />
                      <div>
                        <strong>Save the customer</strong>
                        <p className="muted-text">Name, phone, address, cost, date, and notes</p>
                      </div>
                    </div>

                    <div className="hero-preview-row">
                      <span className="hero-dot" />
                      <div>
                        <strong>Generate the message</strong>
                        <p className="muted-text">Professional review text ready to copy or send</p>
                      </div>
                    </div>

                    <div className="hero-preview-row">
                      <span className="hero-dot" />
                      <div>
                        <strong>Reuse later</strong>
                        <p className="muted-text">Find old jobs fast in Customers, Calendar, and Invoice</p>
                      </div>
                    </div>
                  </div>

                  <div className="hero-proof-bar">
                    <div className="hero-proof-box">
                      <div className="hero-proof-label">Best for</div>
                      <div className="hero-proof-value">Plumbers, HVAC, electrical, field service</div>
                    </div>

                    <div className="hero-proof-box">
                      <div className="hero-proof-label">Good fit</div>
                      <div className="hero-proof-value">Solo owners and multi-staff teams</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* QUICK VALUE STRIP */}
          <section className="home-strip-grid">
            <div className="card" style={{ marginBottom: 0 }}>
              <p className="muted-text" style={{ marginBottom: 8 }}>
                Reputation
              </p>
              <h3 className="home-strip-title">Ask for reviews faster</h3>
              <p className="muted-text">
                Send the request while the good experience is still fresh.
              </p>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <p className="muted-text" style={{ marginBottom: 8 }}>
                Records
              </p>
              <h3 className="home-strip-title">Keep every job organized</h3>
              <p className="muted-text">
                Save names, notes, costs, addresses, and old messages in one workspace.
              </p>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <p className="muted-text" style={{ marginBottom: 8 }}>
                Admin
              </p>
              <h3 className="home-strip-title">Create invoices and quotes</h3>
              <p className="muted-text">
                Use the built-in invoice tool without paying extra.
              </p>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <p className="muted-text" style={{ marginBottom: 8 }}>
                Team
              </p>
              <h3 className="home-strip-title">Share one workflow</h3>
              <p className="muted-text">
                Add staff on the Agency plan and keep everyone inside the same system.
              </p>
            </div>
          </section>

          {/* 3 STEP FLOW */}
          <section className="card" style={{ marginBottom: 0 }}>
            <div className="section-heading-row">
              <div>
                <span className="badge">How it works</span>
                <h2 className="section-title" style={{ marginTop: 12 }}>
                  A simple flow your team can repeat every day
                </h2>
              </div>
            </div>

            <div className="home-steps-grid">
              <div className="list-card">
                <div className="step-number">01</div>
                <h3 className="home-card-title">Enter the completed job</h3>
                <p className="muted-text">
                  Add the customer name, phone number, address, cost, date, and rough notes from the job.
                </p>
              </div>

              <div className="list-card">
                <div className="step-number">02</div>
                <h3 className="home-card-title">Generate the review request</h3>
                <p className="muted-text">
                  Turn rough notes into a cleaner, more professional message that is easier to send.
                </p>
              </div>

              <div className="list-card">
                <div className="step-number">03</div>
                <h3 className="home-card-title">Save, find, reuse, and invoice</h3>
                <p className="muted-text">
                  Keep the record, search it later, send it again by WhatsApp or email, or build an invoice from it.
                </p>
              </div>
            </div>
          </section>

          {/* FEATURES */}
          <section className="card" style={{ marginBottom: 0 }}>
            <div className="section-heading-row">
              <div>
                <span className="badge">What you can do</span>
                <h2 className="section-title" style={{ marginTop: 12 }}>
                  Everything important stays easy to find and easy to use
                </h2>
              </div>
            </div>

            <div className="home-feature-grid">
              <div className="list-card">
                <h3 className="home-card-title">Dashboard workspace</h3>
                <p className="muted-text">
                  Generate messages, save jobs, and handle the main daily workflow from one place.
                </p>
              </div>

              <div className="list-card">
                <h3 className="home-card-title">Customers page</h3>
                <p className="muted-text">
                  Search by name, phone, address, notes, or saved message and edit old records fast.
                </p>
              </div>

              <div className="list-card">
                <h3 className="home-card-title">Calendar page</h3>
                <p className="muted-text">
                  Focus on one date, scan the jobs on that day, and take action without digging through old messages.
                </p>
              </div>

              <div className="list-card">
                <h3 className="home-card-title">Invoice and quote tool</h3>
                <p className="muted-text">
                  Create professional documents, print them, save them as PDF, or send the text by WhatsApp or email.
                </p>
              </div>

              <div className="list-card">
                <h3 className="home-card-title">Reusable business settings</h3>
                <p className="muted-text">
                  Save your business name, review link, phone, email, address, and currency once and reuse them across the app.
                </p>
              </div>

              <div className="list-card">
                <h3 className="home-card-title">Team access</h3>
                <p className="muted-text">
                  Let staff work from their own accounts while keeping the same shared workspace on the Agency plan.
                </p>
              </div>
            </div>
          </section>

          {/* WHY IT MATTERS */}
          <section className="home-two-col-grid">
            <div className="card" style={{ marginBottom: 0 }}>
              <span className="badge">Why this matters</span>
              <h2 className="section-title" style={{ marginTop: 12 }}>
                Reviews and repeat work are not separate problems
              </h2>

              <div className="info-list" style={{ marginTop: 14 }}>
                <div className="muted-text info-line">
                  Strong review volume helps a business look more established.
                </div>

                <div className="muted-text info-line">
                  Fresh reviews matter because people want to see recent proof, not old praise.
                </div>

                <div className="muted-text info-line">
                  Clean records make it easier to handle repeat work, pricing questions, and follow-up jobs later.
                </div>

                <div className="muted-text info-line">
                  A faster post-job process means less admin drag on the owner or team.
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
                  Instead of writing a message from scratch, the team saves the job and generates a review request in seconds.
                </div>

                <div className="muted-text info-line">
                  If the customer calls back later, the old notes, cost, address, and message are already saved.
                </div>

                <div className="muted-text info-line">
                  If needed, the business can turn the same job into an invoice or quote without starting over.
                </div>
              </div>
            </div>
          </section>

          {/* WHO IT IS FOR */}
          <section className="card" style={{ marginBottom: 0 }}>
            <div className="section-heading-row">
              <div>
                <span className="badge">Built for real service work</span>
                <h2 className="section-title" style={{ marginTop: 12 }}>
                  Good fit for businesses that finish jobs in the field and need a cleaner follow-up system
                </h2>
              </div>
            </div>

            <div className="home-fit-grid">
              <div className="list-card">Plumbing</div>
              <div className="list-card">Electrical</div>
              <div className="list-card">HVAC</div>
              <div className="list-card">Appliance repair</div>
              <div className="list-card">Cleaning services</div>
              <div className="list-card">General field-service teams</div>
            </div>
          </section>

          {/* FAQ */}
          <section className="card" style={{ marginBottom: 0 }}>
            <div className="section-heading-row">
              <div>
                <span className="badge">Questions people usually have</span>
                <h2 className="section-title" style={{ marginTop: 12 }}>
                  A clearer homepage also removes objections early
                </h2>
              </div>
            </div>

            <div className="home-faq-stack">
              <details className="faq-card" open>
                <summary>Is this only for review requests?</summary>
                <p className="muted-text">
                  No. It also helps with customer records, job history, calendar filtering, team access, and invoices or quotes.
                </p>
              </details>

              <details className="faq-card">
                <summary>Can I use it if I work alone?</summary>
                <p className="muted-text">
                  Yes. The Pro plan is built for solo owners or one daily user. Agency is for multi-staff teams.
                </p>
              </details>

              <details className="faq-card">
                <summary>Do I need to type my business details every time?</summary>
                <p className="muted-text">
                  No. Save them once in Settings and reuse them in messages and invoices.
                </p>
              </details>

              <details className="faq-card">
                <summary>Can I send messages without rewriting them?</summary>
                <p className="muted-text">
                  Yes. Saved messages can be copied, reused later, and sent by WhatsApp or email.
                </p>
              </details>

              <details className="faq-card">
                <summary>Is the invoice tool included?</summary>
                <p className="muted-text">
                  Yes. The invoice and quote tool is included and stays free to use.
                </p>
              </details>
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="card" style={{ marginBottom: 0 }}>
            <div className="home-final-cta">
              <div>
                <span className="badge">Start now</span>
                <h2 className="section-title" style={{ marginTop: 12 }}>
                  Clean up the post-job workflow before it turns into more admin later
                </h2>
                <p className="muted-text" style={{ maxWidth: 760, marginTop: 12 }}>
                  Start with the dashboard, test the review workflow, then use Customers,
                  Calendar, Team, and Invoices as your workspace grows.
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
          grid-template-columns: 1.1fr 0.9fr;
          gap: 24px;
          align-items: start;
        }

        .home-hero-title-new {
          font-size: 62px;
          line-height: 0.96;
          font-weight: 900;
          max-width: 820px;
          margin: 16px 0 16px;
          letter-spacing: -0.03em;
        }

        .home-hero-text-new {
          max-width: 760px;
          font-size: 18px;
          line-height: 1.85;
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

        .hero-proof-bar {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 6px;
        }

        .hero-proof-box {
          padding: 14px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .hero-proof-label {
          font-size: 13px;
          opacity: 0.75;
          margin-bottom: 6px;
        }

        .hero-proof-value {
          font-weight: 800;
          line-height: 1.5;
        }

        .home-strip-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .home-strip-title {
          font-size: 24px;
          font-weight: 900;
          line-height: 1.12;
          margin-bottom: 10px;
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

        .home-feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .home-fit-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
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

        .home-faq-stack {
          display: grid;
          gap: 14px;
        }

        .faq-card {
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          padding: 18px 20px;
        }

        .faq-card summary {
          cursor: pointer;
          font-weight: 800;
          font-size: 18px;
          list-style: none;
        }

        .faq-card summary::-webkit-details-marker {
          display: none;
        }

        .faq-card p {
          margin-top: 12px;
          line-height: 1.85;
        }

        .home-final-cta {
          display: grid;
          gap: 4px;
        }

        @media (max-width: 1100px) {
          .home-hero-title-new {
            font-size: 52px;
          }

          .home-strip-grid,
          .home-feature-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 980px) {
          .home-hero-grid,
          .home-strip-grid,
          .home-steps-grid,
          .home-feature-grid,
          .home-fit-grid,
          .home-two-col-grid,
          .hero-proof-bar {
            grid-template-columns: 1fr !important;
          }

          .home-hero-title-new {
            font-size: 44px;
            line-height: 1;
          }

          .home-hero-text-new {
            font-size: 17px;
          }
        }

        @media (max-width: 640px) {
          .home-hero-title-new {
            font-size: 36px;
          }

          .home-strip-title,
          .home-card-title {
            font-size: 21px;
          }
        }
      `}</style>
    </main>
  );
}