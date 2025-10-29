import React, { useState, useRef, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";
import "./CartSummary.css";

export default function CartSummary({ cart, setCart, user, orderType, onPlaceOrder }) {
  const [swiped, setSwiped] = useState(false);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  //  Update item quantity (add / remove)
  const updateQty = (id, delta) => {
    setCart((prev) => {
      const updated = prev
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
        )
        .filter((item) => item.qty > 0); // remove items with qty=0
      return updated;
    });
  };

  //  Calculate totals
  const itemsTotal = cart.reduce((s, c) => s + c.qty * c.price, 0);
  const delivery = orderType === "Take Away" ? 50 : 0;
  const taxes = 5;
  const grandTotal = itemsTotal + delivery + taxes;

  // Redirect if cart empty
  useEffect(() => {
    if (cart.length === 0) {
      setTimeout(() => navigate("/"), 300);
    }
  }, [cart, navigate]);

  //  Swipe to place order
  const handleOrder = () => {
    if (!swiped) {
      setSwiped(true);
      onPlaceOrder?.();
      setTimeout(() => setSwiped(false), 1500);
    }
  };

  const handlers = useSwipeable({
    onSwipedRight: handleOrder,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div className="summary-card">
      {/*  CART ITEMS SECTION */}
      <div className="cart-items">
        <h3>Your Cart</h3>
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-left">
              <span className="item-name">{item.name}</span>
              <span className="item-price">₹{item.price}</span>
            </div>
            <div className="cart-item-right">
              <button onClick={() => updateQty(item.id, -1)} className="qty-btn">
                −
              </button>
              <span className="qty">{item.qty}</span>
              <button onClick={() => updateQty(item.id, 1)} className="qty-btn">
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/*  PRICE SECTION */}
      <div className="price-section">
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
      </div>

      {/*  YOUR DETAILS */}
      <div className="your-details">
        <div className="yd-title">Your Details</div>
        <div className="yd-info">
          {user?.name} • {user?.phone}
        </div>
        <div className="user-line" />

        {orderType === "Take Away" ? (
          <div className="yd-extra">
            <div className="yd-row">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon-green"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>
                Delivery at Home — {user?.address || "Fetching location..."}
              </span>
            </div>

            <div className="yd-row">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon-green"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>
                Delivery in <strong>42 mins</strong>
              </span>
            </div>
          </div>
        ) : (
          <div className="yd-row">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon-green"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 21v-7a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v7" />
              <path d="M12 12V3" />
              <path d="M8 3h8" />
            </svg>
            <span>Dining in restaurant</span>
          </div>
        )}
      </div>

      {/*  SWIPE TO ORDER */}
      <div className="swipe-track" {...handlers} ref={sliderRef}>
        <div className={`swipe-thumb ${swiped ? "swiped" : ""}`}>➡</div>
        <span className={`swipe-text ${swiped ? "done" : ""}`}>
          {swiped ? "Order Placed!" : "Swipe to Order"}
        </span>
      </div>
    </div>
  );
}