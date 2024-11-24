import express from "express";
import { createService, getAllServices, getServiceById, updateService, deleteService } from "../controller/serviceController.js";

const router = express.Router();

router.get("/getAll", getAllServices);
router.get("/get/:id", getServiceById);
router.post("/create", createService);
router.put("/update/:id", updateService);
router.delete("/delete/:id", deleteService);

export default router;