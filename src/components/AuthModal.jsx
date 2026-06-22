import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function AuthModal() {
  const { showAuth, setShowAuth, register, login } = useAuth();
  const [tab, setTab] = useState("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  if (!showAuth) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      if (tab === "cadastro") {
        if (!nome.trim() || !email.trim() || !senha.trim()) {
          throw new Error("Preencha todos os campos obrigatórios");
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          throw new Error("E-mail inválido");
        }
        await register(nome, email, senha);
      } else {
        if (!email.trim() || !senha.trim()) {
          throw new Error("Preencha todos os campos obrigatórios");
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          throw new Error("E-mail inválido");
        }
        await login(email, senha);
      }
      setNome("");
      setEmail("");
      setSenha("");
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    padding: "12px 16px",
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    fontSize: "0.95rem",
    width: "100%",
    boxSizing: "border-box",
    background: "#fafafa",
    color: "#1a1a1a",
    outline: "none",
    fontFamily: "'Quicksand', sans-serif",
  };

  return (
    <div
      onClick={() => setShowAuth(false)}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "36px",
          width: "100%",
          maxWidth: "400px",
          margin: "0 20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ display: "flex", gap: "4px", marginBottom: "28px", background: "#f5f5f5", borderRadius: "12px", padding: "4px" }}>
          {["login", "cadastro"].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setErro(""); }}
              style={{
                flex: 1,
                padding: "10px",
                border: "none",
                borderRadius: "10px",
                background: tab === t ? "#fff" : "transparent",
                boxShadow: tab === t ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                color: tab === t ? "#1a1a1a" : "#999",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.9rem",
                fontFamily: "'Quicksand', sans-serif",
                textTransform: "capitalize",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {erro && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              padding: "10px 14px",
              marginBottom: "16px",
              color: "#dc2626",
              fontSize: "0.85rem",
            }}
          >
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {tab === "cadastro" && (
            <input
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={inputStyle}
            />
          )}
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={inputStyle}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#1a1a1a",
              color: "#fff",
              border: "none",
              padding: "14px",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              fontFamily: "'Quicksand', sans-serif",
              marginTop: "4px",
            }}
          >
            {loading ? "Aguarde..." : tab === "cadastro" ? "Criar conta" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
