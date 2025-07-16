// ProfilePage.jsx
import React, { useState, useEffect } from "react";
import "./profile.css";
import axiosInstance from "../../api/axiosInstance";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const { setLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation("profile");

  useEffect(() => {
    fetchUser();
    fetchOrders();
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setLoggedIn(false);
    navigate("/");
  };

  const fetchUser = async () => {
    axiosInstance
      .get("/api/userinfo/")
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/api/orders/");
      setOrders(res.data.order);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    axiosInstance
      .post("/api/change_password/", passwordData)
      .then(() => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          icon: "success",
          title: "Success",
          text: "Password Changed Successfully",
          confirmButtonText: "OK",
        });
      })
      .catch((err) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          icon: "error",
          title: "Password Not changed",
          text: err.response?.data?.error || "Something went wrong",
          confirmButtonText: "Try Again",
        });
      });
  };

  const renderProfile = () => (
    <div className="profile-form">
      <h2>{t("edit_profile")}</h2>
      <form onSubmit={handlePasswordChange}>
        <div className="row">
          <input type="text" value={user.first_name || ""} disabled />
          <input type="text" value={user.last_name || ""} disabled />
        </div>
        <div className="row">
          <input type="email" value={user.email || ""} disabled />
          <input
            type="text"
            value={user.address || ""}
            disabled
            placeholder="Address"
          />
        </div>
        <h4>{t("password_change")}</h4>
        <input
          type="password"
          placeholder={t("current_password")}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              current_password: e.target.value,
            })
          }
        />
        <input
          type="password"
          placeholder={t("new_password")}
          onChange={(e) =>
            setPasswordData({ ...passwordData, new_password: e.target.value })
          }
        />
        <input
          type="password"
          placeholder={t("confirm_password")}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              confirm_password: e.target.value,
            })
          }
        />
        <div className="actions">
          <button type="button" className="log-out" onClick={handleLogOut}>
            {t("log_out")}
          </button>
          <button type="button" onClick={() => navigate("/")}>
            {t("cancel")}
          </button>
          <button type="submit" className="save">
            {t("save_changes")}
          </button>
        </div>
      </form>
    </div>
  );

  const renderOrders = () => (
    <div className="orders-list">
      <h2>{t("my_orders")}</h2>
      {orders.length === 0 ? (
        <p>{t("no_orders")}</p>
      ) : (
        <div className="orders-container">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span className="order-id">{t("order")} #{order.id}</span>
                <span className="order-status">
                  {t("status")}: {order.order_status}
                </span>
              </div>
              <div className="order-total">
                {t("total")}:{" "}
                <strong>
                  {" "}
                  {order.total_amount}&nbsp;
                  {t("EGP")}
                </strong>
              </div>
              <div className="order-items">
                {order.orderItems?.map((item) => (
                  <div key={item.id} className="order-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-details">
                      × {item.quantity} - {item.price} &nbsp; {t("EGP")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <section className="profile-page">
      <div className="container">
        <div className="sidebar">
          <h3>{t("manage_account")}</h3>
          <ul>
            <li
              onClick={() => setActiveTab("profile")}
              className={activeTab === "profile" ? "active" : ""}
            >
              {t("my_profile")}
            </li>
          </ul>
          <h3>{t("my_orders")}</h3>
          <ul>
            <li
              onClick={() => setActiveTab("orders")}
              className={activeTab === "orders" ? "active" : ""}
            >
              {t("my_orders")}
            </li>
          </ul>
        </div>
        <div className="main-content">
          {activeTab === "profile" && renderProfile()}
          {activeTab === "orders" && renderOrders()}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
