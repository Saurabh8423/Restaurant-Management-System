import React from "react";
import "./ProductCard.css";

export default function ProductCard({ item }) {
  const BASE_URL = "https://restaurant-management-system-backend-8ku8.onrender.com";

  const imageSrc = item?.image
    ? item.image.startsWith("http")
      ? item.image
      : `${BASE_URL}${item.image.startsWith("/") ? item.image : "/" + item.image}`
    : "/default-food.png";

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={imageSrc} alt={item.name || "Food"} onError={(e) => (e.target.src = "/default-food.png")} />
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
