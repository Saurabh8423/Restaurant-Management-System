import React, { useState } from "react";
import "./CookInstructionsModal.css";

export default function CookInstructionsModal({ visible, onClose, onSave }) {
    const [text, setText] = useState("");
    if (!visible) return null;
    return (
        <div className="cook-overlay">
            <div className="cook-card">
                <h3>Add Cooking instructions</h3>
                <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Optional instructions" />
                <div className="cook-actions">
                    <button className="btn" onClick={() => { onClose(); }}>Cancel</button>
                    <button className="btn-primary" onClick={() => { onSave(text); onClose(); }}>Next</button>
                </div>
            </div>
        </div>
    );
}
