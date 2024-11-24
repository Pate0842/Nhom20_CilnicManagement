import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [2, "Tên phải chứa ít nhất 2 ký tự!"],
      },
      lastName: {
        type: String,
        required: true,
        minLength: [2, "Họ phải chứa ít nhất 2 ký tự!"],
      },
      email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Hãy cung cấp một địa chỉ email hợp lệ!"],
      },
      phone: {
        type: String,
        required: true,
        minLength: [10, "Số điện thoại phải chứa đúng 10 chữ số!"],
        maxLength: [10, "Số điện thoại phải chứa đúng 10 chữ số!"],
      },
      message: {
        type: String,
        required: true,
        minLength: [10, "Tin nhắn phải chứa ít nhất 10 ký tự!"],
      },
})

export const Message = mongoose.model("Message", messageSchema);