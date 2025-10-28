import Chef from "../models/chefModel.js";

export const getChefs = async (req, res) => {
  try {
    const chefs = await Chef.find().sort({ name: 1 });
    res.json({ success: true, data: chefs });
  } catch (error) {
    console.error("Error fetching chefs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
