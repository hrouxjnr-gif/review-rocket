import AppHeader from "@/components/AppHeader";

export default function HowItWorksPage() {
  return (
    <main className="page-shell">
      <div className="page-container" style={{ maxWidth: 900 }}>
        <AppHeader showUserButton={false} />

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