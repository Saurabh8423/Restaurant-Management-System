import React from "react";
import "./FoodCard.css";

export default function FoodCard({ item, qty, onChangeQty }) {
    return (
        <div className="food-card">
            <div className="food-image">{/* placeholder image area */}</div>
            <div className="food-body">
                <div className="food-title">{item.name}</div>
                <div className="food-sub">
                    <div className="food-price">₹{item.price}</div>
                    <div className="food-actions">
                        {qty > 0 ? (
                            <>
                                <button className="btn-qty" onClick={() => onChangeQty(item, -1)}>-</button>
                                <span className="qty">{qty}</span>
                                <button className="btn-qty" onClick={() => onChangeQty(item, +1)}>+</button>
                            </>
                        ) : (
                            <button className="btn-add" onClick={() => onChangeQty(item, +1)}>＋</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
