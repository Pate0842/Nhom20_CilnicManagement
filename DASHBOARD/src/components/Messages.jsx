import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { isAuthenticated } = useContext(Context);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/message/getall",
          { withCredentials: true }
        );
        setMessages(data.messages);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    fetchMessages();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page messages">
      <h1>TIN NHẮN</h1>
      <div className="banner">
        {messages && messages.length > 0 ? (
          messages.map((element) => {
            return (
              <div className="card" key={element._id}>
                <div className="details">
                  <p>
                    Họ: <span>{element.firstName}</span>
                  </p>
                  <p>
                    Tên: <span>{element.lastName}</span>
                  </p>
                  <p>
                    Email: <span>{element.email}</span>
                  </p>
                  <p>
                    SDT: <span>{element.phone}</span>
                  </p>
                  <p>
                    Lời nhắn: <span>{element.message}</span>
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <h1>Không có tin nhắn nào!</h1>
        )}
      </div>
    </section>
  );
};

export default Messages;