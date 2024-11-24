import {catchAsyncErrors} from '../middlewares/catchAsyncError.js'
import { Message } from "../models/messageSchema.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";

export const sendMessage = catchAsyncErrors(async(req,res,next) => {
    const { firstName, lastName, email, phone, message } = req.body;
    if (!firstName || !lastName || !email || !phone || !message) {
        return next(new ErrorHandler("Xin vui lòng điền đầy đủ thông tin!", 400));
    }
    await Message.create({ firstName, lastName, email, phone, message });
        res.status(200).json({
            success: true,
            message: "Tin nhắn đã được gửi thành công!",
    });
});

export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
    const messages = await Message.find();
    res.status(200).json({
      success: true,
      messages,
    });
});