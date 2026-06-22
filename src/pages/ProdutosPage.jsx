import { useState, useEffect } from "react";
import ProdutoCard from "../components/ProdutoCard";
import { tenis } from "../components/tenis";

const API = "http://localhost:3001";

export default function ProdutosPage() {
  const [produtosBanco, setProdutosBanco] = useState([]);

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch(API + "/api/produtos");
        const data = await res.json();
        setProdutosBanco(data);
      } catch {
        // servidor offline, mostra so os locais
      }
    }
    carregar();
  }, []);

  // Converte produtos do banco pro mesmo formato
  const produtosDB = produtosBanco.map((p) => ({
    id: p.id + 1000, // offset para nao colidir com IDs locais
    nome: p.nome,
    preco: p.preco,
    descricao: p.descricao,
    imagem: p.imagens[0] ? `${API}${p.imagens[0]}` : "",
    galeria: p.imagens.map((img) => `${API}${img}`),
  }));

  const todosProdutos = [...tenis, ...produtosDB];

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: 700,
            color: "#1a1a1a",
            marginBottom: "6px",
          }}
        >
          Nossos tênis
        </h1>
        <p style={{ color: "#999", fontSize: "0.95rem", margin: 0 }}>
          Encontre o par perfeito para o seu estilo
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "24px",
        }}
      >
        {todosProdutos.map((item) => (
          <ProdutoCard key={item.id} tenis={item} />
        ))}
      </div>
    </div>
  );
}
