import { useState, useEffect } from "react";
import { CreditCard, CheckCircle, ShoppingBag } from "lucide-react";
import { useCarrinho } from "../contexts/CarrinhoContext";
import { tenis } from "./tenis";

const API = "http://localhost:3001";

export default function CarrinhoModal() {
  const { items, removeItem, showCart, setShowCart, clearCart } = useCarrinho();
  const [produtosBanco, setProdutosBanco] = useState([]);
  const [etapa, setEtapa] = useState("carrinho"); // carrinho | pagamento | sucesso
  const [cardData, setCardData] = useState({ numero: "", nome: "", validade: "", cvv: "" });
  const [processando, setProcessando] = useState(false);
  const [endereco, setEndereco] = useState({ cep: "", logradouro: "", bairro: "", localidade: "", uf: "" });

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch(API + "/api/produtos");
        const data = await res.json();
        setProdutosBanco(data);
      } catch {}
    }
    if (showCart) {
      carregar();
      setEtapa("carrinho");
    }
  }, [showCart]);

  if (!showCart) return null;

  function getProduto(produtoId) {
    const local = tenis.find((t) => t.id === produtoId);
    if (local) return local;
    const dbProduto = produtosBanco.find((p) => p.id + 1000 === produtoId);
    if (dbProduto) {
      return {
        id: dbProduto.id + 1000,
        nome: dbProduto.nome,
        preco: dbProduto.preco,
        imagem: dbProduto.imagens[0] ? `${API}${dbProduto.imagens[0]}` : "",
      };
    }
    return null;
  }

  const total = items.reduce((sum, item) => {
    const produto = getProduto(item.produtoId);
    if (!produto) return sum;
    const preco = parseFloat(
      produto.preco.replace("R$ ", "").replace(".", "").replace(",", ".")
    );
    return sum + preco * item.quantidade;
  }, 0);

  function formatCardNumber(value) {
    const nums = value.replace(/\D/g, "").slice(0, 16);
    return nums.replace(/(.{4})/g, "$1 ").trim();
  }

  function formatValidade(value) {
    const nums = value.replace(/\D/g, "").slice(0, 4);
    if (nums.length > 2) return nums.slice(0, 2) + "/" + nums.slice(2);
    return nums;
  }

  async function handleBuscaCep(e) {
    const cep = e.target.value.replace(/\D/g, "");
    setEndereco(prev => ({ ...prev, cep: e.target.value }));

    if (cep.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) {
        console.error("CEP não encontrado");
        return;
      }
      setEndereco(prev => ({
        ...prev, logradouro: data.logradouro, bairro: data.bairro, localidade: data.localidade, uf: data.uf
      }));
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  }

  async function handlePagar(e) {
    e.preventDefault();
    setProcessando(true);
    // Simula processamento
    await new Promise((r) => setTimeout(r, 1500));
    setProcessando(false);
    setEtapa("sucesso");
    setCardData({ numero: "", nome: "", validade: "", cvv: "" });
    if (clearCart) clearCart();
  }

  function handleFechar() {
    setShowCart(false);
    setEtapa("carrinho");
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
    minWidth: 0,
  };

  return (
    <div
      onClick={handleFechar}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "420px",
          maxHeight: "90vh",
          background: "#fff",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 28px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxSizing: "border-box",
            width: "100%",
          }}
        >
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
            {etapa === "carrinho" && "Carrinho"}
            {etapa === "pagamento" && "Pagamento"}
            {etapa === "sucesso" && "Pedido confirmado"}
          </h2>
          <button
            onClick={handleFechar}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#999",
              padding: "4px",
            }}
          >
            &times;
          </button>
        </div>

        {/* Etapa: Carrinho */}
        {etapa === "carrinho" && (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px", boxSizing: "border-box", width: "100%" }}>
              {items.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
                  <ShoppingBag size={40} strokeWidth={1.2} style={{ marginBottom: "12px", color: "#ddd" }} />
                  <p>Seu carrinho está vazio</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {items.map((item) => {
                    const produto = getProduto(item.produtoId);
                    if (!produto) return null;
                    return (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          gap: "14px",
                          alignItems: "center",
                          padding: "14px",
                          background: "#fafafa",
                          borderRadius: "14px",
                        }}
                      >
                        {produto.imagem && (
                          <img
                            src={produto.imagem}
                            alt={produto.nome}
                            style={{
                              width: "64px",
                              height: "64px",
                              objectFit: "cover",
                              borderRadius: "10px",
                            }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 600, color: "#1a1a1a", fontSize: "0.9rem", margin: "0 0 4px" }}>
                            {produto.nome}
                          </p>
                          <p style={{ color: "#888", fontSize: "0.8rem", margin: 0 }}>
                            Qtd: {item.quantidade} &middot; {produto.preco}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.produtoId)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#ccc",
                            fontSize: "1.2rem",
                            cursor: "pointer",
                            padding: "4px 8px",
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div style={{ padding: "20px 28px", borderTop: "1px solid #f0f0f0", boxSizing: "border-box", width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                  <span style={{ fontWeight: 600, color: "#1a1a1a" }}>Total</span>
                  <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "#1a1a1a" }}>
                    R$ {total.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <button
                  onClick={() => setEtapa("pagamento")}
                  style={{
                    width: "100%",
                    background: "#1a1a1a",
                    color: "#fff",
                    border: "none",
                    padding: "14px",
                    borderRadius: "12px",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    fontFamily: "'Quicksand', sans-serif",
            boxSizing: "border-box",
                  }}
                >
                  Finalizar pedido
                </button>
              </div>
            )}
          </>
        )}

        {/* Etapa: Pagamento */}
        {etapa === "pagamento" && (
          <form onSubmit={handlePagar} style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", boxSizing: "border-box", width: "100%" }}>
            <div style={{ flex: 1, padding: "28px", overflowY: "auto", boxSizing: "border-box", width: "100%" }}>
              <div
                style={{
                  background: "#fafafa",
                  borderRadius: "14px",
                  padding: "20px",
                  marginBottom: "24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  boxSizing: "border-box",
                  width: "100%",
                }}
              >
                <CreditCard size={20} color="#999" />
                <div>
                  <p style={{ fontWeight: 600, color: "#1a1a1a", fontSize: "0.9rem", margin: 0 }}>
                    Total a pagar
                  </p>
                  <p style={{ fontWeight: 700, fontSize: "1.2rem", color: "#1a1a1a", margin: "4px 0 0" }}>
                    R$ {total.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </div>

              <div style={{ borderTop: "1px solid #f0f0f0", margin: "24px 0", paddingTop: "24px", boxSizing: "border-box", width: "100%" }}>
                <p style={{ fontWeight: 600, color: "#1a1a1a", fontSize: "0.9rem", margin: "0 0 14px" }}>
                  Endereço de entrega
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", boxSizing: "border-box", width: "100%" }}>
                  <input
                    type="text"
                    placeholder="CEP"
                    value={endereco.cep}
                    onChange={(e) => setEndereco({ ...endereco, cep: e.target.value })}
                    onBlur={handleBuscaCep}
                    style={inputStyle}
                    maxLength={9}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Rua, Avenida..."
                    value={endereco.logradouro}
                    onChange={(e) => setEndereco({ ...endereco, logradouro: e.target.value })}
                    style={inputStyle}
                    required
                  />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", boxSizing: "border-box", width: "100%" }}>
                    <input
                      type="text"
                      placeholder="Bairro"
                      value={endereco.bairro}
                      onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })}
                      style={{...inputStyle, flex: "2 1 100px"}}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Nº"
                      style={{...inputStyle, flex: "1 1 60px"}}
                      required
                    />
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", boxSizing: "border-box", width: "100%" }}>
                    <input type="text" placeholder="Cidade" value={endereco.localidade} onChange={(e) => setEndereco({ ...endereco, localidade: e.target.value })} style={{...inputStyle, flex: "2 1 100px"}} required />
                    <input type="text" placeholder="UF" value={endereco.uf} onChange={(e) => setEndereco({ ...endereco, uf: e.target.value })} style={{...inputStyle, flex: "1 1 60px"}} required />
                  </div>
                </div>
              </div>

              <div style={{ borderTop: "1px solid #f0f0f0", margin: "24px 0", paddingTop: "24px", boxSizing: "border-box", width: "100%" }}>
                <p style={{ fontWeight: 600, color: "#1a1a1a", fontSize: "0.9rem", margin: "0 0 14px" }}>
                  Dados do Cartão
                </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", boxSizing: "border-box", width: "100%" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "#888", fontWeight: 600, marginBottom: "6px", display: "block" }}>
                    Número do cartão
                  </label>
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={cardData.numero}
                    onChange={(e) => setCardData({ ...cardData, numero: formatCardNumber(e.target.value) })}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "#888", fontWeight: 600, marginBottom: "6px", display: "block" }}>
                    Nome no cartão
                  </label>
                  <input
                    type="text"
                    placeholder="Nome como está no cartão"
                    value={cardData.nome}
                    onChange={(e) => setCardData({ ...cardData, nome: e.target.value })}
                    style={inputStyle}
                    required
                  />
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", boxSizing: "border-box", width: "100%" }}>
                  <div style={{ flex: "1 1 100px", minWidth: 0 }}>
                    <label style={{ fontSize: "0.8rem", color: "#888", fontWeight: 600, marginBottom: "6px", display: "block" }}>
                      Validade
                    </label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      value={cardData.validade}
                      onChange={(e) => setCardData({ ...cardData, validade: formatValidade(e.target.value) })}
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div style={{ flex: "1 1 100px", minWidth: 0 }}>
                    <label style={{ fontSize: "0.8rem", color: "#888", fontWeight: 600, marginBottom: "6px", display: "block" }}>
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>
              </div>
              </div>
            </div>

            <div style={{ padding: "20px 28px", borderTop: "1px solid #f0f0f0", display: "flex", gap: "10px", boxSizing: "border-box", width: "100%" }}>
              <button
                type="button"
                onClick={() => setEtapa("carrinho")}
                style={{
                  flex: 1,
                  background: "none",
                  border: "1px solid #ddd",
                  padding: "14px",
                  borderRadius: "12px",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  color: "#888",
                  fontFamily: "'Quicksand', sans-serif",
                  boxSizing: "border-box",
                }}
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={processando}
                style={{
                  flex: 2,
                  background: "#1a1a1a",
                  color: "#fff",
                  border: "none",
                  padding: "14px",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: processando ? "not-allowed" : "pointer",
                  opacity: processando ? 0.6 : 1,
                  fontFamily: "'Quicksand', sans-serif",
                  boxSizing: "border-box",
                }}
              >
                {processando ? "Processando..." : "Pagar"}
              </button>
            </div>
          </form>
        )}

        {/* Etapa: Sucesso */}
        {etapa === "sucesso" && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "28px", boxSizing: "border-box", width: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <CheckCircle size={56} color="#16a34a" strokeWidth={1.5} style={{ marginBottom: "20px" }} />
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "8px" }}>
                Compra finalizada!
              </h3>
              <p style={{ color: "#888", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "28px" }}>
                Seu pedido foi confirmado com sucesso. Você receberá um e-mail com os detalhes.
              </p>
              <button
                onClick={handleFechar}
                style={{
                  background: "#1a1a1a",
                  color: "#fff",
                  border: "none",
                  padding: "14px 32px",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  fontFamily: "'Quicksand', sans-serif",
                  boxSizing: "border-box",
                }}
              >
                Continuar comprando
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
