import React from "react";
import "./OrderCard.css";

export default function OrderCard({ order, onUpdate }) {
    return (
        <div className="order-card">
            <div className="order-head">
                <strong>#{order.orderId || order._id}</strong>
                <span className={`badge ${order.status}`}>{order.status}</span>
            </div>
            <div className="order-body">
                <div className="order-info">
                    <small>Type: {order.type || order.orderType}</small>
                    <small>Items: {order.items?.length || 0}</small>
                </div>
                <ul className="order-items">
                    {(order.items || []).map((it, i) => (
                        <li key={i}>{it.quantity} x {it.name || it}</li>
                    ))}
                </ul>
                <div className="order-actions">
                    <button onClick={() => onUpdate(order._id, "Served")}>Mark Served</button>
                    <button onClick={() => onUpdate(order._id, "Done")}>Mark Done</button>
                </div>
            </div>
        </div>
    );
}
