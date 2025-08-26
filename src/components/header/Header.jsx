import React, { useEffect, useRef, useState } from "react";
import "./Header.css";
import { BsCart3 } from "react-icons/bs";
import { IoMdHeart } from "react-icons/io";
import { HiBars3 } from "react-icons/hi2";
import SearchBox from "../../modules/SerachBox";
import { Link, NavLink } from "react-router-dom";
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

  useEffect(() => {}, [loggedIn]);

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
              <img src={logo} alt="logo" loading="lazy" />
            </Link>
          </div>
          <ul
            ref={links}
            className={isMenuOpen ? "nav-links open" : "nav-links"} // ⬅️ 4. تغيير الكلاس
          >
            <FaTimes onClick={() => setIsMenuOpen(false)} />
            <NavLink to="/">
              <li>{t("home")}</li>
            </NavLink>
            <NavLink to="/contact">
              <li>{t("contact")}</li>
            </NavLink>
            <NavLink to="/about">
              <li>{t("about")}</li>
            </NavLink>
            {loggedIn ? (
              <NavLink to="/profile">
                <li>{t("profile")}</li>
              </NavLink>
            ) : (
              <NavLink to="/signup">
                <li>{t("signup")}</li>
              </NavLink>
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
