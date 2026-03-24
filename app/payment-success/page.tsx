"use client";

import AppHeader from "@/components/AppHeader";
import Link from "next/link";
import { useEffect, useState } from "react";

type PaymentStatusResponse = {
  latestPayment: {
    plan: string;
    status: string;
    amount: number;
    created_at: string;
  } | null;
  subscription: {
    plan: string;
    max_users: number;
    monthly_limit: number;
  } | null;
  error?: string;
};

export default function PaymentSuccessPage() {
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState<PaymentStatusResponse | null>(null);

  const loadPaymentStatus = async () => {
    try {
      const res = await fetch("/api/payment-status");
      const data = await res.json();
      setPaymentInfo(data);
    } catch (error) {
      console.error(error);
      setPaymentInfo(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPaymentStatus();

    const timer = setTimeout(() => {
      loadPaymentStatus();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="page-shell">
      <div className="page-container">
        <AppHeader showUserButton={false} />

        <div className="card" style={{ maxWidth: 760, margin: "0 auto" }}>
          <span className="badge">Payment Returned</span>
          <h2 className="section-title">Payment return received</h2>

          {loading ? (
            <p className="muted-text">Checking latest payment status...</p>
          ) : paymentInfo?.error ? (
            <p className="muted-text">{paymentInfo.error}</p>
          ) : (
            <>
              <p className="muted-text">
                Latest payment status:{" "}
                <strong>{paymentInfo?.latestPayment?.status || "No payment found"}</strong>
              </p>

              <p className="muted-text">
                Latest payment plan:{" "}
                <strong>{paymentInfo?.latestPayment?.plan || "No payment found"}</strong>
              </p>

              <p className="muted-text">
                Current subscription plan:{" "}
                <strong>{paymentInfo?.subscription?.plan || "No subscription found"}</strong>
              </p>

              <p className="muted-text">
                Refresh the Pricing page after a few seconds if the latest payment is complete
                but the plan has not updated yet.
              </p>
            </>
          )}

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