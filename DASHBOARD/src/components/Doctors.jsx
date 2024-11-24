import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated } = useContext(Context);

  const navigateTo = useNavigate();

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

  const handleUpdate = (doctorId) => {
    const doctorToUpdate = doctors.find(doctor => doctor._id === doctorId);
    navigateTo(`/updateDoctor/${doctorId}`, { state: { doctor: doctorToUpdate } });
};

  const handleDelete = async (doctorId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:4000/api/v1/user/doctors/delete/${doctorId}`,
        { withCredentials: true }
      );
      setDoctors(doctors.filter((doctor) => doctor._id !== doctorId));
      toast.success(data.message || "Bác sĩ đã được xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa:", error.response);
      toast.error(error.response?.data?.message || "Lỗi khi xóa bác sĩ!");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page doctors">
      <h1>BÁC SĨ</h1>
      <div className="banner">
        {doctors && doctors.length > 0 ? (
          doctors.map((element) => {
            return (
              <div className="card" key={element._id}>
                <img
                  src={element.docAvatar && element.docAvatar.url}
                  alt="doctor avatar"
                />
                <h4>{`${element.firstName} ${element.lastName}`}</h4>
                <div className="details">
                  <p>
                    Email: <span>{element.email}</span>
                  </p>
                  <p>
                    SDT: <span>{element.phone}</span>
                  </p>
                  <p>
                    Ngày sinh: <span>{new Date(element.dob).toLocaleDateString("vi-VN")}</span>
                  </p>
                  <p>
                    Chuyên khoa: <span>{element.doctorDepartment}</span>
                  </p>
                  <p>
                    Giới tính: <span>{element.gender}</span>
                  </p>
                </div>
                 <div className="actions">
                 <button onClick={() => handleUpdate(element._id)}>Cập nhật</button>
                  <button onClick={() => handleDelete(element._id)}>Xóa</button>
                </div> 
              </div>  
            );
          })
        ) : (
          <h1>Chưa có bác sĩ nào được đăng ký!</h1>
        )}
      </div>
    </section>
  );
};

export default Doctors;
