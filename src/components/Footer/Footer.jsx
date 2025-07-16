import React from "react";
import { FaSquareWhatsapp } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";
import "./Footer.css";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation("footer");

  return (
    <footer>
      <div className="container">
        <div className="contact">
          <h3>{t("contact_us")}</h3>
          <div className="icons">
            <a href="https://www.facebook.com/future.furniture.and.computer">
              <FaFacebookSquare />
            </a>
            <a href="https://wa.me/+201223721000">
              <FaSquareWhatsapp />
            </a>
          </div>
        </div>
        <div className="copy-right">&copy;{t("copyright")}</div>
      </div>
    </footer>
  );
}

export default Footer;
