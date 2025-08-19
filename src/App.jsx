import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer/Footer";
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import SignUp from "./components/SignUp/SignUp";
import Login from "./components/Login/Login";
import Forget from "./components/Forget/Forget";
import Verify from "./components/Forget/Verfiy";
import NewPassword from "./components/Forget/NewPassword";
import ProductDetails from "./components/Details/Details";
import NotFound from "./components/NotFound/NotFound";
import Cart from "./components/Cart/Cart";
import CategoryPage from "./components/Category/CategoryPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import Profile from "./components/Profile/Profile";
import Checkout from "./components/Checkout/Checkout";
import Contact from "./components/Contact/Contact";
import SearchPage from "./components/Search/Search";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import About from "./components/About.jsx/About";

function App() {
  const { i18n } = useTranslation();
  useEffect(() => {
    const storedLang = localStorage.getItem("i18nextLng") || "en";
    document.documentElement.lang = storedLang;
    document.body.dir = storedLang === "ar" ? "rtl" : "ltr";
    if (i18n.language !== storedLang) {
      i18n.changeLanguage(storedLang);
    }
  }, []);
  return (
    <AuthProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forget" element={<Forget />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/setPassword" element={<NewPassword />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/category/:categorySlug" element={<CategoryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/search/:keyword" element={<SearchPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <ToastContainer />
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
