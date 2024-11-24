import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";

const MedicalRecordDetail = () => {
  const { isAuthenticated } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [servicesList, setServicesList] = useState([]);

  const medicalRecordId = location.pathname.split("/").pop();
  const appointmentId = location.state?.appointmentId;

  useEffect(() => {
    const fetchServicesList = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/service/getAll", { withCredentials: true });
        setServicesList(data.services);
      } catch (error) {
        toast.error("Không thể tải danh sách dịch vụ");
      }
    };
    fetchServicesList();
  }, []);

  useEffect(() => {
    // Lấy thông tin medical record
    const fetchMedicalRecordDetails = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/medical-record/getDetail/${medicalRecordId}`,
          { withCredentials: true }
        );
        setMedicalRecord(data.medicalRecord);
      } catch (error) {
        toast.error(error.response?.data?.message || "Lỗi khi tải hồ sơ bệnh án!");
      }
    };

    // Lấy danh sách appointments để tìm tên bệnh nhân
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/appointment/getall",
          { withCredentials: true }
        );
        setAppointments(data.appointments);

        // Tìm tên bệnh nhân từ appointmentId
        const appointment = data.appointments.find(
          (appt) => appt._id === appointmentId
        );
        if (appointment) {
          setPatientName(`${appointment.firstName} ${appointment.lastName}`);
        } else {
          setPatientName("Không xác định");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Lỗi khi tải danh sách cuộc hẹn!");
      }
    };

    fetchMedicalRecordDetails();
    fetchAppointments();
  }, [medicalRecordId, appointmentId]);

  const getServiceName = (serviceId) => {
    const service = servicesList.find((s) => s._id === serviceId);
    return service ? service.serviceName : "Không rõ dịch vụ";
  };

  const getServiceCost = (serviceId) => {
    const service = servicesList.find((s) => s._id === serviceId);
    return service ? service.cost : 0;
  };

  // Calculate total cost of all services
  const calculateTotalCost = () => {
    return medicalRecord?.services.reduce((total, service) => {
      const serviceCost = getServiceCost(service.serviceId._id);
      return total + serviceCost;
    }, 0);
  };
  
  const totalCost = calculateTotalCost();

  const handlePayment = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/payment/create-payment",
        {
          medicalRecordId: medicalRecord._id,
          amount: calculateTotalCost(),
          description: `Thanh toán dịch vụ y tế cho hồ sơ ${medicalRecord._id}`,
        },
        { withCredentials: true }
      );
  
      // Kiểm tra và chuyển hướng dựa trên cấu trúc phản hồi từ backend
      if (data.zalopay && data.zalopay.order_url) {
        window.open(data.zalopay.order_url, "_blank");
      } else {
        toast.error("Không nhận được URL thanh toán từ Zalopay!");
        console.error("ZaloPay response:", data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi tạo giao dịch!");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!medicalRecord) {
    return <div>Đang tải thông tin...</div>;
  }

  return (
    <section style={{
      backgroundColor: '#f4f7f9', 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '2rem 0'
    }} 
    className="page">
      <section 
      style={{
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
        maxWidth: '800px', 
        width: '95%', 
        padding: '2rem'
      }} 
      className="container medical-record-detail">
        <h1
        style={{
          textAlign: 'center', 
          color: '#2c3e50', 
          marginBottom: '2rem', 
          fontSize: '1.8rem', 
          borderBottom: '2px solid #3498db', 
          paddingBottom: '10px'
        }}
        className="form-title">CHI TIẾT HỒ SƠ BỆNH ÁN</h1>
        <div className="medical-record-info">
          <h3>Bệnh nhân: {patientName}</h3>
          <p><strong>Ngày khám:</strong> {new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(medicalRecord.examinationDate))}</p>
          <p><strong>Chuẩn đoán:</strong> {medicalRecord.diagnosis}</p>
          <p><strong>Bác sĩ:</strong> {`${medicalRecord.doctor.firstName} ${medicalRecord.doctor.lastName}`}</p>

          <h4>Dịch vụ sử dụng:</h4>
          <ul>
            {medicalRecord.services && medicalRecord.services.length > 0
              ? medicalRecord.services.map((service) => {
                  const serviceName = getServiceName(service.serviceId._id);
                  const serviceCost = getServiceCost(service.serviceId._id);
                  return (
                    <li key={service._id}>
                      <strong>{serviceName}</strong> - {service.notes || "Không có ghi chú"} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(serviceCost)}
                    </li>
                  );
                })
              : "Không có dịch vụ nào."}
          </ul>

          <h4>Tổng chi phí dịch vụ:</h4>
          <p>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalCost)}</p>

          <h4>Đơn thuốc:</h4>
          <ul>
            {medicalRecord.prescriptions && medicalRecord.prescriptions.length > 0
              ? medicalRecord.prescriptions.map((prescription) => (
                  <li key={prescription._id}>
                    <strong>{prescription.medicineName}</strong> - {prescription.dosage} {prescription.unit} - {prescription.usage}
                  </li>
                ))
              : "Không có đơn thuốc nào."}
          </ul>
        </div>

        <button className="back-button" onClick={() => navigate("/medical-records")}>
          Quay lại
        </button>

        {medicalRecord.paymentStatus !== "Paid" && (
          <button className="pay-button" onClick={handlePayment}>
            Thanh toán
          </button>
        )}
      </section>
    </section>
  );
};

export default MedicalRecordDetail;