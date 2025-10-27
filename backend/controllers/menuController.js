import Menu from "../models/menuModel.js";

// Add a new menu item
export const addMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      averagePreparationTime,
      stock,
      rating,
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price, and category are required",
      });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newMenu = new Menu({
      name,
      description,
      category,
      price,
      averagePreparationTime,
      stock,
      rating,
      image: imagePath,
    });

    await newMenu.save();

    res.status(201).json({
      success: true,
      message: "✅ Menu item added successfully",
      data: newMenu,
    });
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all menu items
export const getAllMenuItems = async (req, res) => {
  try {
    const menu = await Menu.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, menu });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch menu" });
  }
};
