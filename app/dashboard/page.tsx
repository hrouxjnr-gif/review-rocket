"use client";

import AppHeader from "@/components/AppHeader";
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
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [jobDatetime, setJobDatetime] = useState("");
  const [repairCost, setRepairCost] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [reviewLink, setReviewLink] = useState("");
  const [template, setTemplate] = useState("friendly");
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
      setHistory(data.reviews || []);
    } catch {
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
    } catch {}
  };

  const loadUsage = async () => {
    try {
      const res = await fetch("/api/usage");
      const data = await res.json();
      if (!data.error) setUsage(data);
    } catch {}
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

    if (!customerName.trim()) {
      setReview("Please enter the customer name.");
      return;
    }

    if (!jobDatetime) {
      setReview("Please enter the job date and time.");
      return;
    }

    if (usage && usage.remaining <= 0) {
      setReview(`You reached your free limit of ${usage.limit} messages this month.`);
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
          template,
        }),
      });

      const data = await res.json();

      if (data.review) {
        setReview(data.review);

        await fetch("/api/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_name: customerName,
            customer_phone: customerPhone,
            customer_address: customerAddress,
            job_datetime: new Date(jobDatetime).toISOString(),
            job_notes: text,
            repair_cost: repairCost,
            generated_message: data.review,
          }),
        });

        setText("");
        setCustomerName("");
        setCustomerPhone("");
        setCustomerAddress("");
        setJobDatetime("");
        setRepairCost("");

        loadHistory();
        loadUsage();
      } else {
        setReview(data.error || "Something went wrong");
      }
    } catch {
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
    } catch {
      setCopyMessage("Copy failed");
      setTimeout(() => setCopyMessage("Copy Message"), 2000);
    }
  };

  const whatsappUrl = review
    ? `https://wa.me/?text=${encodeURIComponent(review)}`
    : "#";

  const smsUrl = review ? `sms:?body=${encodeURIComponent(review)}` : "#";

  return (
    <main className="page-shell">
      <div className="page-container">
        <AppHeader />

        {usage && (
          <div className={`usage-box ${usage.remaining > 0 ? "good" : "bad"}`}>
            <p className="main">
              {usage.plan} Plan — {usage.used}/{usage.limit} messages used this month
            </p>
            <p style={{ marginTop: 8 }}>
              {usage.remaining > 0
                ? `${usage.remaining} ${usage.remaining === 1 ? "message" : "messages"} remaining this month.`
                : `You reached your free limit of ${usage.limit} messages this month.`}
            </p>
          </div>
        )}

        <section className="content-grid">
          <div className="card">
            <h2 className="section-title">Create Review Request</h2>

            <input
              type="text"
              placeholder="Customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <div style={{ height: 12 }} />

            <input
              type="text"
              placeholder="Customer phone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
            <div style={{ height: 12 }} />

            <input
              type="text"
              placeholder="Customer address"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
            />
            <div style={{ height: 12 }} />

            <input
              type="datetime-local"
              value={jobDatetime}
              onChange={(e) => setJobDatetime(e.target.value)}
            />
            <div style={{ height: 12 }} />

            <input
              type="number"
              step="0.01"
              placeholder="Repair cost"
              value={repairCost}
              onChange={(e) => setRepairCost(e.target.value)}
            />
            <div style={{ height: 12 }} />

            <input
              type="text"
              placeholder="Business name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
            <div style={{ height: 12 }} />

            <input
              type="text"
              placeholder="Google review link"
              value={reviewLink}
              onChange={(e) => setReviewLink(e.target.value)}
            />
            <div style={{ height: 12 }} />

            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              style={{
                width: "100%",
                padding: "13px 14px",
                borderRadius: 14,
                border: "1px solid #d7e1ec",
                background: "#ffffff",
                color: "#0f172a",
              }}
            >
              <option value="friendly">Friendly</option>
              <option value="professional">Professional</option>
              <option value="short-sms">Short SMS</option>
              <option value="follow-up">Follow-up Reminder</option>
            </select>
            <div style={{ height: 12 }} />

            <textarea
              rows={8}
              placeholder="Example: fixed leaking pipe and explained the problem clearly"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div className="button-row">
              <button
                onClick={handleGenerate}
                className="btn"
                disabled={loading || (usage ? usage.remaining <= 0 : false)}
              >
                {loading ? "Generating..." : "Generate + Auto Save"}
              </button>

              <button
                onClick={handleCopy}
                className="btn-outline"
                disabled={!review}
              >
                {copyMessage}
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-success"
                style={{
                  pointerEvents: review ? "auto" : "none",
                  opacity: review ? 1 : 0.65,
                }}
              >
                Send WhatsApp
              </a>

              <a
                href={smsUrl}
                className="btn-purple"
                style={{
                  pointerEvents: review ? "auto" : "none",
                  opacity: review ? 1 : 0.65,
                }}
              >
                Send SMS
              </a>
            </div>

            <div className="info-box">
              <h3>Latest Result</h3>
              <p>{review || "Your generated message will appear here."}</p>
            </div>
          </div>

          <div className="card">
            <h2 className="section-title">Recent Messages</h2>

            {historyLoading ? (
              <p className="muted-text">Loading history...</p>
            ) : history.length === 0 ? (
              <p className="muted-text">No saved messages yet.</p>
            ) : (
              <div className="grid-list">
                {history.map((item) => (
                  <div key={item.id} className="list-card">
                    <p>
                      <strong>Notes</strong>
                    </p>
                    <p className="list-gap">{item.input_text}</p>

                    <p className="list-gap">
                      <strong>Generated Message</strong>
                    </p>
                    <p
                      className="list-gap"
                      style={{ whiteSpace: "pre-wrap", color: "#1e3a8a" }}
                    >
                      {item.output_text}
                    </p>

                    <p
                      className="list-gap"
                      style={{ fontSize: 12, color: "#64748b" }}
                    >
                      Created: {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}