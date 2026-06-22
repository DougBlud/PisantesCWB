# 👟 PisantesCWB (Sneaker Store)

Este é um projeto de marketplace de tênis desenvolvido com React no frontend e Node.js/Express no backend pelos alunos: 
- Douglas Henrque do Prado
- Pedro Henrique Hara Bialy
- Ryan D`Oliveira Lopes Figueredo
- Yasmim Egidio de Oliveira

## Como Executar o Projeto

1. **Instale as dependências:**
    ```bash
    npm install
    ```

2. **Inicie o servidor de desenvolvimento do frontend:**
    ```bash
    npm start
    ```

3. **Inicie o backend local (se necessário):**
    ```bash
    node server.js
    ```

4. A aplicação estará disponível em `http://localhost:3000` e o backend em `http://localhost:3001`.

---

## Fluxo de Autenticação

A autenticação é gerenciada pelo `AuthContext` em `src/contexts/AuthContext.js`.

- `login(email, senha)` faz a requisição para `POST /api/login` usando `apiPost`.
- O backend retorna um objeto com `token` e `user`.
- O `token` é armazenado em `localStorage` com a chave `token`.
- O usuário também é armazenado em `localStorage` com a chave `user`.
- O estado de autenticação é compartilhado pela aplicação via `AuthContext.Provider`.
- `logout()` remove o token e o usuário do `localStorage`.

O modal de autenticação está em `src/components/AuthModal.jsx`:

- exibe abas de `login` e `cadastro`
- valida campos do formulário antes de enviar
- chama `login()` ou `register()` do contexto

O backend trata autenticação em `server.js`:

- `POST /api/login` valida email e senha usando bcrypt
- gera um token JWT com `jwt.sign(...)`
- validações de token ocorrem no middleware `auth`

---

## Integração com API

A aplicação consome APIs REST usando `fetch` para operações de leitura e escrita.

### Página de produtos

- `src/pages/ProdutosPage.jsx` faz `fetch(API + "/api/produtos")` para carregar produtos.
- Os produtos retornados são exibidos dinamicamente em cards usando `ProdutoCard.jsx`.
- A lista é atualizada a cada montagem do componente.

### Admin e operações protegidas

- `src/pages/AdminPage.jsx` faz requisições protegidas com header `Authorization: Bearer ${token}`.
- Rotas utilizadas:
  - `GET /api/admin/usuarios` para listar usuários
  - `POST /api/admin/produtos` para criar produtos
  - `PUT /api/admin/produtos/:id` para editar produtos
  - `DELETE /api/admin/produtos/:id` para excluir produtos
  - `PUT /api/admin/usuarios/:userId` para alterar papel do usuário
  - `DELETE /api/admin/usuarios/:userId` para excluir usuário

### Serviços de API

- `src/services/api.js` define helpers de requisição `apiGet`, `apiPost` e `apiDelete`.
- Esses helpers incluem automaticamente o header `Authorization` quando o token estiver presente.

---

## Upload de Arquivo

O upload de imagens é feito no painel admin em `src/pages/AdminPage.jsx`.

- O formulário usa um `input type="file" multiple accept="image/*"`.
- As imagens são enviadas via `FormData` para a rota `POST /api/admin/produtos`.
- No backend, `server.js` usa `multer` para salvar as imagens em `public/uploads`.
- As URLs salvas são retornadas e usadas para exibir imagens do produto.

### Preview antes do envio

- O frontend gera previews usando `URL.createObjectURL(file)` ao selecionar arquivos.
- Os previews são exibidos antes do envio, permitindo confirmar as imagens.
- Ao enviar o formulário, os previews são limpos e a lista de produtos é recarregada.

---

## Arquitetura e arquivos principais

- `src/App.js` - configuração inicial da aplicação e provedores de contexto
- `src/contexts/AuthContext.js` - lógica de autenticação e token
- `src/pages/ProdutosPage.jsx` - listagem de produtos e consumo de API pública
- `src/pages/AdminPage.jsx` - painel admin, upload de imagens e ações protegidas
- `src/components/AuthModal.jsx` - interface de login/cadastro
- `src/components/ProdutoCard.jsx` - exibição de cada produto
- `src/services/api.js` - helpers de requisição com suporte a token
- `server.js` - backend Express com autenticação JWT e upload de imagens

