import mongoose from "mongoose";
import validator from "validator";

// Các đầu số hợp lệ cho phone
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

// Các mã tỉnh hợp lệ cho CCCD
const validProvinces = [
  "001", "002", "004", "006", "008", "010", "011", "012", "014", "015",
  "017", "019", "020", "022", "024", "025", "026", "027", "030", "031",
  "033", "034", "035", "036", "037", "038", "040", "042", "044", "045",
  "046", "048", "049", "051", "052", "054", "056", "058", "060", "062",
  "064", "066", "067", "068", "070", "072", "074", "075", "077", "079",
  "080", "082", "083", "084", "086", "087", "089", "091", "092", "093",
  "094", "095", "096"
];

const appointmentSchema = new mongoose.Schema({
  lastName: {
    type: String,
    required: [true, "Họ Là Bắt Buộc!"],
    minLength: [2, "Họ Phải Có Ít Nhất 2 Ký Tự!"],
  },
  firstName: {
    type: String,
    required: [true, "Tên Là Bắt Buộc!"],
    minLength: [2, "Tên Phải Có Ít Nhất 2 Ký Tự!"],
  },
  email: {
    type: String,
    required: [true, "Email Là Bắt Buộc!"],
    validate: [validator.isEmail, "Cung Cấp Một Email Hợp Lệ!"],
  },
  phone: {
    type: String,
    required: [true, "Số Điện Thoại Là Bắt Buộc!"],
    validate: {
      validator: function (value) {
        if (value.length !== 10) {
          return false;
        }
        const prefix = value.substring(0, 3);
        return validPrefixes.includes(prefix);
      },
      message: "Số điện thoại không hợp lệ!",
    },
  },
  cccd: {
    type: String,
    required: [true, "Số CCCD Là Bắt Buộc!"],
    validate: {
      validator: function (cccd) {
        const dob = this.dob;
        const gender = this.gender;

        if (cccd.length !== 12) {
          throw new Error("Số CCCD phải chứa đúng 12 ký tự!");
        }

        const provinceCode = cccd.substring(0, 3);
        const genderCode = cccd[3];
        const birthYearCode = cccd.substring(4, 6);
        const randomDigits = cccd.substring(6);

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
      message: "Số CCCD không hợp lệ!",
    },
  },
  dob: {
    type: Date,
    required: [true, "Ngày Sinh Là Bắt Buộc!"],
    validate: {
      validator: function (value) {
        return value <= new Date();
      },
      message: "Ngày sinh không hợp lệ!",
    },
  },
  gender: {
    type: String,
    required: [true, "Giới Tính Là Bắt Buộc!"],
    enum: ["Nam", "Nữ"],
  },
  appointment_date: {
    type: Date,
    required: [true, "Ngày Hẹn Là Bắt Buộc!"],
    validate: {
      validator: function (value) {
        // Kiểm tra nếu appointment_date lớn hơn hoặc bằng ngày hiện tại
        return value >= new Date().setHours(0, 0, 0, 0); // Đặt giờ về 0 để so sánh với ngày
      },
      message: "Ngày hẹn phải từ hôm nay trở đi!",
    },
  },
  department: {
    type: String,
    required: [true, "Department Name Is Required!"],
  },
  doctor: {
    firstName: {
      type: String,
      required: [true, "Tên Bác Sĩ Là Bắt Buộc!"],
    },
    lastName: {
      type: String,
      required: [true, "Họ Bác Sĩ Là Bắt Buộc!"],
    },
  },
  hasVisited: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
    required: [true, "Địa Chỉ Là Bắt Buộc!"],
  },
  doctorId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  patientId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Đang Chờ", "Đã Chấp Nhận", "Đã Từ Chối", "Đã Kê Đơn"],
    default: "Đang Chờ",
  },
  isProcessed: {
    type: Boolean,
    default: false, 
  },
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);