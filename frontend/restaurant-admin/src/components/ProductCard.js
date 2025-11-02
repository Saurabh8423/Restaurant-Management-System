import React from "react";
import "./ProductCard.css";

export default function ProductCard({ item }) {
  const backendURL =
    process.env.REACT_APP_API_BASE_URL ||
    "https://restaurant-management-system-backend-8ku8.onrender.com";

  const imageUrl = item.image
    ? item.image.startsWith("http")
      ? item.image
       : item.image.startsWith("/uploads/")
      ? `${backendURL}${item.image}`
      : `${backendURL}/uploads/${item.image}`
    : "/placeholder.png";

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={imageUrl} alt={item.name || "Product"} />
      </div>

      <div className="product-details">
        <p><strong>Name:</strong> {item.name}</p>
        <p><strong>Description:</strong> {item.description}</p>
        <p><strong>Price:</strong> ₹{item.price}</p>
        <p><strong>Category:</strong> {item.category}</p>
        <p><strong>Prep Time:</strong> {item.averagePreparationTime}</p>

        {item.stock > 0 && <p><strong>Stock:</strong> {item.stock}</p>}

        {item.rating > 0 && <p><strong>Rating:</strong> ⭐ {item.rating}</p>}
      </div>
    </div>
  );
}
