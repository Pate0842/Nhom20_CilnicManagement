import express from "express";
import { createPayment, paymentCallback } from "../controller/paymentController.js";

const router = express.Router();

router.post("/create-payment", createPayment);
router.post("/callback", paymentCallback);

export default router;