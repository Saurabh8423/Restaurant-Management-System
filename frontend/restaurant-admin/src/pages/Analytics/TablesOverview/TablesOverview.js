import React, { useEffect, useState } from "react";
import ChartCard from "../../../components/ChartCard/ChartCard";
import API from "../../../api/axios";
import "./TablesOverview.css";

export default function TablesOverview() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
  fetchTables();
  const interval = setInterval(fetchTables, 5000);
  return () => clearInterval(interval);
}, []);


  const fetchTables = async () => {
    try {
      const res = await API.get("/tables");
      if (Array.isArray(res.data)) setTables(res.data);
      else if (res.data.tables) setTables(res.data.tables);
      else setTables(res.data || []);
    } catch (err) {
      // fallback for local test
      const sample = Array.from({ length: 30 }, (_, i) => ({
        tableNumber: i + 1,
        reserved: i % 4 === 0, // random pattern
      }));
      setTables(sample);
    }
  };

  return (
    <ChartCard title="Tables" className="tables-overview-card">
      <div className="tables-legend">
        <span className="legend-item">
          <span className="legend-color reserved-color"></span>Reserved
        </span>
        <span className="legend-item">
          <span className="legend-color available-color"></span>Available
        </span>
      </div>

      <div className="tables-overview">
        <div className="table-grid-preview">
          {tables.map((t, i) => (
            <div
              key={t._id || i}
              className={`mini-table ${t.reserved ? "reserved" : "available"}`}
            >
              Table {String(t.tableNumber).padStart(2, "0")}
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}
