import Order from "../models/orderModel.js";
import Chef from "../models/chefModel.js";

export const getAnalytics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalChefs = await Chef.countDocuments();
    const totalRevenue = await Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }]);
    const totalClients = await Order.distinct("phoneNumber");

    res.json({
      totalOrders,
      totalChefs,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalClients: totalClients.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
