import React, { useEffect, useRef, useState } from "react";
import "./Checkout.css";
import axios from "../../api/axiosInstance";
import API_URL from "../../config";
import { useNavigate } from "react-router-dom";
import { PropagateLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState("delivery"); // "delivery" | "pickup"
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
  const { t } = useTranslation("checkout");

  const isPickup = deliveryMethod === "pickup";

  const handlePlaceOrder = () => {
    setOrderLoading(true);

    const payload = isPickup ? { pickup: true } : { ...address };
    if (isPickup) {
      axios
        .post(`${API_URL}/api/cart/pickup/`)
        .then(() => {
          const MySwal = withReactContent(Swal);
          MySwal.fire({
            title: "تم تأكيد طلبك ✅",
            text: "يمكنك استلام طلبك من المتجر. شكراً لك!",
            icon: "success",
            confirmButtonText: "حسناً",
          }).then(() => navigate("/"));
        })
        .catch(() => {
          const MySwal = withReactContent(Swal);
          MySwal.fire({
            title: "حدث خطأ ❌",
            text: "تعذر تأكيد الطلب. برجاء المحاولة لاحقاً.",
            icon: "error",
            confirmButtonText: "حسناً",
          }).then(() => setOrderLoading(false));
        });
      return;
    }
    axios
      .post(`${API_URL}/api/payment/pay/`, payload)
      .then((res) => {
        if (res.data.redirect_url) {
          // Delivery: redirect to online payment
          window.location.href = res.data.redirect_url;
        } else {
          // Pickup: show success message
          const MySwal = withReactContent(Swal);
          MySwal.fire({
            title: "تم تأكيد طلبك ✅",
            text: "يمكنك استلام طلبك من المتجر. شكراً لك!",
            icon: "success",
            confirmButtonText: "حسناً",
          }).then(() => {
            navigate("/");
          });
        }
      })
      .catch((err) => {
        console.error("Checkout Error:", err);
        const MySwal = withReactContent(Swal);

        if (err.response?.data?.error || err.response?.data?.message) {
          MySwal.fire({
            title: "خطأ في الدفع عبر OPay ❌",
            html: `
              <p><strong>الرسالة:</strong> ${err.response.data.message || "غير محددة"}</p>
              <p><strong>الكود:</strong> ${err.response.data.error || "لا يوجد كود"}</p>
            `,
            icon: "error",
            confirmButtonText: "فهمت",
          }).then(() => setOrderLoading(false));
        } else {
          MySwal.fire({
            title: "حدث خطأ في الطلب ❌",
            text: "تعذر إتمام عملية الدفع. برجاء المحاولة لاحقاً.",
            icon: "error",
            confirmButtonText: "حسناً",
          }).then(() => setOrderLoading(false));
        }
      });
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

  const effectiveShipping = isPickup ? 0 : shippingCost;

  return (
    <section className="checkout">
      <div className="container">
        <div>
          {/* ── Delivery Method Toggle ── */}
          <div className="delivery-method">
            <button
              type="button"
              className={`method-btn ${!isPickup ? "active" : ""}`}
              onClick={() => setDeliveryMethod("delivery")}
            >
              🚚 {t("delivery") || "التوصيل للمنزل"}
            </button>
            <button
              type="button"
              className={`method-btn ${isPickup ? "active" : ""}`}
              onClick={() => setDeliveryMethod("pickup")}
            >
              🏪 {t("pickup") || "الاستلام من المتجر"}
            </button>
          </div>
          {/* ── Order Summary ── */}
          <div className="sub-total">
            {cartLoading ? (
              <p>{t("loading")}</p>
            ) : (
              cartItems.items.map((item, i) => (
                <div className="item" key={i}>
                  <img
                    src={`${API_URL}${item.product.images[0].image}`}
                    alt={item.product.name}
                  />
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
                <span>{effectiveShipping} EGP</span>
              </div>
              <div className="total">
                <span>{t("total")}:</span>
                <span>
                  {effectiveShipping + Number(cartItems.subtotal)} EGP
                </span>
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
                value={
                  isPickup
                    ? t("confirm_pickup") || "تأكيد الطلب"
                    : t("place_order")
                }
                onClick={(e) => {
                  e.preventDefault();
                  if (isPickup) {
                    handlePlaceOrder();
                  } else if (formRef.current.checkValidity()) {
                    handlePlaceOrder();
                  } else {
                    formRef.current.reportValidity();
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* ── Address Form (delivery only) ── */}
        {!isPickup && (
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
        )}

        {/* ── Pickup Notice ── */}
        {isPickup && (
          <div className="pickup-notice">
            <p>
              🏪{" "}
              {t("pickup_notice") ||
                "سيتم تأكيد طلبك وتسديد المبلغ عند الاستلام من المتجر."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Checkout;
