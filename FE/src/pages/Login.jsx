import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main"; // Import Context
import { Link, useNavigate, Navigate } from "react-router-dom";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context); // Thêm setUser

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password, role: "Bệnh nhân" }, // Không cần confirmPassword
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(res.data.message);
      setIsAuthenticated(true);
      setUser({ firstName: res.data.user.firstName, lastName: res.data.user.lastName }); // Lưu thông tin người dùng
      navigateTo("/");
      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <div className="container form-component login-form">
        <h2>Đăng Nhập</h2>
        <p>Vui Lòng Đăng Nhập Để Tiếp Tục</p>
        <p>
          Phiên truy cập của bạn đã hết hạn,vui lòng xác thực lại tài khoản.Hệ thống yêu cầu xác
          minh định kỳ nhằm đảm bảo an toàn thông tin cá nhân.Bạn cần đăng nhập lại để tiếp
          tục sử dụng dịch vụ của chúng tôi.
        </p>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mật Khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            style={{
              gap: "10px",
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
          >
            <p style={{ marginBottom: 0 }}>Không có tài khoản?</p>
            <Link
              to={"/register"}
              style={{ textDecoration: "none", color: "#271776ca" }}
            >
              Đăng kí ngay
            </Link>
          </div>
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">Đăng Nhập</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
