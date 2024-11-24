import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import jwt from "jsonwebtoken"; 

export const isAdminAuthenticated = catchAsyncErrors(
    async (req, res, next) => {
      const token = req.cookies.adminToken;
      if (!token) {
        return next(
          new ErrorHandler("Quản trị viên không được xác thực!", 400)
        );
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(decoded.id);
      if (req.user.role !== "Admin") {
        return next(
          new ErrorHandler(`${req.user.role} không được ủy quyền cho tài nguyên này!`, 403)
        );
      }
      next();
    }
);

export const isPatientAuthenticated = catchAsyncErrors(
    async (req, res, next) => {
      const token = req.cookies.patientToken;
      if (!token) {
        return next(
          new ErrorHandler("Bệnh nhân không được xác thực!", 400)
        );
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(decoded.id);
      if (req.user.role !== "Bệnh nhân") {
        return next(
          new ErrorHandler(`${req.user.role} không được ủy quyền cho tài nguyên này!`, 403)
        );
      }
      next();
    }
);

export const isDoctorAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies.doctorToken;
    if (!token) {
      return next(
        new ErrorHandler("Bác sĩ không được xác thực!", 400)
      );
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (req.user.role !== "Bác sĩ") {
      return next(
        new ErrorHandler(`${req.user.role} không được ủy quyền cho tài nguyên này!`, 403)
      );
    }
    next();
  }
);