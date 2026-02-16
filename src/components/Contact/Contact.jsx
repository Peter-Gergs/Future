import React, { useState } from "react";
import "./Contact.css";
import withReactContent from "sweetalert2-react-content";
import API_URL from "../../config";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import axios from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Contact() {
  const { t } = useTranslation("contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/contact/`, formData);
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        icon: "success",
        title: t("alerts.success"),
        confirmButtonText: t("alerts.ok"),
      });
      navigate("/");
    } catch (err) {
      console.log(err.response?.data);
      toast.error(t("alerts.error"));
    }
  };

  return (
    <section className="contact">
      <div className="container">
        <div className="info">
          <p>
            📌 {t("hotline")} <br /> ☎️ 01202327232
          </p>

          <h4>🛒 {t("branches.title")}</h4>
          <p>
            📌 {t("branches.bustan")} <br /> ☎️ 0223909935
          </p>
          <p>
            📌 {t("branches.attaba")} <br /> ☎️ 0223938170
          </p>
          <p>
            📌 {t("branches.may")} <br /> ☎️ 25452001 - 25452002 - 25452003
          </p>
        </div>

        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                name="name"
                placeholder={t("form.name")}
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder={t("form.email")}
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                name="phone"
                placeholder={t("form.phone")}
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <textarea
                name="message"
                placeholder={t("form.message")}
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">
              {t("form.send")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
