import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  medicalRecordId: {
    type: mongoose.Schema.ObjectId,
    ref: "MedicalRecord",
    required: [true, "ID hồ sơ y tế là bắt buộc!"],
  },
  appointmentId: {
    type: mongoose.Schema.ObjectId,
    ref: "Appointment",
    required: [true, "ID cuộc hẹn là bắt buộc!"],
  },
  amount: {
    type: Number,
    required: [true, "Số tiền thanh toán là bắt buộc!"],
  },
  appTransId: {
    type: String,
    required: [true, "ID giao dịch Zalopay là bắt buộc!"],
    unique: true,
  },
  mac: {
    type: String,
    required: [true, "MAC là bắt buộc!"],
  },
  bankCode: {
    type: String,
  },
  paymentStatus: {
    type: String,
    enum: ["Unpaid", "Pending", "Paid"],
    default: "Pending",
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

export const Payment = mongoose.model("Payment", paymentSchema);