import { useState, useEffect } from "react";
import { Package, Users, Plus, Trash2, ImagePlus, Pencil, Shield, ShieldOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const API = "http://localhost:3001";

export default function AdminPage() {
  const { token, isAdmin, user: currentUser } = useAuth();
  const [tab, setTab] = useState("novo");
  const [produtos, setProdutos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // form novo produto
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // form editar produto
  const [editando, setEditando] = useState(null);
  const [editNome, setEditNome] = useState("");
  const [editPreco, setEditPreco] = useState("");
  const [editDescricao, setEditDescricao] = useState("");
  const [editImagens, setEditImagens] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      carregarProdutos();
      carregarUsuarios();
    }
  }, [isAdmin]);

  async function carregarProdutos() {
    try {
      const res = await fetch(API + "/api/produtos");
      const data = await res.json();
      setProdutos(data);
    } catch {}
  }

  async function carregarUsuarios() {
    try {
      const res = await fetch(API + "/api/admin/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setUsuarios(data);
    } catch {}
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("preco", preco);
      formData.append("descricao", descricao);
      for (const img of imagens) {
        formData.append("imagens", img);
      }
      const res = await fetch(API + "/api/admin/produtos", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      setMsg("Produto criado com sucesso!");
      setNome("");
      setPreco("");
      setDescricao("");
      setImagens([]);
      carregarProdutos();
    } catch (err) {
      setMsg("Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function iniciarEdicao(p) {
    setEditando(p.id);
    setEditNome(p.nome);
    setEditPreco(p.preco);
    setEditDescricao(p.descricao);
    setEditImagens([]);
  }

  async function salvarEdicao(id) {
    try {
      const formData = new FormData();
      formData.append("nome", editNome);
      formData.append("preco", editPreco);
      formData.append("descricao", editDescricao);
      for (const img of editImagens) {
        formData.append("imagens", img);
      }
      await fetch(API + `/api/admin/produtos/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      setEditando(null);
      carregarProdutos();
    } catch {}
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja remover este produto?")) return;
    await fetch(API + `/api/admin/produtos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    carregarProdutos();
  }

  async function toggleRole(userId, currentRole) {
    const newRole = currentRole === "admin" ? "usuario" : "admin";
    await fetch(API + `/api/admin/usuarios/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: newRole }),
    });
    carregarUsuarios();
  }

  async function handleDeleteUser(userId) {
    if (!window.confirm("Tem certeza que deseja remover este usuário?")) return;
    await fetch(API + `/api/admin/usuarios/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    carregarUsuarios();
  }

  if (!isAdmin) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2 style={{ color: "#1a1a1a", marginBottom: "8px" }}>Acesso restrito</h2>
        <p style={{ color: "#999" }}>Apenas administradores podem acessar esta página.</p>
      </div>
    );
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

  const tabs = [
    { key: "novo", label: "Novo produto", icon: <Plus size={16} /> },
    { key: "produtos", label: "Produtos", icon: <Package size={16} /> },
    { key: "usuarios", label: "Usuários", icon: <Users size={16} /> },
  ];

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "6px" }}>
          Painel Admin
        </h1>
        <p style={{ color: "#999", fontSize: "0.95rem", margin: 0 }}>
          Gerencie produtos e usuários
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          background: "#f0f0f0",
          borderRadius: "12px",
          padding: "4px",
          marginBottom: "28px",
          maxWidth: "500px",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              padding: "10px 16px",
              border: "none",
              borderRadius: "10px",
              background: tab === t.key ? "#fff" : "transparent",
              boxShadow: tab === t.key ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
              color: tab === t.key ? "#1a1a1a" : "#999",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.85rem",
              fontFamily: "'Quicksand', sans-serif",
              transition: "all 0.2s ease",
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── Novo produto ── */}
      {tab === "novo" && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: "20px",
            padding: "28px",
            maxWidth: "520px",
          }}
        >
          {msg && (
            <div
              style={{
                background: msg.includes("Erro") ? "#fef2f2" : "#f0fdf4",
                border: `1px solid ${msg.includes("Erro") ? "#fecaca" : "#bbf7d0"}`,
                borderRadius: "10px",
                padding: "10px 14px",
                marginBottom: "16px",
                color: msg.includes("Erro") ? "#dc2626" : "#16a34a",
                fontSize: "0.85rem",
              }}
            >
              {msg}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <input type="text" placeholder="Nome do produto" value={nome} onChange={(e) => setNome(e.target.value)} style={inputStyle} required />
            <input type="text" placeholder="Preco (ex: R$ 599,99)" value={preco} onChange={(e) => setPreco(e.target.value)} style={inputStyle} required />
            <textarea placeholder="Descrição do produto" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} required />
            <label
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "24px",
                border: "2px dashed #ddd",
                borderRadius: "12px",
                cursor: "pointer",
                color: "#999",
                fontSize: "0.9rem",
              }}
            >
              <ImagePlus size={20} />
              {imagens.length > 0 ? `${imagens.length} imagem(ns) selecionada(s)` : "Selecionar imagens"}
              <input type="file" multiple accept="image/*" onChange={(e) => setImagens(Array.from(e.target.files))} style={{ display: "none" }} />
            </label>
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
              }}
            >
              {loading ? "Salvando..." : "Criar produto"}
            </button>
          </div>
        </form>
      )}

      {/* ── Produtos ── */}
      {tab === "produtos" && (
        <div style={{ maxWidth: "700px" }}>
          <p style={{ color: "#888", fontSize: "0.85rem", marginBottom: "16px" }}>
            {produtos.length} produto(s) cadastrado(s)
          </p>
          {produtos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px", background: "#fff", borderRadius: "16px", border: "1px solid #eee", color: "#999" }}>
              <Package size={32} strokeWidth={1.2} style={{ marginBottom: "12px", color: "#ccc" }} />
              <p>Nenhum produto cadastrado</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {produtos.map((p) => (
                <div key={p.id} style={{ background: "#fff", border: "1px solid #eee", borderRadius: "14px", padding: "16px" }}>
                  {editando === p.id ? (
                    // Modo edicao
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <input type="text" value={editNome} onChange={(e) => setEditNome(e.target.value)} style={inputStyle} />
                      <input type="text" value={editPreco} onChange={(e) => setEditPreco(e.target.value)} style={inputStyle} />
                      <textarea value={editDescricao} onChange={(e) => setEditDescricao(e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "#999", fontSize: "0.85rem" }}>
                        <ImagePlus size={16} />
                        {editImagens.length > 0 ? `${editImagens.length} nova(s) imagem(ns)` : "Trocar imagens (opcional)"}
                        <input type="file" multiple accept="image/*" onChange={(e) => setEditImagens(Array.from(e.target.files))} style={{ display: "none" }} />
                      </label>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => salvarEdicao(p.id)}
                          style={{ flex: 1, background: "#1a1a1a", color: "#fff", border: "none", padding: "10px", borderRadius: "10px", fontWeight: 600, cursor: "pointer", fontFamily: "'Quicksand', sans-serif", fontSize: "0.85rem" }}
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => setEditando(null)}
                          style={{ background: "none", border: "1px solid #ddd", padding: "10px 16px", borderRadius: "10px", color: "#888", cursor: "pointer", fontFamily: "'Quicksand', sans-serif", fontSize: "0.85rem" }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Modo visualizacao
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      {p.imagens && p.imagens[0] && (
                        <img src={`${API}${p.imagens[0]}`} alt={p.nome} style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "10px" }} />
                      )}
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, color: "#1a1a1a", fontSize: "0.9rem", margin: "0 0 2px" }}>{p.nome}</p>
                        <p style={{ color: "#888", fontSize: "0.8rem", margin: 0 }}>{p.preco}</p>
                      </div>
                      <button
                        onClick={() => iniciarEdicao(p)}
                        style={{ background: "none", border: "1px solid #eee", borderRadius: "8px", padding: "8px", cursor: "pointer", color: "#999", display: "flex", alignItems: "center" }}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        style={{ background: "none", border: "1px solid #eee", borderRadius: "8px", padding: "8px", cursor: "pointer", color: "#ccc", display: "flex", alignItems: "center", transition: "color 0.2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#dc2626")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#ccc")}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Usuarios ── */}
      {tab === "usuarios" && (
        <div style={{ maxWidth: "700px" }}>
          <p style={{ color: "#888", fontSize: "0.85rem", marginBottom: "16px" }}>
            {usuarios.length} usuário(s) cadastrado(s)
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {usuarios.map((u) => (
              <div
                key={u.id}
                style={{
                  background: "#fff",
                  border: "1px solid #eee",
                  borderRadius: "14px",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: u.role === "admin" ? "#1a1a1a" : "#f0f0f0",
                    color: u.role === "admin" ? "#fff" : "#999",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    fontFamily: "'Quicksand', sans-serif",
                  }}
                >
                  {u.nome.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: "#1a1a1a", fontSize: "0.9rem", margin: "0 0 2px" }}>
                    {u.nome}
                  </p>
                  <p style={{ color: "#888", fontSize: "0.8rem", margin: 0 }}>{u.email}</p>
                </div>
                <button
                  onClick={() => toggleRole(u.id, u.role)}
                  title={u.role === "admin" ? "Remover admin" : "Tornar admin"}
                  style={{
                    background: "none",
                    border: "1px solid #eee",
                    borderRadius: "8px",
                    padding: "8px",
                    cursor: "pointer",
                    color: u.role === "admin" ? "#1a1a1a" : "#ccc",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {u.role === "admin" ? <Shield size={15} /> : <ShieldOff size={15} />}
                </button>
                {u.id !== currentUser?.id && (
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    style={{
                      background: "none",
                      border: "1px solid #eee",
                      borderRadius: "8px",
                      padding: "8px",
                      cursor: "pointer",
                      color: "#ccc",
                      display: "flex",
                      alignItems: "center",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#dc2626")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#ccc")}
                  >
                    <Trash2 size={15} />
                  </button>
                )}
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: "6px",
                    background: u.role === "admin" ? "#1a1a1a" : "#f0f0f0",
                    color: u.role === "admin" ? "#fff" : "#999",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
