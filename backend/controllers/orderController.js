import Order from "../models/orderModel.js";
import Chef from "../models/chefModel.js";

// Assign chef with fewer orders
const assignChef = async () => {
  const chefs = await Chef.find().sort({ ordersHandled: 1 });
  if (chefs.length === 0) return null;

  const assignedChef = chefs[0];
  assignedChef.ordersHandled += 1;
  await assignedChef.save();
  return assignedChef.name;
};

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { orderId, type, items, totalAmount, tableNumber, clientName, phoneNumber, address, instructions } = req.body;

    const assignedChef = await assignChef();

    const newOrder = await Order.create({
      orderId,
      type,
      tableNumber,
      items,
      totalAmount,
      clientName,
      phoneNumber,
      address,
      instructions,
      assignedChef,
      status: "Processing",
      processingTime: Math.floor(Math.random() * 10) + 5, // random countdown in minutes
    });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
