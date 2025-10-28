
import React from "react";
import "./CategoryTabs.css";
import {
  FaHamburger,
  FaPizzaSlice,
  FaGlassWhiskey,
  FaCarrot,
  FaUtensils,
} from "react-icons/fa";

export default function Categorymenu({ categories, selected, onSelect }) {
  const icons = {
    Burger: <FaHamburger size={20} />,
    Pizza: <FaPizzaSlice size={20} />,
    Drink: <FaGlassWhiskey size={20} />,
    "French fries": <FaUtensils size={20} />, 
    Veggies: <FaCarrot size={20} />,
  };

  return (
    <div className="cat-tabs">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`cat-btn ${selected === cat ? "active" : ""}`}
          onClick={() => onSelect(cat)}
        >
          <div className="cat-icon">{icons[cat]}</div>
          <span className="cat-label">{cat}</span>
        </button>
      ))}
    </div>
  );
}
