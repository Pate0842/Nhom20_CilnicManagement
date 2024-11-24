import { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import { Context } from "./main";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import CreateMedicalRecord from "./components/CreateMedicalRecord";
import "./App.css";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setDoctor } =
    useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/doctor/me",
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(true);
        setDoctor(response.data.user);
      } catch  {
        setIsAuthenticated(false);
        setDoctor({});
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
        <Route path="/createMedicalRecord/:appointmentId" element={<CreateMedicalRecord />} />
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;