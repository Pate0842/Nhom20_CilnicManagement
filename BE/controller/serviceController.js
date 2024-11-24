import { Service } from "../models/serviceSchema.js";

// Tạo dịch vụ mới
export const createService = async (req, res) => {
  try {
    const { serviceName, description, cost } = req.body;

    // Kiểm tra nếu tên dịch vụ đã tồn tại
    const existingService = await Service.findOne({ serviceName });
    if (existingService) {
      return res.status(400).json({
        success: false,
        message: "Dịch vụ này đã tồn tại!",
      });
    }

    const newService = new Service({ serviceName, description, cost });
    await newService.save();

    res.status(201).json({
      success: true,
      message: "Dịch vụ mới đã được tạo thành công!",
      service: newService,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Không thể tạo dịch vụ.",
      error: error.message,
    });
  }
};

// Lấy danh sách tất cả các dịch vụ
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });

    res.status(200).json({
      success: true,
      message: "Danh sách dịch vụ đã được lấy thành công!",
      services,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Không thể lấy danh sách dịch vụ.",
      error: error.message,
    });
  }
};

// Lấy dịch vụ theo ID
export const getServiceById = async (req, res) => {
    try {
      const { id } = req.params;
      const service = await Service.findById(id);
  
      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Dịch vụ không tồn tại!",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Dịch vụ đã được lấy thành công!",
        service,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Không thể lấy dịch vụ.",
        error: error.message,
      });
    }
};
  

// Cập nhật dịch vụ
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedService = await Service.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: "Dịch vụ không tồn tại!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Dịch vụ đã được cập nhật thành công!",
      updatedService,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Không thể cập nhật dịch vụ.",
      error: error.message,
    });
  }
};

// Xóa (ngừng kích hoạt) dịch vụ
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedService = await Service.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!deletedService) {
      return res.status(404).json({
        success: false,
        message: "Dịch vụ không tồn tại!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Dịch vụ đã được ngừng kích hoạt!",
      deletedService,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Không thể xóa dịch vụ.",
      error: error.message,
    });
  }
};