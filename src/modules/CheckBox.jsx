import React from "react";
import { FaCheck } from "react-icons/fa";

function Checkbox({ onChange, children }) {
  const checkboxId = `${children.toLowerCase().split(" ")[0]}${children
    .split(" ")
    .slice(1)
    .join("")}Checkbox`;
  return (
    <div className="control-checkbox">
      <input
        type="checkbox"
        className="custom-control-checkbox"
        id={checkboxId}
        onChange={onChange}
        value={children}
      />
      <label htmlFor={checkboxId}>
        <span>
          <FaCheck />
        </span>
        <span className="text">{children}</span>
      </label>
    </div>
  );
}

export default Checkbox;
