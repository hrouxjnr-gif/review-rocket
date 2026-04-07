"use client";

import AppHeader from "@/components/AppHeader";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="page-shell">
      <div className="page-container">
        <AppHeader />

        <div className="card" style={{ maxWidth: 860, margin: "40px auto 0" }}>
          <span className="badge">Privacy Policy</span>
          <h1 className="section-title" style={{ fontSize: 34 }}>
            Privacy Policy
          </h1>

          <p className="muted-text" style={{ lineHeight: 1.85, marginBottom: 16 }}>
            This page explains what data Roux Review Rocket collects, why we collect it, and
            how you can manage it. This is a practical policy for a small SaaS app. If you
            need a stricter legal policy for your region, you should review this with a
            professional.
          </p>

          <h2 className="section-title" style={{ marginTop: 18 }}>
            What we collect
          </h2>
          <div className="info-list">
            <div className="muted-text info-line">
              • <strong>Account info</strong> (from sign-in): basic identifiers like your user
              ID and email.
            </div>
            <div className="muted-text info-line">
              • <strong>Business/work data</strong>: customers, jobs, notes, invoice data, and
              generated messages you create in the app.
            </div>
            <div className="muted-text info-line">
              • <strong>Plan + payments metadata</strong>: your plan (Free/Pro/Agency) and
              payment status. We do not store raw card details.
            </div>
          </div>

          <h2 className="section-title" style={{ marginTop: 18 }}>
            What we don&apos;t collect
          </h2>
          <div className="info-list">
            <div className="muted-text info-line">
              • We don&apos;t store your customers&apos; payment card data.
            </div>
            <div className="muted-text info-line">
              • We don&apos;t sell your data.
            </div>
          </div>

          <h2 className="section-title" style={{ marginTop: 18 }}>
            Why we use your data
          </h2>
          <div className="info-list">
            <div className="muted-text info-line">
              • To run the app (saving jobs/customers, generating messages, showing usage).
            </div>
            <div className="muted-text info-line">
              • To manage subscriptions and protect plan limits.
            </div>
            <div className="muted-text info-line">
              • To provide support when you contact us.
            </div>
          </div>

          <h2 className="section-title" style={{ marginTop: 18 }}>
            Data retention
          </h2>
          <p className="muted-text" style={{ lineHeight: 1.85, marginBottom: 16 }}>
            We keep your data while your account is active so the app can work. If you want
            your data removed, contact support and we&apos;ll help you delete it.
          </p>

          <h2 className="section-title" style={{ marginTop: 18 }}>
            Security
          </h2>
          <p className="muted-text" style={{ lineHeight: 1.85, marginBottom: 16 }}>
            We use authenticated access (sign-in) and restrict protected routes. Payments are
            handled by PayFast and we only store payment identifiers needed to match your
            account to your subscription.
          </p>

          <h2 className="section-title" style={{ marginTop: 18 }}>
            Contact
          </h2>
          <p className="muted-text" style={{ lineHeight: 1.85, marginBottom: 16 }}>
            Questions? Use the support page and we&apos;ll respond.
          </p>

          <div className="button-row">
            <Link href="/feedback" className="btn">
              Contact Support
            </Link>

            <Link href="/terms" className="btn-outline">
              View Terms
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
