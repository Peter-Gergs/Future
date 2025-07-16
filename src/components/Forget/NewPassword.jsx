import React, { useEffect, useState } from "react";
import "./Forget.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import API_URL from "../../config";

function NewPassword() {
  const [userdata, setUserdata] = useState({
    password: "",
    confirm_password: "",
  });
  const navigate = useNavigate();
  const { t } = useTranslation("auth");
  const location = useLocation();
  const token = location.state?.token;
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserdata((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${API_URL}/api/password/reset/${token}/`, userdata)
      .then(() => {
        navigate("/login");
      })
      .catch(() => {});
  };
  return (
    <section className="forget">
      <form onSubmit={handleSubmit}>
        <h2>{t("enter_new_password")}</h2>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          placeholder={t("new_password")}
        />
        <input
          type="password"
          name="confirm_password"
          onChange={handleChange}
          placeholder={t("confirm_new_password")}
        />
        <button type="submit">{t("change_password")}</button>
      </form>
    </section>
  );
}

export default NewPassword;
