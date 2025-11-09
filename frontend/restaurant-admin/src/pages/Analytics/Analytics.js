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
  const [filter, setFilter] = useState("Daily");
  const [ , setLoading] = useState(false);


  const fetchAnalyticsData = useCallback(
    async (selectedFilter) => {
      try {
        setLoading(true);
        const response = await API.get(`/analytics?filter=${selectedFilter.toLowerCase()}`);
        const data = response.data || {};

        setStats(data.stats || {});
        setOrders(data.orders || {});
        setRevenueData(data.revenue || []);

        //  Fetch chef data dynamically
        const chefRes = await API.get("/chefs");
        if (chefRes?.data?.success) {
          const chefData = chefRes.data.chefs.map((c) => ({
            name: c.name,
            totalOrders: c.ordersHandled || 0,
          }));
          setChefPerformance(chefData);
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );


  useEffect(() => {
    fetchAnalyticsData(filter);
  }, [filter, fetchAnalyticsData]);

  // ===== Improved Blur Logic =====
  const getBlurClass = (section) => {
    if (!searchTerm) return ""; // nothing blurred if input is empty
    const term = searchTerm.toLowerCase().trim();

    // Chef section never blurs
    if (section === "chef") return "";

    // === Total Stats ===
    if (
      term.includes("total") ||
      term.includes("total revenue") ||
      term.includes("total orders") ||
      term.includes("total clients") ||
      term.includes("total chef")
    ) {
      return section === "stats" ? "" : "blurred";
    }

    // === Order Summary ===
    if (term.includes("order") || term.includes("summary")) {
      return section === "orderSummary" ? "" : "blurred";
    }

    // === Revenue Chart ===
    if (term.includes("revenue")) {
      return section === "revenueChart" ? "" : "blurred";
    }

    // === Tables Overview ===
    if (term.includes("table") || term.includes("tables")) {
      return section === "tablesOverview" ? "" : "blurred";
    }

    // Default: blur everything else
    return "blurred";
  };

  return (
    <div className="analytics-page">
      <h3>Analytics</h3>

      {/* ==== Stats Row ==== */}
      <div className={getBlurClass("stats")}>
        <StatsRow stats={stats} />
      </div>

      <div className="analytics-grid">
        <div className={getBlurClass("orderSummary")}>
          <OrderSummary
            served={orders?.served || 0}
            dineIn={orders?.dineIn || 0}
            takeAway={orders?.takeAway || 0}
            filter={filter}
            setFilter={setFilter}
          />
        </div>

        <div className={getBlurClass("revenueChart")}>
          <RevenueChart
            lineData={revenueData}
            revenueFilter={filter}
            setRevenueFilter={setFilter}
          />
        </div>

        <div className={getBlurClass("tablesOverview")}>
          <TablesOverview />
        </div>
      </div>

      {/* Chef section never blurs */}
      <div className={getBlurClass("chef")}>
        <ChefPerformance chefPerformance={chefPerformance} />
      </div>
    </div>
  );
}
