import { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { MdEdit, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const [patients, setPatients] = useState([]); 
  const { isAuthenticated, admin } = useContext(Context);
  const [doctors, setDoctors] = useState([]);
  const navigateTo = useNavigate();

  // Hàm để lấy dữ liệu người dùng từ API
  const fetchPatients = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/user/patients",
        { withCredentials: true }
      );
      console.log("Data received from API:", data); // Kiểm tra dữ liệu trả về
      if (data.success) {
        setPatients(data.patients); // Lưu danh sách bệnh nhân vào state
      } else {
        toast.error(data.message || "Không tìm thấy bệnh nhân!");
      }
    } catch (error) {
      console.error("Error fetching patients:", error); // Kiểm tra lỗi
      toast.error(error.response?.data?.message || "Lỗi khi tải dữ liệu!");
    }
  };

  useEffect(() => {
    fetchPatients(); // Gọi hàm để lấy dữ liệu khi component được mount
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

  // Kiểm tra nếu người dùng chưa đăng nhập thì chuyển hướng đến trang đăng nhập
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  const handleEdit = (patientId) => {
    const patientToUpdate = patients.find(patient => patient._id === patientId);
    navigateTo(`/updatePatient/${patientId}`, { state: { patient: patientToUpdate } });
  };

  const handleDelete = async (patientId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:4000/api/v1/user/patients/delete/${patientId}`,
        { withCredentials: true }
      );
      setPatients(patients.filter((patient) => patient._id !== patientId));
      toast.success(data.message || "Tài khoản bệnh nhân đã được xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa:", error.response);
      toast.error(error.response?.data?.message || "Lỗi khi xóa tài khoản bệnh nhân!");
    }
  };

  return (
    <section className="dashboard page">
      <div className="banner">
        <div className="firstBox">
          <img src="/doc.png" alt="docImg" />
          <div className="content">
            <div>
              <p>Hello,</p>
              <h5>{admin && `${admin.firstName} ${admin.lastName}`}</h5>
            </div>
          </div>
        </div>
        <div className="secondBox">
          <p>Tổng số người dùng</p>
          <h3>{patients.length}</h3>
        </div>
        <div className="thirdBox">
          <p>Tổng số bác sĩ</p>
          <h3>{doctors.length}</h3>
        </div>
      </div>
      <div className="banner">
        <h5>Danh sách tài khoản bệnh nhân</h5>
        <table>
          <thead>
            <tr>
              <th>Tên bệnh nhân</th>
              <th>Email</th>
              <th>SDT</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 ? ( // Kiểm tra xem có bệnh nhân không
              patients.map((patient) => (
                <tr key={patient._id}>
                  <td>{`${patient.firstName} ${patient.lastName}`}</td>
                  <td>{patient.email}</td>
                  <td>{patient.phone}</td>
                  <td>
                  <div className="action-icons">
                    <MdEdit 
                      onClick={() => handleEdit(patient._id)} 
                      title="Chỉnh sửa" 
                    />
                    <MdDelete 
                      onClick={() => handleDelete(patient._id)} 
                      style={{ color: 'red' }} 
                      title="Xóa" 
                    />
                  </div>
                </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>Không có tài khoản nào!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Account;
