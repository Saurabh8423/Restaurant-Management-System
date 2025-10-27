import React from "react";
import "./CategoryTabs.css";

export default function CategoryTabs({ categories, selected, onSelect }) {
  return (
    <div className="cat-tabs">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`cat-btn ${selected === cat ? "active" : ""}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
