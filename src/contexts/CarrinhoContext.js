import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiGet, apiPost, apiDelete } from "../services/api";
import { useAuth } from "./AuthContext";

const CarrinhoContext = createContext();

export function CarrinhoProvider({ children }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const carregarCarrinho = useCallback(async () => {
    if (!token) {
      setItems([]);
      return;
    }
    try {
      const data = await apiGet("/api/cart", token);
      if (Array.isArray(data)) setItems(data);
    } catch {
      // servidor offline
    }
  }, [token]);

  useEffect(() => {
    carregarCarrinho();
  }, [carregarCarrinho]);

  async function addItem(produtoId) {
    if (!token) return;
    await apiPost("/api/cart", { produtoId }, token);
    await carregarCarrinho();
    setShowCart(true);
  }

  async function removeItem(produtoId) {
    if (!token) return;
    await apiDelete(`/api/cart/${produtoId}`, token);
    await carregarCarrinho();
  }

  async function clearCart() {
    if (!token) return;
    for (const item of items) {
      await apiDelete(`/api/cart/${item.produtoId}`, token);
    }
    setItems([]);
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantidade, 0);

  return (
    <CarrinhoContext.Provider
      value={{ items, addItem, removeItem, clearCart, totalItems, showCart, setShowCart }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  return useContext(CarrinhoContext);
}
