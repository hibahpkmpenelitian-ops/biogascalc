import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import LoginModal from "../modals/LoginModal";
import RegisterModal from "../modals/RegisterModal";
import { useAuth } from "../../contexts/AuthContext";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Lokasi", href: "/lokasi" },
  { label: "Dome", href: "/rancang-dome" },
  { label: "Kalkulator", href: "/kalkulator-limbah" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modal, setModal] = useState(null); // 'login' | 'register' | null

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    document.body.style.overflow = "";
  }, [pathname]);

  const toggleMenu = () => {
    const next = !mobileOpen;
    setMobileOpen(next);
    document.body.style.overflow = next ? "hidden" : "";
  };

  return (
    <>
      {/* ── Navbar — pill hitam full-width, sudut bawah rounded, notch SVG kiri/kanan ── */}
      <header
        className={`sticky top-0 z-50 w-full transition-shadow duration-200 ${scrolled ? "shadow-[rgba(0,0,0,0.25)_0px_8px_20px_0px]" : ""}`}
        style={{ position: "relative" }}
      >
        {/* SVG kiri — quarter-circle, menempel di luar sisi kiri pill, vertically centered (top: 30px) */}
        <svg
          aria-hidden="true"
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          style={{ position: "absolute", left: -49, top: 30, transform: "rotate(-180deg)" }}
        >
          <g clipPath="url(#clip0_62_1095)">
            <path d="M50 50C50.0079 12.6999 41.0038 -0.0116 0 0H50V50V50" fill="#0a0a0a" />
          </g>
          <defs>
            <clipPath id="clip0_62_1095">
              <rect width="50" height="50" fill="white" transform="matrix(-1 0 0 -1 50 50)" />
            </clipPath>
          </defs>
        </svg>

        {/* SVG kanan — quarter-circle, menempel di luar sisi kanan pill, vertically centered (top: 30px) */}
        <svg
          aria-hidden="true"
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          style={{ position: "absolute", right: -48.99, top: 30, transform: "rotate(90deg)" }}
        >
          <g clipPath="url(#clip0_62_1097)">
            <path d="M50 5.17597e-06C12.6999 -0.0078826 -0.0116 8.99616 0 50V5.17597e-06H50V5.17597e-06" fill="#0a0a0a" />
          </g>
          <defs>
            <clipPath id="clip0_62_1097">
              <rect width="50" height="50" fill="white" transform="matrix(0 1 -1 0 50 0)" />
            </clipPath>
          </defs>
        </svg>

        <div
          style={{
            display: "flex",
            height: 80,
            padding: "0 15.99px",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "stretch",
            backgroundColor: "#0a0a0a",
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
        >
          <div style={{ maxWidth: 1280, width: "100%", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* ── KIRI: Logo + Nama ── */}
            <Link to="/" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
              <img src="/Logo.png" alt="BioGasCalc logo" className="w-8 h-8 rounded-full object-cover" style={{ border: "1px solid #2a2a2a" }} />
              <span className="block font-semibold tracking-tight" style={{ fontSize: "0.9375rem", color: "#ffffff", lineHeight: 1.2 }}>
                BioGasCalc
              </span>
            </Link>

            {/* ── TENGAH: Nav links (desktop) ── */}
            <nav aria-label="Navigasi utama" className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    aria-current={isActive ? "page" : undefined}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 8,
                      fontSize: "0.875rem",
                      fontWeight: isActive ? 600 : 500,
                      textDecoration: "none",
                      transition: "all 0.15s",
                      color: isActive ? "#ffffff" : "#a8b3bc",
                      backgroundColor: isActive ? "#1c1c1c" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "#ffffff";
                        e.currentTarget.style.backgroundColor = "#1c1c1c";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "#a8b3bc";
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* ── KANAN: Auth buttons (desktop) ── */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      style={{
                        padding: "8px 16px",
                        borderRadius: 9999,
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        color: "#0a0a0a",
                        backgroundColor: "#9fe870",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#8ad860";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#9fe870";
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                      Admin Panel
                    </Link>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #00ed64 0%, #00b545 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        color: "#001e2b",
                        flexShrink: 0,
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#ffffff", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 9999,
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "#a8b3bc",
                      border: "1px solid #2a2a2a",
                      backgroundColor: "transparent",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#ffffff";
                      e.currentTarget.style.borderColor = "#555";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#a8b3bc";
                      e.currentTarget.style.borderColor = "#2a2a2a";
                    }}
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  {/* Login — teks polos */}
                  <button
                    onClick={() => setModal("login")}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 9999,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#ffffff",
                      border: "none",
                      backgroundColor: "transparent",
                      transition: "all 0.15s",
                      display: "inline-flex",
                      alignItems: "center",
                      lineHeight: 1.3,
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#a8b3bc"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#ffffff"; }}
                  >
                    Masuk
                  </button>

                  {/* Register — pill putih + tail hijau-lime dengan ikon */}
                  <button
                    onClick={() => setModal("register")}
                    className="register-split-btn"
                    style={{
                      padding: "4px",
                      paddingLeft: "20px",
                      borderRadius: 9999,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#0a0a0a",
                      backgroundColor: "#f4f7f6",
                      border: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 12,
                      lineHeight: 1.3,
                      transition: "all 0.15s",
                      cursor: "pointer",
                    }}
                  >
                    Daftar
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        backgroundColor: "#9fe870",
                        flexShrink: 0,
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M3 9 9 3M9 3H4M9 3v5" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                </>
              )}
            </div>

            {/* ── Hamburger (mobile only) ── */}
            <button
              onClick={toggleMenu}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
              className="md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-lg gap-[5px]"
              style={{ border: "1px solid #2a2a2a", backgroundColor: "transparent" }}
            >
              <span
                className="block w-5 rounded-full transition-all duration-200"
                style={{
                  height: 1.5,
                  backgroundColor: "#ffffff",
                  transform: mobileOpen ? "rotate(45deg) translateY(6.5px)" : "none",
                }}
              />
              <span
                className="block w-5 rounded-full transition-all duration-200"
                style={{
                  height: 1.5,
                  backgroundColor: "#ffffff",
                  opacity: mobileOpen ? 0 : 1,
                  transform: mobileOpen ? "scaleX(0)" : "none",
                }}
              />
              <span
                className="block w-5 rounded-full transition-all duration-200"
                style={{
                  height: 1.5,
                  backgroundColor: "#ffffff",
                  transform: mobileOpen ? "rotate(-45deg) translateY(-6.5px)" : "none",
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden"
            style={{ backgroundColor: "rgba(0,30,43,0.4)", backdropFilter: "blur(4px)" }}
            onClick={() => {
              setMobileOpen(false);
              document.body.style.overflow = "";
            }}
            aria-hidden="true"
          />
          <div
            id="mobile-menu"
            className="fixed top-16 left-0 right-0 z-50 md:hidden"
            style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e1e5e8" }}
          >
            <div className="flex flex-col gap-1 p-4" style={{ maxWidth: 1280, margin: "0 auto" }}>
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 8,
                      fontSize: "0.9rem",
                      fontWeight: isActive ? 600 : 500,
                      textDecoration: "none",
                      color: isActive ? "#001e2b" : "#3d4f5b",
                      backgroundColor: isActive ? "#e3fcef" : "transparent",
                      border: isActive ? "1px solid #c3f0d2" : "1px solid transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {link.label}
                    {isActive && (
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: "#00ed64",
                          display: "block",
                        }}
                      />
                    )}
                  </Link>
                );
              })}

              <div style={{ borderTop: "1px solid #e1e5e8", margin: "8px 0" }} />

              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      style={{
                        padding: "12px 16px",
                        borderRadius: 9999,
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        textAlign: "center",
                        color: "#0a0a0a",
                        backgroundColor: "#9fe870",
                        textDecoration: "none",
                        display: "block",
                        width: "100%",
                      }}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px" }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #00ed64 0%, #00b545 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        color: "#001e2b",
                        flexShrink: 0,
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#001e2b" }}>{user.name}</span>
                  </div>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); document.body.style.overflow = ""; }}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 9999,
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      textAlign: "center",
                      color: "#d32f2f",
                      border: "1px solid #f5c6c6",
                      backgroundColor: "transparent",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setModal("login"); setMobileOpen(false); document.body.style.overflow = ""; }}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 9999,
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      textAlign: "center",
                      color: "#001e2b",
                      border: "1px solid #c1ccd6",
                      backgroundColor: "transparent",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => { setModal("register"); setMobileOpen(false); document.body.style.overflow = ""; }}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 9999,
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      textAlign: "center",
                      color: "#001e2b",
                      backgroundColor: "#00ed64",
                      border: "none",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Daftar →
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Auth modals ── */}
      <LoginModal
        open={modal === "login"}
        onClose={() => setModal(null)}
        onSwitchToRegister={() => setModal("register")}
      />
      <RegisterModal
        open={modal === "register"}
        onClose={() => setModal(null)}
        onSwitchToLogin={() => setModal("login")}
      />
    </>
  );
}
