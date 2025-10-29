import React, { useEffect, useState } from "react";
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

// Dropdown filter for time range
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
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    //  Simulate day-wise data for Mon–Sun
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const data = days.map((day) => ({
      name: day,
      orders: Math.floor(Math.random() * 120) + 20, // Random order count
    }));
    setWeeklyData(data);
  }, [lineData, revenueFilter]);

  return (
    <ChartCard title="Revenue" className="revenue-card">
      <div className="chart-header-controls">
        <p className="placeholder-text">Day-wise order performance</p>
        <TimeFilter selected={revenueFilter} setSelected={setRevenueFilter} />
      </div>

      {/* Chart Container */}
      <div className="revenue-chart-container">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#4b5563", fontSize: 12 }}
            />
            <YAxis hide={true} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value) => [`${value} orders`, "Orders"]}
            />
            <Bar
              dataKey="orders"
              fill="#1f2937"
              radius={[6, 6, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
