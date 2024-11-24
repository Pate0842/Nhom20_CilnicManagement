import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../main";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MedicalRecordStatus = () => {
  const { user } = useContext(Context);
  const [medicalRecords, setMedicalRecords] = useState([]); 
  const navigate = useNavigate();

  // Lấy thông tin hồ sơ bệnh án từ patientId
  useEffect(() => {
    if (user && user._id) {
      fetchMedicalRecords(user._id);  // Dùng patientId từ user để lấy hồ sơ bệnh án
    }
  }, [user]);

  // Fetch hồ sơ bệnh án liên quan đến patientId
  const fetchMedicalRecords = async (patientId) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/v1/medical-record/get/${patientId}`, {
        withCredentials: true,
      });

      const sortedRecords = res.data.records.sort((a, b) =>
        new Date(b.examinationDate) - new Date(a.examinationDate)
      );
      setMedicalRecords(sortedRecords);
    } catch (err) {}
  };

  const handleIdClick = (recordId) => {
    navigate(`/details-medical-record/${recordId}`);
  };

  return (
    <div className="page-content">
      <section className="MedicalRecordStatus page">
        <div className="MedicalRecord-bannerstatus">
          <h5>Trạng Thái Hồ Sơ Bệnh Án</h5>
          {medicalRecords.length === 0 ? (
            <div className="text-center p-4">Không có hồ sơ bệnh án nào.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-2 border">ID Hồ Sơ Bệnh Án</th>
                  <th className="p-2 border">Ngày Khám</th>
                </tr>
              </thead>
              <tbody>
                {medicalRecords.map((record) => (
                  <tr
                    key={record._id}
                    onClick={() => handleIdClick(record._id)}
                    className="hover:bg-gray-100 pointer"
                  >
                    <td className="p-2 border text-blue-600 record-id">{record._id}</td>
                    <td className="p-2 border">
                      {new Date(record.examinationDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
};

export default MedicalRecordStatus;