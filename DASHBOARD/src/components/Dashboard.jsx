import { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedTab, setSelectedTab] = useState("appointments");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/appointment/getall",
          { withCredentials: true }
        );
  
        // Sort appointments by date in descending order (newest first)
        const sortedAppointments = data.appointments.sort(
          (a, b) => new Date(b.appointment_date) - new Date(a.appointment_date)
        );
        
        // Display sorted appointments
        setAppointments(sortedAppointments);
      } catch {
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, []);
  

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/medicalRecord/getall",
          { withCredentials: true }
        );
        setMedicalRecords(data.medicalRecords);
      } catch {
        setMedicalRecords([]);
      }
    };
    fetchMedicalRecords();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    // Find the current appointment
    const appointment = appointments.find((app) => app._id === appointmentId);
  
    // Check if the status has already been updated from "Đang Chờ"
    if (appointment.status !== "Đang Chờ") {
      toast.error("Bạn không thể thay đổi trạng thái cuộc hẹn này nữa!");
      return; // Stop further execution if status is already updated
    }
  
    try {
      const hasVisited = status === "Đã Chấp Nhận"; // Automatically mark as visited if accepted
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/appointment/update/${appointmentId}`,
        { status, hasVisited },
        { withCredentials: true }
      );
  
      // Update the state with the new status
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status, hasVisited }
            : appointment
        )
      );
  
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  

  const { isAuthenticated, admin } = useContext(Context);
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
                <h5>
                  {admin && `${admin.firstName} ${admin.lastName}`}{" "}
                </h5>
              </div>
            </div>
          </div>
          <div className="secondBox">
            <p>Tổng số cuộc hẹn</p>
            <h3>{appointments.length}</h3>
          </div>
          <div className="thirdBox">
            <p>Tổng số bác sĩ</p>
            <h3>{doctors.length}</h3>
          </div>
        </div>
        <div className="banner">
          <h5>Lịch hẹn</h5>
          <table>
            <thead>
              <tr>
                <th>Tên bệnh nhân</th>
                <th>Ngày hẹn</th>
                <th>Email</th>
                <th>SDT</th>
                <th>Tên bác sĩ</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {appointments && appointments.length > 0
                ? appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                      <td>{new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(appointment.appointment_date))}</td>

                      <td>{appointment.email}</td>
                      <td>{appointment.phone}</td>
                      <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                      <td>
                        <select
                          className={
                            appointment.status === "Đang Chờ"
                              ? "value-pending"
                              : appointment.status === "Đã Chấp Nhận"
                              ? "value-accepted"
                              : "value-rejected"
                          }
                          value={appointment.status}
                          onChange={(e) =>
                            handleUpdateStatus(appointment._id, e.target.value)
                          }
                        >
                          <option value="Đang Chờ" className="value-pending">
                            Đang Chờ
                          </option>
                          <option value="Đã Chấp Nhận" className="value-accepted">
                            Đã Chấp Nhận
                          </option>
                          <option value="Đã Từ Chối" className="value-rejected">
                            Đã Từ Chối
                          </option>
                        </select>
                      </td>
                    </tr>
                  ))
                : "Không có cuộc hẹn nào!"}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Dashboard;