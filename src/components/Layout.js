import { Link, Outlet, useLocation } from "react-router-dom";
import { ShoppingBag, Settings } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCarrinho } from "../contexts/CarrinhoContext";
import AuthModal from "./AuthModal";
import CarrinhoModal from "./CarrinhoModal";

export default function Layout() {
  const location = useLocation();
  const { user, logout, setShowAuth, isAdmin } = useAuth();
  const { totalItems, setShowCart } = useCarrinho();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/produtos", label: "Produtos" },
  ];


  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fafafa" }}>
      <header
        style={{
          background: "#fff",
          padding: "0 32px",
          borderBottom: "1px solid #eee",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
          }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            <h1
              style={{
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "#1a1a1a",
                letterSpacing: "-0.5px",
                margin: 0,
              }}
            >
              Pisantes CWB
            </h1>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <nav style={{ display: "flex", gap: "4px", marginRight: "12px" }}>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    style={{
                      textDecoration: "none",
                      color: isActive ? "#1a1a1a" : "#999",
                      fontWeight: isActive ? 600 : 400,
                      fontSize: "0.9rem",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      background: isActive ? "#f0f0f0" : "transparent",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {isAdmin && (
              <Link
                to="/admin"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 10px",
                  color: location.pathname === "/admin" ? "#1a1a1a" : "#999",
                  transition: "color 0.2s ease",
                }}
              >
                <Settings size={20} strokeWidth={1.8} />
              </Link>
            )}

            <button
              onClick={() => setShowCart(true)}
              style={{
                position: "relative",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px 10px",
                color: "#1a1a1a",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ShoppingBag size={22} strokeWidth={1.8} />
              {totalItems > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "2px",
                    background: "#1a1a1a",
                    color: "#fff",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {totalItems}
                </span>
              )}
            </button>

            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "4px" }}>
                <span style={{ fontSize: "0.85rem", color: "#666", fontWeight: 500 }}>
                  {user.nome.split(" ")[0]}
                  {isAdmin && (
                    <span style={{ fontSize: "0.7rem", color: "#999", marginLeft: "4px" }}>(admin)</span>
                  )}
                </span>
                <button
                  onClick={logout}
                  style={{
                    background: "none",
                    border: "1px solid #ddd",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    color: "#888",
                    fontFamily: "'Quicksand', sans-serif",
                  }}
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                style={{
                  background: "#1a1a1a",
                  color: "#fff",
                  border: "none",
                  padding: "8px 18px",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Quicksand', sans-serif",
                  marginLeft: "4px",
                }}
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: "1200px", margin: "0 auto", padding: "32px 20px", width: "100%" }}>
        <Outlet />
      </main>

      <footer
        style={{
          textAlign: "center",
          padding: "24px 20px",
          borderTop: "1px solid #eee",
          background: "#fff",
          color: "#bbb",
          fontSize: "0.8rem",
          letterSpacing: "0.5px",
        }}
      >
        <p style={{ margin: 0 }}>Pisantes CWB &mdash; PUCPR 2026</p>
      </footer>

      <AuthModal />
      <CarrinhoModal />
    </div>
  );
}
