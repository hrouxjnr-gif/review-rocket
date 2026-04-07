"use client";

import AppHeader from "@/components/AppHeader";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useAuth();

  const [stats, setStats] = useState<any>({});
  const [usage, setUsage] = useState<any>({});

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [jobDateTime, setJobDateTime] = useState("");
  const [jobNotes, setJobNotes] = useState("");
  const [repairCost, setRepairCost] = useState("");

  const [generatedMessage, setGeneratedMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");
  const [demoUsed, setDemoUsed] = useState(0);

  const totalJobs = isSignedIn ? Number(stats.totalJobs ?? 0) : 0;
  const jobsToday = isSignedIn ? Number(stats.jobsToday ?? 0) : 0;
  const currentPlan = isSignedIn
    ? String(usage.plan ?? stats.plan ?? "free")
    : "free demo";
  const messagesUsed = isSignedIn ? Number(usage.used ?? 0) : demoUsed;
  const monthlyLimit = isSignedIn ? Number(usage.limit ?? 5) : 5;

  const usagePercent = useMemo(() => {
    if (!monthlyLimit) return 0;
    return Math.min((messagesUsed / monthlyLimit) * 100, 100);
  }, [messagesUsed, monthlyLimit]);

  const load = async () => {
    if (!isSignedIn) return;

    const [s, u] = await Promise.all([fetch("/api/stats"), fetch("/api/usage")]);

    setStats(await s.json());
    setUsage(await u.json());
  };

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      load();
    }
  }, [isLoaded, isSignedIn]);

  const generate = async () => {
    setMessage("");
    setCopied(false);

    if (!jobNotes.trim()) {
      setMessage("Please add some job notes first.");
      return;
    }

    if (!isSignedIn && demoUsed >= 5) {
      setMessage("Demo limit reached. Sign in to keep using the free plan and save your work.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName,
          phone: customerPhone,
          address: customerAddress,
          job_datetime: jobDateTime,
          notes: jobNotes,
          cost: repairCost,
        }),
      });

      const data = await res.json();

      if (data.output_text) {
        setGeneratedMessage(data.output_text);

        if (data.demo_mode) {
          setDemoUsed((prev: number) => Math.min(prev + 1, 5));
          setMessage("Demo message generated. Sign in if you want to save jobs and customers.");
        } else {
          await load();
          setMessage("Message generated and saved.");
        }
      } else {
        setMessage(data.error || "Could not generate the message.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
    }

    setSubmitting(false);
  };

  const copy = async () => {
    if (!generatedMessage) return;

    await navigator.clipboard.writeText(generatedMessage);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const whatsapp = () => {
    if (!generatedMessage) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(generatedMessage)}`);
  };

  const sms = () => {
    if (!generatedMessage) return;
    window.location.href = `sms:?&body=${encodeURIComponent(generatedMessage)}`;
  };

  const email = () => {
    if (!generatedMessage) return;
    window.location.href = `mailto:?body=${encodeURIComponent(generatedMessage)}`;
  };

  return (
    <main className="page-shell">
      <AppHeader />

      <div className="page-container" style={{ marginTop: 52 }}>
        <div style={{ display: "grid", gap: 28 }}>
          {!isSignedIn && (
            <section className="card" style={{ marginBottom: 0, padding: 28 }}>
              <span className="badge">Free demo mode</span>

              <h2 style={{ marginTop: 14, marginBottom: 10 }}>
                Try the workflow without signing in.
              </h2>

              <p className="muted-text" style={{ lineHeight: 1.8, maxWidth: 860 }}>
                You can generate review messages here without an account. In demo mode,
                jobs and customers are not saved. Sign in when you want to save records,
                use customers and calendar, or buy Pro or Agency.
              </p>

              <div className="button-row" style={{ marginTop: 18 }}>
                <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                  <button className="btn">Sign In to Save Work</button>
                </SignInButton>

                <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                  <button className="btn-outline">Create Free Account</button>
                </SignUpButton>

                <Link href="/pricing" className="btn-outline">
                  View Pricing
                </Link>
              </div>
            </section>
          )}

          <section
            className="dashboard-stats-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 20,
              marginTop: 8,
            }}
          >
            <div className="card" style={{ marginBottom: 0 }}>
              <h3 style={{ marginBottom: 12 }}>Total Jobs</h3>
              <h2>{totalJobs}</h2>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <h3 style={{ marginBottom: 12 }}>Today</h3>
              <h2>{jobsToday}</h2>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <h3 style={{ marginBottom: 12 }}>Plan</h3>
              <h2>{currentPlan}</h2>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <h3 style={{ marginBottom: 12 }}>Usage</h3>
              <h2>
                {messagesUsed}/{monthlyLimit}
              </h2>
            </div>
          </section>

          <section className="card" style={{ marginBottom: 0, padding: 28 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 18,
                flexWrap: "wrap",
                marginBottom: 18,
              }}
            >
              <div>
                <h3 style={{ marginBottom: 10 }}>Monthly Usage</h3>
                <p className="muted-text">
                  {Math.max(monthlyLimit - messagesUsed, 0)} messages left
                </p>
              </div>

              <Link href="/pricing" className="btn-outline">
                Change Plan
              </Link>
            </div>

            <div
              style={{
                height: 12,
                background: "#222",
                borderRadius: 999,
                overflow: "hidden",
                marginTop: 10,
              }}
            >
              <div
                style={{
                  width: `${usagePercent}%`,
                  height: "100%",
                  background: "cyan",
                  borderRadius: 999,
                }}
              />
            </div>
          </section>

          <section
            className="dashboard-main-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 28,
              alignItems: "stretch",
              marginTop: 4,
            }}
          >
            <div className="card" style={{ marginBottom: 0, padding: 32 }}>
              <h2 style={{ marginBottom: 22 }}>Create Review</h2>

              <div style={{ display: "grid", gap: 14 }}>
                <input
                  placeholder="Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />

                <input
                  placeholder="Phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />

                <input
                  placeholder="Address"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                />

                <input
                  type="datetime-local"
                  value={jobDateTime}
                  onChange={(e) => setJobDateTime(e.target.value)}
                />

                <input
                  placeholder="Cost"
                  value={repairCost}
                  onChange={(e) => setRepairCost(e.target.value)}
                />

                <textarea
                  rows={5}
                  placeholder="Notes"
                  value={jobNotes}
                  onChange={(e) => setJobNotes(e.target.value)}
                />

                <div style={{ paddingTop: 6 }}>
                  <button className="btn" onClick={generate}>
                    {submitting ? "Generating..." : "Generate"}
                  </button>
                </div>

                {message && (
                  <p style={{ marginTop: 8, fontWeight: 700 }}>{message}</p>
                )}
              </div>
            </div>

            <div className="card" style={{ marginBottom: 0, padding: 32 }}>
              <h2 style={{ marginBottom: 22 }}>Generated Message</h2>

              {generatedMessage ? (
                <>
                  <div
                    className="list-card"
                    style={{
                      marginBottom: 20,
                      lineHeight: 1.8,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {generatedMessage}
                  </div>

                  <div className="button-row" style={{ gap: 12 }}>
                    <button className="btn" onClick={copy}>
                      {copied ? "Copied" : "Copy"}
                    </button>

                    <button className="btn-outline" onClick={whatsapp}>
                      WhatsApp
                    </button>

                    <button className="btn-outline" onClick={sms}>
                      SMS
                    </button>

                    <button className="btn-outline" onClick={email}>
                      Email
                    </button>
                  </div>
                </>
              ) : (
                <div
                  style={{
                    minHeight: 280,
                    display: "flex",
                    alignItems: "flex-start",
                    paddingTop: 4,
                  }}
                >
                  <p className="muted-text">No message yet</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        .dashboard-stats-grid :global(.card),
        .dashboard-main-grid :global(.card) {
          position: relative;
          z-index: 1;
        }

        @media (max-width: 980px) {
          .dashboard-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }

          .dashboard-main-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 640px) {
          .dashboard-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}