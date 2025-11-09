import React from "react";
import "./CategoryTabs.css";
import { FaHamburger, FaUtensils } from "react-icons/fa";
import { GiFullPizza, GiFrenchFries } from "react-icons/gi";
import { RiDrinksLine } from "react-icons/ri";
import { LuIceCreamBowl } from "react-icons/lu";

export default function CategoryTabs({ categories, selected, onSelect }) {
  const icons = {
    Burger: <FaHamburger size={20} />,
    Pizza: <GiFullPizza size={20} />,
    Drink: <RiDrinksLine size={20} />,
    "French fries": <GiFrenchFries size={20} />,
    Veggies: <LuIceCreamBowl size={20} />,
    Default: <FaUtensils size={20} />,
  };

  return (
    <div className="cat-tabs">
      {categories.length > 0 ? (
        categories.map((cat) => (
          <button
            key={cat}
            className={`cat-btn ${selected === cat ? "active" : ""}`}
            onClick={() => onSelect(cat)}
          >
            <div className="cat-icon">
              {/*  fallback icon for unknown categories */}
              {icons[cat] || icons.Default}
            </div>
            <span className="cat-label">{cat}</span>
          </button>
        ))
      ) : (
        <p className="loading">Loading...</p>
      )}
    </div>
  );
}
