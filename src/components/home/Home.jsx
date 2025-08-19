import React, { useEffect, useState } from "react";
import "./Home.css";
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
  const [categories, setCategories] = useState([]);

  const { t } = useTranslation("home");
  useEffect(() => {
    axios
      .get(`${API_URL}/api/categories`)
      .then((res) => setCategories(res.data));
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
            {categories.map((cat) => (
              <Link to={`/category/${cat.slug}`}>
                <li>{cat[`name_${i18n.language}`]}</li>
              </Link>
            ))}
          </ul>
          <OffersSlider />
        </div>
      </section>
      <section
        className="items-section flash-sales"
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
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
            categories={categories}
            sub={t("sections.categories_sub")}
            title={t("sections.categories_title")}
          />
        </div>
      </section>
      <section
        className="items-section best-sales"
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
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
