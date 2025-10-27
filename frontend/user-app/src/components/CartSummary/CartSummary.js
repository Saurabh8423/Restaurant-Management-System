import React, { useRef, useState } from "react";
import "./CartSummary.css";

export default function CartSummary({ cart, user, orderType, onPlaceOrder }) {
  const [swiped, setSwiped] = useState(false);
  const swipeRef = useRef(null);

  const handleTouchMove = (e) => {
    const x = e.touches[0].clientX;
    if (x - swipeRef.current.getBoundingClientRect().left > 200) {
      setSwiped(true);
      onPlaceOrder();
    }
  };

  const handleTouchEnd = () => {
    if (!swiped) setSwiped(false);
  };

  const itemsTotal = cart.reduce((s, c) => s + c.qty * c.price, 0);
  const delivery = orderType === "Take Away" ? 50 : 0;
  const taxes = 5;
  const grandTotal = itemsTotal + delivery + taxes;

  return (
    <div className="summary-card">
      <div className="row">
        <span>Item Total</span>
        <span>₹{itemsTotal.toFixed(2)}</span>
      </div>

      {/* Show Delivery Charge only for Take Away */}
      {orderType === "Take Away" && (
        <div className="row">
          <span>Delivery Charge</span>
          <span>₹{delivery.toFixed(2)}</span>
        </div>
      )}

      <div className="row">
        <span>Taxes</span>
        <span>₹{taxes.toFixed(2)}</span>
      </div>

      <div className="row total">
        <strong>Grand Total</strong>
        <strong>₹{grandTotal.toFixed(2)}</strong>
      </div>

      <div className="your-details">
        <div className="yd-title">Your Details</div>
        <div>
          {user?.name} • {user?.phone}
        </div>

        {orderType === "Take Away" ? (
          <>
            <div>Delivery at Home: {user?.address || "Current location fetching..."}</div>
            <div>Delivery in 42 mins</div>
          </>
        ) : (
          <div>Dining in restaurant</div>
        )}
      </div>

      <div
        className={`swipe-container ${swiped ? "done" : ""}`}
        ref={swipeRef}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="swipe-arrow">👉 Swipe to Order</div>
      </div>
    </div>
  );
}
