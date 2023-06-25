import React from "react";
import { Link } from "react-router-dom";

const OperationsBox = ({ header, description, link, image }) => {
  return (
    <div className="operations-box">
      <Link to={`/${link}`} className="link">
        <div className="operations-box--detail">
          <div className="operations-box__img">{image}</div>
          <h4>{header}</h4>
          <div className="operations-box__arrow">
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <path d="M9 7L10 6L16 12L10 18L9 17L14.17 12L9 7Z"></path>
            </svg>
          </div>
        </div>
        <p>{description}</p>
      </Link>
    </div>
  );
};

export default OperationsBox;
