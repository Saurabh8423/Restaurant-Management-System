import React, { useEffect, useState, useRef } from "react";
import api from "../../api/axios";
import CategoryTabs from "../../components/CategoryTabs/CategoryTabs";
import SearchBar from "../../components/SearchBar/SearchBar";
import FoodCard from "../../components/FoodCard/FoodCard";
import DetailsModal from "../../components/DetailsModal/DetailsModal";
// import ITEMS from "../../data/items";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const CATEGORIES = ["Burger", "Pizza", "Drink", "Fries", "Veggies"];

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("rms_user")) || null);
  const [showDetails, setShowDetails] = useState(!user);
  const [selected, setSelected] = useState("Pizza");
  const [items, setItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("rms_cart")) || []);
  const perPage = 8;
  const listRef = useRef();

  useEffect(() => {
    api.get("/menu")
      .then(res => {
        const data = res.data.menu || [];
        setItems(data);
        setVisibleItems(data.filter(i => i.category === selected).slice(0, perPage));
      })
      .catch(err => console.error("Error fetching menu:", err));
  }, []);

  useEffect(() => {
    const filtered = items.filter(
      i => i.category === selected && i.name.toLowerCase().includes(search.toLowerCase())
    );
    setVisibleItems(filtered.slice(0, perPage));
  }, [selected, items, search]);

  useEffect(() => {
    localStorage.setItem("rms_cart", JSON.stringify(cart));
  }, [cart]);

  const onAdd = (item, delta) => {
    setCart(prev => {
      const exists = prev.find(p => p.id === item._id);
      if (exists) {
        return prev
          .map(p => p.id === item._id ? { ...p, qty: Math.max(0, p.qty + delta) } : p)
          .filter(p => p.qty > 0);
      } else if (delta > 0) {
        return [...prev, { id: item._id, name: item.name, price: item.price, qty: delta }];
      }
      return prev;
    });
  };

  const qtyOf = (id) => cart.find(c => c.id === id)?.qty || 0;

  const loadMore = () => {
    const filtered = items.filter(
      i => i.category === selected && i.name.toLowerCase().includes(search.toLowerCase())
    );
    const next = filtered.slice(visibleItems.length, visibleItems.length + perPage);
    if (next.length) setVisibleItems(v => [...v, ...next]);
  };

  const onScroll = (e) => {
    const el = e.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 120) loadMore();
  };

  const handleDetailsSave = (u) => {
    setUser(u);
    setShowDetails(false);
  };

  return (
    <div className="home-shell">
      <DetailsModal visible={showDetails} onSave={handleDetailsSave} />

      <header className="home-header">
        <div className="greet">
          <div className="greet-large">Good {(() => {
            const h = new Date().getHours();
            if (h < 12) return "morning";
            if (h < 17) return "afternoon";
            return "evening";
          })()}</div>
          <div className="greet-small">Place your order here</div>
        </div>
      </header>

      <div className="search-row">
        <SearchBar value={search} onChange={setSearch} />
        <div className="cart-total">₹{cart.reduce((s, c) => s + c.qty * c.price, 0)}</div>
      </div>

      <CategoryTabs categories={CATEGORIES} selected={selected} onSelect={setSelected} />

      <div className="category-title">{selected}</div>

      <div className="items-grid" onScroll={onScroll}>
        {visibleItems.map(it => (
          <FoodCard
            key={it._id}
            item={{
              ...it,
              image: it.image ? `http://localhost:5000${it.image}` : "/no-image.png"
            }}
            qty={qtyOf(it._id)}
            onChangeQty={onAdd}
          />
        ))}
      </div>

      <div className="next-fixed">
        <button className="btn-next" onClick={() => navigate("/checkout")}>Next</button>
      </div>
    </div>
  );
}
