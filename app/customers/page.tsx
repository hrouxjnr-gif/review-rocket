"use client";

import AppHeader from "@/components/AppHeader";
import { useEffect, useState } from "react";

type Job = {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  job_notes: string;
  repair_cost: number | null;
  job_datetime: string;
  created_at: string;
  generated_message?: string | null;
};

export default function CustomersPage() {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [currency, setCurrency] = useState("R");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Job | null>(null);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();

      const loadedJobs = data.jobs || [];
      setAllJobs(loadedJobs);
      setJobs(loadedJobs);
    } catch (err) {
      console.error(err);
      setAllJobs([]);
      setJobs([]);
    }
    setLoading(false);
  };

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.settings?.currency) {
        setCurrency(data.settings.currency);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadJobs();
    loadSettings();
  }, []);

  const handleSearch = () => {
    const q = searchInput.trim().toLowerCase();

    if (!q) {
      setJobs(allJobs);
      return;
    }

    const filtered = allJobs.filter((job) => {
      return (
        (job.customer_name || "").toLowerCase().includes(q) ||
        (job.customer_phone || "").toLowerCase().includes(q) ||
        (job.customer_address || "").toLowerCase().includes(q) ||
        (job.job_notes || "").toLowerCase().includes(q) ||
        (job.generated_message || "").toLowerCase().includes(q)
      );
    });

    setJobs(filtered);
  };

  const handleReset = () => {
    setSearchInput("");
    setJobs(allJobs);
  };

  const startEdit = (job: Job) => {
    setEditingId(job.id);
    setEditingData({
      ...job,
      repair_cost:
        job.repair_cost === null || job.repair_cost === undefined
          ? null
          : Number(job.repair_cost),
    });
  };

  const saveEdit = async () => {
    if (!editingData) return;

    await fetch("/api/jobs/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editingData),
    });

    setEditingId(null);
    setEditingData(null);
    loadJobs();
  };

  const copyMessage = async (message: string) => {
    try {
      await navigator.clipboard.writeText(message);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="page-shell">
      <div className="page-container">
        <AppHeader />

        <div className="card" style={{ marginBottom: 20 }}>
          <h2 className="section-title">Customers</h2>

          <input
            placeholder="Search by name, phone, address, notes, or saved message"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          <div className="button-row">
            <button className="btn" onClick={handleSearch}>
              Search
            </button>

            <button className="btn-outline" onClick={handleReset}>
              Reset
            </button>

            <a className="btn-outline" href="/api/export/jobs">
              Export CSV
            </a>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          <div className="grid-list">
            {jobs.map((job) => {
              const isEditing = editingId === job.id;

              const whatsappUrl = job.generated_message
                ? `https://wa.me/?text=${encodeURIComponent(job.generated_message)}`
                : "#";

              const emailUrl = job.generated_message
                ? `mailto:?subject=${encodeURIComponent("Review Request")}&body=${encodeURIComponent(job.generated_message)}`
                : "#";

              return (
                <div key={job.id} className="card">
                  {!isEditing ? (
                    <>
                      <p><strong>Name:</strong> {job.customer_name}</p>
                      <p><strong>Phone:</strong> {job.customer_phone}</p>
                      <p><strong>Address:</strong> {job.customer_address}</p>
                      <p><strong>Notes:</strong> {job.job_notes}</p>
                      <p>
                        <strong>Cost:</strong>{" "}
                        {job.repair_cost !== null
                          ? `${currency} ${Number(job.repair_cost).toFixed(2)}`
                          : "Not added"}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {job.job_datetime
                          ? new Date(job.job_datetime).toLocaleString()
                          : "No date"}
                      </p>

                      {job.generated_message && (
                        <>
                          <p style={{ marginTop: 12 }}>
                            <strong>Saved Message:</strong>
                          </p>
                          <p
                            className="list-gap"
                            style={{ whiteSpace: "pre-wrap", color: "#1e3a8a" }}
                          >
                            {job.generated_message}
                          </p>
                        </>
                      )}

                      <div className="button-row">
                        <button
                          className="btn-outline"
                          onClick={() => startEdit(job)}
                        >
                          Edit
                        </button>

                        {job.generated_message && (
                          <>
                            <button
                              className="btn-outline"
                              onClick={() => copyMessage(job.generated_message || "")}
                            >
                              Copy Message
                            </button>

                            <a
                              className="btn-success"
                              href={whatsappUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              WhatsApp
                            </a>

                            <a className="btn-outline" href={emailUrl}>
                              Email
                            </a>
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <input
                        value={editingData?.customer_name || ""}
                        onChange={(e) =>
                          setEditingData((prev) =>
                            prev ? { ...prev, customer_name: e.target.value } : prev
                          )
                        }
                        placeholder="Customer Name"
                      />

                      <div style={{ height: 12 }} />

                      <input
                        value={editingData?.customer_phone || ""}
                        onChange={(e) =>
                          setEditingData((prev) =>
                            prev ? { ...prev, customer_phone: e.target.value } : prev
                          )
                        }
                        placeholder="Phone"
                      />

                      <div style={{ height: 12 }} />

                      <input
                        value={editingData?.customer_address || ""}
                        onChange={(e) =>
                          setEditingData((prev) =>
                            prev ? { ...prev, customer_address: e.target.value } : prev
                          )
                        }
                        placeholder="Address"
                      />

                      <div style={{ height: 12 }} />

                      <textarea
                        rows={5}
                        value={editingData?.job_notes || ""}
                        onChange={(e) =>
                          setEditingData((prev) =>
                            prev ? { ...prev, job_notes: e.target.value } : prev
                          )
                        }
                        placeholder="Notes"
                      />

                      <div style={{ height: 12 }} />

                      <input
                        type="number"
                        step="0.01"
                        value={editingData?.repair_cost ?? ""}
                        onChange={(e) =>
                          setEditingData((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  repair_cost:
                                    e.target.value === ""
                                      ? null
                                      : Number(e.target.value),
                                }
                              : prev
                          )
                        }
                        placeholder="Cost"
                      />

                      <div className="button-row">
                        <button className="btn" onClick={saveEdit}>
                          Save
                        </button>

                        <button
                          className="btn-outline"
                          onClick={() => {
                            setEditingId(null);
                            setEditingData(null);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}