import express from "express";
import { getMenuItems, addMenuItem } from "../controllers/menuController.js";

const router = express.Router();

router.get("/", getMenuItems);
router.post("/", addMenuItem);

export default router;
