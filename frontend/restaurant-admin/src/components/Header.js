import React from "react";
import "./Header.css";
import logo from "../Assets/Restaurant-Logo.png";

export default function Header() {
  return (
    <header className="header-bar">
      <div className="header-left">
        <img src={logo} alt="Restaurant Logo" className="header-logo" />
        <div className="search-wrap">
          <input className="search-input" placeholder="Filter..." />
        </div>
      </div>
    </header>
  );
}
