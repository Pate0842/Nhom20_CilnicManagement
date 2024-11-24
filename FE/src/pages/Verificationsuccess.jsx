import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng

const Verificationsuccess = () => {
  const navigate = useNavigate(); // Khởi tạo navigate để sử dụng

  useEffect(() => {
    // Sử dụng setTimeout để chuyển hướng sau 3 giây
    const timer = setTimeout(() => {
      navigate('/login'); // Điều hướng đến trang đăng nhập
    }, 3000); // 10000ms = 10s

    // Dọn dẹp khi component unmount
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="verification-success-container">
      <div className="message-box">
        <img 
          src="/ltn.png"  // Thay bằng đường dẫn tới file hình PNG của bạn
          alt="Xác thực thành công"
          className="verification-image"  // Thêm lớp CSS để tùy chỉnh hình ảnh
        />
        <p>Xin chân thành cảm ơn bạn vì đã sử dụng dịch vụ của chúng tôi!
        HappyTeeth xin thông báo tài khoản của bạn đã được đăng kí thành công và sẽ chuyển qua đăng nhập.
        </p>
      </div>
    </div>
  );
};

export default Verificationsuccess;
