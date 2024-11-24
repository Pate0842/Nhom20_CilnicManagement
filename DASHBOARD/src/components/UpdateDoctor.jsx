import axios from "axios";
import { useContext, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";

const UpdateDoctor = () => {
  const { isAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();
  const location = useLocation();
  const doctor = location.state?.doctor;

  const [firstName, setFirstName] = useState(doctor?.firstName || "");
  const [lastName, setLastName] = useState(doctor?.lastName || "");
  const [email, setEmail] = useState(doctor?.email || "");
  const [phone, setPhone] = useState(doctor?.phone || "");
  const [nic, setNic] = useState(doctor?.nic || "");
  const [dob, setDob] = useState(doctor?.dob ? new Date(doctor.dob).toISOString().substring(0, 10) : "");
  const [gender, setGender] = useState(doctor?.gender || "");
  const [doctorDepartment, setDoctorDepartment] = useState(doctor?.doctorDepartment || "");
  const [docAvatar, setDocAvatar] = useState("");
  const [docAvatarPreview, setDocAvatarPreview] = useState(doctor?.docAvatar?.url || "");

  const departmentsArray = [
    "NHA NHI",
    "PHẪU THUẬT HÀM MẶT",
    "CHỈNH NHA",
    "NỘI NHA",
    "NHA CHU",
    "CẤY GHÉP NHA KHOA",
    "CHẨN ĐOÁN HÌNH ẢNH",
    "THẪM MỸ NHA KHOA",
    "NHA KHOA PHỤC HÌNH",
  ];

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setDocAvatarPreview(reader.result);
      setDocAvatar(file);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateDoctor = async (e) => {
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
      formData.append("doctorDepartment", doctorDepartment);

      if (docAvatar) formData.append("docAvatar", docAvatar);

      await axios.put(`http://localhost:4000/api/v1/user/doctors/update/${doctor._id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Cập nhật bác sĩ thành công!");
      navigateTo("/doctors");
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật bác sĩ!");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page">
      <section className="container add-doctor-form"> 
        <h1 className="form-title">CẬP NHẬT BÁC SĨ</h1>
        <form onSubmit={handleUpdateDoctor}>
          <div className="first-wrapper">
            <div>
              <img src={docAvatarPreview || "/docHolder.jpg"} alt="Doctor Avatar"/>
              <input type="file" onChange={handleAvatar} />
            </div>
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
              <select value={doctorDepartment} onChange={(e) => setDoctorDepartment(e.target.value)}>
                <option value="">Chuyên khoa</option>
                {departmentsArray.map((depart, index) => (
                  <option value={depart} key={index}>{depart}</option>
                ))}
              </select>
              <button type="submit">Cập nhật</button>
            </div>
          </div>
        </form>
      </section>
    </section>
  );
};

export default UpdateDoctor;
