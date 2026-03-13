"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

type JobItem = {
  id: number;
  customer_name: string;
  customer_phone: string | null;
  customer_address: string | null;
  job_datetime: string;
  job_notes: string;
  repair_cost: number | null;
  generated_message: string | null;
  created_at: string;
};

type CustomerItem = {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_jobs: number;
  total_spent: number;
  latest_job_datetime: string;
  jobs: JobItem[];
};

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCustomers = async (search = "") => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/customers?${params.toString()}`);
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch {
      setCustomers([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <main className="page-shell">
      <div className="page-container">
        <header className="topbar">
          <div className="brand-block">
            <h1>Customers</h1>
            <p className="brand-subtitle">
              Search old clients, view repeat jobs, and track customer history.
            </p>
          </div>

          <div className="nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/dashboard" className="nav-link">Dashboard</Link>
            <Link href="/calendar" className="nav-link">Calendar</Link>
            <Link href="/settings" className="nav-link">Settings</Link>
            <UserButton />
          </div>
        </header>

        <div className="card" style={{ marginBottom: 24 }}>
          <h2 className="section-title">Find Customers</h2>

          <input
            type="text"
            placeholder="Search by name, phone, address, or notes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="button-row">
            <button className="btn" onClick={() => loadCustomers(searchTerm)}>
              Search
            </button>
            <button
              className="btn-outline"
              onClick={() => {
                setSearchTerm("");
                loadCustomers("");
              }}
            >
              Reset
            </button>
            <a className="btn-outline" href="/api/export/jobs">
              Export CSV
            </a>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">Customer Database</h2>

          {loading ? (
            <p className="muted-text">Loading customers...</p>
          ) : customers.length === 0 ? (
            <p className="muted-text">No customers found.</p>
          ) : (
            <div className="grid-list">
              {customers.map((customer, index) => (
                <div key={`${customer.customer_name}-${index}`} className="list-card">
                  <p><strong>{customer.customer_name}</strong></p>

                  {customer.customer_phone && (
                    <p className="list-gap">
                      <strong>Phone:</strong> {customer.customer_phone}
                    </p>
                  )}

                  {customer.customer_address && (
                    <p className="list-gap">
                      <strong>Address:</strong> {customer.customer_address}
                    </p>
                  )}

                  <p className="list-gap">
                    <strong>Total jobs:</strong> {customer.total_jobs}
                  </p>

                  <p className="list-gap">
                    <strong>Total spent:</strong> R {customer.total_spent.toFixed(2)}
                  </p>

                  <p className="list-gap">
                    <strong>Latest job:</strong>{" "}
                    {new Date(customer.latest_job_datetime).toLocaleString()}
                  </p>

                  <div className="grid-list" style={{ marginTop: 14 }}>
                    {customer.jobs.map((job) => (
                      <div
                        key={job.id}
                        style={{
                          border: "1px solid #e2e8f0",
                          borderRadius: 14,
                          padding: 14,
                          background: "#ffffff",
                        }}
                      >
                        <p><strong>Job time:</strong> {new Date(job.job_datetime).toLocaleString()}</p>
                        <p className="list-gap"><strong>Notes:</strong> {job.job_notes}</p>
                        <p className="list-gap">
                          <strong>Cost:</strong>{" "}
                          {job.repair_cost !== null ? `R ${job.repair_cost}` : "Not added"}
                        </p>

                        {job.generated_message && (
                          <p
                            className="list-gap"
                            style={{ whiteSpace: "pre-wrap", color: "#1e3a8a" }}
                          >
                            <strong>Message:</strong> {job.generated_message}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}