"use client";

import AppHeader from "@/components/AppHeader";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";

type SubscriptionData = {
  plan: string;
  max_users: number;
  monthly_limit: number;
};

type TeamMember = {
  id: number;
  owner_user_id: string;
  member_user_id: string;
  role: string;
  created_at: string;
};

type TeamData = {
  ownerUserId: string;
  currentUserId: string;
  isOwner: boolean;
  plan: string;
  maxUsers: number;
  seatsUsed: number;
  members: TeamMember[];
};

export default function TeamPage() {
  const { user, isLoaded, isSignedIn } = useUser();

  const [memberId, setMemberId] = useState("");
  const [message, setMessage] = useState("");
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copyText, setCopyText] = useState("Copy My User ID");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [removingUserId, setRemovingUserId] = useState("");
  const [memberSearch, setMemberSearch] = useState("");

  const myUserId = user?.id || "";

  const planName = String(subscription?.plan || teamData?.plan || "free");
  const maxUsers =
    typeof teamData?.maxUsers === "number"
      ? teamData.maxUsers
      : typeof subscription?.max_users === "number"
      ? subscription.max_users
      : 1;

  const seatsUsed =
    typeof teamData?.seatsUsed === "number" ? teamData.seatsUsed : 1;

  const seatsLeft = maxUsers >= 9999 ? "Unlimited" : Math.max(maxUsers - seatsUsed, 0);
  const isWorkspaceOwner = Boolean(teamData?.isOwner);

  const usagePercent = useMemo(() => {
    if (!maxUsers || maxUsers >= 9999) return 0;
    return Math.min((seatsUsed / maxUsers) * 100, 100);
  }, [seatsUsed, maxUsers]);

  const filteredMembers = useMemo(() => {
    const members = teamData?.members || [];
    const q = memberSearch.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) =>
      `${m.member_user_id} ${m.role}`.toLowerCase().includes(q)
    );
  }, [teamData, memberSearch]);

  const loadSubscription = async () => {
    try {
      const res = await fetch("/api/subscription");
      const data = await res.json();

      if (!data.error) {
        setSubscription(data);
      }
    } catch (error) {
      console.error("Failed to load subscription:", error);
    }
  };

  const loadTeam = async () => {
    try {
      const res = await fetch("/api/team/members");
      const data = await res.json();

      if (!data.error) {
        setTeamData(data);
      }
    } catch (error) {
      console.error("Failed to load team:", error);
    }
  };

  const loadAll = async () => {
    setLoading(true);
    setMessage("");
    await Promise.all([loadSubscription(), loadTeam()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const copyMyUserId = async () => {
    if (!myUserId) return;

    try {
      await navigator.clipboard.writeText(myUserId);
      setCopyText("Copied!");
      setTimeout(() => setCopyText("Copy My User ID"), 2000);
    } catch {
      setCopyText("Copy failed");
      setTimeout(() => setCopyText("Copy My User ID"), 2000);
    }
  };

  const invite = async () => {
    if (!memberId.trim()) {
      setMessage("Please enter a user ID.");
      return;
    }

    setMessage("");
    setInviteLoading(true);

    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ memberUserId: memberId.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("User added successfully.");
        setMemberId("");
        await loadAll();
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Invite failed:", error);
      setMessage("Something went wrong.");
    }

    setInviteLoading(false);
  };

  const removeMember = async (memberUserId: string) => {
    setMessage("");
    setRemovingUserId(memberUserId);

    try {
      const res = await fetch("/api/team/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ memberUserId }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("User removed successfully.");
        await loadAll();
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Remove failed:", error);
      setMessage("Something went wrong.");
    }

    setRemovingUserId("");
  };

  return (
    <main className="page-shell">
      <div className="page-container">
        <AppHeader />

        <div style={{ marginTop: 40, display: "grid", gap: 22 }}>
          {/* HERO */}
          <section className="card" style={{ marginBottom: 0 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.1fr 0.9fr",
                gap: 24,
                alignItems: "start",
              }}
              className="team-top-grid"
            >
              <div>
                <span className="badge">Team Management</span>

                <h1
                  style={{
                    fontSize: "40px",
                    lineHeight: "1.08",
                    fontWeight: 800,
                    marginBottom: 14,
                    maxWidth: 760,
                  }}
                >
                  Add staff, share one workspace, and keep team access simple.
                </h1>

                <p
                  className="muted-text"
                  style={{
                    fontSize: 18,
                    lineHeight: 1.75,
                    maxWidth: 760,
                  }}
                >
                  Agency works by letting each worker sign in with their own
                  account, copy their user ID, and send it to the owner. The
                  owner then adds them to the shared workspace from this page.
                </p>

                {!loading && teamData && !isWorkspaceOwner && (
                  <p style={{ marginTop: 16, fontWeight: 700 }}>
                    You are viewing this workspace as a team member. Only the owner can add or remove seats.
                  </p>
                )}

                {message && (
                  <p style={{ marginTop: 16, fontWeight: 700 }}>{message}</p>
                )}
              </div>

              <div className="list-card" style={{ display: "grid", gap: 12 }}>
                <p style={{ fontWeight: 800, fontSize: 20 }}>Quick overview</p>

                <div className="info-list">
                  <div className="muted-text info-line">
                    • Plan: <strong style={{ textTransform: "capitalize" }}>{planName}</strong>
                  </div>
                  <div className="muted-text info-line">
                    • Seats used: <strong>{seatsUsed}</strong>
                  </div>
                  <div className="muted-text info-line">
                    • Seats left: <strong>{seatsLeft}</strong>
                  </div>
                  <div className="muted-text info-line">
                    • Monthly messages: <strong>{subscription?.monthly_limit ?? 0}</strong>
                  </div>
                  <div className="muted-text info-line">
                    • Workspace owner: <strong>{teamData?.ownerUserId || myUserId}</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* METRICS */}
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 18,
            }}
            className="team-metrics-grid"
          >
            <div className="card" style={{ marginBottom: 0 }}>
              <p className="muted-text" style={{ marginBottom: 8 }}>
                Current plan
              </p>
              <h2 style={{ fontSize: 28, fontWeight: 800, textTransform: "capitalize" }}>
                {planName}
              </h2>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <p className="muted-text" style={{ marginBottom: 8 }}>
                Seats used
              </p>
              <h2 style={{ fontSize: 28, fontWeight: 800 }}>
                {maxUsers >= 9999 ? `${seatsUsed}` : `${seatsUsed}/${maxUsers}`}
              </h2>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <p className="muted-text" style={{ marginBottom: 8 }}>
                Team members
              </p>
              <h2 style={{ fontSize: 28, fontWeight: 800 }}>
                {teamData?.members?.length || 0}
              </h2>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <p className="muted-text" style={{ marginBottom: 8 }}>
                Messages / month
              </p>
              <h2 style={{ fontSize: 28, fontWeight: 800 }}>
                {subscription?.monthly_limit ?? 0}
              </h2>
            </div>
          </section>

          {/* MAIN */}
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "0.95fr 1.05fr",
              gap: 22,
              alignItems: "start",
            }}
            className="team-main-grid"
          >
            {/* LEFT */}
            <div style={{ display: "grid", gap: 22 }}>
              <div className="card" style={{ marginBottom: 0, padding: 30 }}>
                <h2 className="section-title" style={{ marginBottom: 18 }}>
                  Your User ID
                </h2>

                {!isLoaded ? (
                  <p className="muted-text">Loading user...</p>
                ) : !isSignedIn ? (
                  <p className="muted-text">You must be signed in to see your user ID.</p>
                ) : (
                  <>
                    <div
                      className="list-card"
                      style={{
                        wordBreak: "break-all",
                        fontWeight: 700,
                        lineHeight: 1.7,
                        marginBottom: 16,
                      }}
                    >
                      {myUserId}
                    </div>

                    <div className="button-row">
                      <button onClick={copyMyUserId} className="btn-outline">
                        {copyText}
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="card" style={{ marginBottom: 0, padding: 30 }}>
                <h2 className="section-title" style={{ marginBottom: 18 }}>
                  Seat usage
                </h2>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                    marginBottom: 12,
                  }}
                >
                  <p className="muted-text">
                    {maxUsers >= 9999
                      ? `${seatsUsed} seat${seatsUsed === 1 ? "" : "s"} used on an unlimited plan`
                      : `${seatsUsed} of ${maxUsers} seats used`}
                  </p>

                  <p style={{ fontWeight: 700 }}>
                    {maxUsers >= 9999 ? "Unlimited" : `${Math.max(maxUsers - seatsUsed, 0)} left`}
                  </p>
                </div>

                {maxUsers < 9999 ? (
                  <div
                    style={{
                      width: "100%",
                      height: 12,
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.08)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${usagePercent}%`,
                        height: "100%",
                        borderRadius: 999,
                        background: "linear-gradient(90deg, #22d3ee 0%, #3b82f6 100%)",
                      }}
                    />
                  </div>
                ) : (
                  <div className="list-card" style={{ fontWeight: 700 }}>
                    Unlimited seats available on this plan.
                  </div>
                )}
              </div>

              <div className="card" style={{ marginBottom: 0, padding: 30 }}>
                <h2 className="section-title" style={{ marginBottom: 18 }}>
                  Add a team member
                </h2>

                <p className="muted-text" style={{ marginBottom: 16, lineHeight: 1.75 }}>
                  Ask your worker to sign in, open this page, copy their user ID,
                  and send it to you. Then paste that ID below.
                </p>

                <div style={{ display: "grid", gap: 14 }}>
                  <input
                    placeholder="Paste team member user ID"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    disabled={!isWorkspaceOwner}
                  />

                  <div className="button-row">
                    <button onClick={invite} className="btn" disabled={inviteLoading || !isWorkspaceOwner}>
                      {inviteLoading ? "Adding..." : "Add User"}
                    </button>
                  </div>

                  {!isWorkspaceOwner && (
                    <p className="muted-text">
                      Ask the workspace owner to add team members. You can still copy your own user ID above and send it to them.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="card" style={{ marginBottom: 0, padding: 0, overflow: "hidden" }}>
              <div
                style={{
                  padding: "18px 22px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <h2 className="section-title" style={{ marginBottom: 8 }}>
                  Current Team Members
                </h2>
                <p className="muted-text">
                  View who is already inside the shared workspace.
                </p>
              </div>

              {loading ? (
                <div style={{ padding: 22 }} className="muted-text">
                  Loading members...
                </div>
              ) : !teamData || teamData.members.length === 0 ? (
                <div style={{ padding: 24 }}>
                  <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>
                    No team members added yet
                  </h3>
                  <p className="muted-text">
                    Add your first worker using their user ID.
                  </p>
                </div>
              ) : (
                <div style={{ display: "grid" }}>
                  <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <input
                      placeholder="Search by user ID or role (owner/member)"
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                    />
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.2fr 0.55fr 0.8fr 0.55fr",
                      gap: 12,
                      padding: "14px 22px",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      fontWeight: 700,
                      color: "#d1d5db",
                    }}
                    className="team-head-row"
                  >
                    <div>User ID</div>
                    <div>Role</div>
                    <div>Added</div>
                    <div>Action</div>
                  </div>

                  {filteredMembers.length === 0 ? (
                    <div style={{ padding: 22 }} className="muted-text">
                      No matches.
                    </div>
                  ) : (
                    filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1.2fr 0.55fr 0.8fr 0.55fr",
                        gap: 12,
                        padding: "18px 22px",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        alignItems: "start",
                      }}
                      className="team-data-row"
                    >
                      <div style={{ wordBreak: "break-all", lineHeight: 1.7, fontWeight: 700 }}>
                        {member.member_user_id}
                      </div>

                      <div className="muted-text" style={{ textTransform: "capitalize" }}>
                        {member.role}
                      </div>

                      <div className="muted-text">
                        {new Date(member.created_at).toLocaleString()}
                      </div>

                      <div>
                        <button
                          className="btn-outline"
                          onClick={() => removeMember(member.member_user_id)}
                          disabled={removingUserId === member.member_user_id || !isWorkspaceOwner}
                        >
                          {!isWorkspaceOwner ? "Owner only" : removingUserId === member.member_user_id ? "Removing..." : "Remove"}
                        </button>
                      </div>
                    </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </section>

          {/* BOTTOM HELP */}
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 22,
            }}
            className="team-bottom-grid"
          >
            <div className="card" style={{ marginBottom: 0 }}>
              <h2 className="section-title">How the team flow works</h2>

              <div className="info-list">
                <div className="muted-text info-line">
                  • Each worker signs in with their own account
                </div>
                <div className="muted-text info-line">
                  • Each worker copies their own user ID
                </div>
                <div className="muted-text info-line">
                  • The owner pastes that ID into this page
                </div>
                <div className="muted-text info-line">
                  • Once added, the team works inside the same shared workspace
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <h2 className="section-title">When Agency makes sense</h2>

              <div className="info-list">
                <div className="muted-text info-line">
                  • Multiple field workers need access
                </div>
                <div className="muted-text info-line">
                  • The owner wants one shared record system
                </div>
                <div className="muted-text info-line">
                  • Staff need to generate messages without sharing one login
                </div>
                <div className="muted-text info-line">
                  • The business wants team usage under one plan
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          .team-top-grid,
          .team-main-grid,
          .team-bottom-grid,
          .team-metrics-grid {
            grid-template-columns: 1fr !important;
          }

          .team-head-row {
            display: none !important;
          }

          .team-data-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}