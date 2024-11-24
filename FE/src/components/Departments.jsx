import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const Departments = () => {
  const departmentsArray = [
    {
      name: "NHA NHI",
      imageUrl: "/departments/Nha nhi.jpg",
    },  
    {
      name: "PHẪU THUẬT HÀM MẶT",
      imageUrl: "/departments/Phẫu thuật hàm mặt.jpg",
    },
    {
      name: "CHỈNH NHA  ",
      imageUrl: "/departments/Chỉnh nha.jpg",
    },
    {
      name: "NỘI NHA",
      imageUrl: "/departments/Nội nha.jpg",
    },
    {
      name: "NHA CHU",
      imageUrl: "/departments/Nha chu.png",
    },
    {
      name: "CẤY GHÉP NHA KHOA",
      imageUrl: "/departments/Cấy Ghép Nha Khoa.jpg",
    },
    {
      name: "CHẨN ĐOÁN HÌNH ẢNH",
      imageUrl: "/departments/Chẩn đoán hình ảnh.jpg",
    },
    {
      name: "THẪM MỸ NHA KHOA",
      imageUrl: "/departments/Thẫm mỹ nha khoa.jpg",
    },
    {
      name: "NHA KHOA PHỤC HÌNH ",
      imageUrl: "/departments/Nha khoa phục hình.jpg",
    },
  ];

  const responsive = {
    extraLarge: {
      breakpoint: { max: 3000, min: 1324 },
      items: 4,
      slidesToSlide: 1, // optional, default to 1.
    },
    large: {
      breakpoint: { max: 1324, min: 1005 },
      items: 3,
      slidesToSlide: 1, // optional, default to 1.
    },
    medium: {
      breakpoint: { max: 1005, min: 700 },
      items: 2,
      slidesToSlide: 1, // optional, default to 1.
    },
    small: {
      breakpoint: { max: 700, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  return (
    <>
      <div className="container departments">
        <h2>Khoa</h2>
        <Carousel
          responsive={responsive}
          removeArrowOnDeviceType={[
            // "superLargeDesktop",
            // "desktop",
            "tablet",
            "mobile",
          ]}
        >
          {departmentsArray.map((depart, index) => {
            return (
              <div key={index} className="card">
                <div className="depart-name">{depart .name}</div>
                <img src={depart.imageUrl} alt="Department" />
              </div>
            );
          })}
        </Carousel>
      </div>
    </>
  );
};

export default Departments;