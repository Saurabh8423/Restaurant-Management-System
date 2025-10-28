import express from "express";
import Chef from "../models/chefModel.js";

const router = express.Router();

// ✅ Add multiple chefs at once
router.post("/", async (req, res) => {
  try {
    const chefs = await Chef.insertMany(req.body);
    res.status(201).json({ success: true, chefs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//  Get all chefs
router.get("/", async (req, res) => {
  try {
    const chefs = await Chef.find();
    res.status(200).json({ success: true, chefs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
