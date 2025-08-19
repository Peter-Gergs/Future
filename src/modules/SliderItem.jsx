import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
function SliderItem({ item }) {
  const { t } = useTranslation("home");

  const percentage = ((item.discount / item.price) * 100).toFixed(0);
  return (
    <Link to={`/product/${item.slug}`}>
      <div className="item">
        <div className="text">
          <h3>{item.name}</h3>
          <h2> {t("discountMessage", { percentage })}</h2>
        </div>
        <div className="image">
          <img src={item.images[0].image} alt="" />
        </div>
      </div>
    </Link>
  );
}

export default SliderItem;
