"use client";

import AppHeader from "@/components/AppHeader";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <main className="page-shell">
      <div className="page-container">
        <AppHeader showUserButton={false} />

        <div className="card" style={{ maxWidth: 760, margin: "0 auto" }}>
          <span className="badge">Payment Cancelled</span>
          <h2 className="section-title">Payment was cancelled</h2>
          <p className="muted-text">
            Your payment was not completed. You can go back to Pricing and try again.
          </p>

          <div className="button-row">
            <Link href="/pricing" className="btn">
              Back to Pricing
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}