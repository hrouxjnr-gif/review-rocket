"use client";

import AppHeader from "@/components/AppHeader";
import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="page-shell">
      <div className="page-container">
        <AppHeader />

        <div className="card" style={{ maxWidth: 860, margin: "40px auto 0" }}>
          <span className="badge">Terms</span>
          <h1 className="section-title" style={{ fontSize: 34 }}>
            Terms of Service
          </h1>

          <p className="muted-text" style={{ lineHeight: 1.85, marginBottom: 16 }}>
            These terms are a simple baseline for using Roux Review Rocket. They are not a
            substitute for legal advice. Update this page with your business name, address,
            contact email, and any region-specific requirements before going live.
          </p>

          <h2 className="section-title" style={{ marginTop: 18 }}>
            1) The service
          </h2>
          <p className="muted-text" style={{ lineHeight: 1.85, marginBottom: 16 }}>
            Roux Review Rocket helps you store customer/job notes and generate review request
            messages. The app is provided on an “as is” basis and may change over time.
          </p>

          <h2 className="section-title" style={{ marginTop: 18 }}>
            2) Accounts
          </h2>
          <div className="info-list">
            <div className="muted-text info-line">
              • You are responsible for keeping your sign-in credentials secure.
            </div>
            <div className="muted-text info-line">
              • You are responsible for the data you enter and share.
            </div>
          </div>

          <h2 className="section-title" style={{ marginTop: 18 }}>
            3) Acceptable use
          </h2>
          <div className="info-list">
            <div className="muted-text info-line">
              • Don’t use the app for illegal activity or harassment.
            </div>
            <div className="muted-text info-line">
              • Don’t attempt to break, probe, or overload the service.
            </div>
            <div className="muted-text info-line">
              • Don’t upload sensitive personal info you don’t have permission to store.
            </div>
          </div>

          <h2 className="section-title" style={{ marginTop: 18 }}>
            4) Subscriptions and billing
          </h2>
          <p className="muted-text" style={{ lineHeight: 1.85, marginBottom: 16 }}>
            Paid plans are billed via PayFast. If you purchase a monthly plan, PayFast will
            attempt to charge the saved payment method on the recurring schedule. If payment
            fails or a subscription is canceled, your plan may be downgraded.
          </p>

          <h2 className="section-title" style={{ marginTop: 18 }}>
            5) Warranty and liability
          </h2>
          <p className="muted-text" style={{ lineHeight: 1.85, marginBottom: 16 }}>
            We do our best to keep the service available and secure, but we can’t guarantee
            uninterrupted operation. To the extent allowed by law, we’re not liable for
            indirect damages or lost profits.
          </p>

          <h2 className="section-title" style={{ marginTop: 18 }}>
            6) Contact
          </h2>
          <p className="muted-text" style={{ lineHeight: 1.85, marginBottom: 16 }}>
            If you have questions about these terms, please contact support.
          </p>

          <div className="button-row">
            <Link href="/feedback" className="btn">
              Contact Support
            </Link>

            <Link href="/privacy" className="btn-outline">
              View Privacy
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
