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

export default function CalendarPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currency, setCurrency] = useState("R");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Job | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const loadJobs = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error(err);
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
    setSelectedDate(new Date().toISOString().split("T")[0]);
  }, []);

  const filteredJobs = useMemo(() => {
    const q = searchInput.trim().toLowerCase();

    return [...jobs]
      .filter((job) => {
        const dateMatch = selectedDate
          ? (job.job_datetime || "").slice(0, 10) === selectedDate
          : true;

        const searchMatch = q
          ? `${job.customer_name} ${job.customer_phone} ${job.customer_address} ${job.job_notes} ${job.generated_message || ""}`
              .toLowerCase()
              .includes(q)
          : true;

        return dateMatch && searchMatch;
      })
      .sort((a, b) => {
        return (
          new Date(a.job_datetime || a.created_at).getTime() -
          new Date(b.job_datetime || b.created_at).getTime()
        );
      });
  }, [jobs, selectedDate, searchInput]);

  const totalForSelectedDay = filteredJobs.reduce(
    (sum, job) => sum + Number(job.repair_cost || 0),
    0
  );

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

  const resetSearch = () => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
    setSearchInput("");
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
                <span className="badge">Agenda view</span>
                <h1
                  style={{
                    fontSize: "34px",
                    fontWeight: 800,
                    lineHeight: 1.08,
                    marginBottom: 10,
                  }}
                >
                  Calendar
                </h1>
                <p className="muted-text" style={{ maxWidth: 720 }}>
                  Focus on one date, scan the jobs in time order, and take action fast.
                </p>
              </div>

              <a className="btn-outline" href="/api/export/jobs">
                Export CSV
              </a>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "0.35fr 1fr 0.22fr",
                gap: 12,
              }}
              className="calendar-toolbar-grid"
            >
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />

              <input
                type="text"
                placeholder="Search by name, phone, address, notes, or saved message"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />

              <button className="btn-outline" onClick={resetSearch}>
                Reset
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
            className="calendar-metrics-grid"
          >
            <div className="card" style={{ marginBottom: 0 }}>
              <p className="muted-text" style={{ marginBottom: 8 }}>
                Selected date
              </p>
              <h2 style={{ fontSize: 28, fontWeight: 800 }}>
                {selectedDate || "No date"}
              </h2>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <p className="muted-text" style={{ marginBottom: 8 }}>
                Jobs on date
              </p>
              <h2 style={{ fontSize: 28, fontWeight: 800 }}>
                {filteredJobs.length}
              </h2>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <p className="muted-text" style={{ marginBottom: 8 }}>
                Value on date
              </p>
              <h2 style={{ fontSize: 28, fontWeight: 800 }}>
                {currency} {totalForSelectedDay.toFixed(2)}
              </h2>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "0.95fr 1.05fr",
              gap: 20,
            }}
            className="calendar-main-grid"
          >
            <div className="card" style={{ marginBottom: 0 }}>
              <h2 className="section-title">Selected day summary</h2>

              <div className="info-list">
                <div className="muted-text info-line">
                  • Date: {selectedDate || "Not selected"}
                </div>
                <div className="muted-text info-line">
                  • Jobs scheduled: {filteredJobs.length}
                </div>
                <div className="muted-text info-line">
                  • Day value: {currency} {totalForSelectedDay.toFixed(2)}
                </div>
                <div className="muted-text info-line">
                  • Search: {searchInput ? "Filtered" : "All jobs for day"}
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 0, padding: 0, overflow: "hidden" }}>
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  fontWeight: 800,
                }}
              >
                Day agenda
              </div>

              {loading ? (
                <div style={{ padding: 20 }} className="muted-text">
                  Loading...
                </div>
              ) : filteredJobs.length === 0 ? (
                <div style={{ padding: 24 }}>
                  <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>
                    No jobs found for this date
                  </h3>
                  <p className="muted-text" style={{ marginBottom: 16 }}>
                    Change the selected date or reset the search filters.
                  </p>
                  <button className="btn-outline" onClick={resetSearch}>
                    Reset Filters
                  </button>
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
                              gap: 12,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 12,
                                flexWrap: "wrap",
                              }}
                            >
                              <div>
                                <div style={{ fontWeight: 800, marginBottom: 6 }}>
                                  {job.customer_name || "No name"}
                                </div>
                                <div className="muted-text">
                                  {job.job_datetime
                                    ? new Date(job.job_datetime).toLocaleString()
                                    : "No date"}
                                </div>
                              </div>

                              <div style={{ fontWeight: 700 }}>
                                {job.repair_cost !== null &&
                                job.repair_cost !== undefined
                                  ? `${currency} ${Number(job.repair_cost).toFixed(2)}`
                                  : "Not added"}
                              </div>
                            </div>

                            <div className="muted-text" style={{ lineHeight: 1.7 }}>
                              {job.customer_phone || "No phone"} •{" "}
                              {job.customer_address || "No address"}
                            </div>

                            <div className="muted-text" style={{ lineHeight: 1.7 }}>
                              {job.job_notes || "No notes"}
                            </div>

                            {job.generated_message && (
                              <div
                                style={{
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
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          .calendar-toolbar-grid,
          .calendar-main-grid {
            grid-template-columns: 1fr !important;
          }

          .calendar-metrics-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 640px) {
          .calendar-metrics-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}