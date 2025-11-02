import React, { useEffect, useState, useMemo } from "react";
import API from "../api/axios";
import AddProduct from "../components/AddProduct";
import ProductCard from "../components/ProductCard";
import "./AdminMenu.css";
import { useSearch } from "../context/SearchContext";

export default function AdminMenu() {
  const { searchTerm } = useSearch();
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/menu");
      setProducts(res.data?.menu || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    return products.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, products]);

  const handleProductAdded = () => {
    setShowModal(false);
    fetchProducts(); // Refresh after adding product
  };

  return (
    <div className="menu-container">
      <div className={`menu-page ${showModal ? "blur-bg" : ""}`}>
        <div className="menu-header">
          <h2>Product Menu</h2>
          <button className="add-btn" onClick={() => setShowModal(true)}>
            Add Product
          </button>
        </div>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="empty">No products found for "{searchTerm}"</p>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((item) => (
              <ProductCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AddProduct
          onClose={() => setShowModal(false)}
          onProductAdded={handleProductAdded}
        />
      )}
    </div>
  );
}
