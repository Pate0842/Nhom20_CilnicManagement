import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Service = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    serviceName: "",
    description: "",
    cost: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/service/getAll",
          { withCredentials: true }
        );
        setServices(data.services);
      } catch (error) {
        toast.error("Không thể tải danh sách dịch vụ.");
      }
    };
    fetchServices();
  }, []);

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/service/create",
        newService,
        { withCredentials: true }
      );
      toast.success(data.message);
      setNewService({ serviceName: "", description: "", cost: "" });
      setServices((prev) => [...prev, data.service]);
      setIsModalOpen(false); // Đóng modal sau khi thêm mới
    } catch (error) {
      toast.error("Không thể thêm dịch vụ.");
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/v1/service/${id}`, {
        withCredentials: true,
      });
      toast.success("Xóa dịch vụ thành công.");
      setServices((prev) => prev.filter((service) => service._id !== id));
    } catch (error) {
      toast.error("Không thể xóa dịch vụ.");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section className="page">
      <div className="dashboard">
        <div className="banner">
          <div className="firstBox">
            <img src="/doc.png" alt="serviceImg" />
            <div className="content">
              <div>
                <h5>Quản lý Dịch vụ</h5>
              </div>
              <p>Thêm, xóa và quản lý các dịch vụ y tế</p>
            </div>
          </div>
          <div className="secondBox">
            <p>Tổng số dịch vụ</p>
            <h3>{services.length}</h3>
          </div>
        </div>

        <div className="banner">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h5>Danh sách Dịch vụ</h5>
            <button onClick={() => setIsModalOpen(true)} className="btn-add-service">
              Thêm mới
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Tên dịch vụ</th>
                <th>Mô tả</th>
                <th>Giá</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {services.length > 0 ? (
                services.map((service) => (
                  <tr key={service._id}>
                    <td>{service.serviceName}</td>
                    <td>{service.description}</td>
                    <td>{formatCurrency(service.cost)}</td>
                    <td>
                    <button
                      onClick={() => handleDeleteService(service._id)}
                      className="cancel-btn"
                    >
                      Xóa
                    </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    Không có dịch vụ nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal thêm dịch vụ */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Thêm Dịch vụ</h3>
            <form onSubmit={handleAddService}>
              <div>
                <input
                  type="text"
                  placeholder="Tên dịch vụ"
                  value={newService.serviceName}
                  onChange={(e) =>
                    setNewService({ ...newService, serviceName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <textarea
                  placeholder="Mô tả dịch vụ"
                  value={newService.description}
                  onChange={(e) =>
                    setNewService({ ...newService, description: e.target.value })
                  }
                  rows="3"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Giá dịch vụ (VND)"
                  value={newService.cost}
                  onChange={(e) =>
                    setNewService({ ...newService, cost: e.target.value })
                  }
                  required
                />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit">Thêm</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Service;