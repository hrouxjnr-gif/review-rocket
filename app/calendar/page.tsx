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
};

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadJobs = async (date: string, search: string) => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (date) params.set("date", date);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch {
      setJobs([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    loadJobs(today, "");
  }, []);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    loadJobs(date, searchTerm);
  };

  const handleSearch = () => {
    loadJobs(selectedDate, searchTerm);
  };

  const handleClear = () => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    setSearchTerm("");
    loadJobs(today, "");
  };

  return (
    <main className="page-shell">
      <div className="page-container">
        <header className="topbar">
          <div className="brand-block">
            <h1>Calendar</h1>
            <p className="brand-subtitle">
              View saved jobs by date and search old clients or job details.
            </p>
          </div>

          <div className="nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/dashboard" className="nav-link">Dashboard</Link>
            <Link href="/settings" className="nav-link">Settings</Link>
            <Link href="/pricing" className="nav-link">Pricing</Link>
            <UserButton />
          </div>
        </header>

        <div className="card" style={{ marginBottom: 24 }}>
          <h2 className="section-title">Find Jobs</h2>

          <div className="content-grid" style={{ gridTemplateColumns: "0.8fr 1.2fr" }}>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
            />

            <input
              type="text"
              placeholder="Search by client, phone, address, or notes"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="button-row">
            <button onClick={handleSearch} className="btn">Search</button>
            <button onClick={handleClear} className="btn-outline">Reset</button>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">Results</h2>

          {loading ? (
            <p className="muted-text">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="muted-text">No jobs found.</p>
          ) : (
            <div className="grid-list">
              {jobs.map((job) => (
                <div key={job.id} className="list-card">
                  <p><strong>{job.customer_name}</strong></p>
                  <p className="list-gap">
                    <strong>Time:</strong> {new Date(job.job_datetime).toLocaleString()}
                  </p>

                  {job.customer_phone && (
                    <p className="list-gap"><strong>Phone:</strong> {job.customer_phone}</p>
                  )}

                  {job.customer_address && (
                    <p className="list-gap"><strong>Address:</strong> {job.customer_address}</p>
                  )}

                  <p className="list-gap">
                    <strong>Cost:</strong> {job.repair_cost !== null ? `R ${job.repair_cost}` : "Not added"}
                  </p>

                  <p className="list-gap"><strong>Notes:</strong> {job.job_notes}</p>

                  {job.generated_message && (
                    <p className="list-gap" style={{ whiteSpace: "pre-wrap", color: "#1e3a8a" }}>
                      <strong>Message:</strong> {job.generated_message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}