import React, { useEffect, useRef, useState } from "react";
import "./Header.css";
import { IoIosHeartEmpty } from "react-icons/io";
import { BsCart3 } from "react-icons/bs";
import { IoMdHeart } from "react-icons/io";
import { HiBars3 } from "react-icons/hi2";
import SearchBox from "../../modules/SerachBox";
import { Link } from "react-router-dom";
import logo from "../../assets/icon.png";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { FaTimes } from "react-icons/fa";

function Header() {
  const links = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // ⬅️ 1. حالة القائمة
  const { loggedIn } = useAuth();
  const { t, i18n } = useTranslation("header");

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev); // ⬅️ 2. تبديل الحالة
  };

  useEffect(() => {
    const LinksElement = [...links.current.children];
    LinksElement.slice(1).forEach((ele) => {
      ele = ele.querySelector("li");
      ele.onclick = function () {
        LinksElement.forEach((e) =>
          e.querySelector("li").classList.remove("active")
        );
        ele.classList.add("active");
      };
    });
  }, [loggedIn]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.lang = i18n.language;
    document.body.dir = lng === "ar" ? "rtl" : "ltr";
  };

  return (
    <header>
      <div className="container">
        <nav>
          <div className="logo">
            <HiBars3 onClick={toggleMenu} className="menu-icon" />{" "}
            {/* ⬅️ 3. ربط الدالة */}
            <Link to={"/"}>
              <img src={logo} alt="logo" />
            </Link>
          </div>
          <ul
            ref={links}
            className={isMenuOpen ? "nav-links open" : "nav-links"} // ⬅️ 4. تغيير الكلاس
          >
            <FaTimes onClick={() => setIsMenuOpen(false)} />
            <Link to="/">
              <li className="active">{t("home")}</li>
            </Link>
            <Link to="/contact">
              <li>{t("contact")}</li>
            </Link>
            <Link to="/about">
              <li>{t("about")}</li>
            </Link>
            {loggedIn ? (
              <Link to="/profile">
                <li>{t("profile")}</li>
              </Link>
            ) : (
              <Link to="/signup">
                <li>{t("signup")}</li>
              </Link>
            )}
          </ul>

          <div className="icons">
            <SearchBox placeholder={t("search_placeholder")} />
            <div className="cart-icon">
              <Link to={"/cart"}>
                <BsCart3 />
              </Link>
            </div>
            <div className="lang-switch">
              {i18n.language === "ar" ? (
                <button onClick={() => changeLanguage("en")}>EN</button>
              ) : (
                <button onClick={() => changeLanguage("ar")}>AR</button>
              )}
            </div>
          </div>
        </nav>
        <SearchBox placeholder={t("search_placeholder")} width={"100%"} />
      </div>
    </header>
  );
}

export default Header;
