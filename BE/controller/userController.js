import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import {generateToken} from "../utils/jwtToken.js"
import sendEmail from "../utils/sendEmail.js";
import cloudinary from "cloudinary"
import jwt from "jsonwebtoken";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { 
    firstName, 
    lastName, 
    email, 
    phone, 
    password, 
    confirmPassword,
    gender, 
    dob, 
    nic, 
    role,
  } = req.body;
  
  // Kiểm tra dữ liệu đầu vào
  if (!firstName || !lastName || !email || !phone || !password || !confirmPassword || !gender || !dob || !nic || !role) {
    return next(new ErrorHandler("Xin vui lòng điền đầy đủ thông tin!", 400));
  }
  
  // Kiểm tra email và mật khẩu
  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("Email đã được đăng kí!", 400));
  }
  user = await User.findOne({ nic });
  if (user) {
    return next(new ErrorHandler("CCCD đã tồn tại!", 400));
  }
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Mật khẩu không trùng khớp!", 400));
  }

  // Tạo người dùng mới
  user = await User.create({
    firstName, 
    lastName, 
    email, 
    phone, 
    password, 
    confirmPassword,
    gender, 
    dob, 
    nic, 
    role: "Bệnh nhân",
    isVerified: false,
  });

  // Tạo token xác thực
  const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  const verificationUrl = `${process.env.BACKEND_URL}/api/v1/user/verify/${verificationToken}`;

  // Gửi email xác thực
  const message = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Welcome to Happy Teeth!</h2>
    <p>Dear ${firstName},</p>
    <p>Thank you for registering with us. Please verify your email by clicking the button below:</p>
    <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; margin-top: 20px; background-color: #4CAF50; color: #ffffff; text-decoration: none; border-radius: 5px;">
      Verify Your Email
    </a>
    <p>If you did not request this, please ignore this email.</p>
    <p>Best regards,<br/>The Happy Teeth Team</p>
  </div>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Email Verification - Happy Teeth',
    html: message,
  });

  // Gửi phản hồi về việc đăng ký
  res.status(200).json({
    success: true,
    message: "Người dùng đã đăng kí thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      nic: user.nic,
      dob: user.dob,
      gender: user.gender,
      role: user.role,
      isVerified: user.isVerified,
      _id: user._id,
    },
    token: user.generateJsonWebToken(),
  });
});

export const verifyEmail = catchAsyncErrors(async (req, res, next) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user) return next(new ErrorHandler("Token không hợp lệ hoặc người dùng không tồn tại!", 400));

    user.isVerified = true;
    await user.save();

    const redirectUrl = `${process.env.FRONTEND_URL}/verification-success`;
    res.redirect(redirectUrl);

  } catch (error) {
    return next(new ErrorHandler("Token không hợp lệ hoặc đã hết hạn!", 400));
  }
});

export const login = catchAsyncErrors(async(req,res,next) => {
  const {email, password, role} = req.body;
  if (!email || !password || !role) {
      return next(new ErrorHandler("Xin hãy cung cấp đầy đủ thông tin!", 400));
  }
  const user = await User.findOne({email}).select("+password");
  if (!user) {
      return next(new ErrorHandler("Email hoặc mật khẩu không chính xác!", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
      return next(new ErrorHandler("Email hoặc mật khẩu không chính xác!", 400));
  }
  if (role !== "Admin" && role !== "Bác sĩ" && !user.isVerified) {
    return next(new ErrorHandler("Vui lòng xác thực email trước khi đăng nhập!", 400));
  }
  if (role !== user.role) {
      return next(new ErrorHandler("Không tìm thấy người dùng với vai trò này!", 400));
  }
  generateToken(user, "Đăng nhập thành công", 200, res);
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { 
    firstName, 
    lastName, 
    email, 
    phone, 
    password, 
    gender, 
    dob, 
    nic 
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password || 
    !gender ||
    !dob ||
    !nic 
  )  {
    return next(new ErrorHandler("Xin vui lòng điền đầy đủ thông tin!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler(`${isRegistered.role} với email này đã tồn tại!`));
  }

  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Admin",
  });
  res.status(200).json({
    success: true,
    message: "Quản trị viên mới đã tạo thành công!"
  });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Avatar bác sĩ là bắt buộc!", 400));
  }
  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("Định dạng tệp không được hỗ trợ!", 400));
  }
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nic,
    doctorDepartment,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password || 
    !gender ||
    !dob ||
    !nic ||
    !doctorDepartment ||
    !docAvatar
  )  {
    return next(new ErrorHandler("Xin vui lòng điền đầy đủ thông tin!", 400));
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler(`${isRegistered.role} với email này đã tồn tại!`)
    );
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
  }
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Bác sĩ",
    doctorDepartment,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "Bác sĩ mới đã tạo thành công!",
    doctor,
  });
});

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Bác sĩ" });
  res.status(200).json({
    success: true,
    doctors,
  });
});

export const getAllPatients = catchAsyncErrors(async (req, res, next) => {
  const patients = await User.find({ role: "Bệnh nhân" });
  res.status(200).json({
    success: true,
    patients,
  });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Quản trị viên đăng xuất thành công.",
    });
});

export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Bệnh nhân đăng xuất thành công.",
    });
});

export const logoutDoctor = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("doctorToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Bác sĩ đăng xuất thành công.",
    });
});

export const deleteDoctors = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await User.findById(id);

    if (!doctor || doctor.role !== "Bác sĩ") {
      return next(new ErrorHandler("Không tìm thấy bác sĩ!", 404));
    }

    await doctor.deleteOne();
    res.status(200).json({
      success: true,
      message: "Đã xóa bác sĩ!",
    });
  } catch (error) {
    console.error("Lỗi khi xóa bác sĩ:", error);
    next(new ErrorHandler("Có lỗi xảy ra khi xóa bác sĩ.", 500));
  }
});

export const deletePatient = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await User.findById(id);

    if (!patient || patient.role !== "Bệnh nhân") {
      return next(new ErrorHandler("Không tìm thấy bệnh nhân!", 404));
    }

    await patient.deleteOne();
    res.status(200).json({
      success: true,
      message: "Đã xóa bệnh nhân!",
    });
  } catch (error) {
    console.error("Lỗi khi xóa bệnh nhân:", error);
    next(new ErrorHandler("Có lỗi xảy ra khi xóa bệnh nhân.", 500));
  }
});

export const updateDoctorHandler = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await User.findById(id);

    if (!doctor || doctor.role !== "Bác sĩ") {
      return next(new ErrorHandler("Không tìm thấy bác sĩ!", 404));
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      dob,
      nic,
      doctorDepartment
    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!firstName || !lastName || !email || !phone || !gender || !dob || !nic || !doctorDepartment) {
      return next(new ErrorHandler("Xin vui lòng điền đầy đủ thông tin!", 400));
    }

    // Cập nhật thông tin bác sĩ
    Object.assign(doctor, { firstName, lastName, email, phone, gender, dob, nic, doctorDepartment });

    // Xử lý avatar mới nếu có
    if (req.files && req.files.docAvatar) {
      const { docAvatar } = req.files;
      const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
      
      if (!allowedFormats.includes(docAvatar.mimetype)) {
        return next(new ErrorHandler("Định dạng tệp không được hỗ trợ!", 400));
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);
      if (!cloudinaryResponse) {
        return next(new ErrorHandler("Lỗi khi tải lên ảnh!", 500));
      }

      doctor.docAvatar = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    }

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật bác sĩ thành công!",
      doctor,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật bác sĩ:", error);
    next(new ErrorHandler("Có lỗi xảy ra khi cập nhật bác sĩ.", 500));
  }
});
export const updatePatientProfile = catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.user._id; 
    const patient = await User.findById(userId);

    if (!patient || patient.role !== "Bệnh nhân") {
      return next(new ErrorHandler("Không tìm thấy bệnh nhân!", 404));
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      dob,
      nic
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !gender || !dob || !nic) {
      return next(new ErrorHandler("Xin vui lòng điền đầy đủ thông tin!", 400));
    }

    Object.assign(patient, { firstName, lastName, email, phone, gender, dob, nic });

    await patient.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật hồ sơ bệnh nhân thành công!",
      patient,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật hồ sơ bệnh nhân:", error);
    next(new ErrorHandler("Có lỗi xảy ra khi cập nhật hồ sơ bệnh nhân.", 500));
  }
});



export const updatePatientHandler = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await User.findById(id);

    if (!patient || patient.role !== "Bệnh nhân") {
      return next(new ErrorHandler("Không tìm thấy bệnh nhân", 404));
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      dob,
      nic,
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !gender || !dob || !nic) {
      return next(new ErrorHandler("Xin vui lòng điền đầy đủ thông tin!", 400));
    }

    Object.assign(patient, { firstName, lastName, email, phone, gender, dob, nic });


    await patient.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật tài khoản bệnh nhân thành công!",
      updateUser: patient,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật tài khoản bệnh nhân:", error);
    next(new ErrorHandler("Có lỗi xảy ra khi cập nhật tài khoản bệnh nhân.", 500));
  }
});