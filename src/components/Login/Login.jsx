import React, { useEffect, useState } from "react";
import signPhoto from "../../assets/signin.png";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../config";
import { useTranslation } from "react-i18next";

function SignUp() {
  const [userdata, setUserdata] = useState({
    username: "",
    password: "",
  });
  const { loggedIn, setLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation("auth");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${API_URL}/api/token/`, userdata)
      .then((res) => {
        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh);
        toast.success(t("login_success"));
        setLoggedIn(true);
        navigate("/");
      })
      .catch((err) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          icon: "error",
          title: t("login_failed"),
          text: t("wrong_credentials"),
          confirmButtonText: t("try_again"),
        });
      });
  };

  useEffect(() => {
    if (loggedIn) {
      navigate("/");
    }
  });

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
        <form className="login" onSubmit={handleSubmit}>
          <h2>{t("login_title")}</h2>
          <div>{t("enter_details")}</div>
          <input
            type="text"
            name="username"
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
          <div className="login-footer">
            <button type="submit">{t("login")}</button>
            <Link to="/forget">{t("forgot_password")}</Link>
          </div>
        </form>
      </div>
    </section>
  );
}

export default SignUp;
