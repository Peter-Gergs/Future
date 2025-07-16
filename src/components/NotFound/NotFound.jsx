import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./notfound.css";

function NotFound() {
  const { t } = useTranslation("notfound");

  return (
    <section className="not-found">
      <div className="container">
        <h2>404 {t("title")}</h2>
        <p>{t("message")}</p>
        <Link to="/">{t("backHome")}</Link>
      </div>
    </section>
  );
}

export default NotFound;
