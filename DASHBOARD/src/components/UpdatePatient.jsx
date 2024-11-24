import axios from "axios";
import { useContext, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";

const UpdatePatient = () => {
  const { isAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();
  const location = useLocation();
  const patient = location.state?.patient;

  const [firstName, setFirstName] = useState(patient?.firstName || "");
  const [lastName, setLastName] = useState(patient?.lastName || "");
  const [email, setEmail] = useState(patient?.email || "");
  const [phone, setPhone] = useState(patient?.phone || "");
  const [nic, setNic] = useState(patient?.nic || "");
  const [dob, setDob] = useState(patient?.dob ? new Date(patient.dob).toISOString().substring(0, 10) : "");
  const [gender, setGender] = useState(patient?.gender || "");



  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("nic", nic);
      formData.append("dob", dob);
      formData.append("gender", gender);



      await axios.put(`http://localhost:4000/api/v1/user/patients/update/${patient._id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Cập nhật bệnh nhân thành công!");
      navigateTo("/patients");
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật tài khoản bệnh nhân!");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page">
      <section className="container add-doctor-form"> 
        <h1 className="form-title">CẬP NHẬT TÀI KHOẢN BỆNH NHÂN</h1>
        <form onSubmit={handleUpdatePatient}>
          <div className="first-wrapper">
            <div>
              <input type="text" placeholder="Họ" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <input type="text" placeholder="Tên" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} readOnly/>
              <input type="tel" placeholder="SDT" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <input type="text" placeholder="CCCD" value={nic} onChange={(e) => setNic(e.target.value)} readOnly/>
              <input 
                type="date" 
                placeholder="Ngày sinh" 
                value={dob} 
                onChange={(e) => setDob(e.target.value)} 
                readOnly
              />
              <select value={gender} onChange={(e) => setGender(e.target.value)} disabled>
                <option value="">Giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
              <button type="submit">Cập nhật</button>
            </div>
          </div>
        </form>
      </section>
    </section>
  );
};

export default UpdatePatient;
