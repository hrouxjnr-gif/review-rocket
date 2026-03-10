"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

type ReviewItem = {
  id: number;
  input_text: string;
  output_text: string;
  created_at: string;
};

type UsageData = {
  plan: string;
  limit: number;
  used: number;
  remaining: number;
};

export default function DashboardPage() {
  const [customerName, setCustomerName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [reviewLink, setReviewLink] = useState("");
  const [text, setText] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ReviewItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [copyMessage, setCopyMessage] = useState("Copy Message");
  const [usage, setUsage] = useState<UsageData | null>(null);

  const loadHistory = async () => {
    setHistoryLoading(true);

    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();

      if (data.reviews) {
        setHistory(data.reviews);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error("Failed to load history:", error);
      setHistory([]);
    }

    setHistoryLoading(false);
  };

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();

      if (data.settings) {
        setBusinessName(data.settings.business_name || "");
        setReviewLink(data.settings.review_link || "");
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const loadUsage = async () => {
    try {
      const res = await fetch("/api/usage");
      const data = await res.json();

      if (!data.error) {
        setUsage(data);
      }
    } catch (error) {
      console.error("Failed to load usage:", error);
    }
  };

  useEffect(() => {
    loadHistory();
    loadSettings();
    loadUsage();
  }, []);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setReview("Please enter some job notes first.");
      return;
    }

    if (usage && usage.remaining <= 0) {
      setReview("You reached your free limit. Upgrade to continue.");
      return;
    }

    setLoading(true);
    setReview("");
    setCopyMessage("Copy Message");

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          customerName,
          businessName,
          reviewLink,
        }),
      });

      const data = await res.json();

      if (data.review) {
        setReview(data.review);
        setText("");
        loadHistory();
        loadUsage();
      } else {
        setReview(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Generate failed:", error);
      setReview("Something went wrong");
    }

    setLoading(false);
  };

  const handleCopy = async () => {
    if (!review) return;

    try {
      await navigator.clipboard.writeText(review);
      setCopyMessage("Copied!");
      setTimeout(() => setCopyMessage("Copy Message"), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
      setCopyMessage("Copy failed");
      setTimeout(() => setCopyMessage("Copy Message"), 2000);
    }
  };

  const whatsappUrl = review
    ? `https://wa.me/?text=${encodeURIComponent(review)}`
    : "#";

  const smsUrl = review ? `sms:?body=${encodeURIComponent(review)}` : "#";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "32px 24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 32, color: "#0f172a" }}>
              Dashboard
            </h1>
            <p style={{ marginTop: 8, color: "#64748b" }}>
              Turn job notes into a customer review request message.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link
              href="/"
              style={{ textDecoration: "none", color: "#2563eb", fontWeight: 700 }}
            >
              Home
            </Link>
            <Link
              href="/settings"
              style={{ textDecoration: "none", color: "#2563eb", fontWeight: 700 }}
            >
              Settings
            </Link>
            <Link
              href="/how-it-works"
              style={{ textDecoration: "none", color: "#2563eb", fontWeight: 700 }}
            >
              How It Works
            </Link>
            <UserButton />
          </div>
        </header>

        {usage && (
          <div
            style={{
              background: usage.remaining > 0 ? "#eff6ff" : "#fef2f2",
              border: `1px solid ${usage.remaining > 0 ? "#bfdbfe" : "#fecaca"}`,
              borderRadius: 14,
              padding: 16,
              marginBottom: 24,
            }}
          >
            <p
              style={{
                margin: 0,
                color: usage.remaining > 0 ? "#1e3a8a" : "#991b1b",
                fontWeight: 700,
              }}
            >
              {usage.plan} Plan — {usage.used}/{usage.limit} messages used this month
            </p>
            <p
              style={{
                marginTop: 8,
                marginBottom: 0,
                color: usage.remaining > 0 ? "#1e40af" : "#b91c1c",
              }}
            >
              {usage.remaining > 0
                ? `${usage.remaining} messages remaining this month.`
                : "You reached your free limit. Upgrade to continue."}
            </p>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          <section
            style={{
              background: "white",
              borderRadius: 18,
              padding: 24,
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            }}
          >
            <h2 style={{ marginTop: 0, color: "#0f172a" }}>
              Generate Review Request
            </h2>

            <input
              type="text"
              placeholder="Customer name (John)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{
                width: "100%",
                marginTop: 16,
                padding: 12,
                borderRadius: 10,
                border: "1px solid #cbd5e1",
                fontSize: 15,
              }}
            />

            <input
              type="text"
              placeholder="Business name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              style={{
                width: "100%",
                marginTop: 12,
                padding: 12,
                borderRadius: 10,
                border: "1px solid #cbd5e1",
                fontSize: 15,
              }}
            />

            <input
              type="text"
              placeholder="Google review link"
              value={reviewLink}
              onChange={(e) => setReviewLink(e.target.value)}
              style={{
                width: "100%",
                marginTop: 12,
                padding: 12,
                borderRadius: 10,
                border: "1px solid #cbd5e1",
                fontSize: 15,
              }}
            />

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              style={{
                width: "100%",
                marginTop: 12,
                padding: 14,
                borderRadius: 12,
                border: "1px solid #cbd5e1",
                outline: "none",
                resize: "vertical",
                fontSize: 15,
              }}
              placeholder="Example: fixed leaking pipe and explained the problem clearly"
            />

            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 16,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={handleGenerate}
                style={{
                  padding: "14px 20px",
                  cursor: "pointer",
                  borderRadius: 10,
                  border: "none",
                  background: "#2563eb",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: 16,
                }}
                disabled={loading || (usage ? usage.remaining <= 0 : false)}
              >
                {loading ? "Generating..." : "Generate Message"}
              </button>

              <button
                onClick={handleCopy}
                style={{
                  padding: "14px 20px",
                  cursor: "pointer",
                  borderRadius: 10,
                  border: "1px solid #cbd5e1",
                  background: "white",
                  color: "#0f172a",
                  fontWeight: 700,
                  fontSize: 16,
                }}
                disabled={!review}
              >
                {copyMessage}
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "14px 20px",
                  borderRadius: 10,
                  border: "1px solid #16a34a",
                  background: review ? "#16a34a" : "#dcfce7",
                  color: review ? "white" : "#166534",
                  fontWeight: 700,
                  fontSize: 16,
                  textDecoration: "none",
                  pointerEvents: review ? "auto" : "none",
                }}
              >
                Send WhatsApp
              </a>

              <a
                href={smsUrl}
                style={{
                  padding: "14px 20px",
                  borderRadius: 10,
                  border: "1px solid #7c3aed",
                  background: review ? "#7c3aed" : "#ede9fe",
                  color: review ? "white" : "#5b21b6",
                  fontWeight: 700,
                  fontSize: 16,
                  textDecoration: "none",
                  pointerEvents: review ? "auto" : "none",
                }}
              >
                Send SMS
              </a>
            </div>

            <div
              style={{
                marginTop: 24,
                padding: 20,
                borderRadius: 14,
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  color: "#1e3a8a",
                  fontSize: 18,
                  marginBottom: 12,
                }}
              >
                Latest Result
              </h3>

              <p
                style={{
                  marginBottom: 0,
                  color: "#111827",
                  fontSize: 18,
                  lineHeight: 1.7,
                  fontWeight: 600,
                  whiteSpace: "pre-wrap",
                }}
              >
                {review || "Your generated message will appear here."}
              </p>
            </div>
          </section>

          <section
            style={{
              background: "white",
              borderRadius: 18,
              padding: 24,
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            }}
          >
            <h2 style={{ marginTop: 0, color: "#0f172a" }}>Saved Messages</h2>

            {historyLoading ? (
              <p style={{ color: "#64748b" }}>Loading history...</p>
            ) : history.length === 0 ? (
              <p style={{ color: "#64748b" }}>No saved messages yet.</p>
            ) : (
              <div style={{ display: "grid", gap: 14, marginTop: 16 }}>
                {history.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 14,
                      padding: 16,
                      background: "#f8fafc",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        marginBottom: 8,
                        color: "#0f172a",
                      }}
                    >
                      Job Notes
                    </p>
                    <p style={{ margin: 0, color: "#334155" }}>
                      {item.input_text}
                    </p>

                    <p
                      style={{
                        marginTop: 14,
                        marginBottom: 8,
                        fontWeight: 700,
                        color: "#0f172a",
                      }}
                    >
                      Generated Message
                    </p>
                    <p
                      style={{
                        margin: 0,
                        color: "#1e3a8a",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {item.output_text}
                    </p>

                    <p
                      style={{
                        marginTop: 14,
                        fontSize: 12,
                        color: "#64748b",
                        marginBottom: 0,
                      }}
                    >
                      Created: {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}