import { useState } from "react";
import { cadastrarUsuario } from "../services/cadastroService";

function FormCadastro() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    idade: "",
    genero: "",
    aceiteTermos: false,
  });

  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await cadastrarUsuario(formData);
      setEnviado(true);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  function handleReset() {
    setFormData({
      nome: "",
      email: "",
      idade: "",
      genero: "",
      aceiteTermos: false,
    });
    setEnviado(false);
    setErro("");
  }

  const inputStyle = {
    padding: "12px 16px",
    border: "1px solid #333",
    borderRadius: "10px",
    fontSize: "0.95rem",
    width: "100%",
    boxSizing: "border-box",
    background: "#1a1a1a",
    color: "#f0f0f0",
    outline: "none",
    transition: "border-color 0.2s ease",
    fontFamily: "'Inter', sans-serif",
  };

  const labelStyle = {
    marginBottom: "6px",
    fontWeight: 500,
    fontSize: "0.9rem",
    color: "#ccc",
  };

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
  };

  if (enviado) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          background: "#151515",
          borderRadius: "20px",
          border: "1px solid #222",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #e85d04, #fb8500)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: "1.8rem",
            color: "#fff",
          }}
        >
          &#10003;
        </div>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "12px",
          }}
        >
          Cadastro realizado!
        </h2>
        <p style={{ color: "#999", marginBottom: "24px" }}>
          Olá, {formData.nome}! Seu e-mail {formData.email} foi registrado.
        </p>
        <button
          onClick={handleReset}
          style={{
            background: "linear-gradient(135deg, #e85d04, #fb8500)",
            color: "#fff",
            border: "none",
            padding: "12px 28px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.9rem",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Novo cadastro
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            background: "linear-gradient(90deg, #e85d04, #fb8500)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px",
          }}
        >
          Cadastro
        </h2>
        <p style={{ color: "#888", fontSize: "1rem" }}>
          Crie sua conta para acessar ofertas exclusivas
        </p>
      </div>

      {erro && (
        <div
          style={{
            background: "rgba(220, 38, 38, 0.1)",
            border: "1px solid rgba(220, 38, 38, 0.3)",
            borderRadius: "10px",
            padding: "12px 16px",
            marginBottom: "20px",
            color: "#f87171",
            fontSize: "0.9rem",
          }}
        >
          {erro}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#151515",
          border: "1px solid #222",
          borderRadius: "20px",
          padding: "32px",
        }}
      >
        <div style={fieldStyle}>
          <label htmlFor="nome" style={labelStyle}>
            Nome
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Seu nome completo"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="email" style={labelStyle}>
            E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="idade" style={labelStyle}>
            Idade
          </label>
          <input
            type="number"
            id="idade"
            name="idade"
            value={formData.idade}
            onChange={handleChange}
            min="1"
            max="120"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="genero" style={labelStyle}>
            Gênero
          </label>
          <select
            id="genero"
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Selecione...</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
            <option value="nao-informar">Prefiro não informar</option>
          </select>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "24px",
          }}
        >
          <input
            type="checkbox"
            id="aceiteTermos"
            name="aceiteTermos"
            checked={formData.aceiteTermos}
            onChange={handleChange}
            style={{
              width: "18px",
              height: "18px",
              accentColor: "#e85d04",
              cursor: "pointer",
            }}
          />
          <label htmlFor="aceiteTermos" style={{ color: "#999", fontSize: "0.9rem" }}>
            Aceito os termos de uso
          </label>
        </div>

        <button
          type="submit"
          disabled={carregando}
          style={{
            background: "linear-gradient(135deg, #e85d04, #fb8500)",
            color: "#fff",
            border: "none",
            padding: "14px 20px",
            borderRadius: "12px",
            cursor: carregando ? "not-allowed" : "pointer",
            fontWeight: 700,
            fontSize: "1rem",
            width: "100%",
            opacity: carregando ? 0.6 : 1,
            transition: "opacity 0.2s ease",
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "0.5px",
          }}
        >
          {carregando ? "Salvando..." : "Cadastrar"}
        </button>
      </form>

      <div
        style={{
          marginTop: "24px",
          padding: "20px",
          background: "#151515",
          border: "1px solid #222",
          borderRadius: "16px",
        }}
      >
        <h3
          style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#666",
            marginBottom: "12px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Estado do formulário (fins didáticos)
        </h3>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            color: "#fb8500",
            fontSize: "0.85rem",
            fontFamily: "monospace",
            margin: 0,
          }}
        >
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default FormCadastro;
