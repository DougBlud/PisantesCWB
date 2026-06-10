import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CarrinhoProvider } from "./contexts/CarrinhoContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ProdutosPage from "./pages/ProdutosPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CarrinhoProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="produtos" element={<ProdutosPage />} />
              <Route path="admin" element={<AdminPage />} />
            </Route>
          </Routes>
        </CarrinhoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
