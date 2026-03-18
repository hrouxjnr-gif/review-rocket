import AppHeader from "@/components/AppHeader";

export default function HowItWorksPage() {
  return (
    <main className="page-shell">
      <div className="page-container" style={{ maxWidth: 980 }}>
        <AppHeader />

        <div className="simple-stack">
          <div className="card">
            <span className="badge">How It Works</span>
            <h2 className="section-title">How Roux Review Rocket Works</h2>
            <p className="muted-text">
              Roux Review Rocket helps service businesses turn completed jobs into
              professional review requests, save job history, track customers,
              and manage teams under one workspace.
            </p>
          </div>

          <div className="card">
            <h2 className="section-title">1. Save your business settings</h2>
            <p className="muted-text">
              Go to the Settings page and save your business name, Google review
              link, and currency. This helps the app automatically build cleaner,
              more professional review requests for your business.
            </p>
          </div>

          <div className="card">
            <h2 className="section-title">2. Enter the job details</h2>
            <p className="muted-text">
              On the Dashboard, your staff can enter the customer name, phone
              number, address, date and time, repair cost, and rough job notes.
            </p>
          </div>

          <div className="card">
            <h2 className="section-title">3. Generate the review request</h2>
            <p className="muted-text">
              The app rewrites rough notes into a cleaner, more professional
              review request message. Workers can choose different styles like
              Friendly, Professional, Short SMS, or Follow-up.
            </p>
          </div>

          <div className="card">
            <h2 className="section-title">4. Auto-save the job</h2>
            <p className="muted-text">
              When a message is generated, the job is also saved so it can be
              searched later in Calendar and Customers.
            </p>
          </div>

          <div className="card">
            <h2 className="section-title">5. Search and edit past jobs</h2>
            <p className="muted-text">
              Use Calendar to filter jobs by date and use Customers to search by
              name, phone, address, notes, or saved messages. You can also edit
              old jobs directly inside the cards.
            </p>
          </div>

          <div className="card">
            <h2 className="section-title">6. Reuse old messages</h2>
            <p className="muted-text">
              Old saved messages can be copied and reused later. They can also be
              sent again by WhatsApp or email directly from the Calendar and
              Customers pages.
            </p>
          </div>

          <div className="card">
            <span className="badge">Business Setup Help</span>
            <h2 className="section-title">How to set up your review link</h2>
            <div className="grid-list">
              <div className="list-card">
                <p><strong>Step 1</strong></p>
                <p className="list-gap">
                  Open your Google Business Profile.
                </p>
              </div>

              <div className="list-card">
                <p><strong>Step 2</strong></p>
                <p className="list-gap">
                  Find the review sharing option, usually something like “Ask for reviews”.
                </p>
              </div>

              <div className="list-card">
                <p><strong>Step 3</strong></p>
                <p className="list-gap">
                  Copy your Google review link.
                </p>
              </div>

              <div className="list-card">
                <p><strong>Step 4</strong></p>
                <p className="list-gap">
                  Paste that link into the Settings page inside Roux Review Rocket.
                </p>
              </div>

              <div className="list-card">
                <p><strong>Step 5</strong></p>
                <p className="list-gap">
                  Save your settings so future review requests can use the link automatically.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <span className="badge">Pricing Help</span>
            <h2 className="section-title">Which plan should you choose?</h2>
            <div className="grid-list">
              <div className="list-card">
                <p><strong>Free</strong></p>
                <p className="list-gap">
                  Best for testing the app and seeing how it works.
                </p>
              </div>

              <div className="list-card">
                <p><strong>Pro</strong></p>
                <p className="list-gap">
                  Best for one owner or one staff member using the app daily.
                </p>
              </div>

              <div className="list-card">
                <p><strong>Agency</strong></p>
                <p className="list-gap">
                  Best for businesses with multiple workers who need shared access
                  under one workspace.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <span className="badge">Team Access Help</span>
            <h2 className="section-title">How team access works</h2>
            <div className="grid-list">
              <div className="list-card">
                <p><strong>Step 1</strong></p>
                <p className="list-gap">
                  The business owner chooses the Agency plan.
                </p>
              </div>

              <div className="list-card">
                <p><strong>Step 2</strong></p>
                <p className="list-gap">
                  Each worker signs in with their own account.
                </p>
              </div>

              <div className="list-card">
                <p><strong>Step 3</strong></p>
                <p className="list-gap">
                  Each worker opens the Team page and copies their User ID.
                </p>
              </div>

              <div className="list-card">
                <p><strong>Step 4</strong></p>
                <p className="list-gap">
                  The worker sends that User ID to the owner.
                </p>
              </div>

              <div className="list-card">
                <p><strong>Step 5</strong></p>
                <p className="list-gap">
                  The owner pastes that User ID into the Team page and adds the worker.
                </p>
              </div>

              <div className="list-card">
                <p><strong>Step 6</strong></p>
                <p className="list-gap">
                  Once added, the team works inside the same shared workspace.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <span className="badge">Support</span>
            <h2 className="section-title">Need help?</h2>
            <p className="muted-text">
              If you need help setting up your review link, choosing a plan, or
              adding staff members, use the Contact page and email support.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}