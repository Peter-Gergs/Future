import React, { useRef } from "react";
import "./Forget.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import API_URL from "../../config";
import { useState } from "react";

function Verify() {
  const navigate = useNavigate();
  const [token, setToken] = useState();
  const { t } = useTranslation("auth");
  const ref = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .get(`${API_URL}/api/password/verify/${token}`)
      .then(() => {
        navigate("/setPassword", { state: { token } });
      })
      .catch(() => {
        ref.current.style.display = "block";
      });
  };

  return (
    <section className="forget">
      <form onSubmit={handleSubmit}>
        <h2>{t("enter_security_code")}</h2>
        <div>{t("code_sent_to_email")}</div>
        <p
          ref={ref}
          style={{
            display: "none",
            color: "red",
          }}
        >
          {t("code_not_valid")}
        </p>
        <input
          type="text"
          placeholder={t("verification_code")}
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button type="submit">{t("continue")}</button>
      </form>
    </section>
  );
}

export default Verify;
