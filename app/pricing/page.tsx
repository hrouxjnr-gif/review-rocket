import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="page-shell">
      <div className="page-container">
        <header className="topbar">
          <div className="brand-block">
            <h1>Pricing</h1>
            <p className="brand-subtitle">
              Simple plans for service businesses and growing teams.
            </p>
          </div>

          <div className="nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/dashboard" className="nav-link">Dashboard</Link>
            <Link href="/how-it-works" className="nav-link">How It Works</Link>
          </div>
        </header>

        <section style={{ textAlign: "center", marginBottom: 34 }}>
          <span className="badge">Simple pricing for service businesses</span>
          <h2 className="big-title" style={{ maxWidth: 780, marginInline: "auto" }}>
            Choose the plan that fits your team.
          </h2>
          <p className="muted-text" style={{ maxWidth: 700, margin: "18px auto 0" }}>
            Start free, generate review request messages faster, and upgrade when your business needs more volume.
          </p>
        </section>

        <section className="price-grid">
          <div className="price-card">
            <h3 className="section-title">Free</h3>
            <p className="price-value">$0</p>
            <p className="muted-text">For solo testing</p>

            <ul className="price-list">
              <li>5 review requests per month</li>
              <li>Business settings</li>
              <li>Copy message</li>
              <li>WhatsApp and SMS buttons</li>
              <li>Saved history</li>
            </ul>

            <Link href="/dashboard" className="btn-outline" style={{ marginTop: 18 }}>
              Start Free
            </Link>
          </div>

          <div className="price-card featured">
            <div className="price-pill">Most Popular</div>
            <h3 className="section-title">Pro</h3>
            <p className="price-value">$29</p>
            <p className="muted-text">per month</p>

            <ul className="price-list">
              <li>Unlimited review requests</li>
              <li>Unlimited saved history</li>
              <li>Business settings</li>
              <li>Copy message</li>
              <li>WhatsApp and SMS buttons</li>
              <li>Priority updates</li>
            </ul>

            <button className="btn" style={{ marginTop: 18 }}>Upgrade to Pro</button>
          </div>

          <div className="price-card">
            <h3 className="section-title">Agency</h3>
            <p className="price-value">$79</p>
            <p className="muted-text">per month</p>

            <ul className="price-list">
              <li>Everything in Pro</li>
              <li>Multi-client use</li>
              <li>Higher internal usage</li>
              <li>Team-friendly workflow</li>
              <li>Future agency tools</li>
            </ul>

            <button className="btn-outline" style={{ marginTop: 18 }}>Upgrade to Agency</button>
          </div>
        </section>
      </div>
    </main>
  );
}