import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export default function HomePage() {
  return (
    <main className="page-shell">
      <div className="page-container">
        <AppHeader showUserButton={true} />

        <section className="hero-grid">
          <div>
            <span className="badge">
              Built for plumbers, electricians, HVAC and more
            </span>

            <h2 className="big-title">
              Get More Reviews. Track Every Job. Grow Your Reputation.
            </h2>

            <p className="muted-text">
              Roux Review Rocket helps service businesses turn completed jobs
              into professional review requests, track customer history, and
              organize work in one place.
            </p>

            <div className="button-row">
              <Link href="/dashboard" className="btn">
                Dashboard
              </Link>

              <Link href="/calendar" className="btn-outline">
                View Calendar
              </Link>

              <Link href="/customers" className="btn-outline">
                Open Customers
              </Link>
            </div>
          </div>

          <div className="card hero-panel">
            <h3 className="section-title">What it helps with</h3>

            <div className="grid-list">
              <div className="list-card">
                <p>
                  <strong>Review requests</strong>
                </p>
                <p className="list-gap">
                  Create professional review messages in seconds.
                </p>
              </div>

              <div className="list-card">
                <p>
                  <strong>Job records</strong>
                </p>
                <p className="list-gap">
                  Auto-save each job with date, cost, and client details.
                </p>
              </div>

              <div className="list-card">
                <p>
                  <strong>Customer tracking</strong>
                </p>
                <p className="list-gap">
                  Find repeat customers and their full work history fast.
                </p>
              </div>

              <div className="list-card">
                <p>
                  <strong>Exports</strong>
                </p>
                <p className="list-gap">
                  Download your job history as CSV whenever you need it.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}