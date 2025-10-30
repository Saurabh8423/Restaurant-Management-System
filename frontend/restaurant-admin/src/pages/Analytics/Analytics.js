import React, { useEffect, useState, useCallback } from "react";
import API from "../../api/axios";
import "./Analytics.css";
import StatsRow from "./StatsRow";
import OrderSummary from "./OrderSummary";
import RevenueChart from "./RevenueChart";
import TablesOverview from "./TablesOverview";
import ChefPerformance from "./ChefPerformance";
import { useSearch } from "../../context/SearchContext";

export default function Analytics() {
  const { searchTerm } = useSearch();

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalClients: 0,
  });
  const [orders, setOrders] = useState({
    served: 0,
    dineIn: 0,
    takeAway: 0,
  });
  const [chefPerformance, setChefPerformance] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  const [orderFilter, setOrderFilter] = useState("Daily");
  const [revenueFilter, setRevenueFilter] = useState("Daily");
  const [loading, setLoading] = useState(false);

  const chefs = ["Mohan", "Pritam", "Yash", "Rahul"];

  // Generate simulated chef performance (runs once)
  useEffect(() => {
    const performance = chefs.map((chef) => ({
      name: chef,
      totalOrders: Math.floor(Math.random() * 25) + 5,
      served: 0,
      pending: 0,
    }));

    performance.forEach((chef) => {
      chef.served = Math.floor(Math.random() * chef.totalOrders);
      chef.pending = chef.totalOrders - chef.served;
    });

    setChefPerformance(performance);
  }, []);

  // === Fetch Orders Summary ===
  const fetchOrderSummary = async (selectedFilter) => {
    try {
      setLoading(true);
      const response = await API.get(
        `/analytics/orders?filter=${selectedFilter.toLowerCase()}`
      );
      const data = response.data || {};
      if (data.orders) setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching order summary:", error);
    } finally {
      setLoading(false);
    }
  };

  // === Fetch Revenue Data ===
  const fetchRevenueData = async (selectedFilter) => {
    try {
      setLoading(true);
      const response = await API.get(
        `/analytics/revenue?filter=${selectedFilter.toLowerCase()}`
      );
      const data = response.data || {};
      if (data.stats) setStats(data.stats);
      if (data.revenue) setRevenueData(data.revenue);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch order summary only when orderFilter changes
  useEffect(() => {
    fetchOrderSummary(orderFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderFilter]);

  // Fetch revenue data only when revenueFilter changes
  useEffect(() => {
    fetchRevenueData(revenueFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revenueFilter]);

  // ===== Improved Blur Logic =====
  const getBlurClass = (section) => {
    if (!searchTerm) return "";
    const term = searchTerm.toLowerCase().trim();

    if (section === "chef") return "";

    if (
      term.includes("total") ||
      term.includes("revenue") ||
      term.includes("orders") ||
      term.includes("clients")
    ) {
      return section === "stats" ? "" : "blurred";
    }

    if (term.includes("order") || term.includes("summary")) {
      return section === "orderSummary" ? "" : "blurred";
    }

    if (term.includes("revenue")) {
      return section === "revenueChart" ? "" : "blurred";
    }

    if (term.includes("table")) {
      return section === "tablesOverview" ? "" : "blurred";
    }

    return "blurred";
  };

  return (
    <div className="analytics-page">
      <h3>Analytics</h3>

      <div className={getBlurClass("stats")}>
        <StatsRow stats={stats} />
      </div>

      <div className="analytics-grid">
        <div className={getBlurClass("orderSummary")}>
          <OrderSummary
            served={orders?.served || 0}
            dineIn={orders?.dineIn || 0}
            takeAway={orders?.takeAway || 0}
            filter={orderFilter}
            setFilter={setOrderFilter}
          />
        </div>

        <div className={getBlurClass("revenueChart")}>
          <RevenueChart
            lineData={revenueData}
            revenueFilter={revenueFilter}
            setRevenueFilter={setRevenueFilter}
          />
        </div>

        <div className={getBlurClass("tablesOverview")}>
          <TablesOverview />
        </div>
      </div>

      <div className={getBlurClass("chef")}>
        <ChefPerformance chefPerformance={chefPerformance} />
      </div>
    </div>
  );
}
