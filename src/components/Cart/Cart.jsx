import React, { useEffect, useState } from "react";
import "./cart.css";
import CartProduct from "../../modules/CartProduct";
import axios from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useTranslation } from "react-i18next";

function Cart() {
  const { t } = useTranslation("cart");
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("api/cart/")
      .then((res) => {
        setCart(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cart:", err);
        setLoading(false);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      });
  }, []);

  const handleIncrement = (itemId, quantity, done) => {
    const newquantity = quantity + 1;
    axios
      .patch(`${API_URL}/api/cart/item/${itemId}/update/`, {
        quantity: newquantity,
      })
      .then(() => axios.get("api/cart/"))
      .then((res) => setCart(res.data))
      .catch((err) => {
        console.log(err);
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          icon: "error",
          title: t("alerts.increment_error"),
          text: err.response?.data?.error || t("alerts.default_error"),
          confirmButtonText: t("alerts.ok"),
        });
      })
      .finally(() => done && done());
  };

  const handleDecrement = (itemId, quantity, done) => {
    const newquantity = quantity - 1;
    axios
      .patch(`${API_URL}/api/cart/item/${itemId}/update/`, {
        quantity: newquantity,
      })
      .then(() => axios.get("api/cart/"))
      .then((res) => setCart(res.data))
      .finally(() => done && done());
  };

  const handleRemove = (itemId, quantity, done) => {
    axios
      .delete(`${API_URL}/api/cart/item/${itemId}/delete/`)
      .then(() => axios.get("api/cart/"))
      .then((res) => setCart(res.data))
      .finally(() => done && done());
  };

  const handleProceedToCheckout = () => {
    axios
      .post("api/pending/create/")
      .then((res) => {
        const pendingOrderId = res.data.pending_order_id;
        navigate("/checkout", { state: { pendingOrderId } });
      })
      .catch((err) => {
        console.error("Error creating pending order:", err);
      });
  };

  if (loading) return <p>{t("loading")}</p>;

  return (
    <section className="cart">
      <div className="container">
        <div className="items">
          <h2>{t("title")}</h2>
          {cart.items.map((item) => (
            <CartProduct
              key={item.id}
              item={item}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onRemove={handleRemove}
              remove={t("remove")}
              units={t("units")}
            />
          ))}
        </div>
        <div className="checkout">
          <h1>{t("summary.title")}</h1>
          <div className="subtotal">
            <p>{t("summary.subtotal")}</p>
            <p>EGP {cart.subtotal}</p>
          </div>
          <div className="btn">
            <button onClick={handleProceedToCheckout}>
              {t("summary.checkout")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cart;
