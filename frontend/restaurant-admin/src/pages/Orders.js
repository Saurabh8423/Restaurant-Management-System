import React, { useEffect, useState } from "react";
import API from "../api/axios";
import OrderCard from "../components/OrderCard";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null); 

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      // fallback for UI
      setOrders([
        {
          _id: "o1",
          orderId: "108",
          status: "Processing",
          items: [{ name: "Burger", quantity: 1 }],
        },
        {
          _id: "o2",
          orderId: "109",
          status: "Served",
          items: [{ name: "Pizza", quantity: 2 }],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch analytics after updates (optional)
  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/analytics");
      setStats(res.data);
    } catch (err) {
      console.warn("Analytics fetch skipped:", err);
    }
  };

  // Handle status update
 const updateStatus = async (id, status) => {
  try {
    await API.patch(`/orders/${id}`, { status });
    await fetchOrders(); // refresh order list
    await fetchAnalytics(); // refresh revenue & performance data
  } catch (err) {
    console.error("Failed to update order:", err);
    alert("Failed to update order status");
  }
};


  // Initial load
  useEffect(() => {
    fetchOrders();
    fetchAnalytics();
  }, []);

  return (
    <div className="orders-page">
      <h2>Order Line</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} onUpdate={updateStatus} />
          ))}
        </div>
      )}
    </div>
  );
}