import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DetailsMedicalRecord = () => {
  const { id } = useParams(); // Lấy ID của hồ sơ bệnh án từ URL
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [appointments, setAppointments] = useState([]); // State lưu danh sách lịch hẹn

  useEffect(() => {
    const fetchMedicalRecordDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/v1/medicalRecord/getDetail/${id}`, {
          withCredentials: true,
        });
        setMedicalRecord(res.data.record);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin hồ sơ bệnh án:", err.response?.data || err.message);
      }
    };

    const fetchAppointments = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/v1/appointment/getuserappointments", {
          withCredentials: true,
        });
        setAppointments(res.data.appointments); // Lưu danh sách lịch hẹn
      } catch (err) {
        console.error("Lỗi khi lấy thông tin lịch hẹn:", err);
      }
    };

    fetchMedicalRecordDetails();
    fetchAppointments(); // Lấy danh sách lịch hẹn
  }, [id]);

  // Tìm lịch hẹn phù hợp từ danh sách appointments
  const appointment = appointments.find(
    (appointment) => appointment._id === medicalRecord?.appointmentId
  );

  return (
    <div className="medical-record-details">
      <h2>Chi Tiết Hồ Sơ Bệnh Án</h2>
      <h3>Thông Tin Bệnh Nhân và Lịch Hẹn</h3>
      <table>
        <tbody>
          {appointment ? (
            <>
              <tr>
                <th>Họ Và Tên</th>
                <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
              </tr>
              <tr>
                <th>Ngày Sinh</th>
                <td>{new Date(appointment.dob).toLocaleDateString("vi-VN")}</td>
              </tr>
              <tr>
                <th>Giới Tính</th>
                <td>{appointment.gender}</td>
              </tr>
              <tr>
                <th>Số Điện Thoại</th>
                <td>{appointment.phone}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{appointment.email}</td>
              </tr>
              <tr>
                <th>Ngày Hẹn</th>
                <td>{new Date(appointment.appointment_date).toLocaleDateString("vi-VN")}</td>
              </tr>
              <tr>
                <th>Khoa</th>
                <td>{appointment.department}</td>
              </tr>
            </>
          ) : (
            <tr>
              <td colSpan="2">Không có lịch hẹn phù hợp.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>Thông Tin Bác Sĩ</h3>
      <table>
        <tbody>
          <tr>
            <th style={{width:324}}>Họ Tên Bác Sĩ</th>
            <td>{medicalRecord?.doctor?.firstName && medicalRecord?.doctor?.lastName ? 
                  `${medicalRecord.doctor.firstName} ${medicalRecord.doctor.lastName}` : "N/A"}
            </td>
          </tr>
          <tr>
            <th>Khoa</th>
            <td>{medicalRecord?.doctor?.department || "N/A"}</td>
          </tr>
        </tbody>
      </table>

      <h3>Thông Tin Hồ Sơ Bệnh Án</h3>
      <table>
        <tbody>
          <tr>
            <th style={{width:326}}>Ngày Khám</th>
            <td>{medicalRecord ? new Date(medicalRecord.examinationDate).toLocaleDateString("vi-VN") : "N/A"}</td>
          </tr>
          <tr>
            <th>Chẩn Đoán</th>
            <td>{medicalRecord?.diagnosis || "N/A"}</td>
          </tr>
        </tbody>
      </table>

      <h3>Đơn Thuốc:</h3>
{medicalRecord?.prescriptions?.length > 0 ? (
  <table>
    <thead>
      <tr>
        <th>Số Thứ Tự</th>
        <th>Tên Thuốc</th>
        <th>Số Lượng</th>
        <th>Đơn Vị Tính</th>
        <th>Cách Dùng</th>
      </tr>
    </thead>
    <tbody>
      {medicalRecord.prescriptions.map((prescription, index) => (
        <tr key={prescription._id}>
          <td>{index + 1}</td> {/* Số thứ tự */}
          <td>{prescription.medicineName}</td> {/* Tên thuốc */}
          <td>{prescription.dosage}</td> {/* Số lượng */}
          <td>{prescription.unit}</td> {/* Đơn vị tính */}
          <td>{prescription.usage || "Không có hướng dẫn"} </td> {/* Cách dùng */}
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p>Không có đơn thuốc nào.</p>
)}
    </div>
  );
};

export default DetailsMedicalRecord;
