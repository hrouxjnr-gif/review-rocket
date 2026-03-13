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

  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [editCustomerName, setEditCustomerName] = useState("");
  const [editCustomerPhone, setEditCustomerPhone] = useState("");
  const [editCustomerAddress, setEditCustomerAddress] = useState("");
  const [editJobDatetime, setEditJobDatetime] = useState("");
  const [editJobNotes, setEditJobNotes] = useState("");
  const [editRepairCost, setEditRepairCost] = useState("");
  const [editGeneratedMessage, setEditGeneratedMessage] = useState("");
  const [editMessage, setEditMessage] = useState("");

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

  const startEdit = (job: JobItem) => {
    setEditingJobId(job.id);
    setEditCustomerName(job.customer_name || "");
    setEditCustomerPhone(job.customer_phone || "");
    setEditCustomerAddress(job.customer_address || "");
    setEditJobDatetime(toDateTimeLocal(job.job_datetime));
    setEditJobNotes(job.job_notes || "");
    setEditRepairCost(job.repair_cost !== null ? String(job.repair_cost) : "");
    setEditGeneratedMessage(job.generated_message || "");
    setEditMessage("");
  };

  const cancelEdit = () => {
    setEditingJobId(null);
    setEditMessage("");
  };

  const saveEdit = async () => {
    if (!editingJobId) return;

    try {
      const res = await fetch("/api/jobs", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingJobId,
          customer_name: editCustomerName,
          customer_phone: editCustomerPhone,
          customer_address: editCustomerAddress,
          job_datetime: new Date(editJobDatetime).toISOString(),
          job_notes: editJobNotes,
          repair_cost: editRepairCost,
          generated_message: editGeneratedMessage,
        }),
      });

      const data = await res.json();

      if (data.job) {
        setEditMessage("Job updated.");
        setEditingJobId(null);
        loadJobs(selectedDate, searchTerm);
      } else {
        setEditMessage(data.error || "Failed to update job.");
      }
    } catch {
      setEditMessage("Failed to update job.");
    }
  };

  const deleteJob = async (id: number) => {
    const ok = window.confirm("Delete this job?");
    if (!ok) return;

    try {
      const res = await fetch(`/api/jobs?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        loadJobs(selectedDate, searchTerm);
      } else {
        alert(data.error || "Failed to delete job.");
      }
    } catch {
      alert("Failed to delete job.");
    }
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 12,
              marginTop: 12,
            }}
          >
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
                  {editingJobId === job.id ? (
                    <>
                      <input
                        type="text"
                        value={editCustomerName}
                        onChange={(e) => setEditCustomerName(e.target.value)}
                        placeholder="Customer name"
                      />
                      <div style={{ height: 10 }} />

                      <input
                        type="text"
                        value={editCustomerPhone}
                        onChange={(e) => setEditCustomerPhone(e.target.value)}
                        placeholder="Customer phone"
                      />
                      <div style={{ height: 10 }} />

                      <input
                        type="text"
                        value={editCustomerAddress}
                        onChange={(e) => setEditCustomerAddress(e.target.value)}
                        placeholder="Customer address"
                      />
                      <div style={{ height: 10 }} />

                      <input
                        type="datetime-local"
                        value={editJobDatetime}
                        onChange={(e) => setEditJobDatetime(e.target.value)}
                      />
                      <div style={{ height: 10 }} />

                      <input
                        type="number"
                        step="0.01"
                        value={editRepairCost}
                        onChange={(e) => setEditRepairCost(e.target.value)}
                        placeholder="Repair cost"
                      />
                      <div style={{ height: 10 }} />

                      <textarea
                        rows={4}
                        value={editJobNotes}
                        onChange={(e) => setEditJobNotes(e.target.value)}
                        placeholder="Job notes"
                      />
                      <div style={{ height: 10 }} />

                      <textarea
                        rows={5}
                        value={editGeneratedMessage}
                        onChange={(e) => setEditGeneratedMessage(e.target.value)}
                        placeholder="Generated message"
                      />

                      <div className="button-row">
                        <button onClick={saveEdit} className="btn">Save</button>
                        <button onClick={cancelEdit} className="btn-outline">Cancel</button>
                      </div>

                      {editMessage && (
                        <p className="list-gap" style={{ color: "#0f172a", fontWeight: 700 }}>
                          {editMessage}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
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

                      <div className="button-row">
                        <button onClick={() => startEdit(job)} className="btn-outline">Edit</button>
                        <button onClick={() => deleteJob(job.id)} className="btn-outline">
                          Delete
                        </button>
                      </div>
                    </>
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

function toDateTimeLocal(value: string) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}