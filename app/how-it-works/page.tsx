import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <main className="page-shell">
      <div className="page-container" style={{ maxWidth: 900 }}>
        <header className="topbar">
          <div className="brand-block">
            <h1>How Review Rocket Works</h1>
            <p className="brand-subtitle">
              A simple workflow for service businesses that want more reviews and better records.
            </p>
          </div>

          <div className="nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/dashboard" className="nav-link">Dashboard</Link>
            <Link href="/pricing" className="nav-link">Pricing</Link>
          </div>
        </header>

        <div className="simple-stack">
          <div className="card">
            <h2 className="section-title">1. Save your settings</h2>
            <p className="muted-text">
              Add your business name and Google review link once in the Settings page.
            </p>
          </div>

          <div className="card">
            <h2 className="section-title">2. Enter the job details</h2>
            <p className="muted-text">
              Add customer details, date and time, notes, and repair cost on the dashboard.
            </p>
          </div>

          <div className="card">
            <h2 className="section-title">3. Generate the review request</h2>
            <p className="muted-text">
              Review Rocket creates a message that can be copied or sent by WhatsApp or SMS.
            </p>
          </div>

          <div className="card">
            <h2 className="section-title">4. Auto-save the job</h2>
            <p className="muted-text">
              Every generated message also saves the job in the background so you can view it later in the calendar.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}