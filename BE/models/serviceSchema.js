import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: [true, "Tên dịch vụ là bắt buộc!"],
    unique: true,
  },
  description: {
    type: String,
    default: "",
  },
  cost: {
    type: Number,
    required: [true, "Giá dịch vụ là bắt buộc!"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export const Service = mongoose.model("Service", serviceSchema);