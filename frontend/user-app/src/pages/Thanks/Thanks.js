import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Thanks.css";

export default function Thanks() {
    const navigate = useNavigate();
    useEffect(() => {
        const t = setTimeout(() => navigate("/"), 2000);
        return () => clearTimeout(t);
    }, [navigate]);

    return (
        <div className="thanks-shell">
            <div className="thanks-card">
                <h1>Thanks For Ordering</h1>
                <div className="tick">✔</div>
                <div className="redir">Redirecting...</div>
            </div>
        </div>
    );
}
