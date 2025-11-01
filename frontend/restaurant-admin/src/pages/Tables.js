import React, { useEffect, useRef, useState } from "react";
import { FaTrashAlt, FaChair, FaPlus } from "react-icons/fa";
import API from "../api/axios";
import "./Tables.css";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

    const modalRef = useRef(null); 

  useEffect(() => {
    fetchTables();
  }, []);

  // Fetch all tables
  const fetchTables = async () => {
    try {
      const res = await API.get("/tables");
      if (Array.isArray(res.data)) setTables(res.data);
      else if (res.data.tables) setTables(res.data.tables);
      else setTables(res.data || []);
    } catch (err) {
      console.error("Error fetching tables:", err);
      setTables([]);
    }
  };

  // Add a table (POST)
  const addTable = async (payload) => {
    try {
      setLoading(true);
      const res = await API.post("/tables", payload);
      setTables((prev) => [...prev, res.data]);
      setShowModal(false);
    } catch (err) {
      console.error("Error adding table:", err);
      alert("Failed to add table. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  // Delete table
  const deleteTable = async (id) => {
    try {
      await API.delete(`/tables/${id}`);
      setTables((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting table:", err);
      alert("Failed to delete table.");
    }
  };

  return (
    <div className="tables-page">
      <h2>Tables</h2>

      <div className="tables-grid">
        {tables.map((t) => (
          <div key={t._id} className="table-card">
            <button
              className="delete-icon"
              onClick={() => deleteTable(t._id)}
              title="Delete Table"
            >
              <FaTrashAlt />
            </button>

            {/* Updated order: Name first, number second */}
            <div className="table-name">{t.tableName || "Table"}</div>
            <div className="table-number">
              {String(t.tableNumber).padStart(2, "0")}
            </div>

            <div className="table-footer">
              <FaChair className="chair-icon" />
              <span className="chair-count">
                {t.size?.toString().padStart(2, "0")}
              </span>
            </div>
          </div>
        ))}

        {/* Add Table Button */}
        <div className="add-table-card" onClick={() => setShowModal(true)}>
          <FaPlus className="plus-icon" />
        </div>
      </div>

      {showModal && (
        <div className="floating-modal" ref={modalRef}>
          <CreateTable
            onCreate={(size, name) => addTable({ size, tableName: name })}
            onCancel={() => setShowModal(false)}
            loading={loading}
            nextNumber={tables.length + 1}
          />
        </div>
      )}
    </div>
  );
}

function CreateTable({ onCreate, onCancel, loading, nextNumber }) {
  const [name, setName] = useState("");
  const [size, setSize] = useState(2);

  return (
    <div className="new-table-card">
      {/* Close button */}
      <button className="close-btn" onClick={onCancel}>✕</button>

      {/* Input for table name */}
      <label className="label">Table name (optional)</label>
      <input
        type="text"
        className="input-field"
        placeholder="Enter table name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Table number auto-display */}
      <h2 className="table-number-design">
        {nextNumber.toString().padStart(2, "0")}
      </h2>

      {/* Chair dropdown */}
      <label className="label">Chairs</label>
      <select
        value={size}
        onChange={(e) => setSize(Number(e.target.value))}
        className="select-field"
      >
        <option value={2}>02</option>
        <option value={4}>04</option>
        <option value={6}>06</option>
        <option value={8}>08</option>
      </select>

      {/* Create button */}
      <button
        className="btn-create-table"
        onClick={() => onCreate(size, name)}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create"}
      </button>
    </div>
  );
}



