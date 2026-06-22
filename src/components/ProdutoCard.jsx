import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCarrinho } from "../contexts/CarrinhoContext";

export default function ProdutoCard({ tenis }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const [precoUSD, setPrecoUSD] = useState(null);
  const { requireAuth } = useAuth();
  const { addItem } = useCarrinho();

  useEffect(() => {
    async function converterMoeda() {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/BRL');
        const data = await res.json();
        const taxaUSD = data.rates.USD;
        
        const precoNumerico = parseFloat(tenis.preco.replace("R$ ", "").replace(".", "").replace(",", "."));
        setPrecoUSD((precoNumerico * taxaUSD).toFixed(2));
      } catch (err) {
        console.error("Erro ao converter moeda");
      }
    }
    converterMoeda();
  }, [tenis.preco]);

  const fotos = tenis.galeria || [tenis.imagem];

  function handleComprar() {
    requireAuth(() => addItem(tenis.id));
  }

  function prevImg(e) {
    e.stopPropagation();
    setImgIndex((prev) => (prev === 0 ? fotos.length - 1 : prev - 1));
  }

  function nextImg(e) {
    e.stopPropagation();
    setImgIndex((prev) => (prev === fotos.length - 1 ? 0 : prev + 1));
  }

  const arrowStyle = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(255,255,255,0.85)",
    border: "none",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.1rem",
    color: "#333",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    transition: "opacity 0.2s ease",
    opacity: hover ? 1 : 0,
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "#fff",
        borderRadius: "16px",
        overflow: "hidden",
        width: "100%",
        maxWidth: "340px",
        minWidth: "280px",
        flex: "1 1 300px",
        border: "1px solid #eee",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hover
          ? "0 16px 40px rgba(0,0,0,0.1)"
          : "0 2px 8px rgba(0,0,0,0.04)",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          position: "relative",
          background: "#f5f5f5",
          overflow: "hidden",
          height: "240px",
        }}
      >
        <img
          src={fotos[imgIndex]}
          alt={tenis.nome}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.4s ease",
            transform: hover ? "scale(1.03)" : "scale(1)",
          }}
        />

        {fotos.length > 1 && (
          <>
            <button onClick={prevImg} style={{ ...arrowStyle, left: "10px" }}>
              &#8249;
            </button>
            <button onClick={nextImg} style={{ ...arrowStyle, right: "10px" }}>
              &#8250;
            </button>
          </>
        )}

        {fotos.length > 1 && (
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "6px",
            }}
          >
            {fotos.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setImgIndex(i);
                }}
                style={{
                  width: i === imgIndex ? "20px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  border: "none",
                  background:
                    i === imgIndex ? "#1a1a1a" : "rgba(0,0,0,0.2)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: "20px" }}>
        <h3
          style={{
            fontSize: "1.05rem",
            fontWeight: 700,
            marginBottom: "6px",
            color: "#1a1a1a",
            margin: "0 0 6px",
          }}
        >
          {tenis.nome}
        </h3>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#888",
            lineHeight: 1.5,
            marginBottom: "16px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            margin: "0 0 16px",
          }}
        >
          {tenis.descricao}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "#1a1a1a",
              fontFamily: "'Quicksand', sans-serif",
            }}
          >
            {tenis.preco}
          </span>
          {precoUSD && <span style={{ fontSize: '0.8rem', color: '#999', fontWeight: 500 }}>
            (aprox. ${precoUSD})
          </span>}
          </div>
          <div style={{flex: 1, textAlign: 'right'}}>
          <button
            onClick={handleComprar}
            style={{
              background: "#1a1a1a",
              color: "#fff",
              border: "none",
              padding: "10px 22px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.85rem",
              fontFamily: "'Quicksand', sans-serif",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#333")}
            onMouseLeave={(e) => (e.target.style.background = "#1a1a1a")}
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
}
