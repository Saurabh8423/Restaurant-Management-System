import express from "express";
import Chef from "../models/chefModel.js";

const router = express.Router();

// Add multiple chefs
router.post("/", async (req, res) => {
  try {
    const chefs = await Chef.insertMany(req.body);
    res.status(201).json({ success: true, chefs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all chefs
router.get("/", async (req, res) => {
  try {
    const chefs = await Chef.find();
    res.status(200).json({ success: true, chefs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//  Assign order to chef (increment ordersHandled)
router.patch("/:name/assign", async (req, res) => {
  try {
    const chef = await Chef.findOneAndUpdate(
      { name: req.params.name },
      { $inc: { ordersHandled: 1 } },
      { new: true }
    );
    if (!chef) {
      return res.status(404).json({ success: false, message: "Chef not found" });
    }
    res.status(200).json({ success: true, chef });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
