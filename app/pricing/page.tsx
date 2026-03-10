import Link from "next/link";

export default function PricingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "40px 24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 50,
          }}
        >
          <h1 style={{ margin: 0, fontSize: 32, color: "#0f172a" }}>
            Pricing
          </h1>

          <div style={{ display: "flex", gap: 16 }}>
            <Link
              href="/"
              style={{
                textDecoration: "none",
                color: "#2563eb",
                fontWeight: 700,
              }}
            >
              Home
            </Link>

            <Link
              href="/dashboard"
              style={{
                textDecoration: "none",
                color: "#2563eb",
                fontWeight: 700,
              }}
            >
              Dashboard
            </Link>

            <Link
              href="/how-it-works"
              style={{
                textDecoration: "none",
                color: "#2563eb",
                fontWeight: 700,
              }}
            >
              How It Works
            </Link>
          </div>
        </header>

        <section style={{ textAlign: "center", marginBottom: 50 }}>
          <p
            style={{
              color: "#2563eb",
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            Simple pricing for service businesses
          </p>

          <h2
            style={{
              fontSize: 44,
              margin: 0,
              color: "#0f172a",
            }}
          >
            Choose the plan that fits your team.
          </h2>

          <p
            style={{
              marginTop: 18,
              fontSize: 18,
              color: "#64748b",
              maxWidth: 700,
              marginInline: "auto",
              lineHeight: 1.6,
            }}
          >
            Start free, generate review request messages faster, and upgrade when
            your business needs more volume.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 18,
              padding: 28,
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#0f172a", fontSize: 24 }}>
              Free
            </h3>

            <p
              style={{
                fontSize: 40,
                fontWeight: 700,
                color: "#0f172a",
                margin: "12px 0",
              }}
            >
              $0
            </p>

            <p style={{ color: "#64748b", marginTop: 0 }}>For solo testing</p>

            <ul style={{ paddingLeft: 20, color: "#334155", lineHeight: 1.9 }}>
              <li>5 review requests per month</li>
              <li>Business settings</li>
              <li>Copy message</li>
              <li>WhatsApp and SMS buttons</li>
              <li>Saved history</li>
            </ul>

            <Link
              href="/dashboard"
              style={{
                display: "inline-block",
                marginTop: 20,
                background: "#e2e8f0",
                color: "#0f172a",
                padding: "12px 18px",
                borderRadius: 10,
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Start Free
            </Link>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: 18,
              padding: 28,
              border: "2px solid #2563eb",
              boxShadow: "0 12px 30px rgba(37,99,235,0.15)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -12,
                right: 20,
                background: "#2563eb",
                color: "white",
                padding: "6px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Most Popular
            </div>

            <h3 style={{ marginTop: 0, color: "#0f172a", fontSize: 24 }}>
              Pro
            </h3>

            <p
              style={{
                fontSize: 40,
                fontWeight: 700,
                color: "#0f172a",
                margin: "12px 0",
              }}
            >
              $29
            </p>

            <p style={{ color: "#64748b", marginTop: 0 }}>per month</p>

            <ul style={{ paddingLeft: 20, color: "#334155", lineHeight: 1.9 }}>
              <li>Unlimited review requests</li>
              <li>Unlimited saved history</li>
              <li>Business settings</li>
              <li>Copy message</li>
              <li>WhatsApp and SMS buttons</li>
              <li>Priority updates</li>
            </ul>

            <button
              style={{
                marginTop: 20,
                background: "#2563eb",
                color: "white",
                padding: "12px 18px",
                borderRadius: 10,
                border: "none",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Upgrade to Pro
            </button>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: 18,
              padding: 28,
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#0f172a", fontSize: 24 }}>
              Agency
            </h3>

            <p
              style={{
                fontSize: 40,
                fontWeight: 700,
                color: "#0f172a",
                margin: "12px 0",
              }}
            >
              $79
            </p>

            <p style={{ color: "#64748b", marginTop: 0 }}>per month</p>

            <ul style={{ paddingLeft: 20, color: "#334155", lineHeight: 1.9 }}>
              <li>Everything in Pro</li>
              <li>Multi-client use</li>
              <li>Higher internal usage</li>
              <li>Team-friendly workflow</li>
              <li>Future agency tools</li>
            </ul>

            <button
              style={{
                marginTop: 20,
                background: "#0f172a",
                color: "white",
                padding: "12px 18px",
                borderRadius: 10,
                border: "none",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Upgrade to Agency
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}