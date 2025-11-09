import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { MdDashboard, MdOutlineBarChart } from "react-icons/md";
import { RiArmchairFill } from "react-icons/ri";
import { PiNotebookFill } from "react-icons/pi";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <MdDashboard className="nav-icon" title="Analytics" />
        </NavLink>

        <NavLink
          to="/tables"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <RiArmchairFill className="nav-icon" title="Tables" />
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <PiNotebookFill className="nav-icon" title="Orders" />
        </NavLink>

        <NavLink
          to="/admin-menu"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <MdOutlineBarChart className="nav-icon" title="Manage Menu / Add Product" />
        </NavLink>

        <NavLink
          to="#"
          onClick={(e) => e.preventDefault()}
          className={({ isActive }) =>
            isActive ? "nav-item active logout-link" : "nav-item logout-link"
          }
        ></NavLink>
      </nav>
    </aside>
  );
}
