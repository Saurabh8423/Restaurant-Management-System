import React, { useEffect, useState } from "react";
import API from "../api/axios";
import OrderCard from "../components/OrderCard";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/orders")
      .then((res) => setOrders(res.data || []))
      .catch(() => {
        // sample fallback
        setOrders([
          { _id: "o1", orderId: "108", status: "Processing", items: [{ name: "Burger", quantity: 1 }] },
          { _id: "o2", orderId: "109", status: "Served", items: [{ name: "Pizza", quantity: 2 }] },
        ]);
      });
  }, []);

  const updateStatus = (id, status) => {
    API.patch(`/orders/${id}`, { status })
      .then(() => API.get("/orders").then((r) => setOrders(r.data)))
      .catch(() => alert("Failed to update"));
  };

  return (
    <div>
      <h2>Order Line</h2>
      <div className="orders-grid">
        {orders.map((o) => (
          <OrderCard key={o._id} order={o} onUpdate={updateStatus} />
        ))}
      </div>
    </div>
  );
}
