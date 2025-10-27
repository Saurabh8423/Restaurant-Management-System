import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";

import orderRoutes from "./routes/orderRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import chefRoutes from "./routes/chefRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();
const app = express();

// Ensure uploads directory exists
const uploadsPath = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log(" 'uploads' folder created automatically");
}

app.use(cors({
  origin: "http://localhost:3001",
  credentials: true,                
}));

app.use(morgan("dev"));
app.use(express.json());

// Serve uploaded images statically
app.use("/uploads", express.static(uploadsPath));

connectDB();

// Routes
app.use("/api/orders", orderRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/chefs", chefRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) =>
  res.json({ success: true, message: "🍽️ Restaurant API running..." })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
