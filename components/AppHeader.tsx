"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
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
    <header className="topbar app-header-shell">
      <div className="app-header-row">
        <Link href="/" onClick={closeMenu} className="app-header-logo-link">
          <img
            src="/logo.png"
            alt="Roux Review Rocket logo"
            className="app-logo"
          />
        </Link>

        <div className="app-header-right" ref={menuRef}>
          <div className="app-header-main-links">
            <Link href="/" className="nav-link" onClick={closeMenu}>
              Home
            </Link>

            <Link href="/dashboard" className="nav-link" onClick={closeMenu}>
              Dashboard
            </Link>
          </div>

          <button
            type="button"
            className="btn-outline menu-toggle-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            ☰ Menu
          </button>

          {showUserButton && isLoaded && !isSignedIn && (
            <div className="auth-buttons-row">
              <SignInButton>
                <button type="button" className="btn-outline auth-btn-small">
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton>
                <button type="button" className="btn auth-btn-small">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          )}

          {showUserButton && isLoaded && isSignedIn && (
            <div className="user-button-wrap">
              <UserButton />
            </div>
          )}

          {menuOpen && (
            <div className="app-menu-dropdown">
              <div className="app-menu-links">
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
                  Contact
                </Link>
                
                <Link href="/team" className="nav-link" onClick={closeMenu}>
                 Team
                </Link>
                
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}