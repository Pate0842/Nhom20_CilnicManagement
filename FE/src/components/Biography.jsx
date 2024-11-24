import PropTypes from "prop-types";

const Biography = ({ imageUrl }) => {
  return (
    <div className="container biography">
      <div className="banner">
        <img src={imageUrl} alt="whoweare" />
      </div>
      <div className="banner">
        <p>Tiểu sử</p>
        <h3>Giới thiệu về Happy Teeth</h3>
        <p>
        Bệnh viện Nha khoa Happy Teeth tự hào là cơ sở hàng đầu trong lĩnh vực chăm sóc răng miệng,
        mang đến dịch vụ toàn diện với sự tận tâm và chuyên môn cao. Đội ngũ bác sĩ giàu kinh nghiệm của
        chúng tôi luôn sẵn sàng cung cấp các giải pháp điều trị cá nhân hóa, phù hợp với nhu cầu riêng biệt
        của từng bệnh nhân. Tại Happy Teeth, chúng tôi đặt sức khỏe và nụ cười của bạn lên hàng đầu.
        </p>
        <p>Bước vào năm 2024, chúng tôi không ngừng đổi mới, ứng dụng công nghệ hiện đại nhằm nâng cao
           hiệu quả điều trị và sự thoải mái cho bệnh nhân.
        </p>
        <p>
        Chúng tôi cung cấp dịch vụ nha khoa chất lượng, từ các phương pháp điều trị tiên tiến đến các giải
        pháp phòng ngừa hiệu quả. Happy Teeth luôn nỗ lực để nâng cao chất lượng cuộc sống cho bệnh
        nhân và cộng đồng. Chúng tôi cam kết sẽ đồng hành cùng bạn trong hành trình chăm sóc sức khỏe
        răng miệng.
        </p>
        <p>Nụ cười của bạn là niềm tự hào của chúng tôi!</p>
        <p>Happy teeh xin trân trọng cảm ơn.</p>
      </div>
    </div>
  );
};

Biography.propTypes = {
  imageUrl: PropTypes.string.isRequired, // Khai báo kiểu dữ liệu cho imageUrl
};
export default Biography;