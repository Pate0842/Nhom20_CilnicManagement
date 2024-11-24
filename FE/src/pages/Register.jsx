import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Register = () => {
  const { isAuthenticated } = useContext(Context); 

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Bệnh nhân");
  const navigateTo = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          "http://localhost:4000/api/v1/user/patient/register",
          { firstName, lastName, email, phone, nic, dob, gender, password,confirmPassword,role },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          navigateTo("/login");
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setNic("");
          setDob("");
          setGender("");
          setPassword("");
          setConfirmPassword("");
          setRole("Bệnh nhân");
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <div className="container form-component register-form">
        <h2>Đăng Kí</h2>
        <p>Vui Lòng Đăng Kí Để Tiếp Tục</p>
        <p>
          Vui lòng đăng ký tài khoản để sử dụng đầy đủ các tính năng và đảm bảo an toàn thông tin cá nhân.
          Sau khi đăng ký,bạn sẽ có thể truy cập vào mọi dịch vụ của chúng tôi.
        </p>
        <form onSubmit={handleRegistration}>
          <div>
            <input
              type="text"
              placeholder="Họ"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Tên"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="tel"
              placeholder="Số Điện Thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <input
              type="tel"
              placeholder="CCCD"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
            />
            <input
              type={"date"}
              placeholder="Ngày/Tháng/Năm"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Chọn Giới Tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
            <input
              type="password"
              placeholder="Mật Khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div
            style={{
              gap: "18px",
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
          >
          <input
            type="password"
            placeholder="Xác Nhận Lại Mật Khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
            <p style={{ marginBottom: 0 }}>Đã có tài khoản?</p>
            <Link
              to={"/login"}
              style={{ textDecoration: "none", color: "#271776ca",}}
            >
              Đăng nhập ngay
            </Link>
          </div>
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">Đăng Kí</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;