import { useEffect, useState } from "react";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function buscarUsuarios() {
      try {
        const resposta = await fetch("https://jsonplaceholder.typicode.com/users");
        const dados = await resposta.json();
        setUsuarios(dados);
      } catch (erro) {
        console.log("Erro ao buscar usuarios:", erro);
      } finally {
        setLoading(false);
      }
    }
    buscarUsuarios();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            background: "linear-gradient(90deg, #e85d04, #fb8500)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px",
          }}
        >
          Usuarios
        </h1>
        <p style={{ color: "#888", fontSize: "1rem" }}>
          Dados consumidos da API JSONPlaceholder
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid #222",
              borderTopColor: "#e85d04",
              borderRadius: "50%",
              margin: "0 auto 16px",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "#888" }}>Carregando...</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {usuarios.map((user) => (
            <div
              key={user.id}
              style={{
                background: "#151515",
                border: "1px solid #222",
                borderRadius: "16px",
                padding: "24px",
                transition: "border-color 0.2s ease",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #e85d04, #fb8500)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: "16px",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                {user.name.charAt(0)}
              </div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: "12px",
                }}
              >
                {user.name}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "0.85rem", color: "#999" }}>
                  {user.email}
                </span>
                <span style={{ fontSize: "0.85rem", color: "#777" }}>
                  {user.address.city}
                </span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "#fb8500",
                    fontWeight: 500,
                  }}
                >
                  {user.company.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
