import React, {  } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { Autoplay } from "swiper/modules";
import "./ProductSlider.css";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { IoIosHeartEmpty } from "react-icons/io";
import { Link } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import API_URL from "../../config";
import axios from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
function ProductSlider({ sub, title, products, loading }) {
  const { t } = useTranslation("utils");
  const handleAddToCart = (product) => {
    axios
      .post(`${API_URL}/api/cart/add/`, {
        quantity: 1,
        product_id: product.id,
      })
      .then(() => {
        toast.info(t("item_added"));
      })
      .catch(() => {
        toast.error(t("out_of_stock"));
      });
  };
  if (loading) {
    return (
      <>
        <div className="sub-word">{sub}</div>
        <h2 className="title">{title}</h2>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <SyncLoader color={"#ff4400"} size={15} />
        </div>
      </>
    );
  }
  return (
    <>
      <div className="sub-word">{sub}</div>
      <h2 className="title">{title}</h2>
      <Swiper
        spaceBetween={35}
        grabCursor={true}
        breakpoints={{
          0: {
            slidesPerView: 1.2,
          },
          768: {
            slidesPerView: 2,
          },
          992: {
            slidesPerView: 2.6,
          },
          1200: {
            slidesPerView: 3.6,
          },
          1400: {
            slidesPerView: 4.3,
          },
          1600: {
            slidesPerView: 5,
          },
        }}
        modules={[Autoplay]}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
      >
        {products.map((product, i) => (
          <SwiperSlide key={i}>
            <Link to={`/product/${product.slug}`}>
              <div className="slider-item">
                <div className="image">
                  {product.discount ? (
                    <span className="discount">
                      {product.discount
                        ? `${Math.round(
                            ((product.discount / product.price) * 100).toFixed(
                              1
                            )
                          )}%`
                        : ""}
                    </span>
                  ) : (
                    ""
                  )}
                  <img src={`${product.images[0].image}`} />
                  <span className="icon">
                    <MdOutlineRemoveRedEye />
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleAddToCart(product);
                    }}
                  >
                    {t("add_to_cart")}
                  </button>
                </div>
                <h3 className="item-title">{product.name}</h3>
                <span className="price">{product.final_price}EGP</span>
                {product.discount ? (
                  <span className="old-price">{product.price}EGP</span>
                ) : (
                  ""
                )}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

export default ProductSlider;
