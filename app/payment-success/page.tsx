"use client";

import AppHeader from "@/components/AppHeader";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <main className="page-shell">
      <div className="page-container">
        <AppHeader showUserButton={false} />

        <div className="card" style={{ maxWidth: 760, margin: "0 auto" }}>
          <span className="badge">Payment Returned</span>
          <h2 className="section-title">Payment return received</h2>
          <p className="muted-text">
            If your payment was successful, your plan should update shortly after
            PayFast sends the server notification.
          </p>
          <p className="muted-text">
            Go back to Pricing and refresh after a few seconds.
          </p>

          <div className="button-row">
            <Link href="/pricing" className="btn">
              Back to Pricing
            </Link>

            <Link href="/dashboard" className="btn-outline">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}