import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FaAngleDown } from "react-icons/fa6";
import ChartCard from "../../components/ChartCard";
import "./RevenueChart.css";

const TimeFilter = ({ selected, setSelected }) => (
  <div className="time-filter">
    <select value={selected} onChange={(e) => setSelected(e.target.value)}>
      <option value="Daily">Daily</option>
      <option value="Weekly">Weekly</option>
      <option value="Monthly">Monthly</option>
      <option value="Yearly">Yearly</option>
    </select>
    <FaAngleDown className="dropdown-icon" />
  </div>
);

export default function RevenueChart({ lineData, revenueFilter, setRevenueFilter }) {
  // === Convert API date data → day-wise data (Mon–Sun)
  const dayWiseData = useMemo(() => {
    const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result = Array(7).fill(null).map((_, i) => ({
      day: dayMap[i],
      revenue: 0,
    }));

    if (Array.isArray(lineData)) {
      lineData.forEach((item) => {
        if (item.date && item.revenue != null) {
          const dayIndex = new Date(item.date).getDay();
          result[dayIndex].revenue += item.revenue;
        }
      });
    }
    return result;
  }, [lineData]);

  return (
    <ChartCard title="Revenue" className="revenue-card">
      <div className="chart-header-controls">
        <p className="placeholder-text">Revenue performance overview</p>
        <TimeFilter selected={revenueFilter} setSelected={setRevenueFilter} />
      </div>

      <div className="revenue-chart-container">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={dayWiseData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
              }}
              labelStyle={{ color: "#374151" }}
            />
            <Bar
              dataKey="revenue"
              fill="#4f46e5"
              barSize={30}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
