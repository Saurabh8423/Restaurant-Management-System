import React from "react";
import "./ChefPerformance.css";

export default function ChefPerformance({ chefPerformance = [] }) {
  return (
    <div className="chef-performance-card">
      <table className="chef-table">
        <thead>
          <tr>
            <th>Chef Name</th>
            <th>Orders Taken</th>
          </tr>
        </thead>
        <tbody>
          {chefPerformance.map((chef) => (
            <tr key={chef.name}>
              <td>{chef.name}</td>
              <td>{chef.totalOrders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
