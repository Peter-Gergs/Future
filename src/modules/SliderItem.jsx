import React from "react";
import img from "../assets/hero_endframe__cvklg0xk3w6e_large 2.png";
function SliderItem({ title, offer }) {
  return (
    <div className="item">
      <div className="text">
        <h3>{title}</h3>
        <h2>{offer}</h2>
      </div>
      <div className="image">
        <img src={img} alt="" />
      </div>
    </div>
  );
}

export default SliderItem;
