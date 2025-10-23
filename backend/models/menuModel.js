import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    averagePreparationTime: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
  },
  { timestamps: true }
);

const Menu = mongoose.model("Menu", menuSchema);
export default Menu;
