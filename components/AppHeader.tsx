"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

type AppHeaderProps = {
  showUserButton?: boolean;
};

export default function AppHeader({
  showUserButton = true,
}: AppHeaderProps) {
  const { isSignedIn, isLoaded } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth > 900) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="topbar" style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <Link href="/" onClick={closeMenu}>
          <img
            src="/logo.png"
            alt="Roux Review Rocket logo"
            style={{
              width: "clamp(110px, 15vw, 170px)",
              height: "auto",
              display: "block",
            }}
          />
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <Link href="/" className="nav-link">
          Home
        </Link>

        <Link href="/dashboard" className="nav-link">
          Dashboard
        </Link>

        <button
          type="button"
          className="btn-outline"
          onClick={() => setMenuOpen((prev) => !prev)}
          style={{
            minHeight: 42,
            padding: "10px 14px",
          }}
        >
          ☰ Menu
        </button>

        {showUserButton && isLoaded && !isSignedIn && (
          <>
            <SignInButton>
              <button type="button" className="btn-outline">
                Sign In
              </button>
            </SignInButton>

            <SignUpButton>
              <button type="button" className="btn">
                Sign Up
              </button>
            </SignUpButton>
          </>
        )}

        {showUserButton && isLoaded && isSignedIn && <UserButton />}
      </div>

      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: 12,
            width: 260,
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: 18,
            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
            padding: 12,
            zIndex: 50,
          }}
        >
          <div style={{ display: "grid", gap: 8 }}>
            <Link href="/calendar" className="nav-link" onClick={closeMenu}>
              Calendar
            </Link>

            <Link href="/customers" className="nav-link" onClick={closeMenu}>
              Customers
            </Link>

            <Link href="/pricing" className="nav-link" onClick={closeMenu}>
              Pricing
            </Link>

            <Link href="/settings" className="nav-link" onClick={closeMenu}>
              Settings
            </Link>

            <Link href="/how-it-works" className="nav-link" onClick={closeMenu}>
              How It Works
            </Link>

            <Link href="/feedback" className="nav-link" onClick={closeMenu}>
              contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}