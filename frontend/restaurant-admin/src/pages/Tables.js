import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaChair, FaPlus } from "react-icons/fa";
import API from "../api/axios";
import "./Tables.css";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = () => {
    API.get("/tables")
      .then((res) => {
        if (Array.isArray(res.data)) setTables(res.data);
        else if (res.data.tables) setTables(res.data.tables);
        else setTables(res.data || []);
      })
      .catch(() => {
        const sample = Array.from({ length: 30 }, (_, i) => ({
          _id: `t-${i + 1}`,
          tableNumber: i + 1,
          tableName: "",
          size: [2, 4, 6, 8][i % 4],
          reserved: false,
        }));
        setTables(sample);
      });
  };

  const deleteTable = (id) => {
    const updated = tables.filter((t) => t._id !== id);
    const reindexed = updated.map((t, i) => ({
      ...t,
      tableNumber: i + 1,
      _id: `t-${i + 1}`,
    }));
    setTables(reindexed);
  };

  const addTable = (payload) => {
    const newTable = {
      _id: `t-${tables.length + 1}`,
      tableNumber: tables.length + 1,
      tableName: payload.tableName,
      size: payload.size,
      reserved: false,
    };
    setTables([...tables, newTable]);
    setShowModal(false);
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

            <div className="table-number">
              {String(t.tableNumber).padStart(2, "0")}
            </div>

            <div className="table-name">{t.tableName || "Table"}</div>

            <div className="table-footer">
              <FaChair className="chair-icon" />
              <span className="chair-count">
                {t.size.toString().padStart(2, "0")}
              </span>
            </div>
          </div>
        ))}

        {/* Add Table Button */}
        <div className="add-table-card" onClick={() => setShowModal(true)}>
          <FaPlus className="plus-icon" />
        </div>
      </div>

      {/* Popup Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Table</h3>
            <CreateTable
              onCreate={(size, name) => addTable({ size, tableName: name })}
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* Create Table Modal Form */
function CreateTable({ onCreate, onCancel }) {
  const [name, setName] = useState("");
  const [size, setSize] = useState(2);

  return (
    <div className="modal-form">
      <input
        placeholder="Table name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input-field"
      />
      <select
        value={size}
        onChange={(e) => setSize(Number(e.target.value))}
        className="select-field"
      >
        <option value={2}>2</option>
        <option value={4}>4</option>
        <option value={6}>6</option>
        <option value={8}>8</option>
      </select>
      <div className="modal-actions">
        <button className="btn-create" onClick={() => onCreate(size, name)}>
          Create
        </button>
        <button className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
