"use client";

import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <main className="page-shell">
      <div className="page-container">
        <header className="topbar">
          <div className="brand-block">
            <h1>Roux Review Rocket</h1>
          </div>

          <div className="nav-links">
            <Link href="/dashboard" className="nav-link">Dashboard</Link>
            <Link href="/calendar" className="nav-link">Calendar</Link>
            <Link href="/settings" className="nav-link">Settings</Link>
            <Link href="/pricing" className="nav-link">Pricing</Link>
            <Link href="/how-it-works" className="nav-link">How It Works</Link>
            <SignInButton />
            <UserButton />
          </div>
        </header>

        <section className="hero-grid">
          <div>
            <span className="badge">Built for service businesses</span>
            <h2 className="big-title">
              Turn job notes into customer review requests.
            </h2>
            <p className="muted-text">
              Made for plumbers, electricians, HVAC teams, roofers, cleaners,
              landscapers, and pest control businesses who want more reviews,
              better records, and a faster workflow.
            </p>

            <div className="button-row">
              <Link href="/dashboard" className="btn">Open Dashboard</Link>
              <Link href="/calendar" className="btn-outline">Open Calendar</Link>
              <Link href="/pricing" className="btn-outline">View Pricing</Link>
            </div>
          </div>

          <div className="card">
            <h3 className="section-title">Example workflow</h3>

            <div className="list-card">
              <p><strong>Job Notes</strong></p>
              <p className="list-gap">
                Fixed leaking pipe and explained the problem clearly.
              </p>
            </div>

            <div className="info-box">
              <h3>Generated review request</h3>
              <p>
                Hi John,

                {"\n\n"}Thanks for choosing Precision Plumbing.

                {"\n\n"}Fixed leaking pipe and explained the problem clearly.

                {"\n\n"}If you have a moment, we would really appreciate a quick review.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}