import React from "react";
import { FaRegAddressBook , FaRupeeSign } from "react-icons/fa";
import { PiBowlFoodBold } from "react-icons/pi";
import { MdOutlineGroup } from "react-icons/md";
import "./StatsRow.css";
import { useSearch } from "../../context/SearchContext";

// 🔹 Single Stat Card Component
const StatCard = ({ title, value, icon: Icon, iconColor, bgColor, blurred }) => (
  <div className={`custom-stat-card ${blurred ? "blurred" : ""}`}>
    <div
      className="icon-container"
      style={{ backgroundColor: bgColor, color: iconColor }}
    >
      <Icon size={30} />
    </div>
    <div className="text-content">
      <span className="stat-value">{value}</span>
      <span className="stat-title">{title}</span>
    </div>
  </div>
);

export default function StatsRow({ stats = {} }) {
  const { searchTerm } = useSearch();
  const term = searchTerm?.toLowerCase().trim();

  const {
    totalRevenue = 0,
    totalOrders = 0,
    totalClients = 0,
  } = stats;

  // 🔹 Helper to decide which card should blur
  const shouldBlur = (title) => {
    if (!term) return false; // show all if empty
    if (term === "total") return false; // show all for "total"

    // specific matches
    if (term.includes("total chef")) return title !== "TOTAL CHEF";
    if (term.includes("total order")) return title !== "TOTAL ORDERS";
    if (term.includes("total client") || term.includes("total clients"))
      return title !== "TOTAL CLIENTS";
    if (term.includes("total revenue")) return title !== "TOTAL REVENUE";

    // if search not related to totals, hide all total cards
    if (
      term.includes("ordersummary") ||
      term.includes("revenue chart") ||
      term.includes("tables")
    )
      return true;

    return false;
  };

  return (
    <div className="stats-row">
      <StatCard
        title="TOTAL CHEF"
        value={String(4).padStart(2, "0")}
        icon={PiBowlFoodBold}
        iconColor="#000000"
        bgColor="#E0EFFF"
        blurred={shouldBlur("TOTAL CHEF")}
      />
      <StatCard
        title="TOTAL REVENUE"
        value={`₹${(totalRevenue / 1000).toFixed(1)}K`}
        icon={FaRupeeSign}
        iconColor="#000000"
        bgColor="#E0EFFF"
        blurred={shouldBlur("TOTAL REVENUE")}
      />
      <StatCard
        title="TOTAL ORDERS"
        value={String(totalOrders).padStart(2, "0")}
        icon={FaRegAddressBook }
        iconColor="#000000"
        bgColor="#E0EFFF"
        blurred={shouldBlur("TOTAL ORDERS")}
      />
      <StatCard
        title="TOTAL CLIENTS"
        value={String(totalClients).padStart(2, "0")}
        icon={MdOutlineGroup}
        iconColor="#000000"
        bgColor="#E0EFFF"
        blurred={shouldBlur("TOTAL CLIENTS")}
      />
    </div>
  );
}
