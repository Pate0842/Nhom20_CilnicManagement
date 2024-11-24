import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  appointmentId: {
    type: mongoose.Schema.ObjectId,
    ref: "Appointment",
    required: true,
  },
  examinationDate: {
    type: Date,
    required: [true, "Ngày khám là bắt buộc!"],
    default: Date.now,
  },
  doctor: {
    firstName: {
      type: String,
      required: [true, "Tên bác sĩ là bắt buộc!"],
    },
    lastName: {
      type: String,
      required: [true, "Họ bác sĩ là bắt buộc!"],
    },
    department: {
      type: String,
      required: [true, "Khoa là bắt buộc!"],
    },
    doctorId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  diagnosis: {
    type: String,
    required: [true, "Chuẩn đoán là bắt buộc!"],
  },
  prescriptions: [
    {
      medicineName: {
        type: String,
        required: [true, "Tên thuốc là bắt buộc!"],
      },
      dosage: {
        type: Number,
        required: [true, "Liều lượng là bắt buộc!"],
      },
      unit: {
        type: String,
        required: [true, "Đơn vị là bắt buộc!"],
        enum: ["Viên", "Gói", "Ống"],
        default: "viên",
      },
      usage: {
        type: String,
        required: [true, "Cách dùng là bắt buộc!"],
      },
    },
  ],
  services: [
    {
      serviceId: {
        type: mongoose.Schema.ObjectId,
        ref: "Service",
        required: [true, "ID dịch vụ là bắt buộc!"],
      },
      notes: {
        type: String,
      },
    },
  ],
  paymentStatus: {
    type: String,
    enum: ["Unpaid", "Pending", "Paid"],
    default: "Unpaid",
  },
});

export const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);