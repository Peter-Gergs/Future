import React, { useState } from "react";
import signPhoto from "../../assets/signin.png";
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { useTranslation } from "react-i18next";
import API_URL from "../../config";

function SignUp() {
  const { t } = useTranslation("auth");
  const [userdata, setUserdata] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userdata.password !== userdata.confirm_password) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        icon: "error",
        title: t("password_mismatch_title"),
        text: t("password_mismatch_text"),
        confirmButtonText: t("ok"),
      });
    } else {
      axios
        .post(`${API_URL}/api/register/`, userdata)
        .then((res) => {
          const MySwal = withReactContent(Swal);
          MySwal.fire({
            icon: "success",
            title: res.data.details,
            confirmButtonText: t("ok"),
          });
          navigate("/login");
        })
        .catch((err) => {
          const MySwal = withReactContent(Swal);
          MySwal.fire({
            icon: "error",
            title: err.response.data.error || t("registration_failed"),
            confirmButtonText: t("try_again"),
          });
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserdata((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="authentication">
      <div className="container">
        <div className="image">
          <img src={signPhoto} alt="Sign in Cart" />
        </div>
        <form onSubmit={handleSubmit}>
          <h2>{t("create_account")}</h2>
          <div>{t("enter_details")}</div>
          <div className="name">
            <input
              type="text"
              name="first_name"
              placeholder={t("first_name")}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder={t("last_name")}
              onChange={handleChange}
              required
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder={t("email")}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder={t("password")}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirm_password"
            placeholder={t("confirm_password")}
            onChange={handleChange}
            required
          />
          <button type="submit">{t("create_account")}</button>
          <div className="login-footer">
            <span>{t("already_have_account")}</span>{" "}
            <Link to={"/login"}>{t("login")}</Link>
          </div>
        </form>
      </div>
    </section>
  );
}

export default SignUp;
