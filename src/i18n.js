import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// استيراد كل الملفات حسب القسم
import headerEN from "./locales/en/header.json";
import homeEN from "./locales/en/home.json";
import contactEN from "./locales/en/contact.json";
import cartEN from "./locales/en/cart.json";
import productsEN from "./locales/en/product_page.json";
import profileEN from "./locales/en/profile.json";
import footerEN from "./locales/en/footer.json";
import authEN from "./locales/en/auth.json";
import checkoutEN from "./locales/en/checkout.json";
import detailsEN from "./locales/en/details.json";
import notfoundEN from "./locales/en/notfound.json";
import utilsEN from "./locales/en/utils.json";
import aboutEN from "./locales/en/about.json";
// import productCardEN from "./locales/en/productCard.json";

import headerAR from "./locales/ar/header.json";
import homeAR from "./locales/ar/home.json";
import contactAR from "./locales/ar/contact.json";
import cartAR from "./locales/ar/cart.json";
import productsAR from "./locales/ar/product_page.json";
import profileAR from "./locales/ar/profile.json";
import footerAR from "./locales/ar/footer.json";
import authAR from "./locales/ar/auth.json";
import checkoutAR from "./locales/ar/checkout.json";
import detailsAR from "./locales/ar/details.json";
import notfoundAR from "./locales/ar/notfound.json";
import utilsAR from "./locales/ar/utils.json";
import aboutAR from "./locales/ar/about.json";
// import productCardAR from "./locales/ar/productCard.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        header: headerEN,
        home: homeEN,
        contact: contactEN,
        cart: cartEN,
        product: productsEN,
        profile: profileEN,
        footer: footerEN,
        auth: authEN,
        checkout: checkoutEN,
        details: detailsEN,
        notfound: notfoundEN,
        utils: utilsEN,
        about: aboutEN,
      },
      ar: {
        header: headerAR,
        home: homeAR,
        contact: contactAR,
        cart: cartAR,
        product: productsAR,
        profile: profileAR,
        footer: footerAR,
        auth: authAR,
        checkout: checkoutAR,
        details: detailsAR,
        notfound: notfoundAR,
        utils: utilsAR,
        about: aboutAR,
      },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
