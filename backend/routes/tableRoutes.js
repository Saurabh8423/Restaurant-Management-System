import express from "express";
import { getTables, addTable, deleteTable } from "../controllers/tableController.js";

const router = express.Router();

router.get("/", getTables);
router.post("/", addTable);
router.delete("/:id", deleteTable);

export default router;
