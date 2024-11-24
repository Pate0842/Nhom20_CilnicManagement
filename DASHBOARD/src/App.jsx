import { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import AddNewDoctor from "./components/AddNewDoctor";
import Messages from "./components/Messages";
import Doctors from "./components/Doctors";
import { Context } from "./main";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import "./App.css";
import UpdateDoctor from "./components/UpdateDoctor";
import Account from "./components/Account";
import UpdatePatient from "./components/UpdatePatient";
import Service from "./components/Service";
import MedicalRecord from "./components/MedicalRecord";
import MedicalRecordDetail from "./components/MedicalRecordDetail";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setAdmin } =
    useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/admin/me",
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(true);
        setAdmin(response.data.user);
      } catch  {
        setIsAuthenticated(false);
        setAdmin({});
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctor/addnew" element={<AddNewDoctor />} />
        <Route path="/patients" element={<Account />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/updateDoctor/:doctorId" element={<UpdateDoctor />} />
        <Route path="/updatePatient/:patientId" element={<UpdatePatient />} />
        <Route path="/services" element={<Service />} />
        <Route path="/medical-records" element={<MedicalRecord />} />
        <Route path="/medical-records/:id" element={<MedicalRecordDetail />} />
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;