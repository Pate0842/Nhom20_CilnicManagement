import Hero from "../components/Hero";
import Biography from "../components/Biography";
import MessageForm from "../components/MessageForm";
import Departments from "../components/Departments";

const Home = () => {
  return (
    <>
      <Hero
        title={
          "Chào mừng đến với Bệnh viện Nha khoa Happy Teeth | Nơi mang đến nụ cười khỏe đẹp và dịch vụ chăm sóc răng miệng đáng tin cậy dành cho bạn."
        }
        imageUrl={"/public/hero.png"}
      />
      <Biography imageUrl={"/dentist.png"} />
      <Departments />
      <MessageForm />
    </>
  );
};
export default Home;