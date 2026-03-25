"use client";

import AppHeader from "@/components/AppHeader";
import { useEffect, useMemo, useState } from "react";

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
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currency, setCurrency] = useState("R");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Job | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      setAllJobs(data.jobs || []);
    } catch (err) {
      console.error(err);
      setAllJobs([]);
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

  const filteredJobs = useMemo(() => {
    const q = searchInput.trim().toLowerCase();

    let list = [...allJobs];

    if (q) {
      list = list.filter((job) => {
        return (
          (job.customer_name || "").toLowerCase().includes(q) ||
          (job.customer_phone || "").toLowerCase().includes(q) ||
          (job.customer_address || "").toLowerCase().includes(q) ||
          (job.job_notes || "").toLowerCase().includes(q) ||
          (job.generated_message || "").toLowerCase().includes(q)
        );
      });
    }

    list.sort((a, b) => {
      if (sortBy === "oldest") {
        return (
          new Date(a.job_datetime || a.created_at).getTime() -
          new Date(b.job_datetime || b.created_at).getTime()
        );
      }

      if (sortBy === "highest-cost") {
        return Number(b.repair_cost || 0) - Number(a.repair_cost || 0);
      }

      if (sortBy === "lowest-cost") {
        return Number(a.repair_cost || 0) - Number(b.repair_cost || 0);
      }

      if (sortBy === "name") {
        return (a.customer_name || "").localeCompare(b.customer_name || "");
      }

      return (
        new Date(b.job_datetime || b.created_at).getTime() -
        new Date(a.job_datetime || a.created_at).getTime()
      );
    });

    return list;
  }, [allJobs, searchInput, sortBy]);

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

  const cancelEdit = () => {
    setEditingId(null);
    setEditingData(null);
  };

  const copyMessage = async (message: string, id: number) => {
    try {
      await navigator.clipboard.writeText(message);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setSearchInput("");
    setSortBy("newest");
  };

  return (
    <main className="page-shell">
      <div className="page-container">
        <AppHeader />

        <div style={{ marginTop: 40, display: "grid", gap: 20 }}>
          <div className="card" style={{ marginBottom: 0 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
                alignItems: "flex-start",
                marginBottom: 18,
              }}
            >
              <div>
                <span className="badge">Customer index</span>
                <h1
                  style={{
                    fontSize: "34px",
                    fontWeight: 800,
                    lineHeight: 1.08,
                    marginBottom: 10,
                  }}
                >
                  Customers
                </h1>
                <p className="muted-text" style={{ maxWidth: 700 }}>
                  Search, compare, edit, and reuse customer job records from one
                  clean list.
                </p>
              </div>

              <a className="btn-outline" href="/api/export/jobs">
                Export CSV
              </a>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 0.35fr 0.25fr",
                gap: 12,
              }}
              className="customers-toolbar-grid"
            >
              <input
                placeholder="Search by name, phone, address, notes, or saved message"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest-cost">Highest Cost</option>
                <option value="lowest-cost">Lowest Cost</option>
                <option value="name">Name</option>
              </select>

              <button className="btn-outline" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
            }}
            className="customers-metrics-grid"
          >
            <div className="card" style={{ marginBottom: 0 }}>
              <p className="muted-text" style={{ marginBottom: 8 }}>
                Total records
              </p>
              <h2 style={{ fontSize: 30, fontWeight: 800 }}>
                {filteredJobs.length}
              </h2>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <p className="muted-text" style={{ marginBottom: 8 }}>
                With saved message
              </p>
              <h2 style={{ fontSize: 30, fontWeight: 800 }}>
                {filteredJobs.filter((job) => !!job.generated_message).length}
              </h2>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <p className="muted-text" style={{ marginBottom: 8 }}>
                Highest cost
              </p>
              <h2 style={{ fontSize: 30, fontWeight: 800 }}>
                {currency}{" "}
                {filteredJobs.length
                  ? Math.max(
                      ...filteredJobs.map((job) => Number(job.repair_cost || 0))
                    ).toFixed(2)
                  : "0.00"}
              </h2>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <p className="muted-text" style={{ marginBottom: 8 }}>
                Search status
              </p>
              <h2 style={{ fontSize: 30, fontWeight: 800 }}>
                {searchInput ? "Filtered" : "All"}
              </h2>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 0, padding: 0, overflow: "hidden" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.1fr 0.85fr 0.55fr 0.6fr 0.9fr",
                gap: 12,
                padding: "16px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                fontWeight: 700,
                color: "#d1d5db",
              }}
              className="customers-head-row"
            >
              <div>Customer</div>
              <div>Contact</div>
              <div>Cost</div>
              <div>Date</div>
              <div>Actions</div>
            </div>

            {loading ? (
              <div style={{ padding: 20 }} className="muted-text">
                Loading...
              </div>
            ) : filteredJobs.length === 0 ? (
              <div style={{ padding: 24 }}>
                <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>
                  No customer records found
                </h3>
                <p className="muted-text" style={{ marginBottom: 16 }}>
                  Try a different search or create a new job from the dashboard.
                </p>
                <a href="/dashboard" className="btn">
                  Go to Dashboard
                </a>
              </div>
            ) : (
              <div style={{ display: "grid" }}>
                {filteredJobs.map((job) => {
                  const isEditing = editingId === job.id;

                  const whatsappUrl = job.generated_message
                    ? `https://wa.me/?text=${encodeURIComponent(job.generated_message)}`
                    : "#";

                  const emailUrl = job.generated_message
                    ? `mailto:?subject=${encodeURIComponent(
                        "Review Request"
                      )}&body=${encodeURIComponent(job.generated_message)}`
                    : "#";

                  return (
                    <div
                      key={job.id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        padding: "18px 20px",
                      }}
                    >
                      {!isEditing ? (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1.1fr 0.85fr 0.55fr 0.6fr 0.9fr",
                            gap: 12,
                            alignItems: "start",
                          }}
                          className="customers-data-row"
                        >
                          <div>
                            <div style={{ fontWeight: 800, marginBottom: 6 }}>
                              {job.customer_name || "No name"}
                            </div>
                            <div className="muted-text" style={{ lineHeight: 1.6 }}>
                              {job.job_notes || "No notes"}
                            </div>
                            {job.generated_message && (
                              <div
                                style={{
                                  marginTop: 10,
                                  padding: "10px 12px",
                                  borderRadius: 12,
                                  background: "rgba(15,23,42,0.45)",
                                  border: "1px solid rgba(255,255,255,0.06)",
                                  fontSize: 14,
                                  lineHeight: 1.6,
                                  color: "#d1d5db",
                                  whiteSpace: "pre-wrap",
                                }}
                              >
                                {job.generated_message}
                              </div>
                            )}
                          </div>

                          <div>
                            <div style={{ marginBottom: 6 }}>
                              {job.customer_phone || "No phone"}
                            </div>
                            <div className="muted-text" style={{ lineHeight: 1.6 }}>
                              {job.customer_address || "No address"}
                            </div>
                          </div>

                          <div style={{ fontWeight: 700 }}>
                            {job.repair_cost !== null
                              ? `${currency} ${Number(job.repair_cost).toFixed(2)}`
                              : "Not added"}
                          </div>

                          <div className="muted-text" style={{ lineHeight: 1.6 }}>
                            {job.job_datetime
                              ? new Date(job.job_datetime).toLocaleString()
                              : "No date"}
                          </div>

                          <div>
                            <div
                              style={{
                                display: "flex",
                                gap: 8,
                                flexWrap: "wrap",
                              }}
                            >
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
                                    onClick={() =>
                                      copyMessage(job.generated_message || "", job.id)
                                    }
                                  >
                                    {copiedId === job.id ? "Copied" : "Copy"}
                                  </button>

                                  <a
                                    className="btn-outline"
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
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "grid", gap: 12 }}>
                          <input
                            value={editingData?.customer_name || ""}
                            onChange={(e) =>
                              setEditingData((prev) =>
                                prev
                                  ? { ...prev, customer_name: e.target.value }
                                  : prev
                              )
                            }
                            placeholder="Customer Name"
                          />

                          <input
                            value={editingData?.customer_phone || ""}
                            onChange={(e) =>
                              setEditingData((prev) =>
                                prev
                                  ? { ...prev, customer_phone: e.target.value }
                                  : prev
                              )
                            }
                            placeholder="Phone"
                          />

                          <input
                            value={editingData?.customer_address || ""}
                            onChange={(e) =>
                              setEditingData((prev) =>
                                prev
                                  ? { ...prev, customer_address: e.target.value }
                                  : prev
                              )
                            }
                            placeholder="Address"
                          />

                          <textarea
                            rows={5}
                            value={editingData?.job_notes || ""}
                            onChange={(e) =>
                              setEditingData((prev) =>
                                prev
                                  ? { ...prev, job_notes: e.target.value }
                                  : prev
                              )
                            }
                            placeholder="Notes"
                          />

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

                            <button className="btn-outline" onClick={cancelEdit}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          .customers-toolbar-grid {
            grid-template-columns: 1fr !important;
          }

          .customers-metrics-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }

          .customers-head-row {
            display: none !important;
          }

          .customers-data-row {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 640px) {
          .customers-metrics-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}