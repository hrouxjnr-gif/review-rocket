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
            <p className="brand-subtitle">
              Smart review requests and job records for service businesses.
            </p>
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
            <span className="badge">Built for plumbers, electricians, HVAC and more</span>
            <h2 className="big-title">
              Turn every finished job into a professional review request.
            </h2>
            <p className="muted-text">
              Roux Review Rocket helps service businesses create customer-ready
              review requests, auto-save job records, track old work, and keep
              everything organised in one place.
            </p>

            <div className="button-row">
              <Link href="/dashboard" className="btn">Open Dashboard</Link>
              <Link href="/calendar" className="btn-outline">Open Calendar</Link>
              <Link href="/pricing" className="btn-outline">View Pricing</Link>
            </div>
          </div>

          <div className="card hero-panel">
            <h3 className="section-title">How it feels to use</h3>

            <div className="list-card">
              <p><strong>Job Notes</strong></p>
              <p className="list-gap">
                Fixed leaking pipe, explained the issue clearly, and customer was happy.
              </p>
            </div>

            <div className="info-box">
              <h3>Generated message</h3>
              <p>
                Hi John,

                {"\n\n"}Thanks for choosing Precision Plumbing.

                {"\n\n"}Fixed leaking pipe and explained the issue clearly.

                {"\n\n"}If you have a moment, we would really appreciate a quick review.

                {"\n\n"}Thank you again for your support!
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}