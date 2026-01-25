import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { Autoplay } from "swiper/modules";
import "./CategorySlider.css";
import CategoryItem from "../../modules/CategoryItem";
import i18n from "../../i18n";
import API_URL from "../../config";

function CategorySlider({ sub, title, categories }) {
  const [swiperKey, setSwiperKey] = useState(0);
  useEffect(() => {
    setSwiperKey((prev) => prev + 1);
  }, [i18n.language]);

  return (
    <>
      <div className="sub-word">{sub}</div>
      <h2 className="title">{title}</h2>
      <Swiper
        spaceBetween={35}
        grabCursor={true}
        breakpoints={{
          0: { slidesPerView: 2.5 },
          768: { slidesPerView: 3.5 },
          992: { slidesPerView: 4.5 },
          1200: { slidesPerView: 5.5 },
          1400: { slidesPerView: 6.5 },
          1600: { slidesPerView: 7.5 },
        }}
        modules={[Autoplay]}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
        key={swiperKey}
      >
        {categories.map((cat) => (
          <SwiperSlide key={cat.key}>
            <CategoryItem
              name={cat[`name_${i18n.language}`]}
              icon={cat.image}
              link={`/category/${cat.slug}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

export default CategorySlider;
