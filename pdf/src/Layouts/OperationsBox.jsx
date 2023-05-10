import React from "react";
import { Link } from "react-router-dom";

const OperationsBox = ({ header, description, link, image }) => {
  return (
    <div className="operations-box">
      <Link to={`/${link}`} className="link">
        <h4>{header}</h4>
      </Link>
      <div className="operations-box__img">{image}</div>
      <div className="operations-box__arrow">
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
          <path d="M9 7L10 6L16 12L10 18L9 17L14.17 12L9 7Z"></path>
        </svg>
      </div>
      <p>{description}</p>
    </div>
  );
};

export default OperationsBox;
