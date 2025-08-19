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
import axios from "axios";
import API_URL from "../../config";

function OffersSlider() {
  const [swiperKey, setSwiperKey] = useState(0);
  const [items, setItems] = useState([]);
  useEffect(() => {
    axios
      .get(`${API_URL}/api/sales/swiper/`, {
        headers: {
          "Accept-Language": i18n.language,
        },
      })
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setSwiperKey((prev) => prev + 1);
  }, [i18n.language]);

  return (
    <Swiper
      // install Swiper modules
      key={swiperKey}
      modules={[Navigation, Pagination, A11y, Autoplay]}
      autoplay={{
        delay: 30000,
        disableOnInteraction: false,
      }}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
      spaceBetween={50}
      slidesPerView={1}
      pagination={{ clickable: true }}
      style={{ width: "100%" }}
      grabCursor={true}
    >
      {items.map((item) => (
        <SwiperSlide>
          <SliderItem item={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default OffersSlider;
