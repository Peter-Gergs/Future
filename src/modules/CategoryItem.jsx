import React from "react";
import { Link } from "react-router-dom";

function CategoryItem({ name, icon, link }) {
  return (
    <Link to={link}>
      <div className="category">
        {icon}
        <span>{name}</span>
      </div>
    </Link>
  );
}

export default CategoryItem;
