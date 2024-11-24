import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AppointmentForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cccd, setcccd] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [department, setDepartment] = useState("NHA NHI");
  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  const [address, setAddress] = useState("");
  const [hasVisited, setHasVisited] = useState(false);

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

  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    const fetchDoctors = async () => {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/user/doctors",
        { withCredentials: true }
      );
      setDoctors(data.doctors);
      console.log(data.doctors);
    };
    fetchDoctors();
  }, []);

  const handleDobChange = (e) => {
    const today = new Date();
    const selectedDate = new Date(e.target.value);
    if (selectedDate > today) {
      setDob(today.toISOString().split("T")[0]);
      toast.error("Ngày sinh không thể lớn hơn ngày hiện tại. Tự động đặt thành ngày hôm nay.");
    } else {
      setDob(e.target.value);
    }
  };

  const handleAppointmentDateChange = (e) => {
    const today = new Date();
    const selectedDate = new Date(e.target.value);
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setAppointmentDate("");
      toast.error("Ngày hẹn phải lớn hơn ngày hôm nay.");
    } else {
      setAppointmentDate(e.target.value);
    }
  };

  const handleAppointment = async (e) => {
    e.preventDefault();
    try {
      const hasVisitedBool = Boolean(hasVisited);
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/appointment/post",
        {
          firstName,
          lastName,
          email,
          phone,
          cccd,
          dob,
          gender,
          appointment_date: appointmentDate,
          department,
          doctor_firstName: doctorFirstName,
          doctor_lastName: doctorLastName,
          hasVisited: hasVisitedBool,
          address,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setcccd("");
      setDob("");
      setGender("");
      setAppointmentDate("");
      setDepartment("NHA NHI");
      setDoctorFirstName("");
      setDoctorLastName("");
      setHasVisited(false);
      setAddress("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="container form-component appointment-form">
        <h2>Đặt Lịch Hẹn</h2>
        <form onSubmit={handleAppointment}>
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
              value={cccd}
              onChange={(e) => setcccd(e.target.value)}
            />
            <input
              type="date"
              placeholder="Ngày sinh"
              value={dob}
              onChange={handleDobChange}
            />
          </div>
          <div>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Chọn Giới Tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
            <input
              type="date"
              placeholder="Ngày Hẹn"
              value={appointmentDate}
              onChange={handleAppointmentDateChange}
            />
          </div>
          <div>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setDoctorFirstName("");
                setDoctorLastName("");
              }}
            >
              {departmentsArray.map((depart, index) => (
                <option value={depart} key={index}>
                  {depart}
                </option>
              ))}
            </select>
            <select
              value={`${doctorFirstName} ${doctorLastName}`}
              onChange={(e) => {
                const [firstName, lastName] = e.target.value.split(" ");
                setDoctorFirstName(firstName);
                setDoctorLastName(lastName);
              }}
              disabled={!department}
            >
              <option value="">Chọn Bác Sĩ</option>
              {doctors
                .filter((doctor) => doctor.doctorDepartment === department)
                .map((doctor, index) => (
                  <option
                    value={`${doctor.firstName} ${doctor.lastName}`}
                    key={index}
                  >
                    {doctor.firstName} {doctor.lastName}
                  </option>
                ))}
            </select>
          </div>
          <textarea
            rows="10"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Địa Chỉ"
          />
          <div
            style={{
              gap: "10px",
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
          >
          </div>
          <button style={{ margin: "0 auto" }}>Đặt lịch</button>
        </form>
      </div>
    </>
  );
};

export default AppointmentForm;