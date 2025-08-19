import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

function SEO() {
  const { i18n } = useTranslation();

  const metaDescription =
    i18n.language === "ar"
      ? "فيوتشــر فيستا | تسوق أحدث الإلكترونيات والإكسسوارات الأصلية من أفضل الماركات العالمية مثل BOYA وUgreen وJoyroom وEnergizer. عروض وخصومات حصرية مع توصيل سريع وخدمة عملاء مميزة."
      : "Future Vesta | Shop the latest electronics and original accessories from top global brands like BOYA, Ugreen, Joyroom, and Energizer. Exclusive deals, fast delivery, and premium customer service.";

  return (
    <Helmet>
      <html lang={i18n.language} dir={i18n.language === "ar" ? "rtl" : "ltr"} />
      <meta name="description" content={metaDescription} />
      <title>
        {i18n.language === "ar" ? "فيوتشــر فيستا" : "Future Vesta"}
      </title>
    </Helmet>
  );
}

export default SEO;
