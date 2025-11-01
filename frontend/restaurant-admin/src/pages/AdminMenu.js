import React, { useEffect, useState } from "react";
import API from "../api/axios";
import AddProduct from "../components/AddProduct";
import ProductCard from "../components/ProductCard";
import "./AdminMenu.css";

export default function AdminMenu() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/menu");
      // assume API returns array; fallback safe-check
      setProducts(Array.isArray(res.data) ? res.data : res.data?.menu || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductAdded = () => {
    // close modal and refresh product list
    setShowModal(false);
    fetchProducts();
  };

  return (
    <div className={`menu-page ${showModal ? "blur-bg" : ""}`}>
      <div className="menu-header">
        <h2>Products</h2>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Add Product
        </button>
      </div>

      {loading ? (
        <p className="loading">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="empty">No products found.</p>
      ) : (
        <div className="product-grid">
          {products.map((item) => (
            <ProductCard key={item._id || item.id} item={item} />
          ))}
        </div>
      )}

      {showModal && (
        <AddProduct onClose={() => setShowModal(false)} onProductAdded={handleProductAdded} />
      )}
    </div>
  );
}
