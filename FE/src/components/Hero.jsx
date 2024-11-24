import PropTypes from "prop-types";

const Hero = ({ title, imageUrl }) => {
  return (
    <div className="hero container">
      <div className="banner">
        <h1>{title}</h1>
        <p>
          Bệnh viện Nha khoa Happy Teeths là cơ sở nha khoa hiện đại hàng đầu, chuyên cung cấp các dịch
          vụ chăm sóc răng miệng toàn diện với sự tận tâm và chuyên nghiệp. Đội ngũ bác sĩ của chúng tôi
          cam kết mang đến sự chăm sóc cá nhân hóa, đáp ứng từng nhu cầu riêng biệt của mỗi bệnh nhân.
          Tại Happy Teeths, chúng tôi đặt nụ cười và sức khỏe răng miệng của bạn lên hàng đầu, đảm bảo
          hành trình chăm sóc nhẹ nhàng và hiệu quả cho một nụ cười khỏe đẹp và dài lâu.
        </p>
      </div>
      <div className="banner">
        <img src={imageUrl} alt="hero" className="animated-image" />
        <span>
          <img src="/Vector.png" alt="vector" />
        </span>
      </div>
    </div>
  );
};

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

export default Hero;
