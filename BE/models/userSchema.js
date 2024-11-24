import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
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
    validate: {
      validator: function (value) {
        // Kiểm tra độ dài phải là 10 số
        if (value.length !== 10) {
          return false;
        }
        // Kiểm tra đầu số hợp lệ
        const prefix = value.substring(0, 3);
        return validPrefixes.includes(prefix);
      },
      message: "Số điện thoại không hợp lệ!",
    },
  },
  nic: {
    type: String,
    required: [true, "Số Căn cước công dân là bắt buộc!"],
    validate: {
      validator: function (nic) {
        const dob = this.dob;
        const gender = this.gender;
    
        if (nic.length !== 12) {
          throw new Error("Số CCCD phải chứa đúng 12 ký tự!");
        }
    
        const provinceCode = nic.substring(0, 3);
        const genderCode = nic[3];
        const birthYearCode = nic.substring(4, 6);
        const randomDigits = nic.substring(6);
    
        // Kiểm tra mã tỉnh
        if (!validProvinces.includes(provinceCode)) {
          throw new Error("Mã tỉnh không hợp lệ!");
        }
    
        // Kiểm tra mã giới tính và thế kỷ sinh
        const birthYear = dob.getFullYear();
        const birthCentury = Math.floor((birthYear - 1) / 100) + 1;
    
        const genderCenturyMap = {
          "20": { male: "0", female: "1" },
          "21": { male: "2", female: "3" },
          "22": { male: "4", female: "5" },
          "23": { male: "6", female: "7" },
        };
    
        const centuryKey = birthCentury.toString();
        if (
          !genderCenturyMap[centuryKey] ||
          genderCenturyMap[centuryKey][gender === "Nam" ? "male" : "female"] !== genderCode
        ) {
          throw new Error("Mã giới tính hoặc thế kỷ sinh không hợp lệ!");
        }
    
        // Kiểm tra mã năm sinh
        if (birthYear.toString().slice(-2) !== birthYearCode) {
          throw new Error("Mã năm sinh không khớp với ngày sinh!");
        }
    
        // Kiểm tra 6 số ngẫu nhiên cuối
        if (!/^\d{6}$/.test(randomDigits)) {
          throw new Error("6 ký tự cuối của CCCD phải là số!");
        }
    
        return true;
      },
      message: "Số Căn cước công dân không hợp lệ!",
    },    
  },
  
  dob: {
    type: Date,
    required: [true, "Ngày sinh là bắt buộc!"],
    validate: {
      validator: function (value) {
        return value <= new Date();
      },
      message: "Ngày sinh không hợp lệ!",
    },
  },
  gender: {
    type: String,
    required: [true, "Giới tính là bắt buộc!"],
    enum: ["Nam", "Nữ"],
  },
  password: {
    type: String,
    required: [true, "Mật khẩu là bắt buộc!"],
    minLength: [8, "Mật khẩu phải chứa ít nhất 8 ký tự!"],
    select: false,
  },
  role: {
    type: String,
    required: [true, "Vai trò người dùng là bắt buộc!"],
    enum: ["Bệnh nhân", "Bác sĩ", "Admin"],
  },
  doctorDepartment:{
    type: String,
  },
  docAvatar: {
    public_id: String,
    url: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const validPrefixes = [
  "032", "033", "034", "035", "036", "037", "038", "039", // Viettel
  "096", "097", "098", "086", // Viettel
  "083", "084", "085", "081", "082", "088", // Vinaphone
  "091", "094", // Vinaphone
  "070", "079", "077", "076", "078", // Mobifone
  "090", "093", // Mobifone
  "089", // Mobifone
  "056", "058", // Vietnamobile
  "092", // Vietnamobile
  "059", // Gmobile
  "099" // Gmobile
];

const validProvinces = [
  "001", "002", "004", "006", "008", "010", "011", "012", "014", "015",
  "017", "019", "020", "022", "024", "025", "026", "027", "030", "031",
  "033", "034", "035", "036", "037", "038", "040", "042", "044", "045",
  "046", "048", "049", "051", "052", "054", "056", "058", "060", "062",
  "064", "066", "067", "068", "070", "072", "074", "075", "077", "079",
  "080", "082", "083", "084", "086", "087", "089", "091", "092", "093",
  "094", "095", "096"
];

// Middleware để tự động đặt ngày sinh nếu nó lớn hơn ngày hôm nay
userSchema.pre("save", function (next) {
  if (this.dob > new Date()) {
    this.dob = new Date(); // Đặt giá trị ngày sinh bằng ngày hôm nay
  }

  if (!this.isModified("password")) {
    return next();
  }

  bcrypt.hash(this.password, 10).then((hashedPassword) => {
    this.password = hashedPassword;
    next();
  }).catch(next);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);