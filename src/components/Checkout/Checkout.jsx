import React, { useEffect, useRef, useState } from "react";
import "./Checkout.css";
import axios from "../../api/axiosInstance";
import API_URL from "../../config";
import { useNavigate, useLocation } from "react-router-dom";
import { PropagateLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [address, setAddress] = useState({
    customer_phone: "",
    governorate: "",
    city: "",
    street: "",
    building_number: "",
    floor_number: "",
    apartment_number: "",
    landmark: "",
  });

  const formRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("checkout");

  const pendingOrderId = location.state?.pendingOrderId;

  const handlePlaceOrder = () => {
    console.log(pendingOrderId);
    if (!pendingOrderId) return;

    setOrderLoading(true);

    axios
      .post(`${API_URL}/api/pending/update-address/`, {
        ...address,
        pending_order_id: pendingOrderId,
      })
      .then(() => {
        return axios.post(`${API_URL}/api/payment/pay/`, {
          pending_order_id: pendingOrderId,
        });
      })
      .then((res) => {
        window.location.href = res.data.payment_url;
      })
      .catch((err) => {
        console.error("Checkout Error:", err);
        console.log("Server Response:", err.response?.data);
      })
      .finally(() => setOrderLoading(false));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setCartLoading(true);

    Promise.all([axios.get("api/cart/"), axios.get("api/shipping/")])
      .then(([cartRes, shipping]) => {
        setCartItems(cartRes.data);
        setShippingCost(shipping.data.cost);
        if (!cartRes.data.items.length) {
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("Error fetching cart or shipping:", err);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      })
      .finally(() => {
        setCartLoading(false);
      });
  }, []);

  return (
    <section className="checkout">
      <div className="container">
        <form ref={formRef}>
          <input
            type="text"
            placeholder={t("name")}
            name="name"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder={t("phone")}
            name="customer_phone"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder={t("governorate")}
            name="governorate"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder={t("city")}
            name="city"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder={t("street")}
            name="street"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder={t("building_number")}
            name="building_number"
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder={t("floor_number")}
            name="floor_number"
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder={t("apartment_number")}
            name="apartment_number"
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder={t("landmark")}
            name="landmark"
            onChange={handleChange}
          />
        </form>

        <div className="sub-total">
          {cartLoading ? (
            <p>{t("loading")}</p>
          ) : (
            cartItems.items.map((item, i) => (
              <div className="item" key={i}>
                <img src={`${API_URL}${item.product.images[0].image}`} />
                <h3>{item.product.name}</h3>
                <span className="price">{item.product.final_price} EGP</span>
              </div>
            ))
          )}

          <div className="total-price">
            <div className="subtotal-price">
              <span>{t("subtotal")}:</span>
              <span>{cartItems.subtotal} EGP</span>
            </div>
            <div className="shipping-price">
              <span>{t("shipping")}:</span>
              <span>{shippingCost} EGP</span>
            </div>
            <div className="total">
              <span>{t("total")}:</span>
              <span>{shippingCost + Number(cartItems.subtotal)} EGP</span>
            </div>
          </div>
          {orderLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <PropagateLoader color="var(--main-color)" />
            </div>
          ) : (
            <input
              type="submit"
              value={t("place_order")}
              onClick={(e) => {
                e.preventDefault();
                if (formRef.current.checkValidity()) {
                  formRef.current.reportValidity();
                  handlePlaceOrder();
                } else {
                  formRef.current.reportValidity();
                }
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default Checkout;
