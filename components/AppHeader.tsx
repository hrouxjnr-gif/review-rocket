"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";

type AppHeaderProps = {
  showUserButton?: boolean;
};

type MenuItem = {
  href: string;
  label: string;
  description: string;
  protected?: boolean;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

const menuSections: MenuSection[] = [
  {
    title: "Navigation",
    items: [
      {
        href: "/",
        label: "Home",
        description: "Back to the landing page and overview",
        protected: false,
      },
    ],
  },
  {
    title: "Workspace",
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        description: "Try the review workflow and manage daily work",
        protected: false,
      },
      {
        href: "/customers",
        label: "Customers",
        description: "Search, edit, and reuse customer records",
        protected: true,
      },
      {
        href: "/calendar",
        label: "Calendar",
        description: "Filter jobs by date and scan the day fast",
        protected: true,
      },
      {
        href: "/invoice",
        label: "Invoice Tool",
        description: "Create invoices and quotes in one place",
        protected: false,
      },
    ],
  },
  {
    title: "Business",
    items: [
      {
        href: "/pricing",
        label: "Pricing",
        description: "Compare Free, Pro, and Agency",
        protected: false,
      },
      {
        href: "/team",
        label: "Team",
        description: "Add staff and manage seats",
        protected: true,
      },
      {
        href: "/settings",
        label: "Settings",
        description: "Save business details and defaults",
        protected: true,
      },
    ],
  },
  {
    title: "Help",
    items: [
      {
        href: "/how-it-works",
        label: "How It Works",
        description: "See the app flow step by step",
        protected: false,
      },
      {
        href: "/feedback",
        label: "Contact / Support",
        description: "Get help or send feedback",
        protected: false,
      },
      {
        href: "/privacy",
        label: "Privacy Policy",
        description: "How we handle your data",
        protected: false,
      },
      {
        href: "/terms",
        label: "Terms of Service",
        description: "Usage rules and service terms",
        protected: false,
      },
      {
        href: "/refund",
        label: "Refund Policy",
        description: "Refunds and cancellations",
        protected: false,
      },
    ],
  },
];

export default function AppHeader({
  showUserButton = true,
}: AppHeaderProps) {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuWrapRef = useRef<HTMLDivElement | null>(null);

  const flatMenuItems = useMemo(
    () => menuSections.flatMap((section) => section.items),
    []
  );

  const isRouteActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const activeMenuLabel =
    flatMenuItems.find((item) => isRouteActive(item.href))?.label || "Menu";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuWrapRef.current) return;
      if (!menuWrapRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      <header className="site-header">
        <div className="site-header__left">
          <Link href="/" className="site-logo" aria-label="Go to Home">
            <Image
              src="/logo.png"
              alt="Roux Review Rocket"
              width={160}
              height={52}
              priority
              className="site-logo__image"
            />
          </Link>
        </div>

        <div className="site-header__right" ref={menuWrapRef}>
          <div className="site-menu-wrap">
            <button
              type="button"
              className={`site-menu-button ${
                menuOpen ? "site-menu-button--open" : ""
              }`}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-controls="site-header-menu"
              aria-label="Open menu"
            >
              <span className="site-menu-button__icon" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>

              <span className="site-menu-button__text">
                {menuOpen ? "Close" : "Menu"}
              </span>
            </button>

            <div
              id="site-header-menu"
              className={`site-menu-panel ${
                menuOpen ? "site-menu-panel--open" : ""
              }`}
            >
              <div className="site-menu-panel__top">
                <div>
                  <div className="site-menu-badge">Quick navigation</div>
                  <h3 className="site-menu-title">Move faster</h3>
                  <p className="site-menu-subtitle">
                    Use the free demo without signing in. Sign in only when you
                    want to save data, manage customers, or upgrade.
                  </p>
                </div>

                <div className="site-menu-top-right">
                  <div className="site-menu-active-card">
                    <div className="site-menu-active-card__label">
                      Current page
                    </div>
                    <div className="site-menu-active-card__value">
                      {activeMenuLabel}
                    </div>
                  </div>

                  {showUserButton && (
                    <div className="site-menu-account-card">
                      <div className="site-menu-account-card__label">
                        Account
                      </div>

                      {!isLoaded ? (
                        <div className="site-menu-account-signedout">
                          <p className="site-menu-account-helper">
                            Loading account...
                          </p>
                        </div>
                      ) : isSignedIn ? (
                        <div className="site-menu-account-signedin">
                          <span className="site-menu-account-helper">
                            Signed in
                          </span>

                          <div className="site-menu-account-button">
                            <UserButton
                              appearance={{
                                elements: {
                                  userButtonAvatarBox: {
                                    width: "40px",
                                    height: "40px",
                                  },
                                },
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="site-menu-account-signedout">
                          <p className="site-menu-account-helper">
                            Save jobs, keep customers, and upgrade later.
                          </p>

                          <div className="site-account-actions">
                            <SignInButton
                              mode="modal"
                              fallbackRedirectUrl="/dashboard"
                            >
                              <button className="site-account-btn site-account-btn--primary">
                                Sign in
                              </button>
                            </SignInButton>

                            <SignUpButton
                              mode="modal"
                              fallbackRedirectUrl="/dashboard"
                            >
                              <button className="site-account-btn site-account-btn--secondary">
                                Create account
                              </button>
                            </SignUpButton>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="site-menu-sections">
                {menuSections.map((section) => (
                  <div key={section.title} className="site-menu-section">
                    <div className="site-menu-section__title">
                      {section.title}
                    </div>

                    <div className="site-menu-grid">
                      {section.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          prefetch={false}
                          className={`site-menu-link ${
                            isRouteActive(item.href)
                              ? "site-menu-link--active"
                              : ""
                          }`}
                        >
                          <div className="site-menu-link__header">
                            <span className="site-menu-link__label">
                              {item.label}
                            </span>
                            <span className="site-menu-link__arrow">↗</span>
                          </div>

                          <p className="site-menu-link__description">
                            {item.description}
                          </p>

                          {item.protected && (
                            <span className="site-menu-link__badge">
                              Sign in required
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <style jsx>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 1200;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 10px 0 16px;
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(
            180deg,
            rgba(5, 10, 24, 0.96) 0%,
            rgba(6, 16, 34, 0.92) 100%
          );
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }

        .site-header__left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
          flex: 1 1 auto;
        }

        .site-header__right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          position: relative;
        }

        .site-logo {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          flex-shrink: 0;
        }

        .site-logo__image {
          width: 150px;
          height: auto;
          object-fit: contain;
          display: block;
        }

        .site-home-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 0 18px;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 800;
          font-size: 16px;
          line-height: 1;
          white-space: nowrap;
          color: #f8fafc;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow:
            0 8px 20px rgba(15, 23, 42, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          transition:
            transform 0.18s ease,
            background 0.18s ease,
            border-color 0.18s ease,
            box-shadow 0.18s ease,
            color 0.18s ease;
        }

        .site-home-button:hover {
          transform: translateY(-1px);
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .site-home-button--active {
          background: rgba(255, 255, 255, 0.96);
          color: #111827;
          border-color: rgba(255, 255, 255, 0.96);
        }

        .site-menu-wrap {
          position: relative;
        }

        .site-menu-button {
          min-height: 46px;
          padding: 0 14px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: linear-gradient(
            135deg,
            rgba(223, 246, 255, 0.16) 0%,
            rgba(191, 219, 254, 0.12) 100%
          );
          color: #f8fafc;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-weight: 800;
          font-size: 16px;
          box-shadow:
            0 8px 18px rgba(15, 23, 42, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
          transition:
            transform 0.18s ease,
            box-shadow 0.18s ease,
            border-color 0.18s ease,
            background 0.18s ease;
        }

        .site-menu-button:hover {
          transform: translateY(-1px);
        }

        .site-menu-button--open {
          border-color: rgba(34, 211, 238, 0.42);
          background: linear-gradient(
            135deg,
            rgba(34, 211, 238, 0.18) 0%,
            rgba(59, 130, 246, 0.16) 100%
          );
        }

        .site-menu-button__icon {
          width: 18px;
          height: 14px;
          display: inline-flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .site-menu-button__icon span {
          display: block;
          width: 18px;
          height: 2px;
          border-radius: 999px;
          background: currentColor;
          transition:
            transform 0.2s ease,
            opacity 0.2s ease;
        }

        .site-menu-button--open .site-menu-button__icon span:nth-child(1) {
          transform: translateY(6px) rotate(45deg);
        }

        .site-menu-button--open .site-menu-button__icon span:nth-child(2) {
          opacity: 0;
        }

        .site-menu-button--open .site-menu-button__icon span:nth-child(3) {
          transform: translateY(-6px) rotate(-45deg);
        }

        .site-menu-button__text {
          line-height: 1;
          white-space: nowrap;
        }

        .site-menu-panel {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: min(440px, calc(100vw - 24px));
          max-height: min(78vh, 760px);
          overflow-y: auto;
          padding: 14px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: linear-gradient(
            180deg,
            rgba(9, 18, 32, 0.97) 0%,
            rgba(11, 31, 53, 0.98) 100%
          );
          box-shadow:
            0 24px 60px rgba(0, 0, 0, 0.34),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(18px);
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px) scale(0.98);
          transition:
            opacity 0.18s ease,
            transform 0.18s ease,
            visibility 0.18s ease;
          z-index: 1300;
        }

        .site-menu-panel--open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }

        .site-menu-panel__top {
          display: grid;
          gap: 12px;
          padding: 4px 2px 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .site-menu-top-right {
          display: grid;
          gap: 10px;
        }

        .site-menu-badge {
          display: inline-flex;
          align-items: center;
          min-height: 26px;
          width: fit-content;
          padding: 0 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #eff6ff;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 8px;
        }

        .site-menu-title {
          font-size: 22px;
          line-height: 1.04;
          font-weight: 900;
          margin: 0 0 8px;
        }

        .site-menu-subtitle {
          margin: 0;
          color: rgba(255, 255, 255, 0.72);
          line-height: 1.55;
          font-size: 14px;
        }

        .site-menu-active-card,
        .site-menu-account-card {
          border-radius: 16px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: grid;
          gap: 8px;
        }

        .site-menu-active-card__label,
        .site-menu-account-card__label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.68);
        }

        .site-menu-active-card__value {
          font-size: 18px;
          font-weight: 900;
          line-height: 1.1;
        }

        .site-menu-account-signedin {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .site-menu-account-signedout {
          display: grid;
          gap: 10px;
        }

        .site-menu-account-helper {
          font-size: 13px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.82);
        }

        .site-account-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .site-account-btn {
          min-height: 42px;
          width: 100%;
          border-radius: 12px;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.14);
        }

        .site-account-btn--primary {
          background: rgba(255, 255, 255, 0.96);
          color: #111827;
        }

        .site-account-btn--secondary {
          background: rgba(255, 255, 255, 0.08);
          color: #f8fafc;
        }

        .site-menu-sections {
          display: grid;
          gap: 14px;
          padding-top: 14px;
        }

        .site-menu-section {
          display: grid;
          gap: 10px;
        }

        .site-menu-section__title {
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.58);
          padding: 0 2px;
        }

        .site-menu-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .site-menu-link {
          display: grid;
          gap: 6px;
          padding: 13px 14px;
          border-radius: 16px;
          text-decoration: none;
          color: #f8fafc;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition:
            transform 0.18s ease,
            border-color 0.18s ease,
            background 0.18s ease,
            box-shadow 0.18s ease;
        }

        .site-menu-link:hover {
          transform: translateY(-1px);
        }

        .site-menu-link--active {
          background: linear-gradient(
            135deg,
            rgba(34, 211, 238, 0.14) 0%,
            rgba(59, 130, 246, 0.14) 100%
          );
          border-color: rgba(34, 211, 238, 0.34);
        }

        .site-menu-link__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .site-menu-link__label {
          font-size: 16px;
          font-weight: 800;
          line-height: 1.15;
        }

        .site-menu-link__arrow {
          font-size: 16px;
          opacity: 0.74;
        }

        .site-menu-link__description {
          margin: 0;
          color: rgba(255, 255, 255, 0.68);
          line-height: 1.45;
          font-size: 13px;
        }

        .site-menu-link__badge {
          display: inline-flex;
          width: fit-content;
          padding: 5px 9px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 11px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.86);
        }

        @media (max-width: 720px) {
          .site-logo__image {
            width: 132px;
          }

          .site-menu-panel {
            width: min(100vw - 16px, 360px);
          }
        }

        @media (max-width: 520px) {
          .site-logo__image {
            width: 118px;
          }

          .site-menu-button,
          .site-home-button {
            min-height: 42px;
            padding: 0 12px;
            font-size: 14px;
          }

          .site-account-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
