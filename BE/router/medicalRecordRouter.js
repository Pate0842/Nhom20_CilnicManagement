import express from "express";
import {
  createMedicalRecord,
  getAllMedicalRecords,
  getDetailMedicalRecordById,
  deleteMedicalRecord,
  updateMedicalRecord,
} from "../controller/medicalRecordController.js";

const router = express.Router();

router.post("/post", createMedicalRecord);

router.get("/getAll", getAllMedicalRecords);

router.get("/getDetail/:id", getDetailMedicalRecordById);

router.put("/put/:id", updateMedicalRecord);

router.delete("/delete/:id", deleteMedicalRecord);


export default router;