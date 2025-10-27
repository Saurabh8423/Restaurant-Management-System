import React, { useState, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import "./CartSummary.css";

export default function CartSummary({ cart, user, orderType, onPlaceOrder }) {
  const [swiped, setSwiped] = useState(false);
  const sliderRef = useRef(null);

  const handlers = useSwipeable({
    onSwipedRight: () => {
      if (!swiped) {
        setSwiped(true);
        onPlaceOrder();
        setTimeout(() => setSwiped(false), 1500);
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

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
            <div>
              Delivery at Home: {user?.address || "Current location fetching..."}
            </div>
            <div>Delivery in 42 mins</div>
          </>
        ) : (
          <div>Dining in restaurant</div>
        )}
      </div>

      <div className="swipe-track" {...handlers} ref={sliderRef}>
        <div className={`swipe-thumb ${swiped ? "swiped" : ""}`}>
          ➡
        </div>
        <span className={`swipe-text ${swiped ? "done" : ""}`}>
          {swiped ? "Order Placed!" : "Swipe to Order"}
        </span>
      </div>
    </div>
  );
}
