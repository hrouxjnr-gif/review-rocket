"use client";

import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";

type AppHeaderProps = {
  showUserButton?: boolean;
};

export default function AppHeader({
  showUserButton = true,
}: AppHeaderProps) {
  const { isSignedIn, isLoaded } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 8,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(1180px, calc(100vw - 12px))",
          zIndex: 99999,
          padding: "16px 20px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(226, 232, 240, 0.9)",
          borderRadius: 22,
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            alignItems: "center",
            gap: 24,
          }}
        >
          <Link
            href="/"
            onClick={closeMenu}
            style={{ display: "inline-flex", alignItems: "center" }}
          >
            <img
              src="/logo.png"
              alt="Roux Review Rocket logo"
              style={{
                width: 180,
                height: "auto",
                display: "block",
                maxWidth: "100%",
              }}
            />
          </Link>

          <div
            ref={menuRef}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 14,
              minWidth: 0,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <Link href="/" className="nav-link" onClick={closeMenu}>
                Home
              </Link>

              <Link href="/dashboard" className="nav-link" onClick={closeMenu}>
                Dashboard
              </Link>
            </div>

            <button
              type="button"
              className="btn-outline"
              onClick={() => setMenuOpen((prev) => !prev)}
              style={{ minHeight: 42, whiteSpace: "nowrap" }}
            >
              ☰ Menu
            </button>

            {showUserButton && isLoaded && !isSignedIn && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
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
              </div>
            )}

            {showUserButton && isLoaded && isSignedIn && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <UserButton />
              </div>
            )}

            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 10px)",
                  right: 0,
                  width: 260,
                  maxWidth: "calc(100vw - 32px)",
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: 18,
                  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
                  padding: 12,
                  zIndex: 100000,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gap: 8,
                  }}
                >
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

                  <Link href="/team" className="nav-link" onClick={closeMenu}>
                    Team
                  </Link>

                  <Link href="/feedback" className="nav-link" onClick={closeMenu}>
                    Contact
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div style={{ height: 110 }} />
    </>
  );
}