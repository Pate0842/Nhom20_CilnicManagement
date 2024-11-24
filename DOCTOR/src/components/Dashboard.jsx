import { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [todayAppointmentsCount, setTodayAppointmentsCount] = useState(0); // Thêm trạng thái lưu số lượng cuộc hẹn hôm nay
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // Default to today
  const { isAuthenticated, doctor } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/appointment/getallDoctor",
          { withCredentials: true }
        );

        // Lọc các cuộc hẹn thuộc về bác sĩ hiện tại
        const doctorAppointments = data.appointments.filter(
          (appointment) => appointment.doctorId === doctor._id
        );

        // Đếm tổng số cuộc hẹn của bác sĩ hiện tại
        setTotalAppointments(doctorAppointments.length);

        // Lọc các cuộc hẹn đã chấp nhận và chưa xử lý
        const approvedAppointments = doctorAppointments.filter(
          (appointment) =>
            appointment.status === "Đã Chấp Nhận" && !appointment.isProcessed
        );

        // Lọc các cuộc hẹn trong ngày hôm nay
        const today = new Date().toISOString().split("T")[0];
        const todayAppointments = approvedAppointments.filter((appointment) =>
          appointment.appointment_date.startsWith(today)
        );

        // Cập nhật số lượng cuộc hẹn hôm nay
        setTodayAppointmentsCount(todayAppointments.length);

        // Lọc các cuộc hẹn theo ngày được chọn
        const filteredAppointments = approvedAppointments.filter((appointment) =>
          appointment.appointment_date.startsWith(selectedDate)
        );

        setAppointments(filteredAppointments);
      } catch {
        setAppointments([]);
        setTodayAppointmentsCount(0);
        setTotalAppointments(0);
      }
    };

    if (doctor) {
      fetchAppointments();
    }
  }, [doctor, selectedDate]); // Re-fetch khi ngày thay đổi

  const handleCreateMedicalRecord = (appointmentId) => {
    navigate(`/createMedicalRecord/${appointmentId}`);
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
                <p>Hello,</p>
                <h5>{doctor && `${doctor.firstName} ${doctor.lastName}`} </h5>
              </div>
            </div>
          </div>
          <div className="secondBox">
            <p>Cuộc hẹn hôm nay</p>
            <h3>{todayAppointmentsCount}</h3> {/* Luôn hiển thị số cuộc hẹn hôm nay */}
          </div>
          <div className="thirdBox">
            <p>Tổng số cuộc hẹn</p>
            <h3>{totalAppointments}</h3>
          </div>
        </div>
        <div className="banner">
          <div className="header">
            <h5>Danh sách khám</h5>
            <input
              type="date"
              className="date-picker"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <table>
            <thead>
              <tr>
                <th>Tên bệnh nhân</th>
                <th>Email</th>
                <th>SDT</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {appointments && appointments.length > 0
                ? appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                      <td>{appointment.email}</td>
                      <td>{appointment.phone}</td>
                      <td>
                        <a
                          className="kedon"
                          href=""
                          onClick={() => handleCreateMedicalRecord(appointment._id)} // Redirect to create medical record
                        >
                          Kê đơn
                        </a>
                      </td>
                    </tr>
                  ))
                : "Không có lịch khám nào!"}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
