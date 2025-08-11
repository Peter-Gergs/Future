// src/pages/ProductDetails.jsx
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Thumbs } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/thumbs";
import "./Details.css";

import API_URL from "../../config";
import { useParams } from "react-router-dom";
import { PiWarningCircle } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { PiTruck } from "react-icons/pi";
import { IoReturnDownBack } from "react-icons/io5";
import i18n from "../../i18n";
import axios from "axios";

const ProductDetails = () => {
  SwiperCore.use([Thumbs]);
  const { t } = useTranslation("details");

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);
  const { slug } = useParams();
  const [thumbDirection, setThumbDirection] = useState("vertical");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/product/${slug}`, {
        headers: {
          "Accept-Language": i18n.language,
        },
      })
      .then((res) => {
        setProduct(res.data);
        setImages(res.data.images);
      });
    const updateDirection = () => {
      if (window.innerWidth <= 992) {
        setThumbDirection("horizontal");
      } else {
        setThumbDirection("vertical");
      }
    };
    updateDirection(); // تشغيله عند التحميل
    window.addEventListener("resize", updateDirection);
    return () => window.removeEventListener("resize", updateDirection);
  }, [slug,i18n.language]);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  return (
    <section className="details">
      <div className="container">
        <div className="product-page">
          {/* Thumbnail Slider */}
          <div className="thumbnails">
            <Swiper
              direction={thumbDirection}
              spaceBetween={12}
              slidesPerView="auto"
              onSwiper={setThumbsSwiper}
              className="thumbs-swiper"
            >
              {images.map((image, idx) => (
                <SwiperSlide key={idx}>
                  <img src={`${image.image}`} alt={`Thumbnail ${idx}`} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Main Image */}
          <div className="main-image">
            <Swiper
              modules={[Autoplay]}
              autoplay={{
                delay: 12000,
                disableOnInteraction: false,
              }}
              spaceBetween={15}
              thumbs={{ swiper: thumbsSwiper }}
              className="main-swiper"
            >
              {images.map((image, idx) => (
                <SwiperSlide key={idx}>
                  <img src={`${image.image}`} alt={`Main ${idx}`} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h2 className="product-title">{product.name}</h2>

            <div className="product-rating">
              <span
                className={product.stock > 10 ? "in-stock" : "out-of-stock"}
              >
                {product.stock > 10 ? (
                  t("inStock")
                ) : product.stock === 0 ? (
                  t("outOfStock")
                ) : (
                  <>
                    <PiWarningCircle />{" "}
                    {t("unitsLeft", { count: product.stock })}
                  </>
                )}
              </span>
            </div>

            <p className="price">
              {product.final_price} {t("EGP")}
            </p>
            <p className="description">{product.description}</p>

            <div className="actions">
              <div className="quantity-selector">
                <button onClick={decreaseQuantity}>-</button>
                <span>{quantity}</span>
                <button onClick={increaseQuantity}>+</button>
              </div>
              <button className="buy-button">{t("add_to_cart")}</button>
            </div>

            <div className="delivery-info">
              <p>
                <PiTruck /> <span className="bold">{t("delivery")}</span>
              </p>
              <p>
                <IoReturnDownBack />
                <span className="bold">{t("returnDelivery")}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
