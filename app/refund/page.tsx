"use client";

import AppHeader from "@/components/AppHeader";
import Link from "next/link";

export default function RefundPolicyPage() {
  return (
    <main className="page-shell">
      <div className="page-container">
        <AppHeader />

        <div className="card" style={{ maxWidth: 860, margin: "40px auto 0" }}>
          <span className="badge">Refunds</span>
          <h1 className="section-title" style={{ fontSize: 34 }}>
            Refund & Cancellation Policy
          </h1>

          <p className="muted-text" style={{ lineHeight: 1.85, marginBottom: 16 }}>
            This policy is a simple template you can adjust to match how you want to run
            refunds. PayFast charges and subscription management are handled through your
            PayFast dashboard.
          </p>

          <h2 className="section-title" style={{ marginTop: 18 }}>
            Monthly subscriptions
          </h2>
          <div className="info-list">
            <div className="muted-text info-line">
              • You can cancel your subscription at any time to prevent future renewals.
            </div>
            <div className="muted-text info-line">
              • If you cancel, you may keep access until the end of the paid period (if
              applicable).
            </div>
          </div>

          <h2 className="section-title" style={{ marginTop: 18 }}>
            Refund requests
          </h2>
          <p className="muted-text" style={{ lineHeight: 1.85, marginBottom: 16 }}>
            If you believe you were charged in error, contact support with your account email
            and the payment date. We’ll investigate and advise next steps.
          </p>

          <h2 className="section-title" style={{ marginTop: 18 }}>
            PayFast refunds
          </h2>
          <p className="muted-text" style={{ lineHeight: 1.85, marginBottom: 16 }}>
            Refunds are processed in PayFast. Processing times can vary depending on payment
            method and bank.
          </p>

          <div className="button-row">
            <Link href="/feedback" className="btn">
              Contact Support
            </Link>

            <Link href="/pricing" className="btn-outline">
              Back to Pricing
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
