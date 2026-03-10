import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "40px 24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 36, color: "#0f172a", marginBottom: 12 }}>
            How Review Rocket Works
          </h1>
          <p style={{ color: "#475569", fontSize: 18, lineHeight: 1.7 }}>
            Review Rocket helps service businesses turn job notes into customer-ready
            review request messages they can copy, send, and save.
          </p>
        </header>

        <div style={{ display: "grid", gap: 18 }}>
          <div
            style={{
              background: "white",
              padding: 20,
              borderRadius: 14,
              border: "1px solid #e2e8f0",
            }}
          >
            <h2>1. Save your business settings</h2>
            <p>
              Add your business name and Google review link once in Settings.
            </p>
          </div>

          <div
            style={{
              background: "white",
              padding: 20,
              borderRadius: 14,
              border: "1px solid #e2e8f0",
            }}
          >
            <h2>2. Enter customer details and job notes</h2>
            <p>
              After a job, enter the customer name and a few quick notes about the work.
            </p>
          </div>

          <div
            style={{
              background: "white",
              padding: 20,
              borderRadius: 14,
              border: "1px solid #e2e8f0",
            }}
          >
            <h2>3. Generate the review request</h2>
            <p>
              Review Rocket creates a ready-to-send message with your review link.
            </p>
          </div>

          <div
            style={{
              background: "white",
              padding: 20,
              borderRadius: 14,
              border: "1px solid #e2e8f0",
            }}
          >
            <h2>4. Copy it or send it fast</h2>
            <p>
              Use Copy, WhatsApp, or SMS to send the request to the customer right away.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 30, display: "flex", gap: 16 }}>
          <Link
            href="/"
            style={{
              color: "#2563eb",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Home
          </Link>

          <Link
            href="/dashboard"
            style={{
              color: "#2563eb",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}