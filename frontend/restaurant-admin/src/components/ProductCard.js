import React from "react";
import "./ProductCard.css";

export default function ProductCard({ item }) {
  return (
    <div className="product-card">
      <div className="image-box">
        {item.image ? (
          // If image is a URL or path served from backend
          <img src={item.image.startsWith("http") ? item.image : item.image} alt={item.name} />
        ) : (
          <div className="no-img">No Image</div>
        )}
      </div>

      <div className="info">
        <h4 className="pname">{item.name}</h4>
        <p className="pdesc">{item.description}</p>
        <div className="meta">
          <span>₹{item.price}</span>
          <span>{item.category}</span>
          <span>{item.rating || 0}★</span>
        </div>
      </div>
    </div>
  );
}
