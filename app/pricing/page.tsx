"use client";

import AppHeader from "@/components/AppHeader";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

type SubscriptionData = {
  plan: string;
  max_users: number;
  monthly_limit: number;
};

export default function PricingPage() {
  const { user } = useUser();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [message, setMessage] = useState("");
  const [loadingPlan, setLoadingPlan] = useState<"free" | "pro" | "agency" | "">("");

  const currentPlan = (subscription?.plan || "free").toLowerCase();

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
    setLoadingPlan(plan);

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
        setMessage(`Plan changed to ${plan}.`);
        await loadSubscription();
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Failed to change plan:", error);
      setMessage("Something went wrong.");
    }

    setLoadingPlan("");
  };

  const startPayment = async (plan: "pro" | "agency") => {
    setMessage("");
    setLoadingPlan(plan);

    try {
      const res = await fetch("/api/payfast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          email: user?.primaryEmailAddress?.emailAddress || "",
          name: user?.firstName || "Customer",
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setMessage(data.error || "Failed to start payment.");
    } catch (error) {
      console.error("Failed to start payment:", error);
      setMessage("Failed to start payment.");
    }

    setLoadingPlan("");
  };

  return (
    <main className="page-shell">
      <div className="page-container">
        <AppHeader showUserButton={false} />

        <div style={{ marginTop: 40, display: "grid", gap: 22 }}>
          {/* HERO */}
          <section className="card" style={{ marginBottom: 0 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.15fr 0.85fr",
                gap: 22,
                alignItems: "start",
              }}
              className="pricing-hero-grid"
            >
              <div>
                <span className="badge">Pricing</span>

                <h1
                  style={{
                    fontSize: "46px",
                    lineHeight: "1.06",
                    fontWeight: 800,
                    marginBottom: 14,
                    maxWidth: 760,
                  }}
                >
                  Simple pricing for service businesses that want more reviews.
                </h1>

                <p
                  className="muted-text"
                  style={{
                    maxWidth: 760,
                    fontSize: 18,
                    lineHeight: 1.8,
                    marginBottom: 18,
                  }}
                >
                  Start free, upgrade when you need more monthly review requests,
                  and move to Agency when multiple workers need one shared workspace.
                </p>

                <div className="button-row">
                  <a href="#plans" className="btn">
                    View Plans
                  </a>

                  <a href="/dashboard" className="btn-outline">
                    Open Dashboard
                  </a>
                </div>

                {message && (
                  <p style={{ marginTop: 16, fontWeight: 700 }}>{message}</p>
                )}
              </div>

              <div
                className="list-card"
                style={{
                  minHeight: "100%",
                  display: "grid",
                  gap: 14,
                  alignContent: "start",
                }}
              >
                <p style={{ fontWeight: 800, fontSize: 20 }}>
                  Current plan
                </p>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      padding: "8px 12px",
                      borderRadius: 999,
                      background: "rgba(223,246,255,0.12)",
                      border: "1px solid rgba(223,246,255,0.18)",
                      fontWeight: 800,
                      textTransform: "capitalize",
                    }}
                  >
                    {currentPlan}
                  </span>
                </div>

                <div className="info-list">
                  <div className="muted-text info-line">
                    • Free = testing the app
                  </div>
                  <div className="muted-text info-line">
                    • Pro = best for one operator
                  </div>
                  <div className="muted-text info-line">
                    • Agency = best for teams
                  </div>
                  <div className="muted-text info-line">
                    • PayFast checkout is charged in ZAR
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* PLAN CARDS */}
          <section
            id="plans"
            className="price-grid pricing-plan-grid"
            style={{
              gridTemplateColumns: "repeat(3, 1fr)",
              maxWidth: 1100,
              margin: "0 auto",
            }}
          >
            <div className="price-card">
              {currentPlan === "free" && (
                <div className="price-pill">Current plan</div>
              )}

              <h3 className="section-title">Free</h3>
              <p className="price-value">AUD 0</p>
              <p className="muted-text" style={{ marginBottom: 14 }}>
                Best for testing and first setup
              </p>

              <ul className="price-list">
                <li>5 review requests per month</li>
                <li>1 user</li>
                <li>Dashboard access</li>
                <li>Calendar access</li>
                <li>Customers access</li>
                <li>Basic settings</li>
              </ul>

              <div className="button-row" style={{ marginTop: 18 }}>
                <button
                  className="btn-outline"
                  onClick={() => changePlan("free")}
                  disabled={loadingPlan !== ""}
                >
                  {loadingPlan === "free" ? "Loading..." : "Use Free"}
                </button>
              </div>
            </div>

            <div className="price-card featured">
              <div className="price-pill">
                {currentPlan === "pro" ? "Current plan" : "Most popular"}
              </div>

              <h3 className="section-title">Pro</h3>
              <p className="price-value">Approx. AUD 29</p>
              <p className="muted-text" style={{ marginBottom: 14 }}>
                Charged as R 349 via PayFast
              </p>

              <ul className="price-list">
                <li>300 review requests per month</li>
                <li>1 user</li>
                <li>All dashboard tools</li>
                <li>Calendar and customer tracking</li>
                <li>CSV export</li>
                <li>Priority updates</li>
              </ul>

              <div className="button-row" style={{ marginTop: 18 }}>
                <button
                  className="btn"
                  onClick={() => startPayment("pro")}
                  disabled={loadingPlan !== ""}
                >
                  {loadingPlan === "pro" ? "Loading..." : "Pay with PayFast"}
                </button>

                <button
                  className="btn-outline"
                  onClick={() => changePlan("pro")}
                  disabled={loadingPlan !== ""}
                >
                  Test Switch Pro
                </button>
              </div>
            </div>

            <div className="price-card">
              <div className="price-pill">
                {currentPlan === "agency" ? "Current plan" : "Team plan"}
              </div>

              <h3 className="section-title">Agency</h3>
              <p className="price-value">Approx. AUD 100</p>
              <p className="muted-text" style={{ marginBottom: 14 }}>
                Charged as R 1199 via PayFast
              </p>

              <ul className="price-list">
                <li>10,000 review requests per month</li>
                <li>Unlimited users</li>
                <li>Shared team workspace</li>
                <li>Team management page</li>
                <li>Best for multi-staff businesses</li>
                <li>Owner + staff workflow</li>
              </ul>

              <div className="button-row" style={{ marginTop: 18 }}>
                <button
                  className="btn"
                  onClick={() => startPayment("agency")}
                  disabled={loadingPlan !== ""}
                >
                  {loadingPlan === "agency" ? "Loading..." : "Pay with PayFast"}
                </button>

                <button
                  className="btn-outline"
                  onClick={() => changePlan("agency")}
                  disabled={loadingPlan !== ""}
                >
                  Test Switch Agency
                </button>
              </div>
            </div>
          </section>

          {/* VALUE SECTION */}
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
            }}
            className="pricing-value-grid"
          >
            <div className="card" style={{ marginBottom: 0 }}>
              <h2 className="section-title">What you are paying for</h2>

              <div className="info-list">
                <div className="muted-text info-line">
                  • Faster review-request workflow after every completed job
                </div>
                <div className="muted-text info-line">
                  • Better customer record keeping in one place
                </div>
                <div className="muted-text info-line">
                  • Less time lost searching old notes and messages
                </div>
                <div className="muted-text info-line">
                  • More professional follow-up across your business
                </div>
                <div className="muted-text info-line">
                  • Team access when your business grows past one user
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <h2 className="section-title">Who each plan is for</h2>

              <div className="info-list">
                <div className="muted-text info-line">
                  • <strong>Free</strong> — testing the app and basic setup
                </div>
                <div className="muted-text info-line">
                  • <strong>Pro</strong> — solo plumbers, electricians, HVAC, and similar service owners
                </div>
                <div className="muted-text info-line">
                  • <strong>Agency</strong> — businesses with office staff, field staff, or multiple workers using the same system
                </div>
              </div>
            </div>
          </section>

          {/* COMPARISON */}
          <section className="card" style={{ marginBottom: 0, padding: 0, overflow: "hidden" }}>
            <div
              style={{
                padding: "18px 22px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h2 className="section-title" style={{ marginBottom: 8 }}>
                Compare plans
              </h2>
              <p className="muted-text">
                A quick view of what changes as your business grows.
              </p>
            </div>

            <div style={{ display: "grid" }}>
              {[
                ["Review requests / month", "5", "300", "10,000"],
                ["Users", "1", "1", "Unlimited"],
                ["Dashboard", "Yes", "Yes", "Yes"],
                ["Calendar", "Yes", "Yes", "Yes"],
                ["Customers", "Yes", "Yes", "Yes"],
                ["CSV export", "No", "Yes", "Yes"],
                ["Shared workspace", "No", "No", "Yes"],
                ["Team management", "No", "No", "Yes"],
              ].map(([label, free, pro, agency], index) => (
                <div
                  key={label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.3fr 0.55fr 0.55fr 0.55fr",
                    gap: 12,
                    padding: "14px 22px",
                    borderBottom:
                      index === 7 ? "none" : "1px solid rgba(255,255,255,0.06)",
                    alignItems: "center",
                  }}
                  className="pricing-compare-row"
                >
                  <div style={{ fontWeight: 700 }}>{label}</div>
                  <div className="muted-text">{free}</div>
                  <div className="muted-text">{pro}</div>
                  <div className="muted-text">{agency}</div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
            }}
            className="pricing-faq-grid"
          >
            <div className="card" style={{ marginBottom: 0 }}>
              <h2 className="section-title">FAQ</h2>

              <div className="info-list">
                <div className="muted-text info-line">
                  <strong>Why does the page show AUD but checkout uses ZAR?</strong>
                  <br />
                  The pricing is shown in approximate AUD for Australian customers, but PayFast charges in ZAR.
                </div>

                <div className="muted-text info-line">
                  <strong>Can I test the app before paying?</strong>
                  <br />
                  Yes. The Free plan is there so you can test the basic workflow first.
                </div>

                <div className="muted-text info-line">
                  <strong>Who needs Agency?</strong>
                  <br />
                  Businesses with multiple staff or shared team usage.
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <h2 className="section-title">Simple next step</h2>

              <p className="muted-text" style={{ marginBottom: 16, lineHeight: 1.8 }}>
                Start with Free if you want to test. Choose Pro if you run the app yourself.
                Choose Agency if your business needs multiple users under one system.
              </p>

              <div className="button-row">
                <a href="/dashboard" className="btn">
                  Go to Dashboard
                </a>

                <a href="/how-it-works" className="btn-outline">
                  How It Works
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          .pricing-hero-grid,
          .pricing-value-grid,
          .pricing-faq-grid {
            grid-template-columns: 1fr !important;
          }

          .pricing-plan-grid {
            grid-template-columns: 1fr !important;
          }

          .pricing-compare-row {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}