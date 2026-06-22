require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "pisantes-cwb-secret-2026";

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// ── Upload config ──
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "public/uploads")),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ── Middleware auth ──
function auth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Token não fornecido" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}

function adminOnly(req, res, next) {
  if (req.userRole !== "admin") {
    return res.status(403).json({ error: "Acesso restrito a administradores" });
  }
  next();
}

// ── Cadastro ──
app.post("/api/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Preencha todos os campos" });
    }
    const existe = await prisma.user.findUnique({ where: { email } });
    if (existe) return res.status(400).json({ error: "E-mail já cadastrado" });
    const hash = await bcrypt.hash(senha, 10);
    const user = await prisma.user.create({
      data: { nome, email, senha: hash },
    });
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, nome: user.nome, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao cadastrar" });
  }
});

// ── Login ──
app.post("/api/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Credenciais inválidas" });
    const ok = await bcrypt.compare(senha, user.senha);
    if (!ok) return res.status(400).json({ error: "Credenciais inválidas" });
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, nome: user.nome, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

// ── Produtos (publico) ──
app.get("/api/produtos", async (req, res) => {
  const produtos = await prisma.produto.findMany({ orderBy: { createdAt: "desc" } });
  res.json(produtos);
});

// ── Admin: criar produto com upload de imagens ──
app.post("/api/admin/produtos", auth, adminOnly, upload.array("imagens", 5), async (req, res) => {
  try {
    const { nome, preco, descricao } = req.body;
    const imagens = req.files.map((f) => `/uploads/${f.filename}`);
    const produto = await prisma.produto.create({
      data: { nome, preco, descricao, imagens },
    });
    res.json(produto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

// ── Admin: deletar produto ──
app.delete("/api/admin/produtos/:id", auth, adminOnly, async (req, res) => {
  await prisma.produto.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ ok: true });
});

// ── Admin: editar produto ──
app.put("/api/admin/produtos/:id", auth, adminOnly, upload.array("imagens", 5), async (req, res) => {
  try {
    const { nome, preco, descricao } = req.body;
    const data = { nome, preco, descricao };
    if (req.files && req.files.length > 0) {
      data.imagens = req.files.map((f) => `/uploads/${f.filename}`);
    }
    const produto = await prisma.produto.update({
      where: { id: parseInt(req.params.id) },
      data,
    });
    res.json(produto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao editar produto" });
  }
});

// ── Admin: listar usuarios ──
app.get("/api/admin/usuarios", auth, adminOnly, async (req, res) => {
  const usuarios = await prisma.user.findMany({
    select: { id: true, nome: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(usuarios);
});

// ── Admin: editar usuario (role) ──
app.put("/api/admin/usuarios/:id", auth, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { role },
      select: { id: true, nome: true, email: true, role: true, createdAt: true },
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao editar usuário" });
  }
});

// ── Admin: deletar usuario ──
app.delete("/api/admin/usuarios/:id", auth, adminOnly, async (req, res) => {
  await prisma.cartItem.deleteMany({ where: { userId: parseInt(req.params.id) } });
  await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ ok: true });
});

// ── Carrinho ──
app.get("/api/cart", auth, async (req, res) => {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.userId },
  });
  res.json(items);
});

app.post("/api/cart", auth, async (req, res) => {
  const { produtoId } = req.body;
  const item = await prisma.cartItem.upsert({
    where: { userId_produtoId: { userId: req.userId, produtoId } },
    update: { quantidade: { increment: 1 } },
    create: { userId: req.userId, produtoId, quantidade: 1 },
  });
  res.json(item);
});

app.delete("/api/cart/:produtoId", auth, async (req, res) => {
  await prisma.cartItem.deleteMany({
    where: { userId: req.userId, produtoId: parseInt(req.params.produtoId) },
  });
  res.json({ ok: true });
});

// ── Criar pasta uploads se nao existir ──
const fs = require("fs");
const uploadsDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
