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
};

export default function CustomersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("R");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<any>({});
  const [searchInput, setSearchInput] = useState("");
  const [allJobs, setAllJobs] = useState<Job[]>([]);

  const loadJobs = async () => {
    setLoading(true);
    const res = await fetch("/api/jobs");
    const data = await res.json();

    const list = data.jobs || [];
    setJobs(list);
    setAllJobs(list);
    setLoading(false);
  };

  const loadSettings = async () => {
    const res = await fetch("/api/settings");
    const data = await res.json();
    if (data.settings?.currency) {
      setCurrency(data.settings.currency);
    }
  };

  useEffect(() => {
    loadJobs();
    loadSettings();
  }, []);

  const startEdit = (job: Job) => {
    setEditingId(job.id);
    setEditingData({
      ...job,
      repair_cost:
        job.repair_cost === null ? "" : Number(job.repair_cost),
    });
  };

  const saveEdit = async () => {
    await fetch("/api/jobs/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editingData),
    });

    setEditingId(null);
    loadJobs();
  };

  const handleSearch = () => {
    const q = searchInput.toLowerCase();

    const filtered = allJobs.filter((job) =>
      `${job.customer_name} ${job.customer_phone} ${job.customer_address} ${job.job_notes}`
        .toLowerCase()
        .includes(q)
    );

    setJobs(filtered);
  };

  const resetSearch = () => {
    setSearchInput("");
    setJobs(allJobs);
  };

  return (
    <main className="page-shell">
      <div className="page-container">
        <AppHeader />

        {/* SEARCH + EXPORT */}
        <div className="card" style={{ marginBottom: 20 }}>
          <h2>Customers</h2>

          <input
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          <div className="button-row">
            <button className="btn" onClick={handleSearch}>
              Search
            </button>

            <button className="btn-outline" onClick={resetSearch}>
              Reset
            </button>

            <a className="btn-outline" href="/api/export/jobs">
              Export CSV
            </a>
          </div>
        </div>

        {/* JOB LIST */}
        {loading ? (
          <p>Loading...</p>
        ) : jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          <div className="grid-list">
            {jobs.map((job) => {
              const isEditing = editingId === job.id;

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

                      <button
                        className="btn-outline"
                        onClick={() => startEdit(job)}
                      >
                        Edit
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        value={editingData.customer_name}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            customer_name: e.target.value,
                          })
                        }
                      />

                      <input
                        value={editingData.customer_phone}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            customer_phone: e.target.value,
                          })
                        }
                      />

                      <input
                        value={editingData.customer_address}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            customer_address: e.target.value,
                          })
                        }
                      />

                      <textarea
                        value={editingData.job_notes}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            job_notes: e.target.value,
                          })
                        }
                      />

                      <input
                        type="number"
                        value={editingData.repair_cost}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            repair_cost: e.target.value,
                          })
                        }
                      />

                      <div className="button-row">
                        <button className="btn" onClick={saveEdit}>
                          Save
                        </button>

                        <button
                          className="btn-outline"
                          onClick={() => setEditingId(null)}
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