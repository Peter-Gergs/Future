import React from "react";
import { useTranslation } from "react-i18next";
import "./About.css";

function AboutSection() {
  const { t } = useTranslation("about");

  return (
    <section className="about-section">
      <div className="container">
        <div className="about-header">
          <span className="about-label"></span>
          <h2 className="about-title">{t("title")}</h2>
        </div>
        <div className="about-content">
          <p>{t("intro")}</p>
          <p>{t("activity")}</p>
          <p>{t("manufacturing")}</p>
          <p>{t("brands")}</p>
          <p>{t("brands-dis")}</p>
          <ul>
            {t("brand_list", { returnObjects: true }).map((brand, index) => (
              <li key={index}>{brand}</li>
            ))}
          </ul>
          <p>{t("exclusive")}</p>
          <p>{t("mission")}</p>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
