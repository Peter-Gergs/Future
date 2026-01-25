import React from "react";
import { Link } from "react-router-dom";

function CategoryItem({ name, icon, link }) {
  console.log(icon);
  return (
    <Link to={link}>
      <div className="category">
        <img src={icon} alt={name} style={{ width: "40px",  }} />
        <span>{name}</span>
      </div>
    </Link>
  );
}

export default CategoryItem;
