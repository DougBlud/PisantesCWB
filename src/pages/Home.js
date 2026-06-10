import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <section
        style={{
          position: "relative",
          textAlign: "center",
          padding: "80px 20px",
          borderRadius: "20px",
          overflow: "hidden",
          marginBottom: "40px",
          minHeight: "340px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="/banner-hero.jpg"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.7))",
            zIndex: 1,
          }}
        />
        <h1
          style={{
            position: "relative",
            zIndex: 2,
            fontSize: "clamp(2rem, 6vw, 2.8rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: "16px",
            color: "#fff",
          }}
        >
          Seu próximo pisante está aqui
        </h1>
        <p
          style={{
            position: "relative",
            zIndex: 2,
            fontSize: "clamp(0.95rem, 3vw, 1.1rem)",
            color: "rgba(255,255,255,0.85)",
            maxWidth: "460px",
            margin: "0 auto 32px",
            lineHeight: 1.6,
          }}
        >
          Estilo, conforto e qualidade. Encontre os melhores tênis das maiores marcas do mundo.
        </p>
        <Link
          to="/produtos"
          style={{
            position: "relative",
            zIndex: 2,
            display: "inline-block",
            background: "#fff",
            color: "#1a1a1a",
            padding: "14px 36px",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: "0.95rem",
            transition: "opacity 0.2s ease",
          }}
        >
          Ver produtos
        </Link>
      </section>

      <section>
        <h2
          style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            marginBottom: "20px",
            color: "#1a1a1a",
          }}
        >
          Por que a Pisantes CWB?
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {[
            { titulo: "100% Originais", desc: "Todos os produtos com nota fiscal e garantia do fabricante." },
            { titulo: "Envio rápido", desc: "Entregamos para todo o Brasil com rastreamento em tempo real." },
            { titulo: "Melhor preço", desc: "Preços competitivos e condições especiais de pagamento." },
          ].map((item) => (
            <div
              key={item.titulo}
              style={{
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#1a1a1a",
                  marginBottom: "6px",
                  margin: "0 0 6px",
                }}
              >
                {item.titulo}
              </h3>
              <p style={{ color: "#999", lineHeight: 1.6, fontSize: "0.88rem", margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
