"use client";

import AppHeader from "@/components/AppHeader";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";

type SubscriptionData = {
  plan: string;
  max_users: number;
  monthly_limit: number;
};

function PricingPageSkeleton() {
  return (
    <main className="page-shell">
      <div className="page-container">
        <AppHeader />

        <div style={{ marginTop: 40 }}>
          <section className="card" style={{ marginBottom: 0 }}>
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
              Loading pricing...
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
              Please wait while the pricing page loads.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

function PricingPageContent() {
  const { user } = useUser();
  const { isLoaded, isSignedIn } = useAuth();
  const searchParams = useSearchParams();

  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [message, setMessage] = useState("");
  const [loadingPlan, setLoadingPlan] = useState<"free" | "pro" | "agency" | "">("");
  const [autoStarted, setAutoStarted] = useState(false);

  const currentPlan = (subscription?.plan || "free").toLowerCase();
  const showTestSwitches =
    process.env.NEXT_PUBLIC_ALLOW_TEST_PLAN_SWITCHES === "true";

  const pendingBuyPlan = useMemo(() => {
    const raw = String(searchParams?.get("buy") || "").toLowerCase();
    if (raw === "pro" || raw === "agency") return raw as "pro" | "agency";
    return null;
  }, [searchParams]);

  const loadSubscription = async () => {
    if (!isSignedIn) {
      setSubscription({
        plan: "free",
        max_users: 1,
        monthly_limit: 5,
      });
      return;
    }

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
    if (!isLoaded) return;
    loadSubscription();
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) return;
    if (!pendingBuyPlan) return;
    if (autoStarted) return;

    setAutoStarted(true);
    setMessage("");
    setLoadingPlan(pendingBuyPlan);

    window.location.href = `/api/payfast?plan=${pendingBuyPlan}`;
  }, [isLoaded, isSignedIn, pendingBuyPlan, autoStarted]);

  const changePlan = async (plan: "free" | "pro" | "agency") => {
    if (!showTestSwitches) {
      if (plan === "free") {
        window.location.href = "/dashboard";
        return;
      }

      setMessage(
        "Paid plans activate after a successful PayFast payment. Use the Pay with PayFast button."
      );
      return;
    }

    if (!isSignedIn) {
      setMessage("Sign in first if you want to test-switch plans.");
      return;
    }

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

  const startPayment = (plan: "pro" | "agency") => {
    if (!isSignedIn) {
      setMessage("Sign in first if you want to buy Pro or Agency.");
      return;
    }

    setMessage("");
    setLoadingPlan(plan);

    window.location.href = `/api/payfast?plan=${plan}`;
  };

  return (
    <main className="page-shell">
      <div className="page-container">
        <AppHeader />

        <div style={{ marginTop: 40, display: "grid", gap: 22 }}>
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
                  Use the free demo without signing in. Sign in only when you want
                  to save your data or pay for Pro or Agency.
                </p>

                <div className="button-row">
                  <a href="#plans" className="btn">
                    View Plans
                  </a>

                  <a href="/dashboard" className="btn-outline">
                    Open Dashboard
                  </a>
                </div>

                {!isSignedIn && (
                  <div className="button-row" style={{ marginTop: 14 }}>
                    <SignInButton mode="modal" fallbackRedirectUrl="/pricing">
                      <button className="btn-outline">Sign in to upgrade</button>
                    </SignInButton>
                  </div>
                )}

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
                <p style={{ fontWeight: 800, fontSize: 20 }}>Current plan</p>

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
                    • Free demo works without login
                  </div>
                  <div className="muted-text info-line">
                    • Sign in is required for paid upgrades
                  </div>
                  <div className="muted-text info-line">
                    • Pro is best for one operator
                  </div>
                  <div className="muted-text info-line">
                    • Agency is best for teams
                  </div>
                  <div className="muted-text info-line">
                    • PayFast checkout is charged in ZAR
                  </div>
                </div>
              </div>
            </div>
          </section>

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
                <li>Basic workflow demo</li>
                <li>Try before paying</li>
                <li>No login needed for demo</li>
              </ul>

              <div className="button-row" style={{ marginTop: 18 }}>
                <button
                  className="btn-outline"
                  onClick={() => (window.location.href = "/dashboard")}
                  disabled={loadingPlan !== ""}
                >
                  {loadingPlan === "free" ? "Loading..." : "Use Free Demo"}
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
                {isSignedIn ? (
                  <button
                    className="btn"
                    onClick={() => startPayment("pro")}
                    disabled={loadingPlan !== ""}
                  >
                    {loadingPlan === "pro" ? "Loading..." : "Pay with PayFast"}
                  </button>
                ) : (
                  <SignInButton
                    mode="modal"
                    forceRedirectUrl="/pricing?buy=pro"
                    signUpForceRedirectUrl="/pricing?buy=pro"
                    fallbackRedirectUrl="/pricing"
                    signUpFallbackRedirectUrl="/pricing"
                  >
                    <button className="btn" disabled={loadingPlan !== ""}>
                      Sign in to buy
                    </button>
                  </SignInButton>
                )}

                {showTestSwitches && (
                  <button
                    className="btn-outline"
                    onClick={() => changePlan("pro")}
                    disabled={loadingPlan !== ""}
                  >
                    Test Switch Pro
                  </button>
                )}
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
                {isSignedIn ? (
                  <button
                    className="btn"
                    onClick={() => startPayment("agency")}
                    disabled={loadingPlan !== ""}
                  >
                    {loadingPlan === "agency" ? "Loading..." : "Pay with PayFast"}
                  </button>
                ) : (
                  <SignInButton
                    mode="modal"
                    forceRedirectUrl="/pricing?buy=agency"
                    signUpForceRedirectUrl="/pricing?buy=agency"
                    fallbackRedirectUrl="/pricing"
                    signUpFallbackRedirectUrl="/pricing"
                  >
                    <button className="btn" disabled={loadingPlan !== ""}>
                      Sign in to buy
                    </button>
                  </SignInButton>
                )}

                {showTestSwitches && (
                  <button
                    className="btn-outline"
                    onClick={() => changePlan("agency")}
                    disabled={loadingPlan !== ""}
                  >
                    Test Switch Agency
                  </button>
                )}
              </div>
            </div>
          </section>

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

          <section
            className="card"
            style={{ marginBottom: 0, padding: 0, overflow: "hidden" }}
          >
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
                ["Calendar", "Demo only", "Yes", "Yes"],
                ["Customers", "Demo only", "Yes", "Yes"],
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
                  Pricing is shown in approximate AUD for Australian customers, but PayFast charges in ZAR.
                </div>

                <div className="muted-text info-line">
                  <strong>Can I test the app before paying?</strong>
                  <br />
                  Yes. The Free demo is there so you can test the workflow first without signing in.
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

              <p
                className="muted-text"
                style={{ marginBottom: 16, lineHeight: 1.8 }}
              >
                Test the workflow free on the dashboard first. Sign in when you want to
                save data or pay for Pro or Agency.
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

export default function PricingPage() {
  return (
    <Suspense fallback={<PricingPageSkeleton />}>
      <PricingPageContent />
    </Suspense>
  );
}