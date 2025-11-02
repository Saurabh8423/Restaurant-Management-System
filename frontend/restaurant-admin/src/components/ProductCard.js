import React from "react";
import "./ProductCard.css";

export default function ProductCard({ item }) {
  const backendURL =
    process.env.REACT_APP_API_BASE_URL ||
    "https://restaurant-management-system-backend-8ku8.onrender.com";

  //  FIX: Attach backend URL before image path
  const imageUrl = item.image
    ? item.image.startsWith("http")
      ? item.image
      : `${backendURL}${item.image}`
    : "/placeholder.png";

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={imageUrl} alt={item.name || "Product"} />
      </div>
      <div className="product-details">
        <p><strong>Name:</strong> {item.name}</p>
        <p><strong>Price:</strong> ₹{item.price}</p>
        <p><strong>Category:</strong> {item.category}</p>
      </div>
    </div>
  );
}
