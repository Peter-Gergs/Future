import React, { useEffect, useState } from "react";
import "./OffersSlider.css";
// import Swiper core and required modules
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SliderItem from "../../modules/SliderItem";
import i18n from "../../i18n";

function OffersSlider() {
  const [swiperKey, setSwiperKey] = useState(0);

  useEffect(() => {
    // كل مرة اللغة تتغير → غير key السوايبر
    setSwiperKey((prev) => prev + 1);
  }, [i18n.language]);

  return (
    <Swiper
      // install Swiper modules
      key={swiperKey}
      modules={[Navigation, Pagination, A11y, Autoplay]}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
      spaceBetween={50}
      slidesPerView={1}
      pagination={{ clickable: true }}
      style={{ width: "100%" }}
      grabCursor={true}
    >
      <SwiperSlide>
        <SliderItem title={"Iphone 16 Pro"} offer={"Up to 10% off Voucher"} />
      </SwiperSlide>
      <SwiperSlide>
        <SliderItem title={"Iphone 16 Pro"} offer={"Up to 10% off Voucher"} />
      </SwiperSlide>
      <SwiperSlide>
        <SliderItem title={"Iphone 16 Pro"} offer={"Up to 10% off Voucher"} />
      </SwiperSlide>
      <SwiperSlide>
        <SliderItem title={"Iphone 16 Pro"} offer={"Up to 10% off Voucher"} />
      </SwiperSlide>
    </Swiper>
  );
}

export default OffersSlider;
