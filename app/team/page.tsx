"use client";

import AppHeader from "@/components/AppHeader";
import { useEffect, useState } from "react";
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

  const myUserId = user?.id || "";

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

    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ memberUserId: memberId }),
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
  };

  const removeMember = async (memberUserId: string) => {
    setMessage("");

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
  };

  return (
    <main className="page-shell">
      <div className="page-container">
        <AppHeader />

        <div className="grid-list">
          <div className="card">
            <h2 className="section-title">Team Management</h2>

            <div className="info-box" style={{ marginBottom: 20 }}>
              <h3>Your User ID</h3>

              {!isLoaded ? (
                <p>Loading user...</p>
              ) : !isSignedIn ? (
                <p>You must be signed in to see your user ID.</p>
              ) : (
                <>
                  <p style={{ wordBreak: "break-all", fontWeight: 700 }}>
                    {myUserId}
                  </p>

                  <div className="button-row">
                    <button onClick={copyMyUserId} className="btn-outline">
                      {copyText}
                    </button>
                  </div>
                </>
              )}
            </div>

            {loading ? (
              <p className="muted-text">Loading plan...</p>
            ) : subscription ? (
              <div className="info-box" style={{ marginBottom: 20 }}>
                <h3>Current Plan</h3>
                <p>
                  Plan: <strong>{subscription.plan}</strong>
                  {"\n"}Users:{" "}
                  <strong>
                    {subscription.max_users >= 9999 ? "Unlimited" : subscription.max_users}
                  </strong>
                  {"\n"}Messages: <strong>{subscription.monthly_limit}</strong>
                </p>
              </div>
            ) : null}

            {loading ? (
              <p className="muted-text">Loading team...</p>
            ) : teamData ? (
              <div className="info-box" style={{ marginBottom: 20 }}>
                <h3>Seats Used</h3>
                <p>
                  Owner workspace: <strong>{teamData.ownerUserId}</strong>
                  {"\n"}Seats used:{" "}
                  <strong>
                    {teamData.seatsUsed}
                    {teamData.maxUsers >= 9999 ? " / Unlimited" : ` / ${teamData.maxUsers}`}
                  </strong>
                </p>
              </div>
            ) : null}

            <p className="muted-text">
              Agency works like this: each team member signs in with their own account,
              copies their user ID from this page, and sends it to the agency owner.
              The owner then pastes that ID below to add them.
            </p>

            <input
              placeholder="Paste team member user ID"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
            />

            <div className="button-row">
              <button onClick={invite} className="btn">
                Add User
              </button>
            </div>

            {message && (
              <p style={{ marginTop: 12, fontWeight: 700 }}>{message}</p>
            )}
          </div>

          <div className="card">
            <h2 className="section-title">Current Team Members</h2>

            {loading ? (
              <p className="muted-text">Loading members...</p>
            ) : !teamData || teamData.members.length === 0 ? (
              <p className="muted-text">No team members added yet.</p>
            ) : (
              <div className="grid-list">
                {teamData.members.map((member) => (
                  <div key={member.id} className="list-card">
                    <p>
                      <strong>User ID:</strong> {member.member_user_id}
                    </p>
                    <p className="list-gap">
                      <strong>Role:</strong> {member.role}
                    </p>
                    <p className="list-gap">
                      <strong>Added:</strong>{" "}
                      {new Date(member.created_at).toLocaleString()}
                    </p>

                    <div className="button-row">
                      <button
                        className="btn-outline"
                        onClick={() => removeMember(member.member_user_id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}