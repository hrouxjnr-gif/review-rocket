"use client";

import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export default function HowItWorksPage() {
  return (
    <main className="page-shell">
      <div className="page-container" style={{ maxWidth: 1120 }}>
        <AppHeader />

        <div style={{ marginTop: 40, display: "grid", gap: 22 }}>
          <section className="card" style={{ marginBottom: 0 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.1fr 0.9fr",
                gap: 24,
                alignItems: "start",
              }}
              className="how-top-grid"
            >
              <div>
                <span className="badge">How It Works</span>

                <h1
                  style={{
                    fontSize: "42px",
                    lineHeight: "1.08",
                    fontWeight: 800,
                    marginBottom: 14,
                    maxWidth: 760,
                  }}
                >
                  From finished job to saved record to reusable review request.
                </h1>

                <p
                  className="muted-text"
                  style={{
                    fontSize: 18,
                    lineHeight: 1.8,
                    maxWidth: 760,
                  }}
                >
                  Roux Review Rocket helps service businesses turn completed jobs
                  into professional review requests, save customer history, reuse
                  old messages, and keep everything easier to find later.
                </p>

                <div className="button-row" style={{ marginTop: 20 }}>
                  <Link href="/dashboard" className="btn">
                    Start in Dashboard
                  </Link>

                  <Link href="/pricing" className="btn-outline">
                    View Pricing
                  </Link>
                </div>
              </div>

              <div className="list-card" style={{ display: "grid", gap: 12 }}>
                <p style={{ fontWeight: 800, fontSize: 20 }}>Quick overview</p>

                <div className="info-list">
                  <div className="muted-text info-line">
                    • Save business settings once
                  </div>
                  <div className="muted-text info-line">
                    • Enter job details on the dashboard
                  </div>
                  <div className="muted-text info-line">
                    • Generate a cleaner review message
                  </div>
                  <div className="muted-text info-line">
                    • Auto-save the job and message
                  </div>
                  <div className="muted-text info-line">
                    • Find it later in Customers and Calendar
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="card" style={{ marginBottom: 0 }}>
            <h2 className="section-title" style={{ marginBottom: 18 }}>
              Main workflow
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 18,
              }}
              className="how-steps-grid"
            >
              <div className="list-card">
                <p style={{ fontWeight: 800, marginBottom: 8 }}>Step 1</p>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>
                  Save your business settings
                </h3>
                <p className="muted-text" style={{ lineHeight: 1.75 }}>
                  Go to Settings and save your business name, Google review link,
                  and currency. That lets the app generate more consistent
                  messages and cleaner job records.
                </p>
              </div>

              <div className="list-card">
                <p style={{ fontWeight: 800, marginBottom: 8 }}>Step 2</p>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>
                  Enter the job details
                </h3>
                <p className="muted-text" style={{ lineHeight: 1.75 }}>
                  On the Dashboard, add the customer name, phone number,
                  address, time, cost, and rough job notes for the completed job.
                </p>
              </div>

              <div className="list-card">
                <p style={{ fontWeight: 800, marginBottom: 8 }}>Step 3</p>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>
                  Generate the review request
                </h3>
                <p className="muted-text" style={{ lineHeight: 1.75 }}>
                  The app turns rough notes into a cleaner review message that
                  sounds more professional and easier to send.
                </p>
              </div>

              <div className="list-card">
                <p style={{ fontWeight: 800, marginBottom: 8 }}>Step 4</p>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>
                  Save the job automatically
                </h3>
                <p className="muted-text" style={{ lineHeight: 1.75 }}>
                  When a message is generated, the job is saved with the customer
                  details and generated message so it can be found later.
                </p>
              </div>

              <div className="list-card">
                <p style={{ fontWeight: 800, marginBottom: 8 }}>Step 5</p>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>
                  Find and edit old jobs
                </h3>
                <p className="muted-text" style={{ lineHeight: 1.75 }}>
                  Use Customers to search by person and Calendar to search by
                  date. If something is wrong, edit the old job directly.
                </p>
              </div>

              <div className="list-card">
                <p style={{ fontWeight: 800, marginBottom: 8 }}>Step 6</p>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>
                  Reuse saved messages
                </h3>
                <p className="muted-text" style={{ lineHeight: 1.75 }}>
                  Copy, WhatsApp, or email saved messages again later without
                  rewriting everything from scratch.
                </p>
              </div>
            </div>
          </section>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 22,
            }}
            className="how-middle-grid"
          >
            <div className="card" style={{ marginBottom: 0 }}>
              <h2 className="section-title">What each main page is for</h2>

              <div className="info-list">
                <div className="muted-text info-line">
                  <strong>Dashboard</strong>
                  <br />
                  Main working area for entering jobs and generating review requests.
                </div>

                <div className="muted-text info-line">
                  <strong>Customers</strong>
                  <br />
                  Search, compare, edit, and reuse customer job records and old messages.
                </div>

                <div className="muted-text info-line">
                  <strong>Calendar</strong>
                  <br />
                  Focus on one day at a time and review the jobs saved for that date.
                </div>

                <div className="muted-text info-line">
                  <strong>Settings</strong>
                  <br />
                  Control the business name, review link, and currency used across the app.
                </div>

                <div className="muted-text info-line">
                  <strong>Team</strong>
                  <br />
                  Add staff to the same shared workspace on the Agency plan.
                </div>

                <div className="muted-text info-line">
                  <strong>Pricing</strong>
                  <br />
                  Choose Free, Pro, or Agency depending on how many people need access and how much monthly usage you need.
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <h2 className="section-title">What makes the app useful</h2>

              <div className="info-list">
                <div className="muted-text info-line">
                  • It reduces repeated typing and messy manual follow-up
                </div>
                <div className="muted-text info-line">
                  • It keeps jobs and review messages tied together
                </div>
                <div className="muted-text info-line">
                  • It makes old customer history easier to find later
                </div>
                <div className="muted-text info-line">
                  • It gives staff a clearer process after each completed job
                </div>
                <div className="muted-text info-line">
                  • It helps the business owner keep one cleaner workflow across customers, calendar, and team usage
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
            className="how-bottom-grid"
          >
            <div className="card" style={{ marginBottom: 0 }}>
              <span className="badge">Business setup help</span>
              <h2 className="section-title">How to set up your review link</h2>

              <div className="grid-list">
                <div className="list-card">
                  <p><strong>Step 1</strong></p>
                  <p className="list-gap">Open your Google Business Profile.</p>
                </div>

                <div className="list-card">
                  <p><strong>Step 2</strong></p>
                  <p className="list-gap">
                    Find the review sharing option, usually something like “Ask for reviews”.
                  </p>
                </div>

                <div className="list-card">
                  <p><strong>Step 3</strong></p>
                  <p className="list-gap">Copy your Google review link.</p>
                </div>

                <div className="list-card">
                  <p><strong>Step 4</strong></p>
                  <p className="list-gap">
                    Paste that link into the Settings page inside Roux Review Rocket.
                  </p>
                </div>

                <div className="list-card">
                  <p><strong>Step 5</strong></p>
                  <p className="list-gap">
                    Save your settings so future review requests can use the link automatically.
                  </p>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <span className="badge">Team access help</span>
              <h2 className="section-title">How team access works</h2>

              <div className="grid-list">
                <div className="list-card">
                  <p><strong>Step 1</strong></p>
                  <p className="list-gap">
                    The owner chooses the Agency plan.
                  </p>
                </div>

                <div className="list-card">
                  <p><strong>Step 2</strong></p>
                  <p className="list-gap">
                    Each worker signs in with their own account.
                  </p>
                </div>

                <div className="list-card">
                  <p><strong>Step 3</strong></p>
                  <p className="list-gap">
                    Each worker opens the Team page and copies their User ID.
                  </p>
                </div>

                <div className="list-card">
                  <p><strong>Step 4</strong></p>
                  <p className="list-gap">
                    The worker sends that User ID to the owner.
                  </p>
                </div>

                <div className="list-card">
                  <p><strong>Step 5</strong></p>
                  <p className="list-gap">
                    The owner pastes that User ID into the Team page and adds the worker.
                  </p>
                </div>

                <div className="list-card">
                  <p><strong>Step 6</strong></p>
                  <p className="list-gap">
                    Once added, the whole team works in the same shared workspace.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="card" style={{ marginBottom: 0 }}>
            <span className="badge">Pricing help</span>
            <h2 className="section-title">Which plan should you choose?</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 18,
              }}
              className="how-plan-grid"
            >
              <div className="list-card">
                <p><strong>Free</strong></p>
                <p className="list-gap">
                  Best for testing the app and understanding the workflow before paying.
                </p>
              </div>

              <div className="list-card">
                <p><strong>Pro</strong></p>
                <p className="list-gap">
                  Best for one owner or one staff member using the app daily.
                </p>
              </div>

              <div className="list-card">
                <p><strong>Agency</strong></p>
                <p className="list-gap">
                  Best for businesses with multiple workers who need shared access under one workspace.
                </p>
              </div>
            </div>
          </section>

          <Link href="/feedback" className="card support-card-link" style={{ marginBottom: 0 }}>
            <span className="badge">Support</span>
            <h2 className="section-title">Need help?</h2>
            <p className="muted-text">
              If you need help setting up your review link, choosing a plan, or
              adding staff members, tap here to open the Contact page.
            </p>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          .how-top-grid,
          .how-middle-grid,
          .how-bottom-grid,
          .how-plan-grid,
          .how-steps-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}