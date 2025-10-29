import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import CartSummary from "../../components/CartSummary/CartSummary";
import CookInstructionsModal from "../../components/CookInstructionsModal/CookInstructionsModal";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("rms_cart")) || []);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("rms_user")) || {});
  const [orderType, setOrderType] = useState("Dine In");
  const [cookVisible, setCookVisible] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [tables, setTables] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/tables")
      .then((res) => {
        const t = Array.isArray(res.data) ? res.data : res.data.tables || [];
        setTables(t);
      })
      .catch(() => {
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
    return {
      itemsTotal,
      delivery,
      taxes,
      grandTotal: itemsTotal + delivery + taxes,
    };
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
    if (cart.length === 0) return alert("Your cart is empty!");

    let tableNumber = null;
    if (orderType === "Dine In") {
      const table = findTable();
      if (!table) return alert("All tables are full. Please wait.");
      tableNumber = table.tableNumber;
      setTables((prev) =>
        prev.map((t) =>
          t.tableNumber === table.tableNumber ? { ...t, reserved: true } : t
        )
      );
      try {
        await api.patch(`/tables/${table.tableNumber}`, { reserved: true });
      } catch {
        console.warn("Table reservation failed, proceeding locally.");
      }
    }

    const totals = computeTotals();
    const orderData = {
      orderId: `ODR-${Date.now()}`,
      type: orderType === "Take Away" ? "Takeaway" : "Dine In",
      tableNumber,
      items: cart.map((item) => ({
        name: item.name,
        quantity: item.qty,
        price: item.price,
        image: item.image || "",
      })),
      totalAmount: totals.grandTotal,
      clientName: user?.name || "Guest",
      phoneNumber: user?.phone || "N/A",
      address: orderType === "Take Away" ? user?.address || "N/A" : "Restaurant",
      instructions,
      totals,
      user,
    };

    try {
      const res = await api.post("/orders", orderData);
      if (res.status === 201 || res.status === 200) {
        alert("Order placed successfully!");
        localStorage.removeItem("rms_cart");
        setCart([]);
        navigate("/thankyou");
      }
    } catch (err) {
      console.error("Order creation failed:", err);
      alert("Could not place order. Try again.");
    }
  };

  return (
    <div className="checkout-shell">
      <header className="home-header">
        <div className="greet">
          <div className="greet-large">
            Good{" "}
            {(() => {
              const h = new Date().getHours();
              if (h < 12) return "morning";
              if (h < 17) return "afternoon";
              return "evening";
            })()}
          </div>
          <div className="greet-small">Place your order here</div>
        </div>
      </header>

      <SearchBar value={search} onChange={setSearch} />

      <div className="cart-items">
        {cart.map((it) => (
          <div className="cart-item" key={it.id}>
            <div className="cart-img">
              <img
                src={
                  it.image?.startsWith("http")
                    ? it.image
                    : `https://restaurant-management-system-backend-8ku8.onrender.com${it.image}`
                }
                alt={it.name}
              />
            </div>
            <div className="cart-info">
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

      <CartSummary cart={cart} setCart={setCart} user={user} orderType={orderType} onPlaceOrder={handlePlaceOrder} />

      <CookInstructionsModal
        visible={cookVisible}
        onClose={() => setCookVisible(false)}
        onSave={setInstructions}
      />
    </div>
  );
}
