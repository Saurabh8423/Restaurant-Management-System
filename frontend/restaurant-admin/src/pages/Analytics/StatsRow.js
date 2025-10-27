import React from "react";
import { FaUsers, FaChartLine, FaUtensils, FaRupeeSign } from "react-icons/fa";
import "./StatsRow.css";

// Custom StatCard component (kept here as it's tightly coupled to the row)
const StatCard = ({ title, value, icon: Icon, iconColor, bgColor }) => (
  <div className="custom-stat-card">
    <div className="icon-container" style={{ backgroundColor: bgColor, color: iconColor }}>
      <Icon size={20} />
    </div>
    <div className="text-content">
      <span className="stat-value">{value}</span>
      <span className="stat-title">{title}</span>
    </div>
  </div>
);

export default function StatsRow({ stats }) {
  return (
    <div className="stats-row">
      <StatCard
        title="TOTAL CHEF "
        value={String(4).padStart(2, "0")}
        icon={FaUtensils}
        iconColor="#60a5fa"
        bgColor="#eff6ff"
      />
      <StatCard
        title="TOTAL REVENUE"
        value={`₹${stats.totalRevenue/1000}K`}
        icon={FaRupeeSign}
        iconColor="#34d399"
        bgColor="#d1fae5"
      />
      <StatCard
        title="TOTAL ORDERS"
        value={String(stats.totalOrders).padStart(2, "0")}
        icon={FaChartLine}
        iconColor="#fcd34d"
        bgColor="#fefce8"
      />
      <StatCard
        title="TOTAL CLIENTS"
        value={String(stats.totalClients).padStart(2, "0")}
        icon={FaUsers}
        iconColor="#fb923c"
        bgColor="#fff7ed"
      />
    </div>
  );
}