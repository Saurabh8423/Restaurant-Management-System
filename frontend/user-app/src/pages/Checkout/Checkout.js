import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import CartSummary from "../../components/CartSummary/CartSummary";
import CookInstructionsModal from "../../components/CookInstructionsModal/CookInstructionsModal";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("rms_cart")) || []);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("rms_user")) || {});
  const [orderType, setOrderType] = useState("Dine In");
  const [cookVisible, setCookVisible] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [tables, setTables] = useState([]);

  useEffect(() => {
    api
      .get("/tables")
      .then((res) => {
        const t = Array.isArray(res.data) ? res.data : res.data.tables || [];
        setTables(t);
      })
      .catch(() => {
        // fallback mock data if API fails
        setTables(
          Array.from({ length: 30 }, (_, i) => ({
            tableNumber: i + 1,
            size: [2, 4, 6, 8][i % 4],
            reserved: false,
          }))
        );
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("rms_cart", JSON.stringify(cart));
  }, [cart]);

  const updateQty = (id, delta) => {
    setCart((prev) => {
      const p = prev.find((x) => x.id === id);
      if (!p && delta > 0)
        return [...prev, { id, name: "Item", price: 0, qty: delta }];

      const updated = prev
        .map((x) =>
          x.id === id ? { ...x, qty: Math.max(0, x.qty + delta) } : x
        )
        .filter((x) => x.qty > 0);

      if (updated.length === 0) navigate("/");

      return updated;
    });
  };

  const computeTotals = () => {
    const itemsTotal = cart.reduce((s, c) => s + c.qty * c.price, 0);
    const delivery = orderType === "Take Away" ? 50 : 0;
    const taxes = 5;
    return { itemsTotal, delivery, taxes, grandTotal: itemsTotal + delivery + taxes };
  };

  const findTable = () => {
    const members = user?.members || 1;
    const sizes = [2, 4, 6, 8];
    for (const sz of sizes) {
      if (sz < members) continue;
      const found = tables.find((t) => t.size === sz && !t.reserved);
      if (found) return found;
    }
    return null;
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    if (orderType === "Dine In") {
      const table = findTable();
      if (!table) {
        alert("All tables are full — please wait");
        return;
      }

      // Mark locally reserved + try backend update
      setTables((prev) =>
        prev.map((t) =>
          t.tableNumber === table.tableNumber ? { ...t, reserved: true } : t
        )
      );
      try {
        await api.patch(`/tables/${table.tableNumber}`, { reserved: true });
      } catch (e) {
        console.warn("Table reservation failed, proceeding locally.");
      }
    }

    const payload = {
      items: cart,
      type: orderType,
      user,
      instructions,
      totals: computeTotals(),
      timestamp: new Date().toISOString(),
    };

    try {
      await api.post("/orders", payload);
    } catch (err) {
      console.error("Order creation failed:", err);
    } finally {
      setCart([]);
      localStorage.removeItem("rms_cart");
      navigate("/thankyou");
    }
  };

  return (
    <div className="checkout-shell">
      <h2>Cart</h2>

      <div className="cart-items">
        {cart.map((it) => (
          <div className="cart-item" key={it.id}>
            <div>
              <div className="ci-name">{it.name}</div>
              <div className="ci-price">₹{it.price}</div>
            </div>
            <div className="ci-controls">
              <button onClick={() => updateQty(it.id, -1)}>-</button>
              <span>{it.qty}</span>
              <button onClick={() => updateQty(it.id, +1)}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="order-type">
        <button
          className={orderType === "Dine In" ? "active" : ""}
          onClick={() => setOrderType("Dine In")}
        >
          Dine In
        </button>
        <button
          className={orderType === "Take Away" ? "active" : ""}
          onClick={() => setOrderType("Take Away")}
        >
          Take Away
        </button>
      </div>

      <div style={{ marginTop: 10 }}>
        <button className="btn" onClick={() => setCookVisible(true)}>
          Add cooking instructions
        </button>
      </div>

      {/* ✅ Show saved cooking instructions summary */}
      {instructions && (
        <div className="cook-summary">
          <strong>Cooking Instructions:</strong> {instructions}
        </div>
      )}

      <CartSummary
        cart={cart}
        user={user}
        orderType={orderType}
        onPlaceOrder={handlePlaceOrder}
      />

      <CookInstructionsModal
        visible={cookVisible}
        onClose={() => setCookVisible(false)}
        onSave={setInstructions}
      />
    </div>
  );
}
