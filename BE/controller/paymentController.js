import { Payment } from "../models/paymentSchema.js";
import { MedicalRecord } from "../models/medicalRecordSchema.js"; 
import axios from "axios";
import CryptoJS from "crypto-js";
import moment from "moment";

const zalopayConfig = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

export const createPayment = async (req, res) => {
  const { medicalRecordId, amount, description } = req.body;

  try {
    const medicalRecord = await MedicalRecord.findById(medicalRecordId).populate("patientId", "_id");
    if (!medicalRecord) {
      return res.status(404).json({ message: "Hồ sơ y tế không tồn tại!" });
    }

    const patientId = medicalRecord.patientId._id;
    const transID = Math.floor(Math.random() * 1000000);
    const callbackURL = "https://a35d-2401-d800-2a61-185e-c15d-c11e-15da-7f5f.ngrok-free.app/api/v1/payment/callback";

    const order = {
      app_id: zalopayConfig.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
      app_user: patientId.toString(),
      app_time: Date.now(),
      item: JSON.stringify([]),
      embed_data: JSON.stringify({}),
      amount,
      description,
      bank_code: "",
      callback_url: callbackURL,
    };

    const data = zalopayConfig.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = CryptoJS.HmacSHA256(data, zalopayConfig.key1).toString();

    const response = await axios.post(zalopayConfig.endpoint, null, { params: order });

    if (response.data && response.data.return_code === 1) {
      const payment = await Payment.create({
        medicalRecordId,
        appointmentId: medicalRecord.appointmentId,
        amount,
        appTransId: order.app_trans_id,
        mac: order.mac,
        paymentStatus: "Pending",
        description,
      });

      return res.status(201).json({
        success: true,
        payment,
        zalopay: {
          order_url: response.data.order_url,
          return_code: response.data.return_code
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Không thể tạo giao dịch Zalopay",
        zalopayResponse: response.data
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi tạo thanh toán!",
      error: error.message
    });
  }
};

export const paymentCallback = async (req, res) => {
    console.log("Full request body:", req.body);
    console.log("Request method:", req.method);
    console.log("Headers:", req.headers);
  
    let result = {};
  
    try {
      // Kiểm tra nếu thiếu dữ liệu hoặc mac
      if (!req.body || !req.body.data || !req.body.mac) {
        return res.status(400).json({
          return_code: -1,
          return_message: "Invalid callback data"
        });
      }
  
      // Lấy dữ liệu và mac từ request
      const { data: dataStr, mac: reqMac } = req.body;
  
      // Tính toán mac từ dataStr
      const mac = CryptoJS.HmacSHA256(dataStr, zalopayConfig.key2).toString();
  
      console.log("dataStr:", dataStr);
      console.log("Calculated mac:", mac);
      console.log("Received mac:", reqMac);
  
      // Kiểm tra nếu mac nhận được và mac tính toán không khớp
      if (reqMac !== mac) {
        result.return_code = -1;
        result.return_message = "mac not equal";
      } else {
        let dataJson;
        try {
          // Chuyển đổi dataStr thành JSON
          dataJson = JSON.parse(dataStr);
        } catch (jsonError) {
          return res.json({
            return_code: -1,
            return_message: "Invalid JSON format in callback data"
          });
        }
  
        // Lấy thông tin từ dữ liệu JSON
        const { app_trans_id, zp_trans_id, return_code } = dataJson;
  
        // Kiểm tra return_code để xác định trạng thái giao dịch
        console.log('app_trans_id:', app_trans_id);
        console.log('Searching for payment with appTransId:', app_trans_id);

        const existingPayment = await Payment.findOne({ appTransId: app_trans_id });
        console.log('Existing Payment:', existingPayment);

        if (existingPayment) {
        await Payment.findOneAndUpdate(
            { appTransId: app_trans_id },
            { paymentStatus: "Paid", zpTransId: zp_trans_id }
        );
        await MedicalRecord.findByIdAndUpdate(
            existingPayment.medicalRecordId, 
            { paymentStatus: "Paid" }
          );
        } else {
        console.log('No payment found with this appTransId');
        }
      }
    } catch (ex) {
      result.return_code = 0;
      result.return_message = ex.message;
    }
  
    // Trả về kết quả
    res.json(result);
  }; 