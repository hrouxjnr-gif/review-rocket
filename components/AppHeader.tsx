"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

type AppHeaderProps = {
  showUserButton?: boolean;
};

export default function AppHeader({ showUserButton = true }: AppHeaderProps) {
  return (
    <header className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <img
  src="/logo.png"
  alt="Roux Review Rocket logo"
  style={{
    width: "clamp(110px, 15vw, 170px)",
    height: "auto",
    display: "block",
  }}
/>
      </div>

      <nav className="nav-links">
        <Link href="/dashboard" className="nav-link">Dashboard</Link>
        <Link href="/calendar" className="nav-link">Calendar</Link>
        <Link href="/customers" className="nav-link">Customers</Link>
        <Link href="/pricing" className="nav-link">Pricing</Link>
        <Link href="/settings" className="nav-link">Settings</Link>
        <Link href="/how-it-works" className="nav-link">How It Works</Link>

        {showUserButton && <UserButton />}
      </nav>
    </header>
  );
}