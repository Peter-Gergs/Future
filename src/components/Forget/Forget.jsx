import React, { useState } from "react";
import "./Forget.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import API_URL from "../../config";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

function Forget() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { t } = useTranslation("auth");
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${API_URL}/api/forgot_password/`, { email })
      .then(() => {
        navigate('/verify')
      })
      .catch((err) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          icon: "error",
          title: t("not_found"),
          text: t("email_not_match"),
          confirmButtonText: t("try_again"),
        });
      });
  };

  return (
    <section className="forget">
      <form onSubmit={handleSubmit}>
        <h2>{t("forgot_password")}</h2>
        <div>{t("enter_email")}</div>
        <input
          type="email"
          placeholder={t("email")}
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">{t("continue")}</button>
      </form>
    </section>
  );
}

export default Forget;
