import { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const MedicalRecord = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]); // State để lưu hồ sơ sau khi lọc
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // Default to today
  const { isAuthenticated, admin } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/medical-record/getAll",
          { withCredentials: true }
        );
        setMedicalRecords(data.medicalRecords);
  
        // Lọc hồ sơ theo ngày hiện tại
        const today = new Date().toISOString().split("T")[0];
        const filtered = data.medicalRecords.filter((record) =>
          record.examinationDate.startsWith(today)
        );
        setFilteredRecords(filtered); // Gán dữ liệu đã lọc
      } catch {
        setMedicalRecords([]);
        setFilteredRecords([]);
      }
    };
  
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/appointment/getall",
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch {
        setAppointments([]);
      }
    };
  
    fetchMedicalRecords();
    fetchAppointments();
  }, []);
 
  const getPatientName = (appointmentId) => {
    const appointment = appointments.find((appt) => appt._id === appointmentId);
    return appointment
      ? `${appointment.firstName} ${appointment.lastName}`
      : "Không xác định";
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Lọc hồ sơ theo ngày
    const filtered = medicalRecords.filter((record) =>
      record.examinationDate.startsWith(date)
    );
    setFilteredRecords(filtered);
  };

  const handleDetailClick = (recordId, appointmentId) => {
    navigate(`/medical-records/${recordId}`, { state: { appointmentId } });
  };
  
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src="/doc.png" alt="docImg" />
            <div className="content">
              <div>
                <p>Hello ,</p>
                <h5>{admin && `${admin.firstName} ${admin.lastName}`}</h5>
              </div>
            </div>
          </div>
          <div className="secondBox">
            <p>Tổng số hồ sơ bệnh án</p>
            <h3>{medicalRecords.length}</h3>
          </div>
        </div>
        <div className="banner">
          <div className="header">
            <h5>Hồ sơ bệnh án</h5>
            <input
              type="date"
              className="date-picker"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </div>
          <table>
            <thead>
              <tr>
                <th>Tên bệnh nhân</th>
                <th>Ngày khám</th>
                <th>Chuẩn đoán</th>
                <th>Bác sĩ</th>
                <th>Thanh toán</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords && filteredRecords.length > 0
                ? filteredRecords.map((record) => (
                    <tr key={record._id}>
                      <td>{getPatientName(record.appointmentId._id)}</td>
                      <td>
                        {new Intl.DateTimeFormat("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }).format(new Date(record.examinationDate))}
                      </td>
                      <td>{record.diagnosis}</td>
                      <td>{`${record.doctor.firstName} ${record.doctor.lastName}`}</td>
                      <td>
                        <span
                          className={`payment-status ${
                            record.paymentStatus === "Paid"
                              ? "paid"
                              : record.paymentStatus === "Pending"
                              ? "pending"
                              : "unpaid"
                          }`}
                        >
                          {record.paymentStatus === "Paid"
                            ? "Đã thanh toán"
                            : record.paymentStatus === "Pending"
                            ? "Đang chờ xử lý"
                            : "Chưa thanh toán"}
                        </span>
                        {record.paymentStatus !== "Paid"}
                      </td>
                      <td>
                        <button
                          className="details-button"
                          onClick={() =>
                            handleDetailClick(record._id, record.appointmentId._id)
                          }
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
                : "Không tìm thấy hồ sơ bệnh án!"}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default MedicalRecord;