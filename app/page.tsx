"use client";

import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "40px 24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 60,
          }}
        >
          <h1 style={{ fontSize: 28, margin: 0 }}>Review Rocket</h1>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <SignInButton />
            <UserButton />
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 30,
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                color: "#2563eb",
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              Review requests for service businesses
            </p>

            <h2
              style={{
                fontSize: 48,
                lineHeight: 1.1,
                margin: 0,
                marginBottom: 20,
                color: "#0f172a",
              }}
            >
              Turn job notes into customer review requests.
            </h2>

            <p
              style={{
                fontSize: 18,
                lineHeight: 1.6,
                color: "#475569",
                maxWidth: 650,
                marginBottom: 30,
              }}
            >
              Built for plumbers, electricians, HVAC teams, roofers, cleaners,
              landscapers, and pest control businesses that want more Google reviews.
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link
                href="/dashboard"
                style={{
                  background: "#2563eb",
                  color: "white",
                  padding: "14px 22px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Go to Dashboard
              </Link>

              <Link
                href="/settings"
                style={{
                  background: "white",
                  color: "#0f172a",
                  padding: "14px 22px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 700,
                  border: "1px solid #cbd5e1",
                }}
              >
                Settings
              </Link>

              <Link
                href="/how-it-works"
                style={{
                  background: "white",
                  color: "#0f172a",
                  padding: "14px 22px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 700,
                  border: "1px solid #cbd5e1",
                }}
              >
                How It Works
              </Link>

              <Link
                href="/pricing"
                style={{
                  background: "white",
                  color: "#0f172a",
                  padding: "14px 22px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 700,
                  border: "1px solid #cbd5e1",
                }}
              >
                Pricing
              </Link>
            </div>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: 24,
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#0f172a" }}>Example</h3>

            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: 16,
                marginBottom: 18,
              }}
            >
              <p style={{ margin: 0, fontWeight: 700, marginBottom: 8 }}>
                Job Notes
              </p>
              <p style={{ margin: 0, color: "#475569" }}>
                fixed leaking pipe and explained the problem clearly
              </p>
            </div>

            <div
              style={{
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <p style={{ margin: 0, fontWeight: 700, marginBottom: 8 }}>
                Review Request
              </p>
              <p style={{ margin: 0, color: "#1e3a8a", lineHeight: 1.6 }}>
                Hi John, thanks for choosing Precision Plumbing. We fixed the leaking
                pipe and clearly explained the issue. If you have a moment, we would
                really appreciate a quick review.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}