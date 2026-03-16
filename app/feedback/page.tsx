"use client";

import AppHeader from "@/components/AppHeader";
import { useState } from "react";

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      setStatus("Please enter a subject and message.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      });

      const data = await res.json();

      if (data.feedback) {
        setStatus("Feedback sent successfully. Thank you.");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setStatus(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <main className="page-shell">
      <div className="page-container">
        <AppHeader />

        <div className="card" style={{ maxWidth: 820 }}>
          <h2 className="section-title">Feedback</h2>
          <p className="muted-text">
            Found a bug or have an idea to improve Roux Review Rocket? Send it here.
          </p>

          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div style={{ height: 12 }} />

          <input
            type="email"
            placeholder="Your email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div style={{ height: 12 }} />

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <div style={{ height: 12 }} />

          <textarea
            rows={8}
            placeholder="Tell me what should be improved, fixed, or added..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="button-row">
            <button className="btn" onClick={handleSubmit} disabled={loading}>
              {loading ? "Sending..." : "Send Feedback"}
            </button>
          </div>

          {status && (
            <p style={{ marginTop: 16, fontWeight: 700 }}>{status}</p>
          )}
        </div>
      </div>
    </main>
  );
}