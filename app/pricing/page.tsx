"use client";

import AppHeader from "@/components/AppHeader";
import { useEffect, useState } from "react";

type SubscriptionData = {
  plan: string;
  max_users: number;
  monthly_limit: number;
};

export default function PricingPage() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [message, setMessage] = useState("");

  const loadSubscription = async () => {
    try {
      const res = await fetch("/api/subscription");
      const data = await res.json();
      if (!data.error) {
        setSubscription(data);
      }
    } catch (error) {
      console.error("Failed to load subscription:", error);
    }
  };

  useEffect(() => {
    loadSubscription();
  }, []);

  const changePlan = async (plan: "free" | "pro" | "agency") => {
    setMessage("");

    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(
          `Plan changed to ${plan}. This is only for testing until payments are connected.`
        );
        loadSubscription();
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Failed to change plan:", error);
      setMessage("Something went wrong.");
    }
  };

  return (
    <main className="page-shell">
      <div className="page-container">
        <AppHeader showUserButton={false} />

        <section style={{ textAlign: "center", marginBottom: 34 }}>
          <span className="badge">Simple pricing for service businesses</span>
          <h2
            className="big-title"
            style={{ maxWidth: 780, marginInline: "auto" }}
          >
            Choose the plan that fits your business.
          </h2>
          <p
            className="muted-text"
            style={{ maxWidth: 760, margin: "18px auto 0" }}
          >
            Free is for testing. Pro is best for solo operators. Agency is best for
            businesses with multiple workers who need shared access under one workspace.
          </p>

          {subscription && (
            <p style={{ marginTop: 16, fontWeight: 700 }}>
              Current plan: {subscription.plan}
            </p>
          )}

          {message && (
            <p style={{ marginTop: 10, fontWeight: 700 }}>{message}</p>
          )}
        </section>

        <section
          className="price-grid"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <div className="price-card">
            <h3 className="section-title">Free</h3>
            <p className="price-value">$0</p>
            <p className="muted-text">For testing the app</p>

            <ul className="price-list">
              <li>5 review requests per month</li>
              <li>1 user</li>
              <li>Dashboard access</li>
              <li>Calendar access</li>
              <li>Customers access</li>
              <li>Basic settings</li>
            </ul>

            <button
              className="btn-outline"
              style={{ marginTop: 18 }}
              onClick={() => changePlan("free")}
            >
              Use Free
            </button>
          </div>

          <div className="price-card featured">
            <div className="price-pill">Best for solo businesses</div>
            <h3 className="section-title">Pro</h3>
            <p className="price-value">AUD 29</p>
            <p className="muted-text">per month</p>

            <ul className="price-list">
              <li>300 review requests per month</li>
              <li>1 user</li>
              <li>All dashboard tools</li>
              <li>Calendar and customer tracking</li>
              <li>CSV export</li>
              <li>Priority updates</li>
            </ul>

            <button
              className="btn"
              style={{ marginTop: 18 }}
              onClick={() => changePlan("pro")}
            >
              Use Pro
            </button>
          </div>

          <div className="price-card">
            <h3 className="section-title">Agency</h3>
            <p className="price-value">AUD 100</p>
            <p className="muted-text">per month</p>

            <ul className="price-list">
              <li>10,000 review requests per month</li>
              <li>Unlimited users</li>
              <li>Shared team workspace</li>
              <li>Team management page</li>
              <li>Best for multi-staff businesses</li>
              <li>Owner + staff workflow</li>
            </ul>

            <button
              className="btn-outline"
              style={{ marginTop: 18 }}
              onClick={() => changePlan("agency")}
            >
              Use Agency
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}