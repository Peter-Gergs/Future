import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdDelete, MdDeleteOutline } from "react-icons/md";
import { PiWarningCircle } from "react-icons/pi";
import API_URL from "../config";
import { FiMinus, FiPlus } from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im";

function CartProduct({ item, onIncrement, onDecrement, onRemove, remove,units }) {
  const [loadingPlus, setLoadingPlus] = useState(false);
  const [loadingMinus, setLoadingMinus] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
  console.log(item);
  const product = item.product;
  const discount =
    product.discount && product.price
      ? Math.round((product.discount / product.price) * 100)
      : null;

  const handlePlusClick = () => {
    setLoadingPlus(true);
    onIncrement(item.id, item.quantity, () => setLoadingPlus(false));
  };

  const handleMinusClick = () => {
    setLoadingMinus(true);
    onDecrement(item.id, item.quantity, () => setLoadingMinus(false));
  };

  const handleRemoveClick = () => {
    setLoadingRemove(true);
    onRemove(item.id, item.quantity, () => setLoadingRemove(false));
  };
  return (
    <div className="cart-item">
      <Link>
        <div className="image">
          <img src={`${API_URL}${item.product.images[0].image}`} />
        </div>
        <div className="name">
          <h3>{item.product.name}</h3>
          {item.product.stock < 10 ? (
            <p>
              <PiWarningCircle /> {item.product.stock}{" "}
              {units}
            </p>
          ) : null}
        </div>
        <div className="price">
          <div className="final-price">EGP {item.product.final_price}</div>
          {item.product.discount ? (
            <div className="old">
              <span className="old-price">EGP {item.product.price}</span>
              <span className="percentage">{discount}%</span>
            </div>
          ) : null}
        </div>
      </Link>
      <div className="btns">
        <button onClick={handleRemoveClick}>
          {loadingRemove ? (
            <ImSpinner2 className="spinner" />
          ) : (
            <MdDeleteOutline />
          )}
          <span className="remove">{remove}</span>
        </button>
        <div className="num-of-products">
          <button>
            {loadingMinus ? (
              <ImSpinner2 className="spinner" />
            ) : (
              <FiMinus onClick={handleMinusClick} />
            )}
          </button>
          <span>{item.quantity}</span>
          <button>
            {loadingPlus ? (
              <ImSpinner2 className="spinner" />
            ) : (
              <FiPlus onClick={handlePlusClick} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartProduct;
