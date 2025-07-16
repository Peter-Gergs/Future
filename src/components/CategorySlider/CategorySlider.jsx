import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { Autoplay } from "swiper/modules";
import "./CategorySlider.css";
import { CiSpeaker, CiMicrophoneOn, CiRouter, CiMobile3 } from "react-icons/ci";
import { TbCashRegister } from "react-icons/tb";
import { FaComputer } from "react-icons/fa6";
import { GiCctvCamera, GiOfficeChair } from "react-icons/gi";
import { MdScreenshotMonitor } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import CategoryItem from "../../modules/CategoryItem";
import i18n from "../../i18n";
import { useTranslation } from "react-i18next";

function CategorySlider({ sub, title }) {
  const [swiperKey, setSwiperKey] = useState(0);
  const { t } = useTranslation("home");

  useEffect(() => {
    setSwiperKey((prev) => prev + 1);
  }, [i18n.language]);
  const categories = [
    { key: "Speakers", transKey: "speakers", icon: <CiSpeaker /> },
    {
      key: "Monitor Arm",
      transKey: "monitor_arm",
      icon: <MdScreenshotMonitor />,
    },
    { key: "Network", transKey: "network", icon: <CiRouter /> },
    {
      key: "Content Creation Accessories",
      transKey: "content_creation",
      icon: <CiMicrophoneOn />,
    },
    {
      key: "Computer Accessories",
      transKey: "computer_accessories",
      icon: <FaComputer />,
    },
    { key: "Cameras", transKey: "cameras", icon: <GiCctvCamera /> },
    {
      key: "Mobile Accessories",
      transKey: "mobile_accessories",
      icon: <CiMobile3 />,
    },
    { key: "Furniture", transKey: "furniture", icon: <GiOfficeChair /> },
    {
      key: "P.O.S. Service",
      transKey: "pos_service",
      icon: <TbCashRegister />,
    },
    {
      key: "Printing Paper",
      transKey: "printing_paper",
      icon: <IoDocumentTextOutline />,
    },
  ];

  return (
    <>
      <div className="sub-word">{sub}</div>
      <h2 className="title">{title}</h2>
      <Swiper
        spaceBetween={35}
        grabCursor={true}
        breakpoints={{
          0: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          992: { slidesPerView: 4 },
          1200: { slidesPerView: 5 },
          1400: { slidesPerView: 6 },
          1600: { slidesPerView: 7 },
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
              name={t(`categories.${cat.transKey}`)}
              icon={cat.icon}
              link={`/category/${cat.key.toLowerCase()}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

export default CategorySlider;
