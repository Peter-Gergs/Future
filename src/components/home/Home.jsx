import React, { useEffect, useState } from "react";
import "./home.css";
import OffersSlider from "../OffersSlider/OffersSlider";
import ProductSlider from "../ProductSlider/ProductSlider";
import CategorySlider from "../CategorySlider/CategorySlider";
import { Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import API_URL from "../../config";

function Home() {
  const [salesProducts, setSalesProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("home");
  useEffect(() => {
    axios
      .get(`${API_URL}/api/sales/`, {
        headers: { "Accept-Language": i18n.language },
      })
      .then((res) => {
        setSalesProducts(res.data.results);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching flash sale products:", err);
        setLoading(false);
      });
  }, [i18n.language]);
  return (
    <React.Fragment>
      <section className="hero-section">
        <div className="container">
          <ul className="categories">
            <Link to="/category/speakers/">
              <li>{t("categories.speakers")}</li>
            </Link>
            <Link to="/category/monitor arm/">
              <li>{t("categories.monitor_arm")}</li>
            </Link>
            <Link to="/category/network/">
              <li>{t("categories.network")}</li>
            </Link>
            <Link to="/category/content creation accessories/">
              <li>{t("categories.content_creation")}</li>
            </Link>
            <Link to="/category/computer accessories/">
              <li>{t("categories.computer_accessories")}</li>
            </Link>
            <Link to="/category/cameras/">
              <li>{t("categories.cameras")}</li>
            </Link>
            <Link to="/category/mobile accessories/">
              <li>{t("categories.mobile_accessories")}</li>
            </Link>
            <Link to="/category/furniture/">
              <li>{t("categories.furniture")}</li>
            </Link>
            <Link to="/category/P.O.S. Service/">
              <li>{t("categories.pos_service")}</li>
            </Link>
            <Link to="/category/printing paper/">
              <li>{t("categories.printing_paper")}</li>
            </Link>
          </ul>
          <OffersSlider />
        </div>
      </section>
      <section className="items-section flash-sales">
        <div className="container">
          <ProductSlider
            sub={t("sections.flash_sub")}
            title={t("sections.flash_sales")}
            products={salesProducts}
            loading={loading}
          />
          <button>{t("btn")}</button>
        </div>
      </section>
      <section className="items-section category-slider">
        <div className="container">
          <CategorySlider
            sub={t("sections.categories_sub")}
            title={t("sections.categories_title")}
          />
        </div>
      </section>
      <section className="items-section best-sales">
        <div className="container">
          <ProductSlider
            sub={t("sections.best_sub")}
            title={t("sections.best_sales")}
            products={salesProducts}
            loading={loading}
          />
          <button>{t("btn")}</button>
        </div>
      </section>
    </React.Fragment>
  );
}

export default Home;
