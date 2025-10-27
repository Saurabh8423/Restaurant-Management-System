import React from "react";
import "./SearchBar.css";

export default function SearchBar({ value, onChange }) {
    return (
        <div className="search-wrap">
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="search-input"
                placeholder="Search"
            />
        </div>
    );
}
