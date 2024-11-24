import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";

const CreateMedicalRecord = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(Context);

  const [appointment, setAppointment] = useState(null);
  const [prescriptions, setPrescriptions] = useState([{ name: "", quantity: 1, unit: "", usage: "" }]);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([{ serviceId: "", notes: "" }]);
  const [suggestions, setSuggestions] = useState([]);
  const [focusedRow, setFocusedRow] = useState(null);
  const limitedSuggestions = suggestions.slice(0, 100);
  const { state } = useLocation(); // Dữ liệu setAppointments từ Dashboard
  const { setAppointments } = state || {};
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");

  const medicines = [
    { name: "Paracetamol", unit: "Viên", usage: "Tối 1 sáng 1" },
    { name: "Ibuprofen", unit: "Viên", usage: "Tối 1 sáng 1" },
    { name: "Aspirin", unit: "Viên", usage: "Tối 1 sáng 1" },
    { name: "Vitamin C", unit: "Viên", usage: "Tối 1 sáng 1" },
    { name: "Amoxicillin", unit: "Viên", usage: "Tối 1 sáng 1" },
  ];

  // Tải dữ liệu cuộc hẹn
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/appointment/getAppointmentId/${appointmentId}`,
          { withCredentials: true }
        );
        if (data.success) {
          setAppointment(data.appointment);
        } else {
          toast.error(data.message || "Lỗi khi lấy cuộc hẹn.");
        }
      } catch (error) {
        toast.error("Không thể tải cuộc hẹn.");
      }
    };

    if (appointmentId) {
      fetchAppointment();
    }
  }, [appointmentId]);

  // Tải danh sách dịch vụ
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/service/getAll", { withCredentials: true });
        if (data.success) {
          setServices(data.services);
        } else {
          toast.error(data.message || "Lỗi khi tải danh sách dịch vụ.");
        }
      } catch (error) {
        toast.error("Không thể tải danh sách dịch vụ.");
      }
    };

    fetchServices();
  }, []);

  // Gửi yêu cầu tạo hồ sơ bệnh án
  const handleSubmit = async (e) => {
    e.preventDefault();
    const medicalRecord = {
      appointmentId: appointment._id,
      examinationDate: e.target.examinationDate.value,
      diagnosis: e.target.diagnosis.value,
      prescriptions: prescriptions.map((prescription) => ({
        medicineName: prescription.name,
        dosage: prescription.quantity,
        unit: prescription.unit,
        usage: prescription.usage,
      })),
      services: selectedServices.map((service) => ({
        serviceId: service.serviceId,
        notes: service.notes,
      })),
      paymentStatus: "Unpaid",
    };

    try {
      const response = await axios.post("http://localhost:4000/api/v1/medical-record/post", medicalRecord, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        toast.success("Hồ sơ bệnh án đã được tạo thành công!");
        if (setAppointments) {
          setAppointments((prevAppointments) =>
            prevAppointments.filter((appointment) => appointment._id !== appointmentId)
          );
        }
        navigate("/");
      }
    } catch (error) {
      toast.error("Đã có lỗi khi tạo hồ sơ bệnh án.");
    }
  };

  // Quản lý đơn thuốc
  const handlePrescriptionChange = (index, field, value) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index][field] = value;

    if (field === "name" && value.trim() !== "") {
      const filteredSuggestions = medicines.filter((medicine) =>
        medicine.name.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setFocusedRow(index);
    } else {
      setFocusedRow(null);
    }

    setPrescriptions(updatedPrescriptions);
  };

  const addPrescription = () => {
    setPrescriptions([...prescriptions, { name: "", quantity: 1, unit: "", usage: "" }]);
  };

  const deletePrescription = (index) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  // Quản lý dịch vụ
  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...selectedServices];
    updatedServices[index][field] = value;
    setSelectedServices(updatedServices);
  };

  const addService = () => {
    setSelectedServices([...selectedServices, { serviceId: "", notes: "" }]);
  };

  const deleteService = (index) => {
    setSelectedServices(selectedServices.filter((_, i) => i !== index));
  };

  const getTodayVN = () => {
    const vietnamTime = new Date().toLocaleString("en-US", { 
      timeZone: "Asia/Ho_Chi_Minh",
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    // Convert to YYYY-MM-DD format
    const [month, day, year] = vietnamTime.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };
  
  return (
    <section className="page">
      <section className="container add-doctor-form">
        <h1 className="form-title">TẠO HỒ SƠ BỆNH ÁN</h1>
        {appointment ? (
          <form onSubmit={handleSubmit}>
            <div className="form-body">
              <div className="input-group">
                <input type="text" value={appointment.firstName || ""} readOnly placeholder="Họ" />
                <input type="text" value={appointment.lastName || ""} readOnly placeholder="Tên" />
              </div>
              <textarea name="diagnosis" placeholder="Chẩn đoán" required></textarea>
              <input
                type="date"
                name="examinationDate"
                defaultValue={getTodayVN()}
              />
              <div className="prescriptions">
                <h3>Đơn thuốc</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Tên thuốc</th>
                      <th>Số lượng</th>
                      <th>Đơn vị</th>
                      <th>Liều dùng</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.map((prescription, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="text"
                            value={prescription.name}
                            onChange={(e) => handlePrescriptionChange(index, "name", e.target.value)}
                            placeholder="Tên thuốc"
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={prescription.quantity}
                            onChange={(e) => handlePrescriptionChange(index, "quantity", e.target.value)}
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={prescription.unit}
                            onChange={(e) => handlePrescriptionChange(index, "unit", e.target.value)}
                            placeholder="Đơn vị"
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={prescription.usage}
                            onChange={(e) => handlePrescriptionChange(index, "usage", e.target.value)}
                            placeholder="Liều dùng"
                          />
                        </td>
                        <td>
                          <button type="button" onClick={() => deletePrescription(index)}>Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="button" onClick={addPrescription}>Thêm thuốc</button>
              </div>

              <div className="services">
                <h3>Dịch vụ</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Dịch vụ</th>
                      <th>Ghi chú</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedServices.map((service, index) => (
                      <tr key={index}>
                        <td>
                          <select
                            value={service.serviceId}
                            onChange={(e) => handleServiceChange(index, "serviceId", e.target.value)}
                            required
                          >
                            <option value="">Chọn dịch vụ</option>
                            {services.map((service) => (
                              <option key={service._id} value={service._id}>
                                {service.serviceName}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            value={service.notes}
                            onChange={(e) => handleServiceChange(index, "notes", e.target.value)}
                            placeholder="Ghi chú"
                          />
                        </td>
                        <td>
                          <button type="button" onClick={() => deleteService(index)}>Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="button" onClick={addService}>Thêm dịch vụ</button>
              </div>
              <button type="submit" className="submit-btn">Tạo hồ sơ</button>
            </div>
          </form>
        ) : (
          <p>Đang tải thông tin...</p>
        )}
      </section>
    </section>
  );
};

export default CreateMedicalRecord;