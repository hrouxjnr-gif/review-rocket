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
            <Link href="/customers" className="nav-link">Customers</Link>
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
              Get more reviews, track every job, and keep customer history in one place.
            </h2>
            <p className="muted-text">
              Roux Review Rocket helps service businesses turn job notes into
              customer-ready review requests, auto-save work records, search old
              customers, and export job history when needed.
            </p>

            <div className="button-row">
              <Link href="/dashboard" className="btn">Start Using It</Link>
              <Link href="/calendar" className="btn-outline">View Calendar</Link>
              <Link href="/customers" className="btn-outline">Open Customers</Link>
            </div>
          </div>

          <div className="card hero-panel">
            <h3 className="section-title">What it helps with</h3>

            <div className="grid-list">
              <div className="list-card">
                <p><strong>Review requests</strong></p>
                <p className="list-gap">Create professional review messages in seconds.</p>
              </div>

              <div className="list-card">
                <p><strong>Job records</strong></p>
                <p className="list-gap">Auto-save each job with date, cost, and client details.</p>
              </div>

              <div className="list-card">
                <p><strong>Customer tracking</strong></p>
                <p className="list-gap">Find repeat customers and their full work history fast.</p>
              </div>

              <div className="list-card">
                <p><strong>Exports</strong></p>
                <p className="list-gap">Download your job history as CSV whenever you need it.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}